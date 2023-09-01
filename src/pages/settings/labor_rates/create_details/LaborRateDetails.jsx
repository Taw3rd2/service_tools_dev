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
import {
  stringPriceToNumber,
  toCurrency,
} from "../../../../utilities/currencyUtils";

const LaborRateDetails = ({ laborRate, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const [rate, setRate] = useState(
    //turn the number into a string here

    laborRate !== undefined ? toCurrency(laborRate.rate / 100) : toCurrency(0)
  );
  const [rateDescription, setRateDescription] = useState(
    laborRate !== undefined ? laborRate.rateDescription : ""
  );

  const submitLaborRate = (event) => {
    event.preventDefault();

    if (laborRate !== undefined) {
      //update the laborRate
      const data = { rate, rateDescription };
      data.rate = stringPriceToNumber(data.rate);
      updateDocument(doc(db, "laborRate", laborRate.id), data)
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Update Labor Rate",
              message: "Updated Labor Rate in the cloud",
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
              title: "Update Labor Rate",
              message: "There was a error updating",
            },
          });
          console.log("Firebase error: ", error);
        });
    } else {
      //create a new Labor Rate
      const data = { rate, rateDescription };
      data.rate = stringPriceToNumber(data.rate);
      createUnNamedDocument(collection(db, "laborRate"), data)
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Create Labor Rate",
              message: "Created new labor rate in the cloud",
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
              title: "Create Labor Rate",
              message: "There was an error creating",
            },
          });
          console.log("Firebase error: ", error);
        });
    }
  };

  return (
    <form onSubmit={submitLaborRate} autoComplete="new-password">
      <div className="row">
        <div className="doubleRowInput">
          <TextField
            label="Rate Description"
            value={rateDescription}
            fullWidth
            color="primary"
            sx={{ marginTop: "16px" }}
            onChange={(event) => setRateDescription(event.target.value)}
            required
          />
        </div>
        <div className="doubleRowInput">
          <TextField
            label="Labor Rate"
            value={rate}
            fullWidth
            color="primary"
            sx={{ marginTop: "16px" }}
            onChange={(event) => setRate(event.target.value)}
            required
          />
        </div>
      </div>
      <div className="buttonBar">
        <button type="submit" className="standardButton">
          {laborRate !== undefined ? (
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

export default LaborRateDetails;
