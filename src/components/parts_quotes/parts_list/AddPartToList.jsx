import { ArrowUpward, Close } from "@mui/icons-material";
import { Button, InputAdornment, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";

const AddPartToList = ({ closeModalOne, quoteValues, setQuoteValues }) => {
  const [partValues, setPartValues] = useState({
    quantity: 1,
    partNumber: "",
    partDescription: "",
    partVendor: "",
    vendorContact: "",
    partCost: 0.0,
  });

  const handlePartValueChange = (prop) => (event) => {
    setPartValues({ ...partValues, [prop]: event.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const newPart = {
      quantity: partValues.quantity,
      partNumber: partValues.partNumber,
      partDescription: partValues.partDescription,
      partVendor: partValues.partVendor,
      vendorContact: partValues.vendorContact,
      partCost: partValues.partCost,
    };
    const newPartsList = quoteValues.partsList;
    newPartsList.push(newPart);
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
        <Grid xs={12} sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            variant="outlined"
            type="submit"
            startIcon={<ArrowUpward />}
            sx={{ marginLeft: "8px" }}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            type="button"
            startIcon={<Close />}
            onClick={() => closeModalOne()}
            sx={{ marginLeft: "8px" }}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddPartToList;
