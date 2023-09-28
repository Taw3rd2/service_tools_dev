import { useContext, useEffect } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import {
  db,
  updateDocument,
  useSyncedCollection,
} from "../../../../firebase/firestore.utils";
import { ToastContext } from "../../../../context/toastContext";

import { getFormattedExactTime } from "../../../../utilities/dateUtils";
import {
  stringPriceToNumber,
  toCurrency,
} from "../../../../utilities/currencyUtils";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import "../../../../global_style/style.css";
import {
  Add,
  ArrowUpward,
  Clear,
  DeleteForever,
  Edit,
} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const EquipmentDetails = ({
  selectedEquipmentId,
  selectedEquipmentValues,
  setSelectedEquipmentValues,
  clearSelectedEquipment,
  openDeleteEquipment,
  openAddMaterialList,
  openEditLaborList,
  openEditMaterialList,
  openEditAdditionsList,
}) => {
  const subCategories = useSyncedCollection(
    collection(db, "equipmentSubCategories")
  );
  const { dispatch } = useContext(ToastContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "equipment", selectedEquipmentId),
      (doc) => {
        setSelectedEquipmentValues({
          btu: doc.data().btu,
          cost: toCurrency(doc.data().cost / 100),
          dateUpdated: doc.data().dateUpdated,
          defaultAdditionsList: doc.data().defaultAdditionsList,
          defaultLaborList: doc.data().defaultLaborList,
          defaultMaterialList: doc.data().defaultMaterialList,
          model: doc.data().model,
          quantity: doc.data().quantity,
          size: doc.data().size,
          subCategory: doc.data().subCategory,
          voltage: doc.data().voltage,
          weight: doc.data().weight,
        });
      },
      (error) => {
        console.log(error.message);
      }
    );
    return () => unsubscribe();
  }, [selectedEquipmentId, setSelectedEquipmentValues]);

  const clearFields = () => {
    clearSelectedEquipment();
    setSelectedEquipmentValues({
      btu: "",
      cost: "",
      dateUpdated: null,
      defaultAdditionsList: [],
      defaultLaborList: [],
      defaultMaterialList: [],
      model: "",
      quantity: 1,
      size: "",
      subCategory: "",
      voltage: "",
      weight: "",
    });
  };

  const submitEquipment = (e) => {
    e.preventDefault();
    const equipmentFields = {
      btu: selectedEquipmentValues.btu,
      cost: stringPriceToNumber(selectedEquipmentValues.cost),
      dateUpdated: new Date().toLocaleString(),
      defaultAdditionsList:
        selectedEquipmentValues.defaultAdditionsList &&
        selectedEquipmentValues.defaultAdditionsList.length > 0
          ? selectedEquipmentValues.defaultAdditionsList
          : [],
      defaultLaborList:
        selectedEquipmentValues.defaultLaborList &&
        selectedEquipmentValues.defaultLaborList.length > 0
          ? selectedEquipmentValues.defaultLaborList
          : [],
      defaultMaterialList:
        selectedEquipmentValues.defaultMaterialList &&
        selectedEquipmentValues.defaultMaterialList.length > 0
          ? selectedEquipmentValues.defaultMaterialList
          : [],
      model: selectedEquipmentValues.model,
      quantity: selectedEquipmentValues.quantity,
      size: selectedEquipmentValues.size,
      subCategory: selectedEquipmentValues.subCategory,
      voltage: selectedEquipmentValues.voltage,
      weight: selectedEquipmentValues.weight,
    };
    if (selectedEquipmentId !== null) {
      updateDocument(doc(db, "equipment", selectedEquipmentId), equipmentFields)
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Update Equipment",
              message: "Updated equipment in the cloud",
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
              title: "Update Equipment",
              message: "There was an error updating",
            },
          });
          console.log("Firebase error: ", error);
        });
    }
  };

  const startDeleteEquipment = (id, model) => {
    const unitToDelete = {
      id,
      model,
    };
    openDeleteEquipment(unitToDelete);
    clearFields();
  };

  const handleEquipmentValueChange = (prop) => (event) => {
    setSelectedEquipmentValues({
      ...selectedEquipmentValues,
      [prop]: event.target.value,
    });
  };

  return (
    <div className="worksheetContainer">
      <form autoComplete="new password" onSubmit={submitEquipment}>
        <div className="row">
          <div className="singleRowInput">
            {selectedEquipmentValues.dateUpdated !== null ? (
              <div className="worksheetDate">
                {`Last Updated: ${selectedEquipmentValues.dateUpdated}`}
              </div>
            ) : (
              <div className="worksheetDate">{`No equipment loaded.`}</div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="twoThirdsRowInput">
            <div className="row">
              <div className="doubleRowInput">
                <TextField
                  label="Model"
                  fullWidth
                  value={selectedEquipmentValues.model}
                  onChange={handleEquipmentValueChange("model")}
                  required
                />
              </div>
              <div className="doubleRowInput">
                <FormControl fullWidth>
                  <InputLabel id="new_equipment_type_selector">
                    Equipment Type
                  </InputLabel>
                  <Select
                    labelId="new_equipment_type_selector"
                    label="Equipment Type"
                    id="sub_category_selector"
                    value={selectedEquipmentValues.subCategory}
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
              </div>
            </div>
            <div className="row">
              <div className="doubleRowInput">
                <TextField
                  label="BTUs"
                  fullWidth
                  value={selectedEquipmentValues.btu}
                  onChange={handleEquipmentValueChange("btu")}
                />
              </div>
              <div className="doubleRowInput">
                <TextField
                  label="Physical Size"
                  fullWidth
                  value={selectedEquipmentValues.size}
                  onChange={handleEquipmentValueChange("size")}
                />
              </div>
            </div>
            <div className="row">
              <div className="tripleRowInput">
                <TextField
                  label="Weight"
                  fullWidth
                  value={selectedEquipmentValues.weight}
                  onChange={handleEquipmentValueChange("weight")}
                />
              </div>
              <div className="tripleRowInput">
                <TextField
                  label="Voltage"
                  fullWidth
                  value={selectedEquipmentValues.voltage}
                  onChange={handleEquipmentValueChange("voltage")}
                />
              </div>
              <div className="tripleRowInput">
                <TextField
                  label="Equipment Cost"
                  fullWidth
                  value={selectedEquipmentValues.cost}
                  onChange={handleEquipmentValueChange("cost")}
                />
              </div>
            </div>
            <div className="row">
              {selectedEquipmentValues.defaultMaterialList &&
              selectedEquipmentValues.defaultMaterialList.length > 0 ? (
                <div className="singleRowInput">
                  <div className="worksheetDate">
                    * This unit has a pre defined installation material list
                    with{" "}
                    <strong>
                      {selectedEquipmentValues.defaultMaterialList.length}
                    </strong>{" "}
                    items.
                  </div>
                </div>
              ) : (
                <div className="singleRowInput">
                  <div className="worksheetDate">{`No Default Material List Loaded`}</div>
                </div>
              )}
            </div>
            <div className="row">
              {selectedEquipmentValues.defaultLaborList &&
              selectedEquipmentValues.defaultLaborList.length > 0 ? (
                <div className="singleRowInput">
                  <div className="worksheetDate">
                    * This unit has a pre defined installation labor list with{" "}
                    <strong>
                      {selectedEquipmentValues.defaultLaborList.length}
                    </strong>{" "}
                    items.
                  </div>
                </div>
              ) : (
                <div className="singleRowInput">
                  <div className="worksheetDate">{`No Default Labor List Loaded`}</div>
                </div>
              )}
            </div>
            <div className="row">
              {selectedEquipmentValues.defaultAdditionsList &&
              selectedEquipmentValues.defaultAdditionsList.length > 0 ? (
                <div className="singleRowInput">
                  <div className="worksheetDate">
                    * This unit has a pre defined installation additions list
                    with{" "}
                    <strong>
                      {selectedEquipmentValues.defaultAdditionsList.length}
                    </strong>{" "}
                    items.
                  </div>
                </div>
              ) : (
                <div className="singleRowInput">
                  <div className="worksheetDate">{`No Default Additions List Loaded`}</div>
                </div>
              )}
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
                  color="error"
                  fullWidth
                >
                  Clear Fields
                </Button>
              </Grid>
              {selectedEquipmentId ? (
                <>
                  <Grid xs={12}>
                    <Button
                      variant="contained"
                      type="submit"
                      startIcon={<ArrowUpward />}
                      fullWidth
                    >
                      Update Equipment Values
                    </Button>
                  </Grid>
                  <Grid xs={12}>
                    <Button
                      variant="contained"
                      type="button"
                      startIcon={<DeleteForever />}
                      onClick={() =>
                        startDeleteEquipment(
                          selectedEquipmentId,
                          selectedEquipmentValues.model
                        )
                      }
                      color="error"
                      fullWidth
                    >
                      Delete Equipment
                    </Button>
                  </Grid>
                  <Grid xs={12}>
                    <Button
                      variant="contained"
                      type="button"
                      startIcon={<Edit />}
                      onClick={() => openEditMaterialList()}
                      fullWidth
                      sx={{ marginTop: "16px" }}
                    >
                      Edit Pre defined Material List
                    </Button>
                  </Grid>
                  <Grid xs={12}>
                    <Button
                      variant="contained"
                      type="button"
                      startIcon={<Edit />}
                      onClick={() => openEditLaborList(selectedEquipmentId)}
                      fullWidth
                    >
                      Edit Pre defined Labor List
                    </Button>
                  </Grid>
                  <Grid xs={12}>
                    <Button
                      variant="contained"
                      type="button"
                      startIcon={<Edit />}
                      onClick={() => openEditAdditionsList(selectedEquipmentId)}
                      fullWidth
                    >
                      Edit Pre defined Additions List
                    </Button>
                  </Grid>
                  <Grid xs={12}>
                    <Button
                      variant="contained"
                      type="button"
                      startIcon={<Add />}
                      onClick={() => openAddMaterialList()}
                      fullWidth
                      sx={{ marginTop: "16px" }}
                    >
                      Open a Sample Job
                    </Button>
                  </Grid>
                </>
              ) : (
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
              )}
            </Grid>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EquipmentDetails;
