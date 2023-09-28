import { useContext, useState } from "react";
import { ToastContext } from "../../../context/toastContext";
import { addCustomerToFirestore } from "../customerInformationFunctions";
import { getFormattedDateAndTime } from "../../../utilities/dateUtils";

import Contact from "../details/Contact";

import { Button, Checkbox, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Close, PersonAdd } from "@mui/icons-material";

import "../../../global_style/style.css";

const CreateCustomerCard = ({ closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const [customerValues, setCustomerValues] = useState({
    altphone: "",
    altPhoneName: "",
    billingAlternateEmail: null,
    billingAlternateName: null,
    billingAlternatePhone: null,
    billingorg: null,
    billingOtherEmail: null,
    billingOtherName: null,
    billingOtherPhone: null,
    billingPrimaryEmail: null,
    billingPrimaryPhone: null,
    billingPrimaryName: null,
    billingiscommercial: false,
    billingstreet: null,
    billingcity: null,
    billingstate: null,
    billingzip: null,
    city: "",
    cnotes: "",
    contacts: [
      { contactName: "", contactPhone: "", contactEmail: "", contactNotes: "" },
    ],
    commercialContacts: [
      { contactName: "", contactPhone: "", contactEmail: "", contactNotes: "" },
    ],
    email: "",
    firstname: "",
    lastname: "",
    otherPhone: "",
    otherPhoneName: "",
    phone: "",
    phoneName: "",
    squarefootage: "",
    state: "MI",
    street: "",
    zip: "",
  });

  const handleCustomerChange = (prop) => (event) => {
    setCustomerValues({ ...customerValues, [prop]: event.target.value });
  };

  const handleCommercialChange = (name) => (event) => {
    setCustomerValues({
      ...customerValues,
      [name]: event.target.checked,
    });
  };

  const submitCustomer = (event) => {
    event.preventDefault();
    console.log("Customer Values", customerValues);
    addCustomerToFirestore(
      customerValues,
      activateCreateCompletionNotification,
      activateCreateFailureNotification,
      closeModalOne
    );
  };

  const activateCreateCompletionNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Create Customer",
        message: "Customer has been added to the cloud",
      },
    });
  };

  const activateCreateFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Create Customer",
        message: "There was an error adding the customer",
      },
    });
  };

  return (
    <form onSubmit={submitCustomer} autoComplete="new-password">
      <Grid container>
        <Grid xs={12}>
          <h3>
            Commercial:
            <Checkbox
              name="billingiscommercial"
              color="primary"
              checked={customerValues.billingiscommercial}
              onChange={handleCommercialChange("billingiscommercial")}
              style={{ marginBottom: "4px" }}
            />
          </h3>
        </Grid>
      </Grid>

      {customerValues.billingiscommercial ? (
        <Grid container spacing={1}>
          <Grid xs={12}>
            <TextField
              label="Job Site Business Name or Tennant's Name"
              name="lastname"
              value={customerValues.lastname}
              onChange={handleCustomerChange("lastname")}
              inputProps={{ tabIndex: "1" }}
              autoFocus
              size="small"
              fullWidth
              required
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              label="Job Site Street Address"
              name="street"
              value={customerValues.street}
              onChange={handleCustomerChange("street")}
              inputProps={{ tabIndex: "2" }}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              label="Job Site City"
              name="city"
              value={customerValues.city}
              onChange={handleCustomerChange("city")}
              inputProps={{ tabIndex: "3" }}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              label="Job Site State"
              name="state"
              value={customerValues.state}
              onChange={handleCustomerChange("state")}
              inputProps={{ tabIndex: "4" }}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              label="Job Site Zip Code"
              name="zip"
              value={customerValues.zip}
              onChange={handleCustomerChange("zip")}
              inputProps={{ tabIndex: "5" }}
              size="small"
              fullWidth
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={1}>
          <Grid xs={12} md={6}>
            <TextField
              label="First Name"
              name="firstname"
              value={customerValues.firstname}
              onChange={handleCustomerChange("firstname")}
              inputProps={{ tabIndex: "1" }}
              autoFocus
              size="small"
              fullWidth
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              label="Last Name"
              name="lastname"
              value={customerValues.lastname}
              onChange={handleCustomerChange("lastname")}
              inputProps={{ tabIndex: "2" }}
              size="small"
              fullWidth
              required
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              label="Street Address"
              name="street"
              value={customerValues.street}
              onChange={handleCustomerChange("street")}
              inputProps={{ tabIndex: "3" }}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              label="City"
              name="city"
              value={customerValues.city}
              onChange={handleCustomerChange("city")}
              inputProps={{ tabIndex: "4" }}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              label="State"
              name="state"
              value={customerValues.state}
              onChange={handleCustomerChange("state")}
              inputProps={{ tabIndex: "5" }}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              label="Zip Code"
              name="zip"
              value={customerValues.zip}
              onChange={handleCustomerChange("zip")}
              inputProps={{ tabIndex: "6" }}
              size="small"
              fullWidth
            />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={1}>
        <Grid xs={12} direction="row">
          <Contact
            customerValues={customerValues}
            setCustomerValues={setCustomerValues}
          />
        </Grid>
        <Grid
          xs={12}
          container
          spacing={1}
          justifyContent="flex-end"
          alignItems="center"
          flexDirection="row"
        >
          <Grid>
            <Button
              size="large"
              variant="contained"
              startIcon={<PersonAdd />}
              type="submit"
              tabIndex={14}
            >
              Add New Customer
            </Button>
          </Grid>
          <Grid>
            <Button
              size="large"
              variant="contained"
              startIcon={<Close />}
              type="button"
              onClick={() => closeModalOne()}
              tabIndex={15}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateCustomerCard;
