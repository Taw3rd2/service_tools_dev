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
import { TextField } from "@mui/material";
import { Add, ArrowUpward, Close } from "@mui/icons-material";

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
      <div className="buttonBar">
        <button type="submit" className="standardButton">
          {payment !== undefined ? (
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

export default PaymentDetails;
