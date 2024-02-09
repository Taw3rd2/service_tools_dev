import { useState } from "react";
//import CustomerExport from "../export_to_excel/CustomerExport";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import CustomerAutocomplete from "./CustomerAutocomplete.component";
import EventAutocomplete from "./EventAutocomplete";

import "../../global_style/style.css";
import { AddCircleOutline, BuildCircleOutlined } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { db, useSyncedCollection } from "../../firebase/firestore.utils";
import { collection } from "firebase/firestore";

const CustomerSearch = ({
  handleCustomerSelected,
  handleEventSelected,
  openCreateCustomer,
  openMaintenanceList,
}) => {
  const customers = useSyncedCollection(collection(db, "customers"));
  const events = useSyncedCollection(collection(db, "events"));

  const [selectedSearchParameter, setSelectedSearchParameter] =
    useState("lastname");
  const handleSearchParameterChange = (event) => {
    setSelectedSearchParameter(event.target.value);
  };

  return (
    <Grid container spacing={1.5}>
      <Grid xs={12} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4">
          Search {customers.length} Customers
        </Typography>
      </Grid>
      <Grid
        xs={12}
        sm={12}
        md={12}
        lg={6}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <FormControl>
          <RadioGroup
            row
            defaultValue="lastname"
            aria-labelledby="customer_search_parameters_radio_group"
            name="customer_search_radio_buttons_group"
            ß
            onChange={handleSearchParameterChange}
            color="primary"
          >
            <FormControlLabel
              value="lastname"
              control={<Radio color="primary" />}
              label="Last Name"
            />
            <FormControlLabel
              value="street"
              control={<Radio color="primary" />}
              label="Street"
            />
            <FormControlLabel
              value="city"
              control={<Radio color="primary" />}
              label="City"
            />
          </RadioGroup>
        </FormControl>
        <CustomerAutocomplete
          customers={customers}
          selectedSearchParameter={selectedSearchParameter}
          handleCustomerSelected={handleCustomerSelected}
        />
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={6}>
        <Button
          variant="outlined"
          startIcon={<AddCircleOutline />}
          onClick={() => openCreateCustomer()}
          fullWidth
          sx={{ marginTop: "42px" }}
        >
          Add New Customer
        </Button>
        <Button
          variant="outlined"
          startIcon={<BuildCircleOutlined />}
          onClick={() => openMaintenanceList()}
          fullWidth
          sx={{ marginTop: "8px" }}
        >
          Maintenance Customer List
        </Button>
      </Grid>
      <Grid
        xs={12}
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={5}
      >
        <Typography variant="h4">Search {events.length} Jobs</Typography>
      </Grid>
      <Grid xs={6}>
        <EventAutocomplete
          events={events}
          handleEventSelected={handleEventSelected}
        />
      </Grid>
      <Grid xs={6} />
    </Grid>
  );
};

export default CustomerSearch;
