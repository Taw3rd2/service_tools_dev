import { useContext } from "react";
import { doc } from "firebase/firestore";
import { db, deleteDocument } from "../../../../firebase/firestore.utils";
import { ToastContext } from "../../../../context/toastContext";

import { Close, DeleteForever } from "@mui/icons-material";
import "../../../../global_style/style.css";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

const DeleteEquipmentTab = ({ equipmentTab, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const removeEquipmentTab = async () => {
    if (equipmentTab.id) {
      await deleteDocument(doc(db, "equipmentTabs", equipmentTab.id))
        .then(() => {
          dispatch({
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Delete Equipment Tab",
              message: `${equipmentTab.name} removed from the cloud`,
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
              title: "Delete Equipment Tab",
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
          This includes <strong>{equipmentTab.name}</strong>
        </li>
      </ul>
      <div className="buttonBar">
        <button
          type="button"
          className="deleteButton"
          onClick={() => removeEquipmentTab()}
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

export default DeleteEquipmentTab;
