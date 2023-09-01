import { useContext } from "react";
import { ToastContext } from "../../../../context/toastContext";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

import { doc } from "firebase/firestore";
import { db, deleteDocument } from "../../../../firebase/firestore.utils";

import { Close, DeleteForever } from "@mui/icons-material";
import "../../../../global_style/style.css";

const DeletePart = ({ partToDelete, closeModalOne, closeModalTwo }) => {
  const { dispatch } = useContext(ToastContext);

  const removePart = async () => {
    if (partToDelete.id) {
      deleteDocument(doc(db, "parts", partToDelete.id))
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Delete Part",
              message: `${partToDelete.partnumber} removed from the cloud`,
            },
          });
          closeModalTwo();
          closeModalOne();
        })
        .catch((error) => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "ERROR",
              title: "Delete Part",
              message: "There was an error deleting",
            },
          });
          console.log("Firebase error: ", error);
        });
    }
  };

  return (
    <div className="container">
      <div className="deleteWarningText">Unrecoverable Delete!</div>
      <ul>
        <li>
          This includes <strong>{partToDelete.partNumber}</strong>
        </li>
      </ul>
      <div className="buttonBar">
        <button
          type="button"
          className="deleteButton"
          onClick={() => removePart()}
        >
          <DeleteForever />
          <span className="iconSeperation">Confirm Delete</span>
        </button>
        <button
          type="button"
          className="standardButton"
          onClick={() => closeModalTwo()}
        >
          <Close />
          <span className="iconSeperation">Close</span>
        </button>
      </div>
    </div>
  );
};

export default DeletePart;
