import { Close, DeleteForever } from "@mui/icons-material";
import { doc } from "firebase/firestore";
import { useContext } from "react";
import { ToastContext } from "../../../../context/toastContext";
import { db, deleteDocument } from "../../../../firebase/firestore.utils";
import "../../../../global_style/style.css";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

const DeletePayment = ({ payment, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const removePayment = async () => {
    if (payment.id) {
      deleteDocument(doc(db, "payments", payment.id))
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Delete Payment",
              message: `${payment.item} removed from the cloud`,
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
              title: "Delete Payment",
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
          This includes <strong>{payment.item}</strong>
        </li>
      </ul>
      <div className="buttonBar">
        <button
          type="button"
          className="deleteButton"
          onClick={() => removePayment()}
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

export default DeletePayment;
