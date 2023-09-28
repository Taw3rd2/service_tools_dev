import { useContext, useState } from "react";
import { ToastContext } from "../../../context/toastContext";
import { updateCustomer } from "../customerInformationFunctions";
import { getFormattedDateAndTime } from "../../../utilities/dateUtils";

import { Button, TextField } from "@mui/material";
import { ArrowUpward, Close } from "@mui/icons-material";
import "../../../global_style/style.css";
import CommercialContact from "./CommercialContact";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const EditCustomerBilling = ({ customer, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);
  const [customerValues, setCustomerValues] = useState({
    billingorg: customer.billingorg ? customer.billingorg : "",
    billingPrimaryName: customer.billingPrimaryName
      ? customer.billingPrimaryName
      : "",
    billingAlternateName: customer.billingAlternateName
      ? customer.billingAlternateName
      : "",
    billingOtherName: customer.billingOtherName
      ? customer.billingOtherName
      : "",
    billingPrimaryPhone: customer.billingPrimaryPhone
      ? customer.billingPrimaryPhone
      : "",
    billingAlternatePhone: customer.billingAlternatePhone
      ? customer.billingAlternatePhone
      : "",
    billingOtherPhone: customer.billingOtherPhone
      ? customer.billingOtherPhone
      : "",
    billingPrimaryEmail: customer.billingPrimaryEmail
      ? customer.billingPrimaryEmail
      : "",
    billingAlternateEmail: customer.billingAlternateEmail
      ? customer.billingAlternateEmail
      : "",
    billingOtherEmail: customer.billingOtherEmail
      ? customer.billingOtherEmail
      : "",
    billingstreet: customer.billingstreet ? customer.billingstreet : "",
    billingcity: customer.billingcity ? customer.billingstreet : "",
    billingstate: customer.billingstate ? customer.billingstate : "",
    billingzip: customer.billingzip ? customer.billingzip : "",
    commercialContacts: customer.commercialContacts
      ? customer.commercialContacts
      : [],
  });

  const handleValueChange = (name) => (event) => {
    setCustomerValues({
      ...customerValues,
      [name]: event.target.value,
    });
  };

  const submitBillingChanges = (event) => {
    event.preventDefault();
    updateCustomer(
      customer,
      customerValues,
      activateUpdateSuccessNotification,
      activateUpdateFailureNotification,
      closeModalOne
    );
  };

  const activateUpdateSuccessNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Update Customer Billing",
        message: "Customer billing updated in the cloud",
      },
    });
  };

  const activateUpdateFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Update Customer Billing",
        message: "There was an error updating",
      },
    });
  };

  return (
    <form onSubmit={submitBillingChanges} autoComplete="new-password">
      <Grid container spacing={1.5}>
        <Grid xs={12} sm={12} md={12} lg={6} sx={{ marginTop: "6px" }}>
          <TextField
            value={customerValues.billingorg}
            label="Organization Name"
            fullWidth
            onChange={handleValueChange("billingorg")}
            inputProps={{ tabIndex: "1" }}
            autoFocus
            required
            size="small"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={6}></Grid>
        <Grid xs={12}>
          <TextField
            value={customerValues.billingstreet}
            label="Billing Street Address"
            fullWidth
            onChange={handleValueChange("billingstreet")}
            inputProps={{ tabIndex: "11" }}
            size="small"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            value={customerValues.billingcity}
            label="City"
            fullWidth
            onChange={handleValueChange("billingcity")}
            inputProps={{ tabIndex: "12" }}
            size="small"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            value={customerValues.billingstate}
            label="State"
            fullWidth
            onChange={handleValueChange("billingstate")}
            inputProps={{ tabIndex: "13" }}
            size="small"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            value={customerValues.billingzip}
            label="Zip Code"
            fullWidth
            onChange={handleValueChange("billingzip")}
            inputProps={{ tabIndex: "14" }}
            size="small"
          />
        </Grid>
        <Grid xs={12} mb={2}>
          <CommercialContact
            customerValues={customerValues}
            setCustomerValues={setCustomerValues}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}></Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <Button
            variant="contained"
            type="submit"
            startIcon={<ArrowUpward />}
            fullWidth
          >
            Save Changes
          </Button>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <Button
            variant="contained"
            type="button"
            startIcon={<Close />}
            onClick={() => closeModalOne()}
            fullWidth
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditCustomerBilling;
