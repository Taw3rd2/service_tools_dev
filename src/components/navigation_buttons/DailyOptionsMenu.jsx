import { db, useSyncedCollection } from "../../firebase/firestore.utils";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";
import { CalendarMonth, CalendarToday, Close } from "@mui/icons-material";
import "../../global_style/style.css";
import { collection } from "firebase/firestore";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const DailyOptionsMenu = ({
  closeModalOne,
  calendarDateSelected,
  openDayLabelEditor,
}) => {
  const navigate = useNavigate();

  const technicians = useSyncedCollection(collection(db, "technicians"));

  return (
    <Grid container spacing={1.5}>
      {technicians &&
        technicians
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((tech) => (
            <Grid xs={12}>
              <Button
                variant="contained"
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
            </Grid>
          ))}
      <Grid xs={12}>
        <Button
          variant="contained"
          type="button"
          startIcon={<CalendarToday />}
          onClick={() => openDayLabelEditor(calendarDateSelected)}
          fullWidth
        >
          Day Label Editor
        </Button>
      </Grid>
      <Grid xs={12} sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="contained"
          type="button"
          startIcon={<Close />}
          onClick={() => closeModalOne()}
        >
          Close
        </Button>
      </Grid>
    </Grid>
  );
};

export default DailyOptionsMenu;
