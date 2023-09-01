import { useContext } from "react";
import { ToastContext } from "../../../../context/toastContext";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

import { doc } from "firebase/firestore";
import { db, deleteDocument } from "../../../../firebase/firestore.utils";

import { Close, DeleteForever } from "@mui/icons-material";
import "../../../../global_style/style.css";

const DeleteCategory = ({ categoryToDelete, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const removeCategory = async () => {
    if (categoryToDelete.id) {
      deleteDocument(doc(db, "equipmentSubCategories", categoryToDelete.id))
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Delete Category",
              message: `${categoryToDelete.name} removed from the cloud`,
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
              title: "Delete Category",
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
          This includes <strong>category: {categoryToDelete.name}</strong>
        </li>
      </ul>
      <div className="buttonBar">
        <button
          type="button"
          className="deleteButton"
          onClick={() => removeCategory()}
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

export default DeleteCategory;
