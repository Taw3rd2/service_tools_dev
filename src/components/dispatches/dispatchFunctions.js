import { addHours, getUnixTime } from "date-fns";
import { collection, doc } from "firebase/firestore";
import { createNamedDocument, db } from "../../firebase/firestore.utils";
import { setDateToZeroHours } from "../../utilities/dateUtils";

export const submitDispatchToFirestore = (
  customer,
  dispatch,
  activateSuccessNotification,
  activateFailureNotification,
  closeModalOne
) => {
  console.log("customer: ", customer);
  const docForId = doc(collection(db, "events"));
  const techLeadGeneratedId = docForId.id;
  if (dispatch.techHelper === "NONE") {
    const newDispatch = {
      customerId: customer.id,
      dateCreated: new Date(),
      dateModified: new Date(),
      dateScheduled: dispatch.start,
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

    createNamedDocument(doc(db, "events", techLeadGeneratedId), newLeadDispatch)
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
};
