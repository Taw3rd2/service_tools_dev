import { IconButton, InputBase, Paper, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import "../../global_style/style.css";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const BasicSearchBar = ({ value, setValue, searchLabel, clearSearchQuery }) => {
  return (
    <Grid container spacing={1.5} sx={{ marginBottom: "6px" }}>
      <Grid>
        <Typography variant="h5">{searchLabel}</Typography>
      </Grid>
      <Grid sx={{ marginLeft: "auto" }}>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            inputProps={{ "aria-label": "search" }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="clear"
            onClick={() => clearSearchQuery()}
          >
            <Close />
          </IconButton>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default BasicSearchBar;
