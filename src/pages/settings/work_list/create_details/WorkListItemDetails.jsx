import {
  db,
  createUnNamedDocument,
  updateDocument,
} from "../../../../firebase/firestore.utils";
import { collection, doc } from "firebase/firestore";
import { useContext, useState } from "react";
import { ToastContext } from "../../../../context/toastContext";

import { TextField } from "@mui/material";
import "../../../../global_style/style.css";
import { Add, ArrowUpward, Close } from "@mui/icons-material";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

const WorkListItemDetails = ({ workListItem, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const [item, setItem] = useState(
    workListItem !== undefined ? workListItem.item : ""
  );
  const [shorthand, setShorthand] = useState(
    workListItem !== undefined ? workListItem.shorthand : ""
  );

  const submitWorklistItem = (event) => {
    event.preventDefault();
    if (workListItem !== undefined) {
      if (workListItem.item === item && workListItem.shorthand === shorthand) {
        closeModalOne();
      } else {
        //update work list item
        const data = { item, shorthand };
        updateDocument(doc(db, "workList", workListItem.id), data)
          .then(() => {
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "SUCCESS",
                title: "Update Work List Item",
                message: "Work list item updated in the cloud",
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
                title: "Update Work List Item",
                message: "There was an issue updating",
              },
            });
            console.log("Firebase error: ", error);
          });
      }
    } else {
      //create new work list item
      const data = { item, shorthand };
      createUnNamedDocument(collection(db, "workList"), data)
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Add Work list Item",
              message: "Added work list item to the cloud",
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
              title: "Add Work List Item",
              message: "There was a error adding item",
            },
          });
          console.log("Firebase error: ", error);
        });
    }
  };

  return (
    <form onSubmit={submitWorklistItem} autoComplete="new-password">
      <div className="row">
        <div className="doubleRowInput">
          <TextField
            label="Work Item"
            value={item}
            fullWidth
            color="primary"
            sx={{ marginTop: "16px" }}
            onChange={(event) => setItem(event.target.value)}
            required
          />
        </div>
        <div className="doubleRowInput">
          <TextField
            label="Calendar Shorthand"
            value={shorthand}
            fullWidth
            color="primary"
            sx={{ marginTop: "16px" }}
            onChange={(event) => setShorthand(event.target.value)}
            required
          />
        </div>
      </div>
      <div className="buttonBar">
        <button type="submit" className="standardButton">
          {workListItem !== undefined ? (
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

export default WorkListItemDetails;
