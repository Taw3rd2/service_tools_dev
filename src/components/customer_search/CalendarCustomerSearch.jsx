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
        id="search-box"
        options={groupedCustomers.sort(
          (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
        )}
        filterOptions={filterOptions}
        disablePortal
        onChange={(event, value) => handleCustomerSelected(value)}
        // groupBy={(customers) => customers.firstLetter}
        isOptionEqualToValue={(option, value) =>
          option.lastname === value.lastname
        }
        getOptionLabel={(option) => option.lastname}
        renderOption={(props, option) => (
          <Grid2 container style={{ fontSize: 18 }} {...props} key={option.id}>
            <Grid2 xs={12}>
              <Typography noWrap>
                {option.lastname} {option.firstname}
              </Typography>
            </Grid2>
            <Grid2 xs={12}>
              <Typography noWrap style={{ color: "red" }}>
                {option.city}
              </Typography>
            </Grid2>
          </Grid2>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Last Names or Business Names"
            variant="outlined"
            autoFocus
          />
        )}
      />
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="outlined"
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
