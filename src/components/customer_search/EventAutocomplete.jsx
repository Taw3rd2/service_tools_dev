import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";

const EventAutocomplete = ({ events, handleEventSelected }) => {
  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 50,
  });

  const groupedEvents = events.map((event) => {
    const firstLetter = event.lastname[0].toUpperCase();

    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...event,
    };
  });

  return (
    <>
      <Autocomplete
        fullWidth
        id="job-search-box"
        options={groupedEvents.sort(
          (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
        )}
        filterOptions={filterOptions}
        onChange={(event, value) => handleEventSelected(value)}
        isOptionEqualToValue={(option, value) =>
          option.jobNumber === value.jobNumber
        }
        getOptionLabel={(option) => option.jobNumber}
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
            label="Search Job Numbers/POs"
            variant="outlined"
            autoFocus
          />
        )}
      />
    </>
  );
};

export default EventAutocomplete;
