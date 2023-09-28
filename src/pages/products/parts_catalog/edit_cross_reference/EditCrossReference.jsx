import { useContext, useState } from "react";
import { ToastContext } from "../../../../context/toastContext";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";
import { doc } from "firebase/firestore";
import { db, updateDocument } from "../../../../firebase/firestore.utils";
import { Button, InputAdornment, TextField } from "@mui/material";
import { ArrowUpward, Close } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const EditCrossReference = ({ part, crossReferenceIndex, closeModalTwo }) => {
  const { dispatch } = useContext(ToastContext);

  const onBaseCostLoad = (number) => {
    return parseFloat(number / 100).toFixed(2);
  };

  const [crossReferenceValues, setCrossReferenceValues] = useState({
    partNumber: part.crossReference[crossReferenceIndex].partNumber
      ? part.crossReference[crossReferenceIndex].partNumber
      : "",
    partVendor: part.crossReference[crossReferenceIndex].partVendor
      ? part.crossReference[crossReferenceIndex].partVendor
      : "",
    partCost: part.crossReference[crossReferenceIndex].partCost
      ? onBaseCostLoad(part.crossReference[crossReferenceIndex].partCost)
      : 0.0,
    partDataDate: part.crossReference[crossReferenceIndex].partDataDate
      ? part.crossReference[crossReferenceIndex].partDataDate
      : new Date().toLocaleDateString(),
  });

  const costConversion = (costValue) => {
    if (Number.isFinite(costValue)) {
      return costValue;
    } else {
      return Number(costValue.replace(/[^0-9]+/g, ""));
    }
  };

  const updateCrossReference = (e) => {
    e.preventDefault();

    const updatedCrossReference = {
      partNumber: crossReferenceValues.partNumber,
      partVendor: crossReferenceValues.partVendor,
      partCost: costConversion(crossReferenceValues.partCost),
      partDataDate: new Date().toLocaleDateString(),
    };

    part.crossReference.splice(crossReferenceIndex, 1);
    part.crossReference.push(updatedCrossReference);

    if (part.id !== undefined) {
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
    <form onSubmit={updateCrossReference} autoComplete="new-password">
      <div className="row" style={{ marginTop: "6px" }}>
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
      <Grid
        container
        spacing={1.5}
        sx={{ display: "flex", justifyContent: "end" }}
      >
        <Grid>
          <Button variant="contained" type="submit" startIcon={<ArrowUpward />}>
            Update
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            type="button"
            startIcon={<Close />}
            onClick={() => closeModalTwo()}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditCrossReference;
