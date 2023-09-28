import { db, useSyncedCollection } from "../../firebase/firestore.utils";

import { Autocomplete, Button, TextField, Typography } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Close } from "@mui/icons-material";
import { collection } from "firebase/firestore";

const CalendarCustomerSearch = ({
  openCreateDispatch,
  date,
  closeModalOne,
}) => {
  const customers = useSyncedCollection(collection(db, "customers"));

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });

  const groupedCustomers = customers.map((customer) => {
    //here
    const firstLetter = customer.lastname[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...customer,
    };
  });

  const handleCustomerSelected = (value) => {
    console.log("handleCustomerSelected: ", value);
    if (value !== null) {
      openCreateDispatch(value, date);
    }
  };

  return (
    <>
      <Autocomplete
        clearOnEscape
        disablePortal
        filterOptions={filterOptions}
        getOptionLabel={(option) => option.lastname}
        id="search-box"
        isOptionEqualToValue={(option, value) =>
          option.lastname === value.lastname
        }
        options={groupedCustomers.sort(
          (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
        )}
        onChange={(event, value) => handleCustomerSelected(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Last Names or Business Names"
            variant="outlined"
            autoFocus
          />
        )}
        renderOption={(props, option) => (
          <Grid2 container style={{ fontSize: 18 }} {...props} key={option.id}>
            <Grid2 xs={12}>
              <Typography noWrap>
                {option.lastname} {option.firstname}
              </Typography>
            </Grid2>
            <Grid2 xs={12}>
              <Typography noWrap style={{ color: "orange" }}>
                {option.city}
              </Typography>
            </Grid2>
          </Grid2>
        )}
        style={{ marginTop: "8px", minWidth: "400px", minHeight: "425px" }}
      />
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="contained"
          startIcon={<Close />}
          onClick={() => closeModalOne()}
          sx={{ marginTop: "8px" }}
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default CalendarCustomerSearch;
