import { Typography } from "@mui/material";
import Material from "./Material";

const DefaultMaterial = ({
  selectedEquipmentId,
  material,
  setMaterial,
  openJobMaterialPicker,
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
          Material
        </Typography>
        <Material
          material={material}
          setMaterial={setMaterial}
          openJobMaterialPicker={openJobMaterialPicker}
        />
      </div>
    );
  }
};

export default DefaultMaterial;
