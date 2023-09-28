import { Button, TextField, Typography } from "@mui/material";
import { Clear } from "@mui/icons-material";
import "../../global_style/style.css";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const BasicDisabledSearchBar = ({ value, searchLabel }) => {
  return (
    <Grid container spacing={1.5} sx={{ marginBottom: "6px" }}>
      <Grid>
        <Typography variant="h5">{searchLabel}</Typography>
      </Grid>
      <Grid sx={{ marginLeft: "auto" }}>
        <TextField
          id="catalog-search"
          label="Search"
          variant="outlined"
          value={value}
          size="small"
          disabled
        />
      </Grid>
      <Grid>
        <Button
          variant="contained"
          type="button"
          startIcon={<Clear />}
          size="medium"
          disabled
          sx={{ margin: "2px" }}
        >
          Clear Search
        </Button>
      </Grid>
    </Grid>
  );
};

export default BasicDisabledSearchBar;
