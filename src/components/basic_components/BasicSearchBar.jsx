import { IconButton, InputBase, Paper } from "@mui/material";
import { Close } from "@mui/icons-material";
import "../../global_style/style.css";

const BasicSearchBar = ({ value, setValue, searchLabel, clearSearchQuery }) => {
  return (
    <div className="row">
      <div className="doubleRowInput searchBarLabel">{searchLabel}</div>
      <div className="doubleRowinput">
        <div className="buttonBar">
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
        </div>
      </div>
    </div>
  );
};

export default BasicSearchBar;
