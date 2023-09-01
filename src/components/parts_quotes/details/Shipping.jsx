import { InputAdornment, TextField } from "@mui/material";

const Shipping = ({
  quoteValues,
  handleQuoteValueChange,
  handleShippingRateChange,
}) => {
  return (
    <div>
      <div className="row">
        <div className="singleRowInput">
          <div className="columnHeaderText">Shipping</div>
        </div>
      </div>
      <div className="row">
        <div className="doubleRowInput">
          <TextField
            label="Reg Shipping Time"
            size="small"
            value={quoteValues.regularShippingTime}
            onChange={handleQuoteValueChange("regularShippingTime")}
            fullWidth
          />
        </div>
        <div className="doubleRowInput">
          <TextField
            label="Req Shipping Rate"
            type="number"
            id="regularShippingRate"
            size="small"
            value={quoteValues.regularShippingRate}
            onChange={(e) => handleShippingRateChange(e, "regularShippingRate")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            fullWidth
          />
        </div>
      </div>
      <div className="row">
        <div className="doubleRowInput">
          <TextField
            label="Quick Shipping Time"
            size="small"
            value={quoteValues.quickShippingTime}
            onChange={handleQuoteValueChange("quickShippingTime")}
            fullWidth
          />
        </div>
        <div className="doubleRowInput">
          <TextField
            label="Quick Shipping Rate"
            type="number"
            id="quickShippingRate"
            size="small"
            value={quoteValues.quickShippingRate}
            onChange={(e) => handleShippingRateChange(e, "quickShippingRate")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            fullWidth
          />
        </div>
      </div>
      <div className="row">
        <div className="singleRowInput">
          <TextField
            label="Shipping Notes"
            size="small"
            value={quoteValues.shippingNotes}
            onChange={handleQuoteValueChange("shippingNotes")}
            fullWidth
            multiline
            rows={2.25}
          />
        </div>
      </div>
    </div>
  );
};

export default Shipping;
