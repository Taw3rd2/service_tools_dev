import React, { useContext, useState } from "react";
import { collection } from "firebase/firestore";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";
import { ToastContext } from "../../../context/toastContext";
import {
  setDateToZeroHours,
  getFormattedDateAndTime,
  getFormattedExactTime,
} from "../../../utilities/dateUtils";

import ContactCard from "../../customer_information/fields/ContactCard";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Autocomplete, Button, TextField, Typography } from "@mui/material";
import { ArrowUpward, Close } from "@mui/icons-material";
import { submitDispatchToFirestore } from "../dispatchFunctions";

import "../../../global_style/style.css";
import MainField from "../../customer_information/fields/MainField";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const CreateDispatch = ({ customer, date, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const dispatchers = useSyncedCollection(collection(db, "dispatchers"));
  const technicians = useSyncedCollection(collection(db, "technicians"));
  const workList = useSyncedCollection(collection(db, "workList"));
  const payments = useSyncedCollection(collection(db, "payments"));

  const [dispatchData, setDispatchData] = useState({
    issue: "",
    jobNumber: "",
    leadSource: "PC",
    notes: "",
    payment: "",
    shorthand: "",
    start: date ? date : null,
    takenBy: "",
    techHelper: "NONE",
    techLead: "",
    timeAlotted: "1.5",
    timeOfDay: "Anytime",
  });

  const loadedDispatcherList = [...dispatchers, { name: "" }];
  const loadedHelperTechnicians = [...technicians, { name: "NONE" }];
  const loadedTechnicians = [...technicians, { name: "" }];
  const loadedWorkList = [...workList, { item: "" }];
  const loadedPayments = [...payments, { item: "" }];
  const timeOfDayList = [
    { label: "AM", value: "AM" },
    { label: "Anytime", value: "Anytime" },
    { label: "First Call", value: "First Call" },
    { label: "Last Call", value: "Last Call" },
    { label: "Overtime", value: "overtime" },
    { label: "PM", value: "PM" },
  ];

  const handleDispatchDataChange = (prop) => (event) => {
    setDispatchData({ ...dispatchData, [prop]: event.target.value });
  };

  const handleDispatchDateChange = (prop) => (value) => {
    setDispatchData({ ...dispatchData, [prop]: setDateToZeroHours(value) });
  };

  const handleDispatchDataSelectChange = (prop, value) => {
    setDispatchData({ ...dispatchData, [prop]: value });
  };

  const handleIssueChange = (value) => {
    const option = workList.filter((i) => value === i.item);

    setDispatchData({
      ...dispatchData,
      issue: value,
      shorthand: option[0].shorthand,
    });
  };

  const submitDispatch = (event) => {
    event.preventDefault();

    if (dispatchData.techLead === dispatchData.techHelper) {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: getFormattedExactTime(new Date()),
          type: "INFO",
          title: "Create Dispatch",
          message: "Lead and Helper are the same",
        },
      });
      setInputError(true);
      return;
      // } else if (dispatchData.start === null) {
      //   dispatch({
      //     type: "ADD_NOTIFICATION",
      //     payload: {
      //       id: getFormattedExactTime(new Date()),
      //       type: "INFO",
      //       title: "Create Dispatch",
      //       message: "Select a service date.",
      //     },
      //   });
      //   setDateError(true);
      //   return;
    } else {
      setInputError(false);
      //setDateError(false);
      submitDispatchToFirestore(
        customer,
        dispatchData,
        activateSuccessNotification,
        activateFailureNotification,
        closeModalOne
      );
    }
  };

  const activateSuccessNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Create Dispatch",
        message: "Dispatch added in the cloud",
      },
    });
  };

  const activateFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Create Dispatch",
        message: "There was an error adding the dispatch.",
      },
    });
  };

  const [inputError, setInputError] = useState(false);
  //const [dateError, setDateError] = useState(false);

  //   const localInvoiceId = invoiceId !== undefined ? invoiceId : "";
  //   const [jobNumber, setJobNumber] = useState(
  //     invoiceData
  //       ? `${invoiceData.invoiceNumberPrefix}${invoiceData.userCreatedjobNumber}`
  //       : ""
  //   );

  return (
    <form
      onSubmit={submitDispatch}
      autoComplete="new-password"
      style={{
        maxHeight: "654px",
        overflow: "auto",
      }}
    >
      <Typography variant="caption4">
        * to start a dispatch in holding, leave the scheduled date empty!
      </Typography>
      <Grid container spacing={1.5} sx={{ margin: "2px", marginTop: "16px" }}>
        <Grid sm={12} md={12} lg={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Scheduled Date"
              fullWidth
              value={dispatchData.start}
              onChange={handleDispatchDateChange("start")}
              color="primary"
              renderInput={(params) => <TextField {...params} fullWidth />}
              required
            />
          </LocalizationProvider>
        </Grid>
        <Grid sm={12} md={12} lg={4}>
          <TextField
            label="Lead Source"
            value={dispatchData.leadSource}
            fullWidth
            required
            onChange={handleDispatchDataChange("leadSource")}
          />
        </Grid>
        <Grid sm={12} md={12} lg={4}>
          {dispatchers.length > 0 && (
            <Autocomplete
              disableClearable
              disablePortal
              fullWidth
              getOptionLabel={(option) => option}
              id="operator"
              isOptionEqualToValue={(option, value) => option === value}
              options={loadedDispatcherList
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((dispatcher, index) => dispatcher.name)}
              onChange={(option, value) =>
                handleDispatchDataSelectChange("takenBy", value)
              }
              renderInput={(params) => (
                <TextField {...params} label="Dispatcher" variant="outlined" />
              )}
              value={dispatchData.takenBy}
            />
          )}
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={6}>
          <MainField
            title={"Customer Information"}
            name={`${customer.firstname} ${customer.lastname}`}
            address={customer.street}
            address2={`${customer.city},${customer.state} ${customer.zip}`}
            business={false}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={6}>
          <div style={{ maxHeight: "110px", overflowY: "auto" }}>
            {customer.contacts && customer.contacts.length > 0
              ? customer.contacts.map((contact, i) => (
                  <ContactCard contact={contact} key={i} />
                ))
              : null}
          </div>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={6}>
          {workList.length > 0 && (
            <Autocomplete
              disableClearable
              disablePortal
              fullWidth
              getOptionLabel={(option) => option}
              id="work-ordered"
              isOptionEqualToValue={(option, value) => option === value}
              options={loadedWorkList
                .sort((a, b) => a.item.localeCompare(b.item))
                .map((issue, index) => issue.item)}
              onChange={(option, value) => handleIssueChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Work Ordered"
                  variant="outlined"
                />
              )}
              value={dispatchData.issue}
            />
          )}
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={6}>
          <TextField
            label="Slotted Time"
            fullWidth
            value={dispatchData.timeAlotted}
            onChange={handleDispatchDataChange("timeAlotted")}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          {technicians.length > 0 && (
            <Autocomplete
              disableClearable
              disablePortal
              fullWidth
              getOptionLabel={(option) => option}
              id="tech-lead"
              isOptionEqualToValue={(option, value) => option === value}
              options={loadedTechnicians
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((technician, index) => technician.name)}
              onChange={(option, value) =>
                handleDispatchDataSelectChange("techLead", value)
              }
              renderInput={(params) => (
                <TextField {...params} label="Tech Lead" variant="outlined" />
              )}
              value={dispatchData.techLead}
            />
          )}
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          {technicians.length > 0 && (
            <Autocomplete
              disableClearable
              disablePortal
              fullWidth
              getOptionLabel={(option) => option}
              id="tech-helper"
              isOptionEqualToValue={(option, value) => option === value}
              options={loadedHelperTechnicians
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((technician, index) => technician.name)}
              onChange={(option, value) =>
                handleDispatchDataSelectChange("techHelper", value)
              }
              renderInput={(params) => (
                <TextField {...params} label="Tech Helper" variant="outlined" />
              )}
              value={dispatchData.techHelper}
            />
          )}
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          {payments.length > 0 && (
            <Autocomplete
              disableClearable
              disablePortal
              fullWidth
              getOptionLabel={(option) => option}
              id="payment"
              isOptionEqualToValue={(option, value) => option === value}
              options={loadedPayments
                .sort((a, b) => a.item.localeCompare(b.item))
                .map((payment, index) => payment.item)}
              onChange={(option, value) =>
                handleDispatchDataSelectChange("payment", value)
              }
              renderInput={(params) => (
                <TextField {...params} label="Payment" variant="outlined" />
              )}
              value={dispatchData.payment}
            />
          )}
        </Grid>
        <Grid xs={12}>
          <TextField
            label="Notes"
            multiline
            fullWidth
            rows={3}
            variant="outlined"
            value={dispatchData.notes}
            onChange={handleDispatchDataChange("notes")}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <Autocomplete
            disableClearable
            disablePortal
            fullWidth
            getOptionLabel={(option) => option}
            id="time-of-day-select"
            isOptionEqualToValue={(option, value) => option === value}
            options={timeOfDayList
              .sort((a, b) => a.label.localeCompare(b.label))
              .map((item, index) => item.value)}
            onChange={(option, value) =>
              handleDispatchDataSelectChange("timeOfDay", value)
            }
            renderInput={(params) => (
              <TextField {...params} label="Time Of Day" variant="outlined" />
            )}
            value={dispatchData.timeOfDay}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Job Number"
            fullWidth
            required
            value={dispatchData.jobNumber}
            onChange={handleDispatchDataChange("jobNumber")}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}></Grid>
      </Grid>

      {inputError && (
        <Typography variant="h5" color="orange">
          Technician names can not be the same.
        </Typography>
      )}
      {/* {dateError && (
        <Typography variant="h5" color="orange">
          Please set a service date.
        </Typography>
      )} */}

      <Grid container spacing={1.5} sx={{ margin: "2px", marginTop: "16px" }}>
        <Grid xs={12} sm={12} md={12} lg={4}></Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <Button
            variant="contained"
            type="submit"
            startIcon={<ArrowUpward />}
            fullWidth
          >
            Add
          </Button>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <Button
            variant="contained"
            type="button"
            startIcon={<Close />}
            onClick={() => closeModalOne()}
            fullWidth
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateDispatch;
