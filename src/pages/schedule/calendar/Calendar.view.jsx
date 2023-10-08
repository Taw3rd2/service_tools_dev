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
import { useTheme } from "@mui/material/styles";
import {
  getUnixFromDate,
  setDateToOneAm,
  setDateToZeroHours,
} from "../../../utilities/dateUtils";

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
  const theme = useTheme();

  const labels = useSyncedLabels(collection(db, "calLabel"));
  const events = useSyncedEvents(collection(db, "events"));

  const datelessEvents = events.filter((event) => event.dateScheduled === null);

  useEffect(() => {
    let draggableEl = document.getElementById("external-events");
    const draggable = new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: (eventEl) => {
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

  const handleEventReceive = (eventInfo) => {
    const droppedEvent = {
      customerId: eventInfo.draggedEl.getAttribute("customer-id"),
      dateCreated: new Date(eventInfo.draggedEl.getAttribute("date-created")),
      dateModified: new Date(),
      dateScheduled: eventInfo.event.start,
      end: setDateToOneAm(eventInfo.event.start),
      firstname: eventInfo.draggedEl.getAttribute("firstname"),
      id: eventInfo.draggedEl.getAttribute("data-id"),
      invoiceId: eventInfo.draggedEl.getAttribute("invoice-id"),
      issue: eventInfo.draggedEl.getAttribute("issue"),
      jobNumber: eventInfo.draggedEl.getAttribute("job-number"),
      lastname: eventInfo.draggedEl.getAttribute("lastname"),
      leadSource: eventInfo.draggedEl.getAttribute("lead-source"),
      notes: eventInfo.draggedEl.getAttribute("notes"),
      payment: eventInfo.draggedEl.getAttribute("payment"),
      scheduledDate: getUnixFromDate(setDateToZeroHours(eventInfo.event.start)),
      shorthand: eventInfo.draggedEl.getAttribute("shorthand"),
      start: eventInfo.event.start,
      status: eventInfo.draggedEl.getAttribute("status"),
      takenBy: eventInfo.draggedEl.getAttribute("taken-by"),
      techHelper: eventInfo.draggedEl.getAttribute("tech-helper"),
      techHelperId: eventInfo.draggedEl.getAttribute("tech-helper-id"),
      techLead: eventInfo.draggedEl.getAttribute("tech-lead"),
      timeAlotted: eventInfo.draggedEl.getAttribute("time-alotted"),
      timeOfDay: eventInfo.draggedEl.getAttribute("time-of-day"),
      title: eventInfo.draggedEl.getAttribute("title"),
    };
    if (eventInfo.draggedEl.getAttribute("data-id")) {
      //if we have a id, update the dispatch in firestore
      updateDocument(
        doc(db, "events", eventInfo.draggedEl.getAttribute("data-id")),
        droppedEvent
      )
        .then(() => {
          console.log("updated original dispatch");
          //check for a 2nd tech
          if (eventInfo.draggedEl.getAttribute("tech-helper-id")) {
            const helperEvent = {
              customerId: eventInfo.draggedEl.getAttribute("customer-id"),
              dateCreated: new Date(
                eventInfo.draggedEl.getAttribute("date-created")
              ),
              dateModified: new Date(),
              dateScheduled: eventInfo.event.start,
              end: setDateToOneAm(eventInfo.event.start),
              firstname: eventInfo.draggedEl.getAttribute("firstname"),
              id: eventInfo.draggedEl.getAttribute("tech-helper-id"),
              invoiceId: eventInfo.draggedEl.getAttribute("invoice-id"),
              issue: eventInfo.draggedEl.getAttribute("issue"),
              jobNumber: eventInfo.draggedEl.getAttribute("job-number"),
              lastname: eventInfo.draggedEl.getAttribute("lastname"),
              leadSource: eventInfo.draggedEl.getAttribute("lead-source"),
              notes: eventInfo.draggedEl.getAttribute("notes"),
              payment: eventInfo.draggedEl.getAttribute("payment"),
              scheduledDate: getUnixFromDate(
                setDateToZeroHours(eventInfo.event.start)
              ),
              shorthand: eventInfo.draggedEl.getAttribute("shorthand"),
              start: eventInfo.event.start,
              status: eventInfo.draggedEl.getAttribute("status"),
              takenBy: eventInfo.draggedEl.getAttribute("taken-by"),
              techHelper: eventInfo.draggedEl.getAttribute("tech-lead"),
              techHelperId: eventInfo.draggedEl.getAttribute("data-id"),
              techLead: eventInfo.draggedEl.getAttribute("tech-helper"),
              timeAlotted: eventInfo.draggedEl.getAttribute("time-alotted"),
              timeOfDay: eventInfo.draggedEl.getAttribute("time-of-day"),
              title: eventInfo.draggedEl.getAttribute("title"),
            };
            createNamedDocument(
              doc(
                db,
                "events",
                eventInfo.draggedEl.getAttribute("tech-helper-id")
              ),
              helperEvent
            )
              .then(() => {
                console.log("Success updating tech helper in firestore");
              })
              .catch((error) =>
                console.log(
                  "firebase error on updating tech helper dispatch",
                  error
                )
              );
          }
        })
        .catch((error) =>
          console.log("firestore error updating original dispatch: ", error)
        );
    } else {
      console.log("No Id to update");
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
        {datelessEvents.map((disp, index) => {
          return (
            <div
              className="fc-event"
              customer-id={disp.customerId}
              data-id={disp.id}
              date-created={disp.dateCreated}
              date-modified={disp.dateModified}
              date-scheduled={disp.dateScheduled}
              draggable="true"
              end={disp.end}
              firstname={disp.firstname}
              id={disp.id}
              invoice-id={disp.invoiceId}
              issue={disp.issue}
              job-number={disp.jobNumber}
              key={disp.id}
              lastname={disp.lastname}
              lead-source={disp.leadSource}
              notes={disp.notes}
              payment={disp.payment}
              scheduled-date={disp.scheduledDate}
              shorthand={disp.shorthand}
              start={disp.start}
              status={disp.status}
              taken-by={disp.takenBy}
              tech-helper={disp.techHelper}
              tech-helper-id={disp.techHelperId}
              tech-lead={disp.techLead}
              time-alotted={disp.timeAlotted}
              time-of-day={disp.timeOfDay}
              title={disp.title}
              style={{
                backgroundColor: theme.palette.background.paper,
                border: "1px solid",
                borderRadius: "3px",
                color: theme.palette.text.primary,
                cursor: "pointer",
                display: isDrawerOpen ? "inherit" : "none",
                margin: "2px",
                marginBottom: "2px",
              }}
            >
              {disp.title}
            </div>
          );
        })}
      </div>
      <div style={{ width: "100%", margin: "2px" }}>
        <FullCalendar
          customButtons={{
            openDrawerButton: {
              text: "Holding",
              click: function () {
                toggleHolding();
              },
            },
          }}
          dayCellContent={customDateHeader}
          displayEventTime={false}
          droppable={true}
          drop={(dropInfo) => console.log("dropInfo", dropInfo)}
          editable={true}
          eventBorderColor={30}
          eventClassNames="fc-h-event"
          eventChange={() => {
            console.log("eventChange");
          }}
          eventClick={selectEvent}
          eventDataTransform={eventColorSetter}
          eventDisplay="block"
          eventDrop={(info) => {
            console.log("start: ", info.event.start);
            console.log("info: ", info);
          }}
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
