import { addHours, getUnixTime } from "date-fns";
import { collection, doc } from "firebase/firestore";
import {
  createNamedDocument,
  db,
  deleteDocument,
  updateDocument,
} from "../../firebase/firestore.utils";
import {
  getFormattedExactTime,
  setDateToZeroHours,
} from "../../utilities/dateUtils";
import {
  compareEvents,
  compareHelper,
  compareLead,
  finalUpdate,
} from "../../utilities/scheduleUtils";

export const submitDispatchToFirestore = (
  customer,
  dispatch,
  activateSuccessNotification,
  activateFailureNotification,
  closeModalOne
) => {
  if (dispatch.start === null) {
    console.log("no start date chosen => start in holding");
    const docForId = doc(collection(db, "events"));
    const techLeadGeneratedId = docForId.id;
    if (dispatch.techHelper === "NONE") {
      const newDispatch = {
        customerId: customer.id,
        dateCreated: new Date(),
        dateModified: new Date(),
        dateScheduled: null,
        dispatchLog: dispatch.dispatchLog,
        end: null,
        firstname: customer.firstname,
        id: techLeadGeneratedId,
        invoiceId: "",
        issue: dispatch.issue,
        jobNumber: dispatch.jobNumber,
        lastname: customer.lastname,
        leadSource: dispatch.leadSource,
        notes: dispatch.notes,
        payment: dispatch.payment,
        scheduledDate: null,
        shorthand: dispatch.shorthand,
        start: null,
        status: "holding",
        takenBy: dispatch.takenBy,
        techHelper: dispatch.techHelper,
        techHelperId: "",
        techLead: dispatch.techLead,
        timeAlotted: dispatch.timeAlotted,
        timeOfDay: dispatch.timeOfDay,
        title: `${dispatch.timeAlotted} /${customer.lastname} /${dispatch.shorthand} /${dispatch.timeOfDay}`,
      };
      createNamedDocument(doc(db, "events", techLeadGeneratedId), newDispatch)
        .then(() => {
          activateSuccessNotification();
          closeModalOne();
        })
        .catch((error) => {
          activateFailureNotification();
          console.log("error: ", error);
        });
    } else {
      const docForhelperId = doc(collection(db, "events"));
      const techHelperGeneratedId = docForhelperId.id;

      const newLeadDispatch = {
        customerId: customer.id,
        dateCreated: new Date(),
        dateModified: new Date(),
        dateScheduled: null,
        dispatchLog: dispatch.dispatchLog,
        end: null,
        firstname: customer.firstname,
        id: techLeadGeneratedId,
        invoiceId: "",
        issue: dispatch.issue,
        jobNumber: dispatch.jobNumber,
        lastname: customer.lastname,
        leadSource: dispatch.leadSource,
        notes: dispatch.notes,
        payment: dispatch.payment,
        scheduledDate: null,
        shorthand: dispatch.shorthand,
        start: null,
        status: "holding",
        takenBy: dispatch.takenBy,
        techHelper: dispatch.techHelper,
        techHelperId: techHelperGeneratedId,
        techLead: dispatch.techLead,
        timeAlotted: dispatch.timeAlotted,
        timeOfDay: dispatch.timeOfDay,
        title: `${dispatch.timeAlotted} /${customer.lastname} /${dispatch.shorthand} /${dispatch.timeOfDay}`,
      };
      const newHelperDispatch = {
        customerId: customer.id,
        dateCreated: new Date(),
        dateModified: new Date(),
        dateScheduled: null,
        dispatchLog: dispatch.dispatchLog,
        end: null,
        firstname: customer.firstname,
        id: techHelperGeneratedId,
        invoiceId: "",
        issue: dispatch.issue,
        jobNumber: dispatch.jobNumber,
        lastname: customer.lastname,
        leadSource: dispatch.leadSource,
        notes: dispatch.notes,
        payment: dispatch.payment,
        scheduledDate: null,
        shorthand: dispatch.shorthand,
        start: null,
        status: "holding",
        takenBy: dispatch.takenBy,
        techHelper: dispatch.techLead,
        techHelperId: techLeadGeneratedId,
        techLead: dispatch.techHelper,
        timeAlotted: dispatch.timeAlotted,
        timeOfDay: dispatch.timeOfDay,
        title: `${dispatch.timeAlotted} /${customer.lastname} /${dispatch.shorthand} /${dispatch.timeOfDay}`,
      };

      createNamedDocument(
        doc(db, "events", techLeadGeneratedId),
        newLeadDispatch
      )
        .then(() =>
          createNamedDocument(
            doc(db, "events", techHelperGeneratedId),
            newHelperDispatch
          )
        )
        .then(() => {
          activateSuccessNotification();
          closeModalOne();
        })
        .catch((error) => {
          activateFailureNotification();
          console.log("error: ", error);
        });
    }
  } else {
    const docForId = doc(collection(db, "events"));
    const techLeadGeneratedId = docForId.id;
    if (dispatch.techHelper === "NONE") {
      const newDispatch = {
        customerId: customer.id,
        dateCreated: new Date(),
        dateModified: new Date(),
        dateScheduled: dispatch.start,
        dispatchLog: dispatch.dispatchLog,
        end: addHours(setDateToZeroHours(dispatch.start), 1),
        firstname: customer.firstname,
        id: techLeadGeneratedId,
        invoiceId: "",
        issue: dispatch.issue,
        jobNumber: dispatch.jobNumber,
        lastname: customer.lastname,
        leadSource: dispatch.leadSource,
        notes: dispatch.notes,
        payment: dispatch.payment,
        scheduledDate: getUnixTime(setDateToZeroHours(dispatch.start)),
        shorthand: dispatch.shorthand,
        start: dispatch.start,
        status: "scheduled",
        takenBy: dispatch.takenBy,
        techHelper: dispatch.techHelper,
        techHelperId: "",
        techLead: dispatch.techLead,
        timeAlotted: dispatch.timeAlotted,
        timeOfDay: dispatch.timeOfDay,
        title: `${dispatch.timeAlotted} /${customer.lastname} /${dispatch.shorthand} /${dispatch.timeOfDay}`,
      };
      createNamedDocument(doc(db, "events", techLeadGeneratedId), newDispatch)
        .then(() => {
          activateSuccessNotification();
          closeModalOne();
        })
        .catch((error) => {
          activateFailureNotification();
          console.log("error: ", error);
        });
    } else {
      const docForhelperId = doc(collection(db, "events"));
      const techHelperGeneratedId = docForhelperId.id;

      const newLeadDispatch = {
        customerId: customer.id,
        dateCreated: new Date(),
        dateModified: new Date(),
        dateScheduled: dispatch.start,
        dispatchLog: dispatch.dispatchLog,
        end: addHours(setDateToZeroHours(dispatch.start), 1),
        firstname: customer.firstname,
        id: techLeadGeneratedId,
        invoiceId: "",
        issue: dispatch.issue,
        jobNumber: dispatch.jobNumber,
        lastname: customer.lastname,
        leadSource: dispatch.leadSource,
        notes: dispatch.notes,
        payment: dispatch.payment,
        scheduledDate: getUnixTime(setDateToZeroHours(dispatch.start)),
        shorthand: dispatch.shorthand,
        start: dispatch.start,
        status: "scheduled",
        takenBy: dispatch.takenBy,
        techHelper: dispatch.techHelper,
        techHelperId: techHelperGeneratedId,
        techLead: dispatch.techLead,
        timeAlotted: dispatch.timeAlotted,
        timeOfDay: dispatch.timeOfDay,
        title: `${dispatch.timeAlotted} /${customer.lastname} /${dispatch.shorthand} /${dispatch.timeOfDay}`,
      };
      const newhelperDispatch = {
        customerId: customer.id,
        dateCreated: new Date(),
        dateModified: new Date(),
        dateScheduled: dispatch.start,
        dispatchLog: dispatch.dispatchLog,
        end: addHours(setDateToZeroHours(dispatch.start), 1),
        firstname: customer.firstname,
        id: techHelperGeneratedId,
        invoiceId: "",
        issue: dispatch.issue,
        jobNumber: dispatch.jobNumber,
        lastname: customer.lastname,
        leadSource: dispatch.leadSource,
        notes: dispatch.notes,
        payment: dispatch.payment,
        scheduledDate: getUnixTime(setDateToZeroHours(dispatch.start)),
        shorthand: dispatch.shorthand,
        start: dispatch.start,
        status: "scheduled",
        takenBy: dispatch.takenBy,
        techHelper: dispatch.techLead,
        techHelperId: techLeadGeneratedId,
        techLead: dispatch.techHelper,
        timeAlotted: dispatch.timeAlotted,
        timeOfDay: dispatch.timeOfDay,
        title: `${dispatch.timeAlotted} /${customer.lastname} /${dispatch.shorthand} /${dispatch.timeOfDay}`,
      };

      createNamedDocument(
        doc(db, "events", techLeadGeneratedId),
        newLeadDispatch
      )
        .then(() =>
          createNamedDocument(
            doc(db, "events", techHelperGeneratedId),
            newhelperDispatch
          )
        )
        .then(() => {
          activateSuccessNotification();
          closeModalOne();
        })
        .catch((error) => {
          activateFailureNotification();
          console.log("error: ", error);
        });
    }
  }
};

export const updateDispatch = (
  closeModalOne,
  dispatch,
  dispatchData,
  openJobCompleted,
  openSameTech,
  selectedDispatch
) => {
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
        console.log("updatedDispatch: ", updatedDispatch);
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
          console.log("selectedDispatch.extendedProps.techHelperId was empty");
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
