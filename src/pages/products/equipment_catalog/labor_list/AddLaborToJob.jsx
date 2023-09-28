import { useState } from "react";
import { db, useSyncedCollection } from "../../../../firebase/firestore.utils";
import { ArrowUpward, Close } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  stringPriceToNumber,
  toCurrency,
} from "../../../../utilities/currencyUtils";
import { collection } from "firebase/firestore";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const AddLaborToJob = ({ labor, setLabor, closeModalTwo }) => {
  const laborRates = useSyncedCollection(collection(db, "laborRate"));

  const [laborValues, setLaborValues] = useState({
    description: "",
    hours: "",
    rate: "",
  });

  const submitLabor = (e) => {
    e.preventDefault();

    //copy the array
    const newArr = labor;

    //get the new labor values
    const laborToAdd = {
      description: laborValues.description,
      hours: stringPriceToNumber(laborValues.hours),
      rate: stringPriceToNumber(laborValues.rate),
    };

    //push new values to the new array
    newArr.push(laborToAdd);

    //add them to the labor list
    setLabor(newArr);

    //close the modal
    closeModalTwo();
  };

  const handleValueChange = (prop) => (event) => {
    setLaborValues({
      ...laborValues,
      [prop]: event.target.value,
    });
  };

  const handleRateDescriptionChange = (event) => {
    const laborRateDescription = event.target.value;
    const foundRate = laborRates.find(
      (r) => r.rateDescription === laborRateDescription
    );
    setLaborValues({
      ...laborValues,
      rate: foundRate.rate,
      description: foundRate.rateDescription,
    });
  };

  return (
    <form onSubmit={submitLabor} autoComplete="new password">
      <div className="row" style={{ marginTop: "6px" }}>
        <div className="tripleRowInput">
          <FormControl fullWidth>
            <InputLabel id="labor-rate-selector">Select Labor Type</InputLabel>
            <Select
              labelId="labor-rate-selector"
              label="Select Labor Type"
              id="labor_rate_selector"
              value={laborValues.description}
              onChange={(e) => handleRateDescriptionChange(e)}
              required
            >
              {laborRates
                .sort((a, b) =>
                  a.rateDescription.localeCompare(b.rateDescription)
                )
                .map((laborRate, index) => (
                  <MenuItem key={index} value={laborRate.rateDescription}>
                    {laborRate.rateDescription}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <div className="tripleRowInput">
          <TextField
            label="Labor Rate"
            value={`${toCurrency(laborValues.rate / 100)}`}
            fullWidth
            disabled
            required
          />
        </div>
        <div className="tripleRowInput">
          <TextField
            label="Hours"
            value={laborValues.hours}
            onChange={handleValueChange("hours")}
            fullWidth
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
          <Button variant="contained" type="submit" startIcon={<ArrowUpward />}>
            Submit
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

export default AddLaborToJob;
