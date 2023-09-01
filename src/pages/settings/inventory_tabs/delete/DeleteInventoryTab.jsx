import { useContext } from "react";
import { doc } from "firebase/firestore";
import { db, deleteDocument } from "../../../../firebase/firestore.utils";
import { ToastContext } from "../../../../context/toastContext";

import { Close, DeleteForever } from "@mui/icons-material";
import "../../../../global_style/style.css";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

const DeleteInventoryTab = ({ inventoryTab, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const removeInventoryTab = async () => {
    if (inventoryTab.id) {
      deleteDocument(doc(db, "tabs", inventoryTab.id))
        .then(() => {
          dispatch({
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Delete Inventory Tab",
              message: `${inventoryTab.name} removed from the cloud`,
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
              title: "Delete Inventory Tab",
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
          This includes <strong>{inventoryTab.name}</strong>
        </li>
      </ul>
      <div className="buttonBar">
        <button
          type="button"
          className="deleteButton"
          onClick={() => removeInventoryTab()}
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

export default DeleteInventoryTab;
