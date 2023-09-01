import { useContext } from "react";
import { doc } from "firebase/firestore";
import { db, deleteDocument } from "../../../../firebase/firestore.utils";

import { ToastContext } from "../../../../context/toastContext";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

import { Close, DeleteForever } from "@mui/icons-material";
import "../../../../global_style/style.css";

const DeleteService = ({ serviceToDelete, closeModalOne, closeModalTwo }) => {
  const { dispatch } = useContext(ToastContext);

  const removeService = async () => {
    if (serviceToDelete.id) {
      deleteDocument(doc(db, "services", serviceToDelete.id))
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Delete Service",
              message: `${serviceToDelete.partnumber} removed from the cloud`,
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
              title: "Delete Service",
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
          This includes <strong>{serviceToDelete.partNumber}</strong>
        </li>
      </ul>
      <div className="buttonBar">
        <button
          type="button"
          className="deleteButton"
          onClick={() => removeService()}
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

export default DeleteService;
