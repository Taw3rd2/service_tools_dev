import { useContext } from "react";
import { ToastContext } from "../../../../context/toastContext";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

import { doc } from "firebase/firestore";
import { db, updateDocument } from "../../../../firebase/firestore.utils";

import { Close, DeleteForever } from "@mui/icons-material";
import "../../../../global_style/style.css";

const DeleteCrossReference = ({ part, crossReferenceIndex, closeModalTwo }) => {
  const { dispatch } = useContext(ToastContext);

  const removeCrossReference = async () => {
    part.crossReference.splice(crossReferenceIndex, 1);

    if (part.id) {
      updateDocument(doc(db, "parts", part.id), {
        crossReference: part.crossReference,
      })
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Delete Cross Reference",
              message: `cross reference removed from the cloud`,
            },
          });
          closeModalTwo();
        })
        .catch((error) => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "ERROR",
              title: "Delete Cross Reference",
              message: "There was an error deleting",
            },
          });
          console.log("Firebase error: ", error);
        });
    }
  };

  return (
    <div className="container">
      <div className="deleteWarningText">Unrecoverable Delete</div>
      <ul>
        <li>
          This includes{" "}
          <strong>{part.crossReference[crossReferenceIndex].partNumber}</strong>
        </li>
      </ul>
      <div className="buttonBar">
        <button
          type="button"
          className="deleteButton"
          onClick={() => removeCrossReference()}
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

export default DeleteCrossReference;
