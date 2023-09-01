import { useContext } from "react";
import { doc } from "firebase/firestore";
import { db, deleteDocument } from "../../../../firebase/firestore.utils";
import { ToastContext } from "../../../../context/toastContext";

import { Close, DeleteForever } from "@mui/icons-material";
import "../../../../global_style/style.css";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

const DeleteLaborRate = ({ laborRate, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const removeLaborRate = async () => {
    if (laborRate.id) {
      deleteDocument(doc(db, "laborRate", laborRate.id))
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Delete Labor Rate",
              message: `${laborRate.rateDescription} removed from the cloud`,
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
              title: "Delete Labor Rate",
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
          This includes <strong>{laborRate.rateDescription}</strong>
        </li>
      </ul>
      <div className="buttonBar">
        <button
          type="button"
          className="deleteButton"
          onClick={() => removeLaborRate()}
        >
          <DeleteForever />
          <span className="iconSeperation">Confirm Delete</span>
        </button>
        <button
          type="button"
          className="standardButton"
          onClick={() => closeModalOne()}
        >
          <Close />
          <span className="iconSeperation">Close</span>
        </button>
      </div>
    </div>
  );
};

export default DeleteLaborRate;
