import { TextField } from "@mui/material";
import { Clear } from "@mui/icons-material";
import "../../global_style/style.css";

const BasicDisabledSearchBar = ({ value, searchLabel }) => {
  return (
    <div className="row">
      <div className="doubleRowInput searchBarLabel">{searchLabel}</div>
      <div className="doubleRowinput">
        <div className="buttonBar">
          <TextField
            id="catalog-search"
            label="Search"
            variant="outlined"
            size="medium"
            value={value}
            disabled
          />
          <button type="button" className="standardButton" disabled>
            <div
              style={{ padding: "5px", display: "flex", alignItems: "center" }}
            >
              <Clear />
              <span className="iconSeperation">Clear Search</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicDisabledSearchBar;
