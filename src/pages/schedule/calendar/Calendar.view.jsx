import {
  db,
  useSyncedEvents,
  useSyncedLabels,
} from "../../../firebase/firestore.utils";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "./calendarView.css";
import { SettingsOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { collection, doc, getDoc } from "firebase/firestore";

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

const Calendar = ({
  technician,
  technicians,
  openDispatchDetails,
  openDailyOptionsMenu,
  openCalendarCustomerSearch,
}) => {
  const labels = useSyncedLabels(collection(db, "calLabel"));
  const events = useSyncedEvents(collection(db, "events"));

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

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      initialView="dayGridMonth"
      events={[...getFilteredEvents()]}
      eventClassNames="fc-h-event"
      eventBorderColor={30}
      eventDisplay="block"
      eventDataTransform={eventColorSetter}
      eventChange={() => {
        console.log("eventChange");
      }}
      displayEventTime={false}
      dayCellContent={customDateHeader}
      eventClick={selectEvent}
      height={1000}
    />
  );
};

export default Calendar;
