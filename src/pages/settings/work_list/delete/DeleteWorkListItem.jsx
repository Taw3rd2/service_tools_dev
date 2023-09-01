import { useContext } from "react";
import { doc } from "firebase/firestore";
import { ToastContext } from "../../../../context/toastContext";
import { db, deleteDocument } from "../../../../firebase/firestore.utils";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

import { Close, DeleteForever } from "@mui/icons-material";
import "../../../../global_style/style.css";

const DeleteWorkListItem = ({ workListItem, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const removeWorkListItem = async () => {
    if (workListItem.id) {
      deleteDocument(doc(db, "workList", workListItem.id))
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Delete Work List Item",
              message: `${workListItem.item} removed from the cloud`,
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
              title: "Delete Work List Item",
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
          This includes <strong>{workListItem.item}</strong>
        </li>
      </ul>
      <div className="buttonBar">
        <button
          type="button"
          className="deleteButton"
          onClick={() => removeWorkListItem()}
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

export default DeleteWorkListItem;
