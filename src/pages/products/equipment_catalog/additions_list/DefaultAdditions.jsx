import { Typography } from "@mui/material";
import Additions from "./Additions";

const DefaultAdditions = ({
  selectedEquipmentId,
  additions,
  setAdditions,
  openAddAdditionsToJob,
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
          Additions
        </Typography>
        <Additions
          additions={additions}
          setAdditions={setAdditions}
          openAddAdditionsToJob={openAddAdditionsToJob}
        />
      </div>
    );
  }
};

export default DefaultAdditions;
