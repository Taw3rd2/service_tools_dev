import { useContext, useState } from "react";
import { db, updateDocument } from "../../../firebase/firestore.utils";
import { doc } from "firebase/firestore";
import { ToastContext } from "../../../context/toastContext";

import { ChromePicker } from "react-color";

import { useTheme } from "@mui/material/styles";
import { ArrowUpward, Brightness4, Brightness7 } from "@mui/icons-material";
import { Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { getFormattedExactTime } from "../../../utilities/dateUtils";

import "../../../global_style/style.css";

const SetTheme = () => {
  const { dispatch } = useContext(ToastContext);
  const theme = useTheme();

  const [themeValues, setThemeValues] = useState({
    themeColor: theme.palette.primary.main,
    themeMode: theme.palette.mode,
  });

  console.log("themeValues", themeValues);

  const handleThemeChange = (prop, data) => {
    setThemeValues({ ...themeValues, [prop]: data });
  };

  const saveTheme = () => {
    const newThemeValues = {
      color: themeValues.themeColor,
      mode: themeValues.themeMode,
    };
    console.log("newThemeValues: ", newThemeValues);
    updateDocument(doc(db, "theme", "BZ2zpDOt130MnEM9STLL"), newThemeValues)
      .then(() => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "SUCCESS",
            title: "Update Theme",
            message: "Theme saved to the cloud",
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "ERROR",
            title: "Update Theme",
            message: "There was an issue updating",
          },
        });
        console.log("Firebase error: ", error);
      });
  };

  return (
    <div className="sizeRegular">
      <Grid
        container
        spacing={1.5}
        sx={{ marginTop: "6px", display: "flex", justifyContent: "center" }}
      >
        <Grid>
          <ChromePicker
            color={themeValues.themeColor}
            onChangeComplete={(color) => {
              handleThemeChange("themeColor", color.hex);
            }}
            disableAlpha={true}
          />
        </Grid>
        <Grid>
          <Button
            variant="contained"
            type="button"
            startIcon={
              themeValues.themeMode === "dark" ? (
                <Brightness4 />
              ) : (
                <Brightness7 />
              )
            }
            onClick={() =>
              handleThemeChange(
                "themeMode",
                themeValues.themeMode === "dark" ? "light" : "dark"
              )
            }
            sx={{
              backgroundColor: themeValues.themeColor,
              color: themeValues.themeMode === "dark" ? "black" : "white",
            }}
          >
            {themeValues.themeMode === "dark"
              ? "Toggle Light Mode"
              : "Toggle Dark Mode"}
          </Button>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={1.5}
        sx={{ display: "flex", justifyContent: "end" }}
      >
        <Grid>
          <Button
            variant="contained"
            type="button"
            startIcon={<ArrowUpward />}
            onClick={() => saveTheme()}
          >
            Save Theme
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SetTheme;
