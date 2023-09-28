import { Box, Typography } from "@mui/material";
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
      <Box border style={{ margin: "8px" }}>
        <Typography variant="h5" ml={2}>
          Additions
        </Typography>
        <Additions
          additions={additions}
          setAdditions={setAdditions}
          openAddAdditionsToJob={openAddAdditionsToJob}
        />
      </Box>
    );
  }
};

export default DefaultAdditions;
