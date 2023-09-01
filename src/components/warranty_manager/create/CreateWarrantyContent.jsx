import React, { useContext, useState } from "react";
import { ToastContext } from "../../../context/toastContext";

import { db, useSyncedCollection } from "../../../firebase/firestore.utils";
import { addWarranty } from "../warrantyFunctions";

import EquipmentPicker from "../../equipment_picker/EquipmentPicker";

import { TextField, Typography } from "@mui/material";
import { AddCircleOutline, Close } from "@mui/icons-material";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { getFormattedDateAndTime } from "../../../utilities/dateUtils";
import { collection } from "firebase/firestore";

const CreateWarrantyContent = ({ customer, closeModalTwo }) => {
  const { dispatch } = useContext(ToastContext);
  const equipment = useSyncedCollection(
    collection(db, "customers", customer.id, "Equipment")
  );

  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [equipmentError, setEquipmentError] = useState(false);

  const handleCheckChange = (name) => (event) => {
    setSelectedEquipment({
      ...selectedEquipment,
      [name]: event.target.checked,
    });
  };

  const todaysDate = new Date();
  const defaultLaborWarrantyExpiration = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  );
  const defaultPartsWarrantyExpiration = new Date(
    new Date().setFullYear(new Date().getFullYear() + 10)
  );

  const [warrantyValues, setWarrantyValues] = useState({
    jobNumber: "",
    startDate: todaysDate,
    partsExpirationDate: defaultPartsWarrantyExpiration,
    laborExpirationDate: defaultLaborWarrantyExpiration,
  });

  const handleWarrantyChange = (prop) => (event) => {
    setWarrantyValues({ ...warrantyValues, [prop]: event.target.value });
  };

  const handleWarrantyDateChange = (prop, value) => {
    setWarrantyValues({ ...warrantyValues, [prop]: value });
  };

  const submitNewWarranty = (e) => {
    e.preventDefault();

    if (selectedEquipment === undefined || selectedEquipment.length === 0) {
      console.log("No equipment was selected to apply a warranty");
      setEquipmentError(true);
    } else {
      setEquipmentError(false);
      addWarranty(
        customer,
        selectedEquipment,
        warrantyValues,
        equipment,
        activateSuccessNotification,
        activateFailureNotification,
        closeModalTwo
      );
    }
  };

  const activateSuccessNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Create Warranty",
        message: "Warranty added in the cloud",
      },
    });
  };

  const activateFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Create Warranty",
        message: "There was an error creating",
      },
    });
  };

  return (
    <div>
      <EquipmentPicker
        equipment={equipment}
        selectedEquipment={selectedEquipment}
        handleCheckChange={handleCheckChange}
      />
      <form autoComplete="new password" onSubmit={submitNewWarranty}>
        <div className="row" style={{ marginTop: "16px" }}>
          <div className="doubleRowInput">
            <TextField
              label="Job Number"
              variant="outlined"
              value={warrantyValues.jobNumber}
              fullWidth
              sx={{ input: { color: "primary" } }}
              onChange={handleWarrantyChange("jobNumber")}
            />
          </div>
          <div className="doubleRowInput">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                fullWidth
                value={warrantyValues.startDate}
                onChange={(newValue) => {
                  handleWarrantyDateChange("startDate", newValue);
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Parts Expiration Date"
                fullWidth
                value={warrantyValues.partsExpirationDate}
                onChange={(newValue) => {
                  handleWarrantyDateChange("partsExpirationDate", newValue);
                }}
                color="primary"
                renderInput={(params) => (
                  <TextField {...params} sx={{ width: "100%" }} />
                )}
              />
            </LocalizationProvider>
          </div>
          <div className="doubleRowInput">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Labor Expiration Date"
                fullWidth
                value={warrantyValues.laborExpirationDate}
                onChange={(newValue) => {
                  handleWarrantyDateChange("laborExpirationDate", newValue);
                }}
                color="primary"
                renderInput={(params) => (
                  <TextField {...params} sx={{ width: "100%" }} />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>
        {equipment.length < 1 ? (
          <div className="buttonBar">
            <button
              type="button"
              className="standardButton"
              onClick={() => closeModalTwo()}
            >
              <Close />
              <span className="iconSeperation">Close</span>
            </button>
          </div>
        ) : (
          <div className="buttonBar">
            <button type="submit" className="standardButton">
              <AddCircleOutline />
              <span className="iconSeperation">Add Warranty</span>
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
        )}
        {equipmentError && (
          <div className="row">
            <div className="singleRowInput">
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "red" }}
              >
                Please select the equipment you want attached to the maintenance
                then add warranty...
              </Typography>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateWarrantyContent;
