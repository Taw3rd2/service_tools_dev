import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";

const CustomerAutocomplete = ({
  customers,
  selectedSearchParameter,
  handleCustomerSelected,
}) => {
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

  return (
    <>
      {selectedSearchParameter === "lastname" && (
        <Autocomplete
          fullWidth
          id="search-box"
          options={groupedCustomers.sort(
            (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
          )}
          filterOptions={filterOptions}
          onChange={(event, value) => handleCustomerSelected(value)}
          // groupBy={(customers) => customers.firstLetter}
          isOptionEqualToValue={(option, value) =>
            option.lastname === value.lastname
          }
          getOptionLabel={(option) => option.lastname}
          renderOption={(props, option) => (
            <Grid2
              container
              style={{ fontSize: 18, margin: "8px" }}
              {...props}
              key={option.id}
            >
              <Grid2 xs={12}>
                <Typography variant="body1" noWrap>
                  {option.lastname} {option.firstname}
                </Typography>
              </Grid2>
              <Grid2 xs={12}>
                <Typography variant="subtitle1" noWrap>
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
      )}
      {selectedSearchParameter === "street" && (
        <Autocomplete
          fullWidth
          id="search-box"
          options={groupedCustomers.sort(
            (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
          )}
          filterOptions={filterOptions}
          onChange={(event, value) => handleCustomerSelected(value)}
          // groupBy={(customers) => customers.firstLetter}
          isOptionEqualToValue={(option, value) =>
            option.lastname === value.lastname
          }
          getOptionLabel={(option) => option.street}
          renderOption={(props, option) => (
            <Grid2
              container
              style={{ fontSize: 18 }}
              {...props}
              key={option.id}
            >
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
              label="Search by the Street Address"
              variant="outlined"
              autoFocus
            />
          )}
        />
      )}
      {selectedSearchParameter === "city" && (
        <Autocomplete
          fullWidth
          id="search-box"
          options={groupedCustomers.sort(
            (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
          )}
          filterOptions={filterOptions}
          onChange={(event, value) => handleCustomerSelected(value)}
          // groupBy={(customers) => customers.firstLetter}
          isOptionEqualToValue={(option, value) =>
            option.lastname === value.lastname
          }
          getOptionLabel={(option) => option.city}
          renderOption={(props, option) => (
            <Grid2
              container
              style={{ fontSize: 18 }}
              {...props}
              key={option.id}
            >
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
              label="Search by City's"
              variant="outlined"
              autoFocus
            />
          )}
        />
      )}
    </>
  );
};

export default CustomerAutocomplete;
