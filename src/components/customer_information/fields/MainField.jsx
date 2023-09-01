import { Business, LocationOn, Person } from "@mui/icons-material";
import { Card, Typography } from "@mui/material";
import React from "react";

const MainField = ({ title, name, address, address2, business }) => {
  return (
    <Card variant="outlined" sx={{ padding: "8px" }}>
      {business ? (
        <>
          <Typography variant="caption">{title}</Typography>
          <div style={{ display: "flex" }}>
            <Business color="primary" />
            <Typography variant="body1" sx={{ marginLeft: "4px" }}>
              {name}
            </Typography>
          </div>
        </>
      ) : (
        <>
          <Typography variant="caption" gutterBottom>
            Customer Information
          </Typography>
          <div style={{ display: "flex" }}>
            <Person color="primary" />
            <Typography variant="body1" sx={{ marginLeft: "4px" }}>
              {name}
            </Typography>
          </div>
        </>
      )}

      <div style={{ display: "flex" }}>
        <LocationOn style={{ color: "red" }} />
        <Typography variant="body1" sx={{ marginLeft: "4px" }}>
          {address}
        </Typography>
      </div>

      <div style={{ display: "flex" }}>
        <Typography variant="body1" sx={{ marginLeft: "28px" }}>
          {address2}
        </Typography>
      </div>
    </Card>
  );
};

export default MainField;
