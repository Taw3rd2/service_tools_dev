import { useContext } from "react";
import { ToastContext } from "../../../context/toastContext";
import { deleteCustomerNote } from "../customerNoteFunctions";
import { Close, DeleteForever } from "@mui/icons-material";
import { getFormattedDateAndTime } from "../../../utilities/dateUtils";

const DeleteCustomerNote = ({
  customer,
  selectedNote,
  closeDetails,
  closeDelete,
}) => {
  const { dispatch } = useContext(ToastContext);

  const activateSuccessNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Delete Customer Note",
        message: "Customer note was removed from the cloud",
      },
    });
  };

  const activateFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Delete Customer Note",
        message: "There was an error removing the note.",
      },
    });
  };
  return (
    <div className="container">
      <div className="deleteWarningText">Unrecoverable Delete!</div>
      <div className="buttonBar">
        {selectedNote !== undefined && (
          <button
            type="button"
            className="deleteButton"
            onClick={() =>
              deleteCustomerNote(
                customer,
                selectedNote,
                activateSuccessNotification,
                activateFailureNotification,
                closeDetails,
                closeDelete
              )
            }
          >
            <DeleteForever />
            <span className="iconSeperation">Confirm Unrecoverable Delete</span>
          </button>
        )}
        <button
          type="button"
          className="standardButton"
          onClick={() => closeDelete()}
        >
          <Close />
          <span className="iconSeperation">Close</span>
        </button>
      </div>
    </div>
  );
};

export default DeleteCustomerNote;
