import { getUnixTime, addHours } from "date-fns";
import { setDateToZeroHours } from "./dateUtils";

const compareStrings = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  return a.localeCompare(b) === 0;
};

export const compareEvents = (originalEvent, changedEvent) => {
  const compareLeads = compareStrings(
    originalEvent.techLead,
    changedEvent.techLead
  );
  const compareHelpers = compareStrings(
    originalEvent.techHelper,
    changedEvent.techHelper
  );
  if (compareLeads === true) {
    if (compareHelpers === true) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const compareHelper = (originalEvent, changedEvent) => {
  if (originalEvent.techHelper === changedEvent.techHelper) {
    return false;
  } else {
    return true;
  }
};

export const compareLead = (originalEvent, changedEvent) => {
  if (originalEvent.techLead === changedEvent.techLead) {
    return false;
  } else {
    return true;
  }
};

export const finalUpdate = (eventToUpdate) => {
  const updatedDispatch = {
    customerId: eventToUpdate.customerId,
    dateCreated: eventToUpdate.dateCreated,
    dateModified: new Date(),
    dateScheduled: eventToUpdate.start,
    end: eventToUpdate.start
      ? addHours(setDateToZeroHours(eventToUpdate.start), 1)
      : null,
    firstname: eventToUpdate.firstname,
    id: eventToUpdate.id,
    issue: eventToUpdate.issue,
    jobNumber: eventToUpdate.jobNumber,
    lastname: eventToUpdate.lastname,
    leadSource: eventToUpdate.leadSource,
    notes: eventToUpdate.notes,
    payment: eventToUpdate.payment,
    scheduledDate: eventToUpdate.start
      ? getUnixTime(setDateToZeroHours(eventToUpdate.start))
      : null,
    shorthand: eventToUpdate.shorthand,
    start: eventToUpdate.start,
    status: eventToUpdate.status,
    takenBy: eventToUpdate.takenBy,
    techHelper: eventToUpdate.techHelper,
    techHelperId: eventToUpdate.techHelperId ? eventToUpdate.techHelperId : "",
    techLead: eventToUpdate.techLead,
    timeAlotted: eventToUpdate.timeAlotted,
    timeOfDay: eventToUpdate.timeOfDay,
    title: `${eventToUpdate.timeAlotted} /${eventToUpdate.lastname} /${eventToUpdate.shorthand} /${eventToUpdate.timeOfDay}`,

    //   street: eventToUpdate.street,
    //   city: eventToUpdate.city,
    //   phoneName: eventToUpdate.phoneName,
    //   altPhoneName: eventToUpdate.altPhoneName,
    //   phone: eventToUpdate.phone,
    //   altphone: eventToUpdate.altphone,
  };
  return updatedDispatch;
};
