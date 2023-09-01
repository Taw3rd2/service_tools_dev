import { collection, doc } from "firebase/firestore";
import {
  createUnNamedDocument,
  db,
  deleteDocument,
  updateDocument,
} from "../../firebase/firestore.utils";

export const submitNoteToFirestore = (
  customer,
  note,
  activateSuccessNotification,
  activateFailureNotification,
  closeCustomerNoteModal
) => {
  createUnNamedDocument(
    collection(db, "customers", customer.id, "Activity"),
    note
  )
    .then(() => {
      activateSuccessNotification();
      closeCustomerNoteModal();
    })
    .catch((error) => {
      activateFailureNotification();
      console.log("firebase error: ", error);
    });
};

export const updateNoteToFirestore = (
  customer,
  noteId,
  note,
  activateSuccessNotification,
  activateFailureNotification,
  closeCustomerNote
) => {
  updateDocument(doc(db, "customers", customer.id, "Activity", noteId), note)
    .then(() => {
      activateSuccessNotification();
      closeCustomerNote();
    })
    .catch((error) => {
      activateFailureNotification();
      console.log("firebase error", error);
    });
};

export const deleteCustomerNote = (
  customer,
  selectedNote,
  activateSuccessNotification,
  activateFailureNotification,
  closeDetails,
  closeDelete
) => {
  deleteDocument(doc(db, "customers", customer.id, "Activity", selectedNote.id))
    .then(() => {
      activateSuccessNotification();
      closeDetails();
      closeDelete();
    })
    .catch((error) => {
      activateFailureNotification();
      console.log("Firestore error: ", error);
    });
};
