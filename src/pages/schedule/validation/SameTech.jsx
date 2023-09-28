import { Close } from "@mui/icons-material";
import "../../../global_style/style.css";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const SameTech = ({ closeModalTwo }) => {
  return (
    <div className="container">
      <Typography variant="h5" color="orange">
        Tech names can not be the same.
      </Typography>
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

export default SameTech;
