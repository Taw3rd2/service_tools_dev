import { useContext, useState } from "react";

import { collection, doc } from "firebase/firestore";
import {
  createNamedDocument,
  db,
  deleteDocument,
  updateDocument,
  useSyncedCollection,
  useSyncedDocument,
} from "../../../firebase/firestore.utils";
import { ToastContext } from "../../../context/toastContext";
import {
  getFormattedExactTime,
  setDateToZeroHours,
} from "../../../utilities/dateUtils";
import {
  compareEvents,
  compareHelper,
  compareLead,
  finalUpdate,
} from "../../../utilities/scheduleUtils";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Autocomplete, Button, TextField } from "@mui/material";
import "../../../global_style/style.css";
import {
  ArrowUpward,
  Close,
  DeleteForever,
  DoNotDisturb,
} from "@mui/icons-material";
import MainField from "../../customer_information/fields/MainField";
import ContactCard from "../../customer_information/fields/ContactCard";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const DispatchDetails = ({
  closeModalOne,
  openCancelDispatch,
  openDeleteDispatch,
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

  const updateDispatch = (event) => {
    event.preventDefault();

    //If the dispatches are canceled, and rescheduled, there is no 2nd dispatch id to build on.
    //This variable is the techHelper dispatch Id generated if there is no techHelper, and one is generated.
    let generatedTechHelperId = "";

    //validation
    //The office should not be able to update a dispatch that is done, canceled, or needs parts.
    if (
      selectedDispatch.extendedProps.status === "done" ||
      selectedDispatch.extendedProps.status === "parts"
    ) {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: getFormattedExactTime(new Date()),
          type: "INFO",
          title: "Update Dispatch",
          message: "The job was already done...",
        },
      });
      openJobCompleted();
      return;
      //The office should not be able to select the same tech for lead and helper
    } else if (dispatchData.techLead === dispatchData.techHelper) {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: getFormattedExactTime(new Date()),
          type: "INFO",
          title: "Update Dispatch",
          message: "Lead, and Helper are the same...",
        },
      });
      openSameTech();
      return;
    } else {
      const updatedDispatch = {
        ...dispatchData,
        customerId: selectedDispatch.extendedProps.customerId,
        dateCreated: selectedDispatch.extendedProps.dateCreated,
        dateModified: new Date(),
        dateScheduled: dispatchData.start,
        end: selectedDispatch.end,
        id: selectedDispatch.id,
        scheduledDate: selectedDispatch.extendedProps.scheduledDate, //nope
        status: selectedDispatch.extendedProps.status,
        techHelperId: selectedDispatch.extendedProps.techHelperId,
        title: selectedDispatch.title,
      };
      //compare old dispatch with changes to see if techs changed
      const noTechChange = compareEvents(
        selectedDispatch.extendedProps,
        updatedDispatch
      );
      if (noTechChange === true) {
        console.log("no tech change");
        if (
          selectedDispatch.extendedProps.techHelperId === "" ||
          selectedDispatch.extendedProps.techHelperId === undefined
        ) {
          console.log("there is no extra dispatch to change");
          // update the original dispatch only
          const eventToUpdate = finalUpdate(updatedDispatch);
          updateDocument(doc(db, "events", eventToUpdate.id), eventToUpdate)
            .then(() => {
              dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                  id: getFormattedExactTime(new Date()),
                  type: "SUCCESS",
                  title: "Update Dispatch",
                  message: "Updated the dispatch in the cloud",
                },
              });
              closeModalOne();
            })
            .catch((error) => {
              dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                  id: getFormattedExactTime(new Date()),
                  type: "ERROR",
                  title: "Update Dispatch",
                  message: "There was an error updating",
                },
              });
              console.log("Firebase error: ", error);
            });
        } else {
          console.log("there is a extra dispatch to update");
          //update the first dispatch
          const firstEventToUpdate = finalUpdate(updatedDispatch);
          updateDocument(
            doc(db, "events", firstEventToUpdate.id),
            firstEventToUpdate
          ).then(() => console.log("first event updated"));
          //update the second dispatch
          let newEvent = { ...updatedDispatch };
          newEvent.id = updatedDispatch.techHelperId;
          newEvent.techLead = updatedDispatch.techHelper;
          newEvent.techHelper = updatedDispatch.techLead;
          newEvent.techHelperId = updatedDispatch.id;
          const secondEventToUpdate = finalUpdate(newEvent);
          updateDocument(
            doc(db, "events", secondEventToUpdate.id),
            secondEventToUpdate
          )
            .then(() => {
              dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                  id: getFormattedExactTime(new Date()),
                  type: "SUCCESS",
                  title: "Update Dispatch",
                  message: "Updated the dispatch in the cloud",
                },
              });
              closeModalOne();
            })
            .catch((error) => {
              dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                  id: getFormattedExactTime(new Date()),
                  type: "ERROR",
                  title: "Update Dispatch",
                  message: "There was an error updating",
                },
              });
              console.log("Firebase error: ", error);
            });
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Update Dispatch",
              message: "Updated the dispatch in the cloud",
            },
          });
          closeModalOne();
        }
      } else {
        console.log("techs have changed");
        //decide if techLead or techHelper has changed (boolean)
        const helperHasChanged = compareHelper(
          selectedDispatch.extendedProps,
          updatedDispatch
        );
        const leadHasChanged = compareLead(
          selectedDispatch.extendedProps,
          updatedDispatch
        );

        if (helperHasChanged === false) {
          console.log("helper has not changed");
        } else {
          console.log("helper has changed");
          //what has the techHelper changed to?
          if (updatedDispatch.techHelper === "NONE") {
            console.log("techHelper === NONE");
            if (
              selectedDispatch.extendedProps.techHelperId === "" ||
              selectedDispatch.extendedProps.techHelperId === undefined
            ) {
              //TODO: is the original dispatch getting updated here? or maybe its not possible to have this situation?
              console.log(
                "techHelper changed to NONE but there is no second dispatch to delete"
              );
            } else {
              console.log(
                "techHelper changed to NONE and there is a second dispatch to delete"
              );
              const eventToDelete = {
                id: selectedDispatch.extendedProps.techHelperId,
              };
              deleteDocument(doc(db, "events", eventToDelete.id)).then(() => {
                dispatch({
                  type: "ADD_NOTIFICATION",
                  payload: {
                    id: getFormattedExactTime(new Date()),
                    type: "INFO",
                    title: "Submitted",
                    message: "Deleted Tech Helper Dispatch",
                  },
                });
                console.log("event deleted");
              });
              const eventWithNoTechHelperId = { ...updatedDispatch };
              eventWithNoTechHelperId.techHelperId = "";
              const changedEvent = finalUpdate(eventWithNoTechHelperId);
              updateDocument(doc(db, "events", changedEvent.id), changedEvent)
                .then(() => {
                  dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                      id: getFormattedExactTime(new Date()),
                      type: "SUCCESS",
                      title: "Updated Dispatch",
                      message: "Dispatch updated in the cloud",
                    },
                  });
                  closeModalOne();
                })
                .catch((error) => {
                  dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                      id: getFormattedExactTime(new Date()),
                      type: "ERROR",
                      title: "Updated Dispatch",
                      message: "There was an error updating",
                    },
                  });
                  console.log("firebase error: ", error);
                });
            }
          } else {
            if (
              selectedDispatch.extendedProps.techHelperId === "" ||
              selectedDispatch.extendedProps.techHelperId === undefined
            ) {
              console.log(
                "techHelper changed to another tech but there is no second dispatch to change"
              );
              // create a new 2nd dispatch and assign the techHelperId
              let newEvent = { ...updatedDispatch };
              const docForId = doc(collection(db, "events"));
              const generatedId = docForId.id; //**********//
              generatedTechHelperId = docForId.id;
              newEvent.techHelper = updatedDispatch.techLead;
              newEvent.techLead = updatedDispatch.techHelper;
              newEvent.id = generatedId;
              newEvent.techHelperId = selectedDispatch.id;
              const eventToUpdate = finalUpdate(newEvent);

              //this should be named doc, and assigned the generated id
              createNamedDocument(doc(db, "events", newEvent.id), eventToUpdate)
                .then(() => {
                  dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                      id: getFormattedExactTime(new Date()),
                      type: "SUCCESS",
                      title: "Create Tech Helper Dispatch",
                      message: "Added second dispatch for helper",
                    },
                  });
                  console.log("added event");
                })
                .catch((error) => {
                  dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                      id: getFormattedExactTime(new Date()),
                      type: "ERROR",
                      title: "Create Tech Helper Dispatch",
                      message: "There was a error updating",
                    },
                  });
                  console.log("firebase error: ", error);
                });

              //update the techLead event with the newly generated techHelperId above
              //this dont seem to be working...
              const techLeadEvent = { ...updatedDispatch };
              techLeadEvent.techHelperId = generatedId;
              const originalEventToUpdate = finalUpdate(techLeadEvent);
              updateDocument(
                doc(db, "events", originalEventToUpdate.id),
                originalEventToUpdate
              )
                .then(() => {
                  console.log(
                    "original event to update: ",
                    originalEventToUpdate
                  );
                  dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                      id: getFormattedExactTime(new Date()),
                      type: "SUCCESS",
                      title: "Update Tech Lead Dispatch",
                      message: "Updated the dispatch in the cloud",
                    },
                  });
                  closeModalOne();
                })
                .catch((error) => {
                  dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                      id: getFormattedExactTime(new Date()),
                      type: "ERROR",
                      title: "Update Tech Lead Dispatch",
                      message: "There was a error updating",
                    },
                  });
                  console.log("Firestore error: ", error);
                });
            } else {
              console.log(
                "techHelper changed to another tech and there is a second dispatch",
                selectedDispatch.extendedProps.techHelperId
              );
              const firstEventToUpdate = finalUpdate(updatedDispatch);
              updateDocument(
                doc(db, "events", firstEventToUpdate.id),
                firstEventToUpdate
              )
                .then(() => {
                  dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                      id: getFormattedExactTime(new Date()),
                      type: "SUCCESS",
                      title: "Update Tech Helper Dispatch",
                      message: "Updated the dispatch in the cloud",
                    },
                  });
                  console.log("updated first event");
                })
                .catch((error) => {
                  dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                      id: getFormattedExactTime(new Date()),
                      type: "ERROR",
                      title: "Update Tech Helper Dispatch",
                      message: "There was a error updating",
                    },
                  });
                  console.log("Firebase error: ", error);
                });

              let newEvent = { ...updatedDispatch };
              console.log("newEvent: ", newEvent);
              newEvent.id = updatedDispatch.techHelperId;
              newEvent.techLead = updatedDispatch.techHelper;
              newEvent.techHelper = updatedDispatch.techLead;
              newEvent.techHelperId = updatedDispatch.id;
              const secondEventToUpdate = finalUpdate(newEvent);
              updateDocument(
                doc(db, "events", secondEventToUpdate.id),
                secondEventToUpdate
              )
                .then(() => {
                  dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                      id: getFormattedExactTime(new Date()),
                      type: "SUCCESS",
                      title: "Update Dispatch",
                      message: "Updated the dispatch in the cloud",
                    },
                  });
                  closeModalOne();
                })
                .catch((error) => {
                  dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                      id: getFormattedExactTime(new Date()),
                      type: "ERROR",
                      title: "Update Dispatch",
                      message: "There was a error updating",
                    },
                  });
                  console.log("Firebase error: ", error);
                });
            }
          }
        }

        if (leadHasChanged === false) {
          console.log("lead has not changed");
        } else {
          console.log("lead has changed");
          const eventToUpdate = finalUpdate(updatedDispatch);
          updateDocument(doc(db, "events", eventToUpdate.id), eventToUpdate)
            .then(() => {
              dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                  id: getFormattedExactTime(new Date()),
                  type: "SUCCESS",
                  title: "Update Dispatch",
                  message: "Updated the dispatch in the cloud",
                },
              });
              closeModalOne();
            })
            .catch((error) => {
              dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                  id: getFormattedExactTime(new Date()),
                  type: "ERROR",
                  title: "Update Dispatch",
                  message: "There was a error updating",
                },
              });
              console.log("Firebase error: ", error);
            });
          if (
            selectedDispatch.extendedProps.techHelperId === "" ||
            selectedDispatch.extendedProps.techHelperId === undefined
          ) {
            console.log(
              "selectedDispatch.extendedProps.techHelperId was empty"
            );
            if (generatedTechHelperId) {
              console.log("generatedTechHelperId was found");
              const updatedTechLeadEvent = { ...updatedDispatch };
              updatedTechLeadEvent.techHelperId = generatedTechHelperId;
              const eventToUpdate = finalUpdate(updatedTechLeadEvent);
              updateDocument(doc(db, "events", eventToUpdate.id), eventToUpdate)
                .then(() => {
                  console.log("updatedTechLeadEvent: ", updatedTechLeadEvent);
                  dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                      id: getFormattedExactTime(new Date()),
                      type: "SUCCESS",
                      title: "Update Tech Lead Dispatch",
                      message: "Updated the dispatch in the cloud",
                    },
                  });
                  closeModalOne();
                })
                .catch((error) => {
                  dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                      id: getFormattedExactTime(new Date()),
                      type: "ERROR",
                      title: "Update Tech Lead Dispatch",
                      message: "There was a error updating",
                    },
                  });
                  console.log("Firebase error: ", error);
                });
            } else {
              console.log("eneratedTechHelperId was not found");
              console.log(
                "techLead has changed but there is no techHelper event to update"
              );
            }
            //newEvent.id
            // if there is a techHelper here, get the ID and add it to newEvent
          } else {
            console.log(
              "techLead has changed and there is a techHelper event to change"
            );

            let newEvent = { ...updatedDispatch };
            newEvent.id = updatedDispatch.techHelperId;
            newEvent.techLead = updatedDispatch.techHelper;
            newEvent.techHelper = updatedDispatch.techLead;
            newEvent.techHelperId = updatedDispatch.id;
            const eventToUpdate = finalUpdate(newEvent);
            console.log("eventToUpdate: ", eventToUpdate);
            updateDocument(doc(db, "events", eventToUpdate.id), eventToUpdate)
              .then(() => {
                dispatch({
                  type: "ADD_NOTIFICATION",
                  payload: {
                    id: getFormattedExactTime(new Date()),
                    type: "SUCCESS",
                    title: "Update Dispatch",
                    message: "Updated the dispatch in the cloud",
                  },
                });
                closeModalOne();
              })
              .catch((error) => {
                dispatch({
                  type: "ADD_NOTIFICATION",
                  payload: {
                    id: getFormattedExactTime(new Date()),
                    type: "ERROR",
                    title: "Update Dispatch",
                    message: "There was a error updating",
                  },
                });
                console.log("Firebase error: ", error);
              });
          }
        }
      }
    }
  };

  return (
    <form onSubmit={updateDispatch} autoComplete="new-password">
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
      <Grid container spacing={1.5} sx={{ margin: "2px", marginTop: "16px" }}>
        <Grid xs={12} sm={12} md={12} lg={3}>
          <Button
            variant="contained"
            size="large"
            color="error"
            startIcon={<DeleteForever />}
            onClick={() => openDeleteDispatch(selectedDispatch)}
            fullWidth
          >
            Delete
          </Button>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={3}>
          <Button
            variant="contained"
            size="large"
            color="warning"
            startIcon={<DoNotDisturb />}
            onClick={() => openCancelDispatch(selectedDispatch)}
            fullWidth
          >
            {selectedDispatch.extendedProps.status === "canceled"
              ? "Schedule"
              : "Cancel"}
          </Button>
        </Grid>
        {selectedDispatch.extendedProps.status === "canceled" ? (
          <Grid xs={12} sm={12} md={12} lg={3}>
            <Button
              variant="contained"
              size="large"
              color="primary"
              type="submit"
              startIcon={<ArrowUpward />}
              fullWidth
              disabled
            >
              Update
            </Button>
          </Grid>
        ) : (
          <Grid xs={12} sm={12} md={12} lg={3}>
            <Button
              variant="contained"
              size="large"
              color="primary"
              type="submit"
              startIcon={<ArrowUpward />}
              fullWidth
            >
              Update
            </Button>
          </Grid>
        )}
        <Grid xs={12} sm={12} md={12} lg={3}>
          <Button
            variant="contained"
            size="large"
            color="primary"
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

export default DispatchDetails;
