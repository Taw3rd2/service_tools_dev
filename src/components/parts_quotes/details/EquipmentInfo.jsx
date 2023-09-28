import { Switch, TextField, Typography } from "@mui/material";

const EquipmentInfo = ({
  equipmentValues,
  handleEquipmentValueChange,
  quoteValues,
  handleQuoteCheckChange,
}) => {
  return (
    <div>
      <div className="row">
        <div className="singleRowInput">
          <Typography variant="h5">Equipment Information</Typography>
        </div>
      </div>
      <div className="row" style={{ alignItems: "center" }}>
        <div className="doubleRowInput">Not Model Specific</div>
        <div style={{ marginLeft: "auto" }}>
          <Switch
            checked={quoteValues.notModelSpecific}
            onChange={handleQuoteCheckChange("notModelSpecific")}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
      </div>
      {quoteValues.notModelSpecific ? (
        <div className="buttonBarStack">
          <TextField
            label="Equipment Name"
            size="small"
            value={equipmentValues.equipmentName}
            fullWidth
            onChange={handleEquipmentValueChange("equipmentName")}
            inputProps={{ tabIndex: "7" }}
          />
        </div>
      ) : (
        <div className="buttonBarStack">
          <TextField
            label="Equipment Name"
            size="small"
            value={equipmentValues.equipmentName}
            fullWidth
            required
            onChange={handleEquipmentValueChange("equipmentName")}
            inputProps={{ tabIndex: "7" }}
          />
          <TextField
            label="Equipment Brand"
            size="small"
            value={equipmentValues.equipmentBrand}
            fullWidth
            onChange={handleEquipmentValueChange("equipmentBrand")}
            inputProps={{ tabIndex: "8" }}
          />
          <TextField
            label="Equipment Model"
            size="small"
            value={equipmentValues.equipmentModel}
            fullWidth
            onChange={handleEquipmentValueChange("equipmentModel")}
            inputProps={{ tabIndex: "9" }}
          />
          <TextField
            label="Equipment Serial"
            size="small"
            value={equipmentValues.equipmentSerial}
            fullWidth
            onChange={handleEquipmentValueChange("equipmentSerial")}
            inputProps={{ tabIndex: "10" }}
          />
        </div>
      )}
    </div>
  );
};

export default EquipmentInfo;
