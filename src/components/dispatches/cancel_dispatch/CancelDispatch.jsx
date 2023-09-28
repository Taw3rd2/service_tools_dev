import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firestore.utils";
import { useContext } from "react";
import { ToastContext } from "../../../context/toastContext";
import { getFormattedExactTime } from "../../../utilities/dateUtils";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Button, Typography } from "@mui/material";
import { Close, DoNotDisturb } from "@mui/icons-material";

const CancelDispatch = ({ selectedDispatch, closeModalOne, closeModalTwo }) => {
  const { dispatch } = useContext(ToastContext);

  console.log("selectedDispatch: ", selectedDispatch);

  const deleteSecondDispatch = (id) => {
    return new Promise((resolve, reject) => {
      if (id) {
        deleteDoc(
          doc(db, "events", selectedDispatch.extendedProps.techHelperId)
        )
          .then(() => {
            resolve("deleted");
          })
          .catch((error) => {
            resolve(error);
          });
      }
    });
  };

  const updateDispatch = (canceledDispatch) => {
    return new Promise((resolve, reject) => {
      updateDoc(doc(db, "events", selectedDispatch.id), canceledDispatch)
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "ReSchedule Dispatch",
              message: "Updated the dispatch in the cloud",
            },
          });
          resolve("updated");
          closeModalTwo();
          closeModalOne();
        })
        .catch((error) => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "ERROR",
              title: "Reshedule Dispatch",
              message: "There was a error updating the dispatch",
            },
          });
          resolve(error);
        });
    });
  };

  const rescheduleDispatch = async () => {
    console.log("reschedule");
    const updatedDispatch = {
      ...selectedDispatch.extendedProps,
      dateModified: new Date(),
      end: selectedDispatch.end,
      id: selectedDispatch.id,
      start: selectedDispatch.start,
      status: "scheduled",
      techHelperId: "",
      techHelper: "NONE",
      techLead: "",
      title: selectedDispatch.title,
    };
    await updateDoc(doc(db, "events", selectedDispatch.id), updatedDispatch)
      .then(() => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "SUCCESS",
            title: "ReSchedule Dispatch",
            message: "Updated the dispatch in the cloud",
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
            title: "Reshedule Dispatch",
            message: "There was a error updating the dispatch",
          },
        });
        console.log("firebase error: ", error);
      });
  };

  const cancelDispatches = async () => {
    const updatedDispatch = {
      ...selectedDispatch.extendedProps,
      dateModified: new Date(),
      end: selectedDispatch.end,
      id: selectedDispatch.id,
      start: selectedDispatch.start,
      status: "canceled",
      techHelperId: "",
      techHelper: "NONE",
      techLead: "",
      title: selectedDispatch.title,
    };
    console.log("updatedDispatch: ", updatedDispatch);
    await deleteSecondDispatch(
      selectedDispatch.extendedProps.techHelperId
    ).then(updateDispatch(updatedDispatch));
    console.log("Dispatch Canceled");
    // await updateDoc(doc(db, "events", selectedDispatch.id), updatedDispatch)
    //   .then(() => {
    //     dispatch({
    //       type: "ADD_NOTIFICATION",
    //       payload: {
    //         id: getFormattedExactTime(new Date()),
    //         type: "SUCCESS",
    //         title: "Cancel Dispatch",
    //         message: "Updated the dispatch in the cloud",
    //       },
    //     });
    //     closeModalTwo();
    //     closeModalOne();
    //   })
    //   .catch((error) => {
    //     dispatch({
    //       type: "ADD_NOTIFICATION",
    //       payload: {
    //         id: getFormattedExactTime(new Date()),
    //         type: "ERROR",
    //         title: "Cancel Dispatch",
    //         message: "There was a error updating the dispatch",
    //       },
    //     });
    //     console.log("firebase error: ", error);
    //   });
  };

  return (
    <Grid container spacing={1.5}>
      {selectedDispatch.extendedProps.status === "canceled" ? (
        <Grid xs={12}>
          <Typography variant="h5" color="orange">
            Re-Schedule Dispatch
          </Typography>
        </Grid>
      ) : (
        <Grid xs={12}>
          <Typography variant="h5" color="orange">
            Unrecoverable!
          </Typography>
        </Grid>
      )}
      {selectedDispatch.extendedProps.status === "canceled" ? (
        <Grid xs={12}>
          <ul>
            <li>This will set the dispatch status to scheduled.</li>
            <li>
              You will need to reselect technicians and update after
              rescheduling
            </li>
          </ul>
        </Grid>
      ) : (
        <Grid xs={12}>
          <ul>
            <li>This will cancel the dispatch.</li>
            {selectedDispatch.extendedProps.techHelperId && (
              <div>
                <li>
                  This includes{" "}
                  <strong>{selectedDispatch.extendedProps.techHelper}'s</strong>{" "}
                  dispatch!
                </li>
              </div>
            )}
          </ul>
        </Grid>
      )}
      <Grid xs={12} sm={12} md={12} lg={6}>
        <Button
          variant="contained"
          type="button"
          color="warning"
          startIcon={<DoNotDisturb />}
          size="large"
          onClick={
            selectedDispatch.extendedProps.status === "canceled"
              ? () => rescheduleDispatch()
              : () => cancelDispatches()
          }
          fullWidth
        >
          {selectedDispatch.extendedProps.status === "canceled"
            ? "Confirm Re-Schedule"
            : "Confirm Cancel"}
        </Button>
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={6}>
        <Button
          variant="contained"
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

export default CancelDispatch;
