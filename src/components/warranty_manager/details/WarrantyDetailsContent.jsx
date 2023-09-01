import { useContext, useState } from "react";
import { ToastContext } from "../../../context/toastContext";

import { updateWarranty } from "../warrantyFunctions";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { TextField } from "@mui/material";
import { Close, DeleteForever, Update } from "@mui/icons-material";
import {
  getFormattedDate,
  getFormattedDateAndTime,
} from "../../../utilities/dateUtils";

const WarrantyDetailsContent = ({
  customer,
  selectedWarranty,
  openDeleteWarranty,
  closeModalTwo,
}) => {
  const { dispatch } = useContext(ToastContext);
  const [jobNumber, setJobNumber] = useState(
    selectedWarranty ? selectedWarranty.jobNumber : ""
  );
  const [laborExpirationDate, setLaborExpirationDate] = useState(
    selectedWarranty.laborExpirationDate === null
      ? null
      : selectedWarranty.laborExpirationDate.toDate()
  );
  const [partsExpirationDate, setPartsExpirationDate] = useState(
    selectedWarranty
      ? selectedWarranty.partsExpirationDate.toDate()
      : new Date()
  );
  const [startDate, setStartDate] = useState(
    selectedWarranty ? selectedWarranty.startDate.toDate() : new Date()
  );

  const onWarrantyUpdate = (e) => {
    e.preventDefault();

    const warrantyValues = {
      key: selectedWarranty.equipmentName,
      equipmentWarranty: getFormattedDate(partsExpirationDate),
      laborWarranty: getFormattedDate(laborExpirationDate),
      warranty: {
        key: selectedWarranty.equipmentName,
        jobNumber,
        startDate,
        partsExpirationDate,
        laborExpirationDate,
        equipment: selectedWarranty.equipmentName,
        equipmentName: selectedWarranty.equipmentName,
        equipmentBrand: selectedWarranty.equipmentBrand,
        equipmentModel: selectedWarranty.equipmentModel,
        equipmentSerial: selectedWarranty.equipmentSerial,
      },
    };

    updateWarranty(
      customer,
      warrantyValues,
      activateSuccessNotification,
      activateFailureNotification,
      closeModalTwo
    );
  };

  const activateSuccessNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Warranty Update",
        message: "Warranty updated in the cloud",
      },
    });
  };

  const activateFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Warranty Update",
        message: "There was an error updating",
      },
    });
  };

  return (
    <form onSubmit={onWarrantyUpdate} autoComplete="new password">
      <div className="row" style={{ marginTop: "16px" }}>
        <div className="doubleRowInput">
          <TextField
            label="Job Number"
            variant="outlined"
            value={jobNumber}
            fullWidth
            sx={{ input: { color: "primary" } }}
            onChange={(event) => setJobNumber(event.target.value)}
          />
        </div>
        <div className="doubleRowInput">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Warranty Start Date"
              fullWidth
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
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
              value={partsExpirationDate}
              onChange={(newValue) => {
                setPartsExpirationDate(newValue);
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
              value={laborExpirationDate}
              onChange={(newValue) => {
                setLaborExpirationDate(newValue);
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
          onClick={() => openDeleteWarranty(selectedWarranty)}
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

export default WarrantyDetailsContent;
