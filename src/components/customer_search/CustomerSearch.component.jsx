import { useState } from "react";
//import CustomerExport from "../export_to_excel/CustomerExport";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import CustomerAutocomplete from "./CustomerAutocomplete.component";

import "../../global_style/style.css";
import { AddCircleOutline, BuildCircleOutlined } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { db, useSyncedCollection } from "../../firebase/firestore.utils";
import { collection } from "firebase/firestore";

const CustomerSearch = ({
  handleCustomerSelected,
  openCreateCustomer,
  openMaintenanceList,
}) => {
  const customers = useSyncedCollection(collection(db, "customers"));

  const [selectedSearchParameter, setSelectedSearchParameter] =
    useState("lastname");
  const handleSearchParameterChange = (event) => {
    setSelectedSearchParameter(event.target.value);
  };

  return (
    <Grid container spacing={1.5}>
      <Grid xs={12} display="flex" flexDirection="column" alignItems="center">
        <div className="searchCustomers">
          Search {customers.length} Customers
        </div>
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
    </Grid>
  );
};

export default CustomerSearch;
