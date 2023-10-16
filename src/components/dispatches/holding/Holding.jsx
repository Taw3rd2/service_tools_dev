import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Holding = ({
  datelessEvents,
  isDrawerOpen,
  selectEvent,
  technicians,
}) => {
  const theme = useTheme();

  const getBackgroundColor = (dispatch) => {
    let backgroundColor = theme.palette.background.paper;
    technicians.length > 0 &&
      technicians.map((tech) => {
        if (tech.name === dispatch.techLead) {
          return (backgroundColor = tech.color);
        } else {
          return backgroundColor;
        }
      });
    return backgroundColor;
  };

  return (
    <div>
      {datelessEvents.map((disp, index) => {
        const selectedEvent = {
          event: {
            extendedProps: {
              customerId: disp.customerId,
              dateCreated: disp.dateCreated,
              dateModified: disp.dateModified,
              dateScheduled: disp.dateScheduled,
              dispatchLog: disp.dispatchLog,
              firstname: disp.firstname,
              id: disp.id,
              invoiceId: disp.invoiceId,
              issue: disp.issue,
              jobNumber: disp.jobNumber,
              lastname: disp.lastname,
              leadSource: disp.leadSource,
              notes: disp.notes,
              payment: disp.payment,
              scheduledDate: disp.scheduledDate,
              shorthand: disp.shorthand,
              status: disp.status,
              takenBy: disp.takenBy,
              techHelper: disp.techHelper,
              techHelperId: disp.techHelperId,
              techLead: disp.techLead,
              timeAlotted: disp.timeAlotted,
              timeOfDay: disp.timeOfDay,
            },
            end: disp.end,
            id: disp.id,
            start: disp.start,
            title: disp.title,
          },
        };
        return (
          <div
            className="fc-event"
            data-id={disp.id}
            draggable="true"
            key={disp.id}
            style={{
              backgroundColor: getBackgroundColor(
                selectedEvent.event.extendedProps
              ), //theme.palette.background.paper,
              border: "1px solid",
              borderRadius: "3px",
              color: theme.palette.text.primary,
              cursor: "pointer",
              display: isDrawerOpen ? "inherit" : "none",
              margin: "2px",
              marginBottom: "2px",
              padding: "2px",
            }}
            onClick={() => selectEvent(selectedEvent)}
          >
            <Typography variant="body2">{disp.title}</Typography>
          </div>
        );
      })}
    </div>
  );
};

export default Holding;
