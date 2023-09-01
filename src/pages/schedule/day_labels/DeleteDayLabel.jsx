import { useContext } from "react";
import { doc } from "firebase/firestore";
import { db, deleteDocument } from "../../../firebase/firestore.utils";
import { ToastContext } from "../../../context/toastContext";

import { Close, DeleteForever } from "@mui/icons-material";
import "../../../global_style/style.css";
import { getFormattedExactTime } from "../../../utilities/dateUtils";

const DeleteDayLabel = ({ closeModalThree, selectedDayLabel }) => {
  const { dispatch } = useContext(ToastContext);

  const removeLabel = () => {
    deleteDocument(doc(db, "calLabel", selectedDayLabel.id))
      .then(() => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "SUCCESS",
            title: "Delete Day Label",
            message: "Removed the day label from the cloud",
          },
        });
        closeModalThree();
      })
      .catch((error) => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "ERROR",
            title: "Delete Day Label",
            message: "There was an error removing the label",
          },
        });
        console.log("Firestore error: ", error);
      });
  };
  return (
    <div className="container">
      <div className="deleteWarningText">Unrecoverable Delete!</div>
      <ul>
        <li>Will remove the day label from the selected day.</li>
      </ul>
      <div className="buttonBar">
        <button
          type="button"
          className="deleteButton"
          onClick={() => removeLabel()}
        >
          <DeleteForever />
          <span className="iconSeperation">Delete</span>
        </button>
        <button
          type="button"
          className="standardButton"
          onClick={() => closeModalThree()}
        >
          <Close />
          <span className="iconSeperation">Close</span>
        </button>
      </div>
    </div>
  );
};

export default DeleteDayLabel;
