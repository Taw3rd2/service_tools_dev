import { useContext, useState } from "react";
import { ToastContext } from "../../../context/toastContext";
import { updateCustomer } from "../customerInformationFunctions";
import { ArrowUpward, Close, DeleteForever } from "@mui/icons-material";
import { Button, Checkbox, TextField } from "@mui/material";

import "../../../global_style/style.css";
import { getFormattedDateAndTime } from "../../../utilities/dateUtils";
import Contact from "./Contact";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const EditCustomerDetails = ({
  customer,
  openDeleteCustomer,
  closeModalOne,
}) => {
  const { dispatch } = useContext(ToastContext);

  const [lastNameError, setLastNameError] = useState(false);
  const [customerValues, setCustomerValues] = useState({
    altphone: customer.altphone ? customer.altphone : "",
    altPhoneName: customer.altPhoneName ? customer.altPhoneName : "",
    billingiscommercial: customer.billingiscommercial
      ? customer.billingiscommercial
      : false,
    city: customer.city ? customer.city : "",
    contacts: customer.contacts ? customer.contacts : [],
    email: customer.email ? customer.email : "",
    firstname: customer.firstname ? customer.firstname : "",
    lastname: customer.lastname ? customer.lastname : "",
    noService: customer.noService ? customer.noService : false,
    otherPhone: customer.otherPhone ? customer.otherPhone : "",
    otherPhoneName: customer.otherPhoneName ? customer.otherPhoneName : "",
    phone: customer.phone ? customer.phone : "",
    phoneName: customer.phoneName ? customer.phoneName : "",
    state: customer.state ? customer.state : "",
    street: customer.street ? customer.street : "",
    zip: customer.zip ? customer.zip : "",
  });

  const handleValueChange = (name) => (event) => {
    setCustomerValues({
      ...customerValues,
      [name]: event.target.value,
    });
  };

  const handleCheckChange = (name) => (event) => {
    setCustomerValues({
      ...customerValues,
      [name]: event.target.checked,
    });
  };

  const submitUpdate = (event) => {
    event.preventDefault();
    if (customerValues.lastname === "") {
      setLastNameError(true);
      return;
    } else {
      setLastNameError(false);
      console.log("customerValues: ", customerValues);
      updateCustomer(
        customer,
        customerValues,
        activateUpdateSuccessNotification,
        activateUpdateFailureNotification,
        closeModalOne
      );
    }
  };

  const activateUpdateSuccessNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Update Customer Information",
        message: "Customer information updated in the cloud",
      },
    });
  };

  const activateUpdateFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Update Customer Information",
        message: "There was an error updating",
      },
    });
  };

  return (
    <form onSubmit={submitUpdate} autoComplete="new-password">
      <Grid container spacing={1.5}>
        <Grid xs={12} sm={12} md={12} lg={6}>
          <h3>
            Commercial:
            <Checkbox
              name="billingiscommercial"
              color="primary"
              checked={customerValues.billingiscommercial}
              onChange={handleCheckChange("billingiscommercial")}
            />
          </h3>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={6}>
          <h3>
            No Service:
            <Checkbox
              name="noService"
              color="primary"
              checked={customerValues.noService}
              onChange={handleCheckChange("noService")}
            />
          </h3>
        </Grid>
        {customerValues.billingiscommercial ? (
          lastNameError ? (
            <Grid xs={12} sm={12} md={12} lg={12}>
              <TextField
                error
                value={customerValues.lastname}
                label="Organization Name"
                fullWidth
                required
                onChange={handleValueChange("lastname")}
                inputProps={{ tabIndex: "2" }}
                size="small"
              />
            </Grid>
          ) : (
            <Grid xs={12} sm={12} md={12} lg={12}>
              <TextField
                value={customerValues.lastname}
                label="Organization Name"
                required
                fullWidth
                onChange={handleValueChange("lastname")}
                inputProps={{ tabIndex: "2" }}
                size="small"
              />
            </Grid>
          )
        ) : lastNameError ? (
          <>
            <Grid xs={12} sm={12} md={12} lg={6}>
              <TextField
                value={customerValues.firstname}
                label="First Name"
                fullWidth
                autoFocus
                onChange={handleValueChange("firstname")}
                inputProps={{ tabIndex: "1" }}
                size="small"
              />
            </Grid>
            <Grid xs={12} sm={12} md={12} lg={6}>
              <TextField
                error
                value={customerValues.lastname}
                label="Last Name"
                fullWidth
                required
                onChange={handleValueChange("lastname")}
                inputProps={{ tabIndex: "2" }}
                size="small"
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid xs={12} sm={12} md={12} lg={6}>
              <TextField
                value={customerValues.firstname}
                label="First Name"
                fullWidth
                autoFocus
                onChange={handleValueChange("firstname")}
                inputProps={{ tabIndex: "1" }}
                size="small"
              />
            </Grid>
            <Grid xs={12} sm={12} md={12} lg={6}>
              <TextField
                value={customerValues.lastname}
                label="Last Name"
                fullWidth
                required
                onChange={handleValueChange("lastname")}
                inputProps={{ tabIndex: "2" }}
                size="small"
              />
            </Grid>
          </>
        )}
        <Grid xs={12} sm={12} md={12} lg={12}>
          <TextField
            value={customerValues.street}
            label="Street Address"
            fullWidth
            onChange={handleValueChange("street")}
            inputProps={{ tabIndex: "3" }}
            size="small"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            value={customerValues.city}
            label="City"
            fullWidth
            onChange={handleValueChange("city")}
            inputProps={{ tabIndex: "4" }}
            size="small"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            value={customerValues.state}
            label="State"
            fullWidth
            onChange={handleValueChange("state")}
            inputProps={{ tabIndex: "5" }}
            size="small"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            value={customerValues.zip}
            label="Zip"
            fullWidth
            onChange={handleValueChange("zip")}
            inputProps={{ tabIndex: "6" }}
            size="small"
          />
        </Grid>
        <Grid xs={12} mb={2}>
          <Contact
            customerValues={customerValues}
            setCustomerValues={setCustomerValues}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <Button
            variant="outlined"
            type="button"
            color="error"
            startIcon={<DeleteForever />}
            tabIndex={13}
            onClick={() => openDeleteCustomer()}
            fullWidth
          >
            Delete
          </Button>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <Button
            variant="outlined"
            type="submit"
            startIcon={<ArrowUpward />}
            tabIndex={14}
            fullWidth
          >
            Save Changes
          </Button>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <Button
            variant="outlined"
            type="button"
            startIcon={<Close />}
            tabIndex={15}
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

export default EditCustomerDetails;
