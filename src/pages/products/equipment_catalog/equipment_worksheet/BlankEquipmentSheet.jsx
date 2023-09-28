import { collection } from "firebase/firestore";
import { useContext, useState } from "react";
import { ToastContext } from "../../../../context/toastContext";
import {
  createUnNamedDocument,
  db,
  useSyncedCollection,
} from "../../../../firebase/firestore.utils";
import { stringPriceToNumber } from "../../../../utilities/currencyUtils";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowUpward, Clear } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const BlankEquipmentSheet = () => {
  const subCategories = useSyncedCollection(
    collection(db, "equipmentSubCategories")
  );
  const { dispatch } = useContext(ToastContext);

  const [equipmentValues, setEquipmentValues] = useState({
    btu: "",
    cost: "",
    dateUpdated: null,
    model: "",
    quantity: 1,
    size: "",
    subCategory: "",
    voltage: "",
    weight: "",
  });

  const clearFields = () => {
    setEquipmentValues({
      btu: "",
      cost: "",
      dateUpdated: new Date().toLocaleString(),
      model: "",
      quantity: 1,
      size: "",
      subCategory: "",
      voltage: "",
      weight: "",
    });
  };

  const handleEquipmentValueChange = (prop) => (event) => {
    setEquipmentValues({ ...equipmentValues, [prop]: event.target.value });
  };

  const submitEquipment = (e) => {
    e.preventDefault();
    const equipmentFields = {
      btu: equipmentValues.btu,
      cost: stringPriceToNumber(equipmentValues.cost),
      dateUpdated: new Date().toLocaleString(),
      defaultAdditionsList: [],
      defaultLaborList: [],
      defaultMaterialList: [],
      model: equipmentValues.model,
      quantity: equipmentValues.quantity,
      size: equipmentValues.size,
      subCategory: equipmentValues.subCategory,
      voltage: equipmentValues.voltage,
      weight: equipmentValues.weight,
    };
    createUnNamedDocument(collection(db, "equipment"), equipmentFields)
      .then(() => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "SUCCESS",
            title: "Create Equipment",
            message: "Created equipment in the cloud",
          },
        });
        clearFields();
      })
      .catch((error) => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "ERROR",
            title: "Create Equipment",
            message: "There was an error creating",
          },
        });
        console.log("Firebase error: ", error);
      });
  };

  return (
    <div className="worksheetContainer">
      <form autoComplete="new password" onSubmit={submitEquipment}>
        <div className="row">
          <div className="singleRowInput">
            <Typography variant="h5">Blank Equipment Sheet</Typography>
          </div>
        </div>
        <div className="row">
          <div className="towThirdsRowInput">
            <div className="row">
              <div className="doubleRowInput">
                <TextField
                  label="Model"
                  fullWidth
                  value={equipmentValues.model}
                  onChange={handleEquipmentValueChange("model")}
                  required
                />
              </div>
              <div className="doubleRowInput">
                {subCategories.length > 0 && (
                  <FormControl fullWidth>
                    <InputLabel id="new_equipment_type_selector">
                      Equipment Type
                    </InputLabel>
                    <Select
                      labelId="new_equipment_type_selector"
                      id="subCategory"
                      value={equipmentValues.subCategory}
                      label="Equipment Type"
                      onChange={handleEquipmentValueChange("subCategory")}
                      required
                    >
                      {subCategories
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((category, index) => (
                          <MenuItem key={category.id} value={category.name}>
                            {category.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              </div>
            </div>
            <div className="row">
              <div className="doubleRowInput">
                <TextField
                  label="BTUs"
                  fullWidth
                  value={equipmentValues.btu}
                  onChange={handleEquipmentValueChange("btu")}
                />
              </div>
              <div className="doubleRowInput">
                <TextField
                  label="Physical Size"
                  fullWidth
                  value={equipmentValues.size}
                  onChange={handleEquipmentValueChange("size")}
                />
              </div>
            </div>
            <div className="row">
              <div className="tripleRowInput">
                <TextField
                  label="Weight"
                  fullWidth
                  value={equipmentValues.weight}
                  onChange={handleEquipmentValueChange("weight")}
                />
              </div>
              <div className="tripleRowInput">
                <TextField
                  label="Voltage"
                  fullWidth
                  value={equipmentValues.voltage}
                  onChange={handleEquipmentValueChange("voltage")}
                />
              </div>
              <div className="tripleRowInput">
                <FormControl fullWidth>
                  <InputLabel htmlFor="equipment-cost-input">
                    Equipment Cost
                  </InputLabel>
                  <OutlinedInput
                    id="equipment-cost-input"
                    value={equipmentValues.cost}
                    onChange={handleEquipmentValueChange("cost")}
                    fullWidth
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                    label="Equipment Cost"
                    required
                  />
                </FormControl>
              </div>
            </div>
          </div>
          <div className="oneThirdRowInput">
            <Grid container spacing={1.5}>
              <Grid xs={12}>
                <Button
                  variant="contained"
                  type="button"
                  startIcon={<Clear />}
                  onClick={() => clearFields()}
                  fullWidth
                >
                  Clear Fields
                </Button>
              </Grid>
              <Grid xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={<ArrowUpward />}
                  fullWidth
                >
                  Add New Equipment
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlankEquipmentSheet;
