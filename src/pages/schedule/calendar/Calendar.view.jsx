import { useEffect, useState } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import {
  createNamedDocument,
  db,
  updateDocument,
  useSyncedEvents,
  useSyncedLabels,
} from "../../../firebase/firestore.utils";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

import "./calendarView.css";

import { SettingsOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import {
  getUnixFromDate,
  setDateToOneAm,
  setDateToZeroHours,
} from "../../../utilities/dateUtils";
import { getAuth } from "firebase/auth";
import Holding from "../../../components/dispatches/holding/Holding";
import { getUnixTime } from "date-fns";

const settingsButton = {
  borderRadius: "5px",
  marginTop: "4px",
  marginLeft: "4px",
  paddingBottom: 0,
  paddingRight: 0,
  paddingLeft: 1.5,
  paddingTop: 2,
  cursor: "pointer",
  minWidth: 33,
  maxWidth: 33,
  "&:hover": {
    background: "#efefef",
  },
};
const regButton = {
  textAlign: "center",
  marginTop: "4px",
  minWidth: 33,
  maxWidth: 33,
  fontSize: "16px",
  "&:hover": {
    background: "#efefef",
  },
};

const drawerWidth = "15%";

const Calendar = ({
  technician,
  technicians,
  openDispatchDetails,
  openDailyOptionsMenu,
  openCalendarCustomerSearch,
}) => {
  const labels = useSyncedLabels(collection(db, "calLabel"));
  const events = useSyncedEvents(collection(db, "events"));
  const datelessEvents = events.filter((event) => event.dateScheduled === null);
  const currentAuth = getAuth();

  useEffect(() => {
    let draggableEl = document.getElementById("external-events");
    const draggable = new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: (eventEl) => {
        let dispatchLog = eventEl.dataset.dispatchLog;
        let id = eventEl.dataset.id;
        let issue = eventEl.dataset.issue;
        let jobNumber = eventEl.dataset.jobNumber;
        let leadSource = eventEl.dataset.leadSource;
        let notes = eventEl.dataset.notes;
        let payment = eventEl.dataset.payment;
        let shorthand = eventEl.dataset.shorthand;
        let start = null;
        let takenBy = eventEl.dataset.takenBy;
        let techHelper = eventEl.dataset.techHelper;
        let techLead = eventEl.dataset.techLead;
        let timeAlotted = eventEl.dataset.timeAlotted;
        let timeOfDay = eventEl.dataset.timeOfDay;
        let title = eventEl.dataset.title;

        return {
          create: true,
          dispatchLog: dispatchLog,
          id: id,
          issue: issue,
          jobNumber: jobNumber,
          leadSource: leadSource,
          notes: notes,
          payment: payment,
          shorthand: shorthand,
          start: start,
          takenBy: takenBy,
          techHelper: techHelper,
          techLead: techLead,
          timeAlotted: timeAlotted,
          timeOfDay: timeOfDay,
          title: title,
        };
      },
    });

    return () => draggable.destroy();
  }, []);

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const toggleHolding = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const getFilteredEvents = () => {
    let filteredEvents = [];
    if (technician === "ALL") {
      filteredEvents = events;
    } else {
      filteredEvents = events.filter(function (e) {
        return e.techLead === technician;
      });
    }
    return filteredEvents;
  };

  const getFilteredLabels = () => {
    let filteredLabels = [];
    if (technician === "ALL") {
      filteredLabels = labels;
    } else {
      filteredLabels = labels.filter(function (l) {
        return l.tech === technician;
      });
    }
    return filteredLabels;
  };

  const eventColorSetter = (eventData) => {
    let newBackgroundColor = "#000000";
    let newBorderColor = "white";

    technicians.length > 0 &&
      technicians.map((tech) => {
        if (tech.name === eventData.techLead) {
          return (newBackgroundColor = tech.color);
        } else {
          return newBackgroundColor;
        }
      });

    if (eventData.status === "active") {
      newBorderColor = "#30db30";
    } else if (eventData.status === "scheduled") {
      newBorderColor = "blue";
    } else if (eventData.status === "parts") {
      newBorderColor = "orange";
    } else {
      newBorderColor = "black";
    }

    eventData.backgroundColor = newBackgroundColor;
    eventData.borderColor = newBorderColor;
    return eventData;
  };

  const customDateHeader = ({
    date,
    dayNumberText,
    dow,
    isDisabled,
    isFuture,
    isOther,
    isPast,
    isToday,
    view,
  }) => {
    if (labels.length > 0) {
      let cityLabels = [];
      let dayLabels = getFilteredLabels();

      dayLabels.forEach((label) => {
        if (label.labelDate.getTime() === date.getTime()) {
          cityLabels.push(label.locationName.toString());
        }
      });
      return (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            style={settingsButton}
            onClick={() => openDailyOptionsMenu(date)}
          >
            <SettingsOutlined style={{ margin: "0px", padding: "0px" }} />
          </Button>

          <Typography
            sx={{
              flexGrow: 5,
              wordWrap: "break-word",
              wordBreak: "break-word",
              textAlign: "center",
            }}
            color="primary"
            variant="body1"
            gutterBottom
          >
            {cityLabels.join(" ")}
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            size="small"
            sx={regButton}
            onClick={() => openCalendarCustomerSearch(date)}
          >
            <strong>{dayNumberText}</strong>
          </Button>
        </div>
      );
    } else {
      return (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button style={settingsButton}>
            <SettingsOutlined style={{ margin: "0px", padding: "0px" }} />
          </button>
          <Typography
            sx={{ flexGrow: 5 }}
            variant="body1"
            gutterBottom
          ></Typography>
          <Button variant="outlined" size="small" sx={regButton}>
            <strong>{dayNumberText}</strong>
          </Button>
        </div>
      );
    }
  };

  const selectEvent = async (eventInfo) => {
    //get the updated customer information and inject into the event object
    const docRef = doc(
      db,
      "customers",
      eventInfo.event.extendedProps.customerId
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      eventInfo.event.customer = { ...docSnap.data() };
      openDispatchDetails(eventInfo.event);
    } else {
      openDispatchDetails(eventInfo.event);
    }
  };

  const handleEventReceive = async (eventInfo) => {
    // get the event id from eventInfo.draggedEl
    const eventId = eventInfo.draggedEl.getAttribute("data-id");

    // get the event from firestore with the id
    const eventRef = doc(db, "events", eventId);
    const docSnap = await getDoc(eventRef);
    // populate the dispatch with the correct info
    if (docSnap.exists()) {
      const eventData = docSnap.data();

      //create a new dispatch log and add it to the array
      const updatedDispatchLog = eventData.dispatchLog?.length
        ? eventData.dispatchLog
        : [];
      const dispatchLogToAdd = {
        activity: "Moved from holding to scheduled.",
        activityTime: new Date(),
        name: currentAuth.currentUser.displayName,
        sortingDate: getUnixTime(new Date()),
      };
      updatedDispatchLog.push(dispatchLogToAdd);

      //check for a 2nd tech before updating the original.
      if (eventData.techHelper !== "NONE") {
        const docForId = doc(collection(db, "events"));
        const helperEvent = {
          customerId: eventData.customerId,
          dateCreated: eventData.dateCreated,
          dateModified: new Date(),
          dateScheduled: eventInfo.event.start,
          dispatchLog: updatedDispatchLog,
          end: setDateToOneAm(eventInfo.event.start),
          firstname: eventData.firstname,
          id: docForId.id,
          invoiceId: eventData.invoiceId,
          issue: eventData.issue,
          jobNumber: eventData.jobNumber,
          lastname: eventData.lastname,
          leadSource: eventData.leadSource,
          notes: eventData.notes,
          payment: eventData.payment,
          scheduledDate: getUnixFromDate(
            setDateToZeroHours(eventInfo.event.start)
          ),
          shorthand: eventData.shorthand,
          start: eventInfo.event.start,
          status: "scheduled",
          takenBy: eventData.takenBy,
          techHelper: eventData.techLead,
          techHelperId: eventInfo.draggedEl.getAttribute("data-id"),
          techLead: eventData.techHelper,
          timeAlotted: eventData.timeAlotted,
          timeOfDay: eventData.timeOfDay,
          title: eventData.title,
        };
        createNamedDocument(doc(db, "events", docForId.id), helperEvent)
          .then(() => {
            console.log("Success creating tech helper in firestore");
            //update the original
            const originalEventUpdate = {
              customerId: eventData.customerId,
              dateCreated: eventData.dateCreated,
              dateModified: new Date(),
              dateScheduled: eventInfo.event.start,
              dispatchLog: updatedDispatchLog,
              end: setDateToOneAm(eventInfo.event.start),
              firstname: eventData.firstname,
              id: eventData.id,
              invoiceId: eventData.invoiceId,
              issue: eventData.issue,
              jobNumber: eventData.jobNumber,
              lastname: eventData.lastname,
              leadSource: eventData.leadSource,
              notes: eventData.notes,
              payment: eventData.payment,
              scheduledDate: getUnixFromDate(
                setDateToZeroHours(eventInfo.event.start)
              ),
              shorthand: eventData.shorthand,
              start: eventInfo.event.start,
              status: "scheduled",
              takenBy: eventData.takenBy,
              techHelper: eventData.techHelper,
              techHelperId: docForId.id,
              techLead: eventData.techLead,
              timeAlotted: eventData.timeAlotted,
              timeOfDay: eventData.timeOfDay,
              title: eventData.title,
            };
            if (eventInfo.draggedEl.getAttribute("data-id")) {
              //if we have a id, update the dispatch in firestore
              updateDocument(
                doc(db, "events", eventInfo.draggedEl.getAttribute("data-id")),
                originalEventUpdate
              )
                .then(() => {
                  console.log("Success updating the original dispatch");
                })
                .catch((error) =>
                  console.log(
                    "firestore error updating original dispatch: ",
                    error
                  )
                );
            } else {
              console.log("No Id to update");
            }
          })
          .catch((error) =>
            console.log(
              "firebase error on updating tech helper dispatch",
              error
            )
          );
      }
    } else {
      console.log("event document was undefined or dose not exist");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        id="external-events"
        style={{
          width: isDrawerOpen ? drawerWidth : 0,
          border: isDrawerOpen ? "1px solid white" : "none",
          margin: "2px",
        }}
      >
        <div
          style={{
            height: "7vh",
            display: isDrawerOpen ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2em",
          }}
        >
          Holding
        </div>
        <Holding
          datelessEvents={datelessEvents}
          isDrawerOpen={isDrawerOpen}
          selectEvent={selectEvent}
          technicians={technicians}
        />
      </div>
      <div style={{ width: "100%", margin: "2px" }}>
        <FullCalendar
          customButtons={{
            openDrawerButton: {
              text: "holding",
              click: function () {
                toggleHolding();
              },
            },
          }}
          dayCellContent={customDateHeader}
          displayEventTime={false}
          droppable={true}
          // drop={(dropInfo) => console.log("dropInfo", dropInfo)}
          editable={true}
          eventBorderColor={30}
          eventClassNames="fc-h-event"
          eventClick={selectEvent}
          eventDataTransform={eventColorSetter}
          eventDisplay="block"
          eventReceive={handleEventReceive}
          events={[...getFilteredEvents()]}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "openDrawerButton prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height={1000}
          initialView="dayGridMonth"
        />
      </div>
    </div>
  );
};

export default Calendar;
