import { db, useSyncedCollection } from "../../firebase/firestore.utils";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";
import { CalendarMonth, CalendarToday, Close } from "@mui/icons-material";
import "../../global_style/style.css";
import { collection } from "firebase/firestore";

const DailyOptionsMenu = ({
  closeModalOne,
  calendarDateSelected,
  openDayLabelEditor,
}) => {
  const navigate = useNavigate();

  const technicians = useSyncedCollection(collection(db, "technicians"));

  return (
    <div className="container">
      <div className="buttonBarStack">
        {technicians &&
          technicians
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((tech) => (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CalendarMonth />}
                style={{
                  backgroundColor: tech.color,
                  color: "white",
                }}
                onClick={() => {
                  navigate(`/print_daily_slips/${tech.id}`, {
                    state: {
                      techLead: tech.name,
                      date: calendarDateSelected,
                    },
                    key: tech.id,
                  });
                }}
                key={tech.id}
              >
                {`Print ${tech.name}'s Daily Slips`}
              </Button>
              // <Link
              //   key={tech.id}
              //   to={{
              //     pathname: `/print_daily_slips/${tech.id}`,
              //   }}
              //   state={{
              //     techLead: `${tech.name}`,
              //     date: calendarDateSelected,
              //   }}
              //   style={{ textDecoration: "none" }}
              // >

              // </Link>
            ))}
        <button
          type="button"
          className="standardButton"
          style={{ backgroundColor: "teal", color: "white", marginLeft: 0 }}
          onClick={() => openDayLabelEditor(calendarDateSelected)}
        >
          <CalendarToday />
          <span className="iconSeperation">Day Label Editor</span>
        </button>
        <button
          type="button"
          className="standardButton"
          style={{ backgroundColor: "teal", color: "white", marginLeft: 0 }}
          onClick={() => closeModalOne()}
        >
          <Close />
          <span className="iconSeperation">Close</span>
        </button>
      </div>
    </div>
  );
};

export default DailyOptionsMenu;
