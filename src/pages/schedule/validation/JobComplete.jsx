import { Close } from "@mui/icons-material";
import "../../../global_style/style.css";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const JobComplete = ({ closeModalTwo }) => {
  return (
    <div className="container">
      <Typography variant="h5" color="orange">
        This job is already complete.
      </Typography>
      <ul>
        <li>
          This dispatch has been marked "Done" or "Parts Needed" by the
          Technician
        </li>
        <li>Maybe you should start a new job?</li>
      </ul>
      <Grid
        container
        spacing={1.5}
        sx={{ display: "flex", justifyContent: "end" }}
      >
        <Grid>
          <Button
            variant="contained"
            type="button"
            startIcon={<Close />}
            onClick={() => closeModalTwo()}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default JobComplete;
