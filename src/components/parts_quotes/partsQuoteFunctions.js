import { collection, doc } from "firebase/firestore";
import {
  createNamedDocument,
  db,
  deleteDocument,
  updateDocument,
} from "../../firebase/firestore.utils";

export const getTotalPartsCost = (partList) => {
  const tempArray = [];
  if (partList.length > 0) {
    for (const part of partList) {
      tempArray.push(parseFloat(part.partCost) * 100 * part.quantity);
    }
    return tempArray.map((item) => item).reduce((prev, next) => prev + next);
  } else {
    return 0;
  }
};

export const getPriceTier = (costOfParts) => {
  if (costOfParts <= 49999) {
    return { description: "Tier 1", markUp: 2.25 };
  } else if (costOfParts >= 50000 && costOfParts <= 99999) {
    return { description: "Tier 2", markUp: 1.75 };
  } else {
    return { description: "Tier 3", markUp: 1.5 };
  }
};

export const getTotalPartsRetail = (partsList) => {
  const totalCost = getTotalPartsCost(partsList);
  const priceTier = getPriceTier(totalCost);
  return totalCost * priceTier.markUp;
};

export const getTotalPartsTax = (partsList) => {
  const totalRetail = getTotalPartsRetail(partsList);
  return totalRetail * 0.06;
};

export const deletePartsQuote = (
  activateDeleteCompletionNotification,
  activateDeleteFailureNotification,
  closeDeleteModals,
  customer,
  partsQuote,
  routeToHomepage
) => {
  deleteDocument(
    doc(db, "customers", customer.id, "partsQuotes", partsQuote.id)
  )
    .then(() => {
      console.log("Quote Deleted");
      activateDeleteCompletionNotification();
      routeToHomepage();
      closeDeleteModals();
    })
    .catch((error) => {
      activateDeleteFailureNotification();
      console.log("firebase error: ", error);
    });
};

export const submitQuoteToFirestore = (
  customer,
  quote,
  activateSuccessNotification,
  activateFailureNotification
) => {
  //create quote id and save it as id here
  const docForId = doc(collection(db, "customers"));
  quote.id = docForId.id;
  createNamedDocument(
    doc(db, "customers", customer.id, "partsQuotes", docForId.id),
    quote
  )
    .then(() => {
      activateSuccessNotification();
    })
    .catch((error) => {
      activateFailureNotification();
      console.log("firebase error: ", error);
    });
};

export const updateQuoteInFirestore = (
  customer,
  quote,
  activateSuccessNotification,
  activateFailureNotification
) => {
  updateDocument(
    doc(db, "customers", customer.id, "partsQuotes", quote.id),
    quote
  )
    .then(() => {
      activateSuccessNotification();
    })
    .catch((error) => {
      activateFailureNotification();
      console.log("firebase error: ", error);
    });
};
