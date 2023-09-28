import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";

const IncrementDigit = ({ value, setValue, label }) => {
  const decrementValue = (number) => {
    if (number < 1) {
      setValue(number + 1);
    } else {
      setValue(number);
    }
  };

  const incrementValue = (number) => {
    if (number > 10) {
      setValue(number - 1);
    } else {
      setValue(number);
    }
  };

  return (
    <Grid container spacing={1.5}>
      <Grid xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="body1">{label}</Typography>
      </Grid>
      <Grid xs={4}>
        <IconButton
          color="primary"
          onClick={() => decrementValue(value - 1)}
          size="large"
        >
          <RemoveCircleOutline fontSize="large" />
        </IconButton>
      </Grid>
      <Grid
        xs={4}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0px",
        }}
      >
        <Typography variant="h4">{value}</Typography>
      </Grid>
      <Grid xs={4}>
        <IconButton
          color="primary"
          onClick={() => incrementValue(value + 1)}
          size="large"
        >
          <AddCircleOutline fontSize="large" />
        </IconButton>
      </Grid>
    </Grid>
    // <div>
    //   <div style={{ display: "flex", justifyContent: "center" }}>{label}</div>
    //   <div
    //     className="row"
    //     style={{ alignItems: "center", justifyContent: "center" }}
    //   >
    //     <IconButton
    //       color="primary"
    //       onClick={() => decrementValue(value - 1)}
    //       size="large"
    //     >
    //       <RemoveCircleOutline fontSize="large" />
    //     </IconButton>
    //     <div style={{ fontSize: "26px" }}>{value}</div>
    //     <IconButton
    //       color="primary"
    //       onClick={() => incrementValue(value + 1)}
    //       size="large"
    //     >
    //       <AddCircleOutline fontSize="large" />
    //     </IconButton>
    //   </div>
    // </div>
  );
};

export default IncrementDigit;
