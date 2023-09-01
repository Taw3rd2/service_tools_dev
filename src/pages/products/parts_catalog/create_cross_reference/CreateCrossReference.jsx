import { useContext, useState } from "react";
import { doc } from "firebase/firestore";
import { db, updateDocument } from "../../../../firebase/firestore.utils";
import { ToastContext } from "../../../../context/toastContext";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";
import { InputAdornment, TextField } from "@mui/material";
import { ArrowUpward, Close } from "@mui/icons-material";

const CreateCrossReference = ({ part, closeModalTwo }) => {
  const { dispatch } = useContext(ToastContext);

  const [crossReferenceValues, setCrossReferenceValues] = useState({
    partNumber: "",
    partVendor: "",
    partCost: 0.0,
    partDataDate: new Date().toLocaleDateString(),
  });

  const costConversion = (costValue) => {
    if (Number.isFinite(costValue)) {
      return costValue;
    } else {
      return Number(costValue.replace(/[^0-9]+/g, ""));
    }
  };

  const submitNewCrossReference = (e) => {
    e.preventDefault();

    if (part.crossReference === undefined) {
      part.crossReference = [];
    }

    const newCrossReference = {
      partNumber: crossReferenceValues.partNumber,
      partVendor: crossReferenceValues.partVendor,
      partCost: costConversion(crossReferenceValues.partCost),
      partDataDate: crossReferenceValues.partDataDate,
    };

    part.crossReference.push(newCrossReference);

    if (part.id !== undefined) {
      console.log("updated part: ", part);
      updateDocument(doc(db, "parts", part.id), {
        crossReference: part.crossReference,
      })
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Update Part Cross Reference",
              message: "Updated part info in the cloud",
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
              title: "Update Part Cross Reference",
              message: "There was a error updating",
            },
          });
          console.log("Firebase error: ", error);
        });
    } else {
      console.log("The part ID was undefined...");
    }

    closeModalTwo();
  };

  const handleValueChange = (prop) => (event) => {
    setCrossReferenceValues({
      ...crossReferenceValues,
      [prop]: event.target.value,
    });
  };

  return (
    <form onSubmit={submitNewCrossReference} autoComplete="new-password">
      <div className="row">
        <div className="tripleRowInput">
          <TextField
            label="Part Number"
            value={crossReferenceValues.partNumber}
            onChange={handleValueChange("partNumber")}
            fullWidth
            required
          />
        </div>
        <div className="tripleRowInput">
          <TextField
            label="Part Vendor"
            value={crossReferenceValues.partVendor}
            onChange={handleValueChange("partVendor")}
            fullWidth
            required
          />
        </div>

        <div className="tripleRowInput">
          <TextField
            label="Part Cost"
            type="number"
            value={crossReferenceValues.partCost}
            onChange={handleValueChange("partCost")}
            fullWidth
            required
            inputProps={{
              step: 0.01,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </div>
      </div>
      <div className="buttonBar">
        <button type="submit" className="standardButton">
          <ArrowUpward />
          <span className="iconSeperation">Submit</span>
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
    </form>
  );
};

export default CreateCrossReference;
