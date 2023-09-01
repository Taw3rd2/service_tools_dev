import { Add, Remove } from "@mui/icons-material";
import { IconButton } from "@mui/material";
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
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>{label}</div>
      <div
        className="row"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <IconButton
          onClick={() => decrementValue(value - 1)}
          sx={{ color: "white", backgroundColor: "teal" }}
        >
          <Remove />
        </IconButton>
        <div style={{ fontSize: "26px" }}>{value}</div>
        <IconButton
          onClick={() => incrementValue(value + 1)}
          sx={{
            color: "white",
            backgroundColor: "teal",
          }}
        >
          <Add />
        </IconButton>
      </div>
    </div>
  );
};

export default IncrementDigit;
