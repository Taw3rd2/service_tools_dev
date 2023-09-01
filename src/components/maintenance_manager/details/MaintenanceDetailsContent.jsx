import React, { useContext, useState } from "react";
import { ToastContext } from "../../../context/toastContext";

import { updateMaintenance } from "../maintenance_functions/updateMaintenanceFunctions";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { TextField, Typography } from "@mui/material";
import { Close, DeleteForever, Update } from "@mui/icons-material";
import { getFormattedDateAndTime } from "../../../utilities/dateUtils";
import { useSyncedDocument } from "../../../firebase/firestore.utils";

const MaintenanceDetailsContent = ({
  closeModalTwo,
  customer,
  equipmentIndex,
  openDeleteMaintenance,
  selectedMaintenance,
  unit,
}) => {
  const { dispatch } = useContext(ToastContext);

  //passing the array here is unstable, so we have to get the array from the source.
  const currentMaintenanceDocument = useSyncedDocument(
    "maintenance",
    selectedMaintenance.id
  );

  //State
  const [completedDate, setCompletedDate] = useState(
    unit.completedDate === null ? null : unit.completedDate.toDate()
  );
  // const [mNumber, setMNumber] = useState(
  //   selectedMaintenance.mNumber ? selectedMaintenance.mNumber : ""
  // );
  // const [numberOfVisits, setNumberOfVisits] = useState(
  //   selectedMaintenance.numberOfVisits ? selectedMaintenance.numberOfVisits : 1
  // );
  // const [numberOfYears, setNumberOfYears] = useState(
  //   selectedMaintenance.numberOfYears ? selectedMaintenance.numberOfYears : 1
  // );
  // const [saleDate, setSaleDate] = useState(
  //   selectedMaintenance.saleDate
  //     ? selectedMaintenance.saleDate.toDate()
  //     : new Date()
  // );
  // const [salePrice, setSalePrice] = useState(
  //   selectedMaintenance.salePrice ? selectedMaintenance.salePrice : ""
  // );

  const onUpdateMaintenance = (e) => {
    e.preventDefault();

    //get field the updates
    const newMaintenanceValues = {
      completedDate,
      // mNumber,
      // numberOfVisits,
      // numberOfYears,
      // saleDate,
      // salePrice,
    };

    updateMaintenance(
      activateFailureNotification, //1
      activateSuccessNotification, //2
      closeModalTwo, //3
      selectedMaintenance.id, //4
      unit, //5
      newMaintenanceValues, //6
      currentMaintenanceDocument //7
    );
  };

  const activateSuccessNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Update Maintenance",
        message: "Maintenance updated in the cloud",
      },
    });
  };

  const activateFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Update Mainteance",
        message: "There was an error updating",
      },
    });
  };

  return (
    <form onSubmit={onUpdateMaintenance} autoComplete="new password">
      {/*
      <Typography sx={{ margin: "8px" }}>
        <strong>Maintenance Contract Details</strong>
      </Typography>
      <div className="row">
        <div className="tripleRowInput">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Sale Date"
              fullWidth
              value={saleDate}
              onChange={(newValue) => {
                setSaleDate(newValue);
              }}
              color="primary"
              renderInput={(params) => (
                <TextField {...params} sx={{ width: "100%" }} />
              )}
              required
            />
          </LocalizationProvider>
        </div>
        <div className="tripleRowInput">
          <TextField
            label="Contract Number"
            variant="outlined"
            value={mNumber}
            fullWidth
            sx={{ input: { color: "primary" } }}
            onChange={(event) => setMNumber(event.target.value)}
            required
          />
        </div>
        <div className="tripleRowInput">
          <TextField
            label="Sale Price"
            variant="outlined"
            value={salePrice}
            fullWidth
            sx={{ input: { color: "primary" } }}
            onChange={(event) => setSalePrice(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            required
          />
        </div>
      </div>
      <div className="row">
        <div className="doubleRowInput">
          <IncrementDigit
            value={numberOfYears}
            setValue={setNumberOfYears}
            label={"Years"}
          />
        </div>
        <div className="doubleRowInput">
          <IncrementDigit
            value={numberOfVisits}
            setValue={setNumberOfVisits}
            label={"Visits"}
          />
        </div>
      </div>
          */}
      <Typography sx={{ marginBottom: "8px" }}>
        <strong>{unit.equipmentName} Details</strong>
      </Typography>
      <div className="row">
        <div className="doubleRowInput">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date Maintenance Completed"
              fullWidth
              value={completedDate}
              onChange={(newValue) => {
                setCompletedDate(newValue);
              }}
              color="primary"
              renderInput={(params) => (
                <TextField {...params} sx={{ width: "100%" }} />
              )}
            />
          </LocalizationProvider>
        </div>
      </div>
      <div className="buttonBar">
        <button
          type="button"
          className="deleteButton"
          onClick={() => openDeleteMaintenance(selectedMaintenance, unit)}
        >
          <DeleteForever />
          <span className="iconSeperation">Delete</span>
        </button>
        <button type="submit" className="standardButton">
          <Update />
          <span className="iconSeperation">Update</span>
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
    </form>
  );
};

export default MaintenanceDetailsContent;
