import { useContext, useState } from "react";

import { collection } from "firebase/firestore";
import {
  db,
  useSyncedCollection,
  useSyncedDocument,
} from "../../../firebase/firestore.utils";
import { ToastContext } from "../../../context/toastContext";
import { setDateToZeroHours } from "../../../utilities/dateUtils";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  Autocomplete,
  BottomNavigation,
  BottomNavigationAction,
  TextField,
} from "@mui/material";
import "../../../global_style/style.css";
import {
  ArrowUpward,
  Close,
  DeleteForever,
  DoNotDisturb,
  Schedule,
  Update,
} from "@mui/icons-material";
import MainField from "../../customer_information/fields/MainField";
import ContactCard from "../../customer_information/fields/ContactCard";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { updateDispatch } from "../dispatchFunctions";

const DispatchDetails = ({
  closeModalOne,
  openCancelDispatch,
  openDeleteDispatch,
  openHolding,
  openJobCompleted,
  openSameTech,
  selectedDispatch,
}) => {
  const { dispatch } = useContext(ToastContext);

  const customer = useSyncedDocument(
    "customers",
    selectedDispatch.extendedProps.customerId
  );

  const dispatchers = useSyncedCollection(collection(db, "dispatchers"));
  const technicians = useSyncedCollection(collection(db, "technicians"));
  const workList = useSyncedCollection(collection(db, "workList"));
  const payments = useSyncedCollection(collection(db, "payments"));

  const [dispatchData, setDispatchData] = useState({
    firstname: selectedDispatch.extendedProps.firstname
      ? selectedDispatch.extendedProps.firstname
      : "",
    issue: selectedDispatch.extendedProps.issue
      ? selectedDispatch.extendedProps.issue
      : "",
    jobNumber: selectedDispatch.extendedProps.jobNumber
      ? selectedDispatch.extendedProps.jobNumber
      : "",
    lastname: selectedDispatch.extendedProps.lastname
      ? selectedDispatch.extendedProps.lastname
      : "",
    leadSource: selectedDispatch.extendedProps.leadSource
      ? selectedDispatch.extendedProps.leadSource
      : "PC",
    notes: selectedDispatch.extendedProps.notes
      ? selectedDispatch.extendedProps.notes
      : "",
    payment: selectedDispatch.extendedProps.payment
      ? selectedDispatch.extendedProps.payment
      : "C.O.D.",
    shorthand: selectedDispatch.extendedProps.shorthand
      ? selectedDispatch.extendedProps.shorthand
      : "",
    start: selectedDispatch.start
      ? selectedDispatch.start
      : setDateToZeroHours(new Date()),
    takenBy: selectedDispatch.extendedProps.takenBy
      ? selectedDispatch.extendedProps.takenBy
      : "",
    techHelper: selectedDispatch.extendedProps.techHelper
      ? selectedDispatch.extendedProps.techHelper
      : "NONE",
    techLead: selectedDispatch.extendedProps.techLead
      ? selectedDispatch.extendedProps.techLead
      : "",
    timeAlotted: selectedDispatch.extendedProps.timeAlotted
      ? selectedDispatch.extendedProps.timeAlotted
      : "1.5",
    timeOfDay: selectedDispatch.extendedProps.timeOfDay
      ? selectedDispatch.extendedProps.timeOfDay
      : "Anytime",
  });

  const techHelperList = [...technicians, { name: "NONE" }];

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

  const handleDispatchDataSelectChange = (prop, value) => {
    setDispatchData({ ...dispatchData, [prop]: value });
  };

  const handleDispatchDateChange = (prop) => (value) => {
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

  const submitUpdateDispatch = () => {
    updateDispatch(
      closeModalOne,
      dispatch,
      dispatchData,
      openJobCompleted,
      openSameTech,
      selectedDispatch
    );
  };

  return (
    <form onSubmit={submitUpdateDispatch} autoComplete="new-password">
      <Grid
        container
        spacing={1.5}
        sx={{
          margin: "2px",
          marginTop: "16px",
        }}
      >
        <Grid xs={12} sm={12} md={12} lg={4}>
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
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Lead Source"
            value={dispatchData.leadSource}
            fullWidth
            required
            onChange={handleDispatchDataChange("leadSource")}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          {dispatchers.length > 1 && (
            <Autocomplete
              disableClearable
              disablePortal
              fullWidth
              getOptionLabel={(option) => option}
              id="operator"
              isOptionEqualToValue={(option, value) => option === value}
              options={dispatchers
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
              options={workList
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
              options={technicians
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
              options={techHelperList
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
              id="payments"
              isOptionEqualToValue={(option, value) => option === value}
              options={payments
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
            id="time-of-day"
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
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Status"
            fullWidth
            required
            value={selectedDispatch.extendedProps.status}
          />
        </Grid>
      </Grid>
      <BottomNavigation showLabels>
        <BottomNavigationAction
          label="Delete"
          icon={<DeleteForever />}
          sx={{ color: "red" }}
          onClick={() => openDeleteDispatch(selectedDispatch)}
        />
        <BottomNavigationAction
          label={
            selectedDispatch.extendedProps.status === "canceled"
              ? "Reschedule"
              : "Cancel"
          }
          icon={
            selectedDispatch.extendedProps.status === "canceled" ? (
              <Update />
            ) : (
              <DoNotDisturb />
            )
          }
          sx={{
            color:
              selectedDispatch.extendedProps.status === "canceled"
                ? "green"
                : "orange",
          }}
          onClick={() => openCancelDispatch(selectedDispatch)}
        />
        <BottomNavigationAction
          label="Update"
          icon={<ArrowUpward />}
          sx={{
            color:
              selectedDispatch.extendedProps.status === "canceled"
                ? "grey"
                : "green",
          }}
          onClick={
            selectedDispatch.extendedProps.status === "canceled"
              ? () => console.log("No Update the dispatch when its canceled")
              : () => submitUpdateDispatch()
          }
        />
        <BottomNavigationAction
          label="Holding"
          icon={<Schedule />}
          onClick={() => openHolding(selectedDispatch)}
        />
        <BottomNavigationAction
          label="Close"
          icon={<Close />}
          onClick={() => closeModalOne()}
        />
      </BottomNavigation>
    </form>
  );
};

export default DispatchDetails;
