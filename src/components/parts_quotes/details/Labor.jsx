import {
  //Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";
import { toCurrency } from "../../../utilities/currencyUtils";
import { collection } from "firebase/firestore";

const Labor = ({
  quoteValues,
  handleQuoteValueChange,
  //handleQuoteLaborSelectChange,
}) => {
  const laborRates = useSyncedCollection(collection(db, "laborRate"));
  console.log("quoteValues: ", quoteValues);
  console.log("laborRates: ", laborRates);

  return (
    <>
      <div className="row">
        <div className="singleRowInput">
          <Typography variant="h5">Labor</Typography>
        </div>
      </div>

      <div className="row">
        <div className="singleRowInput">
          {/* <Autocomplete
            disableClearable
            disablePortal
            fullWidth
            getOptionLabel={(option) => {
              console.log("option: ", option);
              return option;
            }}
            id="labor-selector"
            isOptionEqualToValue={(option, value) => option === value}
            options={laborRates
              .sort((a, b) =>
                a.rateDescription.localeCompare(b.rateDescription)
              )
              .map((rate, index) => rate.rateDescription)}
            onChange={(option, value) =>
              handleQuoteLaborSelectChange("laborRate", value)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Labor Rate"
                variant="outlined"
              />
            )}
            size="small"
            value={quoteValues.laborRate}
          /> */}
          <FormControl fullWidth>
            <InputLabel id="labor-rate-selector">Select Labor Type</InputLabel>
            <Select
              labelId="labor-rate-selector"
              label="Select Labor Type"
              size="small"
              id="labor_rate_selector"
              // this may need a default value ?
              value={quoteValues.laborRate}
              onChange={handleQuoteValueChange("laborRate")}
            >
              {laborRates
                .sort((a, b) =>
                  a.rateDescription.localeCompare(b.rateDescription)
                )
                .map((rate, index) => (
                  <MenuItem key={index} value={rate.rate}>
                    {rate.rateDescription}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="row">
        <div className="doubleRowInput">
          <TextField
            label="Labor Rate"
            size="small"
            value={`${toCurrency(quoteValues.laborRate / 100)}`}
            fullWidth
            disabled
          />
        </div>
        <div className="doubleRowInput">
          <TextField
            label="Hours"
            size="small"
            value={quoteValues.laborHours}
            onChange={handleQuoteValueChange("laborHours")}
            fullWidth
          />
        </div>
      </div>
    </>
  );
};

export default Labor;
