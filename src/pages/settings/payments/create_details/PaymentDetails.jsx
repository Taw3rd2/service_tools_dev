import { useContext, useState } from "react";
import { collection, doc } from "firebase/firestore";
import { ToastContext } from "../../../../context/toastContext";

import {
  db,
  createUnNamedDocument,
  updateDocument,
} from "../../../../firebase/firestore.utils";

import "../../../../global_style/style.css";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";
import { Button, TextField } from "@mui/material";
import { Add, ArrowUpward, Close } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const PaymentDetails = ({ payment, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const [item, setItem] = useState(payment !== undefined ? payment.item : "");

  const onSubmitPayment = (event) => {
    event.preventDefault();
    if (payment !== undefined) {
      if (payment.item === item) {
        closeModalOne();
      } else {
        //update the payment
        updateDocument(doc(db, "payments", payment.id), { item })
          .then(() => {
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "SUCCESS",
                title: "Update Payment",
                message: "Update Payment in the cloud",
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
                title: "Update Payment",
                message: "There was a error updating",
              },
            });
            console.log("Firebase error: ", error);
          });
      }
    } else {
      //Add the payment
      createUnNamedDocument(collection(db, "payments"), { item })
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Create Payment",
              message: "Created new payment in the cloud",
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
              title: "Create Payment",
              message: "There was an error creating",
            },
          });
          console.log("Firebase error: ", error);
        });
    }
  };

  return (
    <form onSubmit={onSubmitPayment} autoComplete="new-password">
      <div className="row">
        <div className="singleRowInput">
          <TextField
            label="Payment Type"
            value={item}
            fullWidth
            color="primary"
            sx={{ marginTop: "16px" }}
            onChange={(event) => setItem(event.target.value)}
            required
          />
        </div>
      </div>
      <Grid
        container
        spacing={1.5}
        sx={{ display: "flex", justifyContent: "end" }}
      >
        <Grid>
          <Button
            variant="contained"
            type="submit"
            startIcon={payment !== undefined ? <ArrowUpward /> : <Add />}
          >
            {payment !== undefined ? "Update" : "Add"}
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            type="button"
            startIcon={<Close />}
            onClick={() => closeModalOne()}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default PaymentDetails;
