import { Typography } from "@mui/material";
import Labor from "./Labor";

const DefaultLabor = ({
  selectedEquipmentId,
  labor,
  setLabor,
  openAddLaborToJob,
}) => {
  if (selectedEquipmentId === null) {
    return (
      <div className="worksheetDate" style={{ margin: "8px" }}>
        There is no unit selected
      </div>
    );
  } else {
    return (
      <div style={{ margin: "8px", border: "1px solid black" }}>
        <Typography variant="h5" ml={2}>
          Labor
        </Typography>
        <Labor
          selectedEquipmentId={selectedEquipmentId}
          labor={labor}
          setLabor={setLabor}
          openAddLaborToJob={openAddLaborToJob}
        />
      </div>
    );
  }
};

export default DefaultLabor;
