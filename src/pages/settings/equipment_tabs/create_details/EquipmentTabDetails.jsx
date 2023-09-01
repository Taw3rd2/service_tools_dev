import { useContext, useState } from "react";
import { collection, doc } from "firebase/firestore";
import {
  db,
  createUnNamedDocument,
  updateDocument,
} from "../../../../firebase/firestore.utils";
import { ToastContext } from "../../../../context/toastContext";

import { TextField } from "@mui/material";
import "../../../../global_style/style.css";
import { Add, ArrowUpward, Close } from "@mui/icons-material";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

const EquipmentTabDetails = ({ equipmentTab, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);
  const [name, setName] = useState(
    equipmentTab !== undefined ? equipmentTab.name : ""
  );

  const submitEquipmentTab = (event) => {
    event.preventDefault();
    if (equipmentTab !== undefined) {
      if (equipmentTab.name === name) {
        closeModalOne();
      } else {
        //update the inventory tab
        updateDocument(doc(db, "equipmentTabs", equipmentTab.id), { name })
          .then(() => {
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "SUCCESS",
                title: "Update Equipment Tab",
                message: "Updated equipment tab in the cloud",
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
                title: "Update Equipment Tab",
                message: "There was a error updating",
              },
            });
            console.log("Firebase error: ", error);
            closeModalOne();
          });
      }
    } else {
      //create a new equipment tab
      createUnNamedDocument(collection(db, "equipmentTabs"), { name })
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Create Equipment tab",
              message: "Created a new equipment tab in the cloud",
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
              title: "Create Equipment tab",
              message: "There was an error creating",
            },
          });
          console.log("Firebase error: ", error);
          closeModalOne();
        });
    }
  };

  return (
    <form onSubmit={submitEquipmentTab} autoComplete="new password">
      <div className="row">
        <div className="singleRowInput">
          <TextField
            label="Equipment Type"
            value={name}
            fullWidth
            color="primary"
            sx={{ marginTop: "16px" }}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
      </div>
      <div className="buttonBar">
        <button type="submit" className="standardButton">
          {equipmentTab !== undefined ? (
            <>
              <ArrowUpward />
              <span className="iconSeperation">Update</span>
            </>
          ) : (
            <>
              <Add />
              <span className="iconSeperation">Add</span>
            </>
          )}
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
    </form>
  );
};

export default EquipmentTabDetails;
