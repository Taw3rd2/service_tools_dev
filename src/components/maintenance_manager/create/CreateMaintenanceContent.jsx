import React, { useContext, useState } from "react";
import { ToastContext } from "../../../context/toastContext";
import { collection } from "firebase/firestore";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";

import { addMaintenance } from "../maintenance_functions/createMaintenanceFunctions";

import EquipmentPicker from "../../equipment_picker/EquipmentPicker";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { Close, AddCircleOutline, ListAlt } from "@mui/icons-material";
import { getFormattedDateAndTime } from "../../../utilities/dateUtils";

import "../../../global_style/style.css";
import IncrementDigit from "./IncrementDigit";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const CreateMaintenanceContent = ({
  customer,
  closeModalTwo,
  openMaintenanceMaterialList,
}) => {
  const { dispatch } = useContext(ToastContext);

  //list of the customers equipment
  const equipment = useSyncedCollection(
    collection(db, "customers", customer.id, "Equipment")
  );

  //empty array to store equipment selections
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [equipmentError, setEquipmentError] = useState(false);
  const todaysDate = new Date();

  const [maintenanceValues, setMaintenanceValues] = useState({
    mNumber: "",
    salePrice: "",
    saleDate: todaysDate,
    numberOfVisits: 1,
    numberOfYears: 1,
  });

  const handleMaintenanceChange = (prop) => (event) => {
    setMaintenanceValues({ ...maintenanceValues, [prop]: event.target.value });
  };

  const handleMaintenanceDateChange = (prop, value) => {
    setMaintenanceValues({ ...maintenanceValues, [prop]: value });
  };

  const handleCheckChange = (name) => (event) => {
    console.log("name: ", name);
    console.log("checked: ", event.target.checked);

    setSelectedEquipment({
      ...selectedEquipment,
      [name]: event.target.checked,
    });
  };

  const submitNewMaintenance = (e) => {
    e.preventDefault();

    if (selectedEquipment === undefined || selectedEquipment.length === 0) {
      console.log("No equipment was selected to apply a maintenance");
      setEquipmentError(true);
    } else {
      setEquipmentError(false);
      addMaintenance(
        activateSuccessNotification,
        activateFailureNotification,
        closeModalTwo,
        customer,
        equipment,
        maintenanceValues,
        selectedEquipment
      );
    }
  };

  const activateSuccessNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Create Maintenance",
        message: "Equipment maintenance added to the cloud",
      },
    });
  };

  const activateFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Create Maintenance",
        message: "There was an error creating",
      },
    });
  };

  return (
    <div>
      <Typography>{`${customer.firstname} ${customer.lastname}`}</Typography>
      <EquipmentPicker
        equipment={equipment}
        selectedEquipment={selectedEquipment}
        handleCheckChange={handleCheckChange}
      />
      <form autoComplete="new password" onSubmit={submitNewMaintenance}>
        <Grid container spacing={1.5} sx={{ marginTop: "16px" }}>
          <Grid xs={12} sm={12} md={12} lg={4}>
            <TextField
              label="M-Number"
              variant="outlined"
              value={maintenanceValues.mNumber}
              fullWidth
              sx={{ input: { color: "primary" } }}
              onChange={handleMaintenanceChange("mNumber")}
              required
            />
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={4}>
            <TextField
              label="Sale Price"
              variant="outlined"
              value={maintenanceValues.salePrice}
              fullWidth
              sx={{ input: { color: "primary" } }}
              onChange={handleMaintenanceChange("salePrice")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              required
            />
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Sale Date"
                fullWidth
                value={maintenanceValues.saleDate}
                onChange={(newValue) => {
                  handleMaintenanceDateChange("saleDate", newValue);
                }}
                color="primary"
                renderInput={(params) => (
                  <TextField {...params} sx={{ width: "100%" }} />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid
            xs={12}
            sm={12}
            md={12}
            lg={6}
            display="flex"
            justifyContent="space-evenly"
          >
            <IncrementDigit
              value={maintenanceValues.numberOfYears}
              setValue={(newValue) =>
                handleMaintenanceDateChange("numberOfYears", newValue)
              }
              label={"Years"}
            />

            <IncrementDigit
              value={maintenanceValues.numberOfVisits}
              setValue={(newValue) =>
                handleMaintenanceDateChange("numberOfVisits", newValue)
              }
              label={"Visits"}
            />
          </Grid>
          <Grid
            xs={12}
            sm={12}
            md={12}
            lg={6}
            sx={{ marginTop: "26px", textAlign: "right" }}
          >
            <Button
              variant="contained"
              type="button"
              startIcon={<ListAlt />}
              onClick={() => openMaintenanceMaterialList(customer.id)}
            >
              Material
            </Button>
            <Button
              variant="contained"
              type="submit"
              startIcon={<AddCircleOutline />}
              sx={{ marginLeft: "8px" }}
            >
              Add Maintenance
            </Button>
            <Button
              variant="contained"
              type="button"
              startIcon={<Close />}
              onClick={() => closeModalTwo()}
              sx={{ marginLeft: "8px" }}
            >
              Close
            </Button>
          </Grid>
        </Grid>
        {equipmentError && (
          <div className="row">
            <div className="singleRowInput">
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "red" }}
              >
                Please select the equipment you want attached to the maintenance
                then submit...
              </Typography>
            </div>
          </div>
        )}
      </form>
      <div style={{ marginRight: "auto" }}>Notes:</div>
      <div style={{ marginRight: "auto" }}>
        Years will duplicate the maintenance, and automatically advance the
        expiration dates.
      </div>
      <div style={{ marginRight: "auto" }}>
        More than 1 year will automatically add the year after the M number.
      </div>
      <div style={{ marginRight: "auto" }}>
        Visits will duplicate the maintenance for the same year.
      </div>
      <div style={{ marginRight: "auto" }}>
        More than 1 visit will automatically add the visit number after the M
        number.
      </div>
    </div>
  );
};

export default CreateMaintenanceContent;
