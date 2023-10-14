import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, deleteDocument } from "../../../firebase/firestore.utils";
import { useContext } from "react";
import { ToastContext } from "../../../context/toastContext";
import { getFormattedExactTime } from "../../../utilities/dateUtils";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Button } from "@mui/material";
import { Close, Schedule } from "@mui/icons-material";

const Holding = ({ selectedDispatch, closeModalOne, closeModalTwo }) => {
  const { dispatch } = useContext(ToastContext);

  const getSecondTechDispatch = async (secondTechId) => {
    const docRef = doc(db, "events", secondTechId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("Error No 2nd tech document exists!");
    }
  };

  const moveToHolding = async () => {
    console.log("moving to holding");
    console.log(
      "selectedDispatch.extendedProps: ",
      selectedDispatch.extendedProps
    );

    //if dispatch is done, parts, or canceled
    if (
      selectedDispatch.extendedProps.status === "active" ||
      selectedDispatch.extendedProps.status === "canceled" ||
      selectedDispatch.extendedProps.status === "done" ||
      selectedDispatch.extendedProps.status === "parts"
    ) {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: getFormattedExactTime(new Date()),
          type: "INFO",
          title: "Update Dispatch",
          message: "The job is in progress, done, or canceled.",
        },
      });
      return;
    } else if (
      selectedDispatch.extendedProps.techHelperId &&
      selectedDispatch.extendedProps.techHelper !== "NONE"
    ) {
      //we have 2 techs

      //TODO Validation on 2nd tech status is not done and unreachable here..
      // use a 1 time getter to get the 2nd tech document and validate status
      const secondTechDoc = getSecondTechDispatch(
        selectedDispatch.extendedProps.techHelperId
      );
      secondTechDoc.then((result) => {
        if (
          result.status === "active" ||
          result.status === "canceled" ||
          result.status === "done" ||
          result.status === "parts"
        ) {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "INFO",
              title: "Update Dispatch",
              message: "The job is in progress, done, or canceled.",
            },
          });
          return;
        } else {
          //1. delete the techHelper dispatch but keep the techLead dispatch original
          console.log("Removing 2nd tech for Holding");
          deleteDocument(
            doc(db, "events", selectedDispatch.extendedProps.techHelperId)
          ).then(() => {
            //2. strip the original dispatch
            //a. remove dateScheduled
            //b. remove end
            //c. remove scheduledDate
            //d. remove start
            //e. reset the dateModified
            //f. carry over the id, and title params
            console.log("2nd tech removed starting move to Holding");
            const updatedDispatch = {
              ...selectedDispatch.extendedProps,
              dateModified: new Date(),
              dateScheduled: 0,
              end: null,
              id: selectedDispatch.id,
              scheduledDate: null,
              status: "holding",
              start: null,
              title: selectedDispatch.title,
            };
            updateDoc(doc(db, "events", selectedDispatch.id), updatedDispatch)
              .then(() => {
                dispatch({
                  type: "ADD_NOTIFICATION",
                  payload: {
                    id: getFormattedExactTime(new Date()),
                    type: "SUCCESS",
                    title: "Moved To Holding",
                    message: "Updated the dispatch in the cloud",
                  },
                });
                closeModalOne();
                closeModalTwo();
              })
              .catch((error) => {
                dispatch({
                  type: "ADD_NOTIFICATION",
                  payload: {
                    id: getFormattedExactTime(new Date()),
                    type: "ERROR",
                    title: "Move To Holding",
                    message: "There was a error updating the dispatch",
                  },
                });
                console.log("firebase error: ", error);
              });
          });
        }
      });
    } else {
      //only one tech
      const updatedDispatch = {
        ...selectedDispatch.extendedProps,
        dateModified: new Date(),
        dateScheduled: 0,
        end: null,
        id: selectedDispatch.id,
        scheduledDate: null,
        status: "holding",
        start: null,
        title: selectedDispatch.title,
      };
      await updateDoc(doc(db, "events", selectedDispatch.id), updatedDispatch)
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Moved To Holding",
              message: "Updated the dispatch in the cloud",
            },
          });
          closeModalOne();
          closeModalTwo();
        })
        .catch((error) => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "ERROR",
              title: "Move To Holding",
              message: "There was a error updating the dispatch",
            },
          });
          console.log("firebase error: ", error);
        });
    }
  };

  return (
    <Grid container spacing={1.5}>
      <Grid xs={12}>
        <ul>
          <li>This will move the dispatch to Holding.</li>
        </ul>
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={6}>
        <Button
          variant="contained"
          type="button"
          color="warning"
          startIcon={<Schedule />}
          size="large"
          onClick={() => moveToHolding()}
          fullWidth
        >
          Move
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

export default Holding;
