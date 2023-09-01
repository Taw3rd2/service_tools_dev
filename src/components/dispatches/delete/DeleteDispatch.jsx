import { useContext } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/firestore.utils";
import { ToastContext } from "../../../context/toastContext";
import { getFormattedExactTime } from "../../../utilities/dateUtils";
import { Close, DeleteForever } from "@mui/icons-material";
import "../../../global_style/style.css";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Button } from "@mui/material";

const DeleteDispatch = ({ selectedDispatch, closeModalOne, closeModalTwo }) => {
  const { dispatch } = useContext(ToastContext);

  const removeSecondDispatch = async () => {
    if (selectedDispatch.extendedProps.techHelperId) {
      await deleteDoc(
        doc(db, "events", selectedDispatch.extendedProps.techHelperId)
      )
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "INFO",
              title: "Delete Helper Dispatch",
              message: "Deleted the Tech Helper Dispatch",
            },
          });
        })
        .catch((error) => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "ERROR",
              title: "Delete Dispatch",
              message: "There was a error removing the helper dispatch",
            },
          });
          console.log("firebbase error: ", error);
        });
    }
  };

  const removeDispatches = async () => {
    await removeSecondDispatch();
    await deleteDoc(doc(db, "events", selectedDispatch.id))
      .then(() => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "SUCCESS",
            title: "Delete Dispatch",
            message: "Removed the dispatch from the cloud",
          },
        });
        closeModalTwo();
        closeModalOne();
      })
      .catch((error) => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "ERROR",
            title: "Delete Dispatch",
            message: "There was a error removing the dispatch",
          },
        });
        console.log("firebase error: ", error);
      });
  };

  return (
    <Grid container spacing={1.5}>
      <Grid xs={12}>
        <div className="deleteWarningText">Unrecoverable Delete!</div>
      </Grid>
      <Grid xs={12}>
        <ul>
          <li>This will permanently remove the dispatch from the history</li>
          {selectedDispatch.extendedProps.techHelperId && (
            <div>
              <li>
                This includes{" "}
                <strong>{selectedDispatch.extendedProps.techHelper}'s</strong>{" "}
                dispatch!
              </li>
              <li>
                If you need to keep {selectedDispatch.extendedProps.techHelper}
                's dispatch, Open the dispatch you want to keep, and set the
                tech helper to "NONE".
              </li>
            </div>
          )}
        </ul>
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={6}>
        <Button
          variant="outlined"
          type="button"
          color="error"
          startIcon={<DeleteForever />}
          size="large"
          onClick={() => removeDispatches()}
          fullWidth
        >
          Confirm Delete
        </Button>
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={6}>
        <Button
          variant="outlined"
          type="button"
          startIcon={<Close />}
          size="large"
          onClick={() => closeModalTwo()}
          fullWidth
        >
          Close
        </Button>
      </Grid>
    </Grid>
  );
};

export default DeleteDispatch;
