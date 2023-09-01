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

const DispatcherDetails = ({ dispatcher, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);
  const [name, setName] = useState(
    dispatcher !== undefined ? dispatcher.name : ""
  );

  const submitDispatcher = (event) => {
    event.preventDefault();
    if (dispatcher !== undefined) {
      if (dispatcher.name === name) {
        closeModalOne();
      } else {
        //update the dispatcher
        updateDocument(doc(db, "dispatchers", dispatcher.id), { name })
          .then(() => {
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "SUCCESS",
                title: "Update Dispatcher",
                message: "Update Dispatcher in the cloud",
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
                title: "Update Dispatcher",
                message: "There was a error updating",
              },
            });
            console.log("Firebase error: ", error);
          });
      }
    } else {
      //create a new dispatcher
      createUnNamedDocument(collection(db, "dispatchers"), { name })
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Create Dispatcher",
              message: "Created new dispatcher in the cloud",
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
              title: "Create Dispatcher",
              message: "There was an error creating",
            },
          });
          console.log("Firebase error: ", error);
        });
    }
  };

  return (
    <form onSubmit={submitDispatcher} autoComplete="new-password">
      <div className="row">
        <div className="singleRowInput">
          <TextField
            label="Name"
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
          {dispatcher !== undefined ? (
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

export default DispatcherDetails;
