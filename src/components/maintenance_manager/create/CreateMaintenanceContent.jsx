import React, { useContext, useState } from "react";
import { ToastContext } from "../../../context/toastContext";
import { collection } from "firebase/firestore";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";

import { addMaintenance } from "../maintenance_functions/createMaintenanceFunctions";

import EquipmentPicker from "../../equipment_picker/EquipmentPicker";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { InputAdornment, TextField, Typography } from "@mui/material";
import { Close, AddCircleOutline } from "@mui/icons-material";
import { getFormattedDateAndTime } from "../../../utilities/dateUtils";

import "../../../global_style/style.css";
import IncrementDigit from "./IncrementDigit";

const CreateMaintenanceContent = ({ customer, closeModalTwo }) => {
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
        <div className="row" style={{ marginTop: "16px" }}>
          <div className="tripleRowInput">
            <TextField
              label="M-Number"
              variant="outlined"
              value={maintenanceValues.mNumber}
              fullWidth
              sx={{ input: { color: "primary" } }}
              onChange={handleMaintenanceChange("mNumber")}
              required
            />
          </div>
          <div className="tripleRowInput">
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
          </div>
          <div className="tripleRowInput">
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
          </div>
        </div>
        <div className="row">
          <div className="doubleRowInput">
            <div className="row">
              <div className="doubleRowInput">
                <IncrementDigit
                  value={maintenanceValues.numberOfYears}
                  setValue={(newValue) =>
                    handleMaintenanceDateChange("numberOfYears", newValue)
                  }
                  label={"Years"}
                />
              </div>
              <div className="doubleRowInput">
                <IncrementDigit
                  value={maintenanceValues.numberOfVisits}
                  setValue={(newValue) =>
                    handleMaintenanceDateChange("numberOfVisits", newValue)
                  }
                  label={"Visits"}
                />
              </div>
            </div>
          </div>
          <div className="doubleRowInput">
            <div className="buttonBar">
              <button type="submit" className="standardButton">
                <AddCircleOutline />
                <span className="iconSeperation">Submit New Maintenance</span>
              </button>
              <button
                type="button"
                className="standardButton"
                onClick={() => closeModalTwo()}
              >
                <Close />
                <span className="iconSeperation">Close</span>
              </button>
            </div>
          </div>
        </div>

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
