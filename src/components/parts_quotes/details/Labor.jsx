import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";
import { toCurrency } from "../../../utilities/currencyUtils";
import { collection } from "firebase/firestore";

const Labor = ({ quoteValues, handleQuoteValueChange }) => {
  const laborRates = useSyncedCollection(collection(db, "laborRate"));

  return (
    <>
      <div className="row">
        <div className="singleRowInput">
          <div className="columnHeaderText">Labor</div>
        </div>
      </div>

      <div className="row">
        <div className="singleRowInput">
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
