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
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { ArrowUpward, Close } from "@mui/icons-material";
import { submitDispatchToFirestore } from "../dispatchFunctions";

import "../../../global_style/style.css";
import MainField from "../../customer_information/fields/MainField";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const CreateDispatch = ({ customer, date, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);
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

  const handleDispatchDataChange = (prop) => (event) => {
    setDispatchData({ ...dispatchData, [prop]: event.target.value });
  };

  const handleDispatchDateChange = (prop) => (value) => {
    setDispatchData({ ...dispatchData, [prop]: setDateToZeroHours(value) });
  };

  const handleIssueChange = (event) => {
    const option = workList.filter((i) => event.target.value === i.item);

    setDispatchData({
      ...dispatchData,
      issue: event.target.value,
      shorthand: option[0].shorthand,
    });
  };

  const dispatchers = useSyncedCollection(collection(db, "dispatchers"));
  const technicians = useSyncedCollection(collection(db, "technicians"));
  const workList = useSyncedCollection(collection(db, "workList"));
  const payments = useSyncedCollection(collection(db, "payments"));

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
    } else if (dispatchData.start === null) {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: getFormattedExactTime(new Date()),
          type: "INFO",
          title: "Create Dispatch",
          message: "Select a service date.",
        },
      });
      setDateError(true);
      return;
    } else {
      setInputError(false);
      setDateError(false);
      submitDispatchToFirestore(
        customer,
        dispatchData,
        activateSuccessNotification,
        activateFailureNotification,
        closeModalOne
      );
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: getFormattedDateAndTime(dispatchData.start),
          type: "INFO",
          title: "Submitted",
          message: "Requested a cloud update",
        },
      });
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
  const [dateError, setDateError] = useState(false);

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
      <Grid container spacing={1.5} sx={{ margin: "2px", marginTop: "16px" }}>
        <Grid sm={12} md={12} lg={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Scheduled Date"
              fullWidth
              value={dispatchData.start}
              onChange={handleDispatchDateChange("start")}
              color="primary"
              inputProps={{ tabIndex: "1" }}
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
            inputProps={{ tabIndex: "2" }}
          />
        </Grid>
        <Grid sm={12} md={12} lg={4}>
          {dispatchers.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="select-operator">Dispatcher</InputLabel>
              <Select
                labelId="select-operator"
                id="operator"
                value={dispatchData.takenBy}
                label="Dispatcher"
                onChange={handleDispatchDataChange("takenBy")}
                inputProps={{ tabIndex: "3" }}
                required
              >
                {dispatchers
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((dispatcher, index) => (
                    <MenuItem key={index} value={dispatcher.name}>
                      {dispatcher.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
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
            <FormControl fullWidth>
              <InputLabel id="select-work-ordered">Work Ordered</InputLabel>
              <Select
                labelId="select-work-ordered"
                id="work-ordered"
                value={dispatchData.issue}
                label="Work ordered"
                onChange={handleIssueChange}
                inputProps={{ tabIndex: "12" }}
                required
              >
                {workList
                  .sort((a, b) => a.item.localeCompare(b.item))
                  .map((issue) => (
                    <MenuItem key={issue.id} value={issue.item}>
                      {issue.item}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={6}>
          <TextField
            label="Slotted Time"
            fullWidth
            value={dispatchData.timeAlotted}
            onChange={handleDispatchDataChange("timeAlotted")}
            inputProps={{ tabIndex: "13" }}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          {technicians.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="select-tech-lead">Tech Lead</InputLabel>
              <Select
                labelId="select-tech-lead"
                id="tech-lead"
                value={dispatchData.techLead}
                label="Tech Lead"
                onChange={handleDispatchDataChange("techLead")}
                inputProps={{ tabIndex: "14" }}
                required
              >
                {technicians
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((technician) => (
                    <MenuItem key={technician.id} value={technician.name}>
                      {technician.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          {technicians.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="select-tech-helper">Tech Helper</InputLabel>
              <Select
                labelId="select-tech-helper"
                id="tech-helper"
                value={dispatchData.techHelper}
                label="Tech helper"
                onChange={handleDispatchDataChange("techHelper")}
                inputProps={{ tabIndex: "15" }}
              >
                <MenuItem value={"NONE"}>None</MenuItem>
                {technicians
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((technician) => (
                    <MenuItem key={technician.id} value={technician.name}>
                      {technician.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          {payments.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="select-payment">Payment</InputLabel>
              <Select
                labelId="select-payment"
                id="payment"
                value={dispatchData.payment}
                label="Payment"
                onChange={handleDispatchDataChange("payment")}
                inputProps={{ tabIndex: "16" }}
                required
              >
                {payments
                  .sort((a, b) => a.item.localeCompare(b.item))
                  .map((payment) => (
                    <MenuItem key={payment.id} value={payment.item}>
                      {payment.item}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
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
            inputProps={{ tabIndex: "17" }}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <FormControl fullWidth>
            <InputLabel id="time-of-day-select">Time Of Day</InputLabel>
            <Select
              labelId="time-of-day-select"
              id="time-of-day"
              value={dispatchData.timeOfDay}
              label="Time Of Day"
              onChange={handleDispatchDataChange("timeOfDay")}
              inputProps={{ tabIndex: "18" }}
            >
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="Anytime">Anytime</MenuItem>
              <MenuItem value="First Call">First Call</MenuItem>
              <MenuItem value="Last Call">Last Call</MenuItem>
              <MenuItem value="overtime">Overtime</MenuItem>
              <MenuItem value="PM">PM</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Job Number"
            fullWidth
            required
            value={dispatchData.jobNumber}
            onChange={handleDispatchDataChange("jobNumber")}
            inputProps={{ tabIndex: "19" }}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}></Grid>
      </Grid>

      {inputError && (
        <p className="deleteWarningText">
          Technician names can not be the same.
        </p>
      )}
      {dateError && (
        <p className="deleteWarningText">Please set a service date.</p>
      )}

      <Grid container spacing={1.5} sx={{ margin: "2px", marginTop: "16px" }}>
        <Grid xs={12} sm={12} md={12} lg={4}></Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <Button
            variant="outlined"
            size="large"
            type="submit"
            startIcon={<ArrowUpward />}
            tabIndex={20}
            fullWidth
          >
            Add
          </Button>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <Button
            variant="outlined"
            size="large"
            type="button"
            startIcon={<Close />}
            tabIndex={21}
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
