import { useContext } from "react";
import { ToastContext } from "../../../context/toastContext";

import { Close, DeleteForever } from "@mui/icons-material";

import { deleteWarranty } from "../warrantyFunctions";
import { getFormattedDateAndTime } from "../../../utilities/dateUtils";

import "../../../global_style/style.css";

const DeleteWarrantyContent = ({
  customer,
  selectedWarranty,
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
        title: "Delete Warranty",
        message: "Removed warranty from the cloud",
      },
    });
  };

  const activateFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Delete Warranty",
        message: "There was an error removing",
      },
    });
  };
  return (
    <div className="container">
      <div className="deleteWarningText">UnrecoverableDelete</div>
      <ul>
        <li>All Warranty information for this unit</li>
      </ul>
      <div className="buttonBar">
        <button
          type="button"
          className="deleteButton"
          onClick={() =>
            deleteWarranty(
              customer,
              selectedWarranty,
              activateSuccessNotification,
              activateFailureNotification,
              closeDetails,
              closeDelete
            )
          }
        >
          <DeleteForever />
          <span className="iconSeperation">Confirm Delete</span>
        </button>
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

export default DeleteWarrantyContent;
