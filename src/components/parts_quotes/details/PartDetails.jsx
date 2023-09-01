import { useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { ArrowUpward, Close } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const PartDetails = ({
  closeModalOne,
  part,
  partIndex,
  quoteValues,
  setQuoteValues,
}) => {
  const [partValues, setPartValues] = useState({
    quantity: part.quantity,
    partNumber: part.partNumber,
    partDescription: part.partDescription,
    partVendor: part.partVendor,
    vendorContact: part.vendorContact,
    partCost: part.partCost,
  });

  const handlePartValueChange = (prop) => (event) => {
    setPartValues({ ...partValues, [prop]: event.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const modifiedPart = {
      quantity: partValues.quantity,
      partNumber: partValues.partNumber,
      partDescription: partValues.partDescription,
      partVendor: partValues.partVendor,
      vendorContact: partValues.vendorContact,
      partCost: partValues.partCost,
    };
    const newPartsList = [...quoteValues.partsList];
    newPartsList.splice(partIndex, 1);
    newPartsList.push(modifiedPart);
    setQuoteValues({ ...quoteValues, partsList: newPartsList });
    closeModalOne();
  };

  return (
    <form onSubmit={onSubmit} autoComplete="new password">
      <Grid container spacing={1.5}>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={partValues.quantity}
            onChange={handlePartValueChange("quantity")}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Part Number"
            type="text"
            fullWidth
            value={partValues.partNumber}
            onChange={handlePartValueChange("partNumber")}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Description"
            type="text"
            fullWidth
            value={partValues.partDescription}
            onChange={handlePartValueChange("partDescription")}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Vendor"
            fullWidth
            value={partValues.partVendor}
            onChange={handlePartValueChange("partVendor")}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Contact"
            fullWidth
            value={partValues.vendorContact}
            onChange={handlePartValueChange("vendorContact")}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Cost"
            type="number"
            fullWidth
            value={partValues.partCost}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            onChange={handlePartValueChange("partCost")}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1.5} justifyContent="end" mt={2}>
        <Grid>
          <Button variant="outlined" type="submit" startIcon={<ArrowUpward />}>
            Update
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="outlined"
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

export default PartDetails;
