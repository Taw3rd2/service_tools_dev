import { useContext, useState } from "react";
import { collection } from "firebase/firestore";
import { db } from "../../../../firebase/firestore.utils";

import { ArrowUpward, Close } from "@mui/icons-material";
import { Button, TextField, Typography } from "@mui/material";
import { ToastContext } from "../../../../context/toastContext";
import { createUnNamedDocument } from "../../../../firebase/firestore.utils";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const CreateCategory = ({ tab, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const [name, setName] = useState("");

  const submitCategory = (e) => {
    e.preventDefault();
    const newCategory = {
      equipmentTab: tab.name,
      name: name,
    };
    createUnNamedDocument(collection(db, "equipmentSubCategories"), newCategory)
      .then(() => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "SUCCESS",
            title: "Create Category",
            message: "Created a category in the cloud",
          },
        });
        closeModalOne();
      })
      .catch((error) => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "ERROR",
            title: "Create Category",
            message: "There was an error creating",
          },
        });
        console.log("Firebase error: ", error);
      });
  };

  return (
    <div>
      <form onSubmit={submitCategory} autoComplete="new password">
        <Grid container spacing={1.5}>
          <Grid xs={12}>
            <TextField
              label="Category"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid xs={12}>
            <Typography variant="body1">
              Format: Brand Name, Efficiency, Features
            </Typography>
          </Grid>
          <Grid sx={{ marginLeft: "auto" }}>
            <Button
              variant="contained"
              type="submit"
              startIcon={<ArrowUpward />}
              sx={{ margin: "6px" }}
            >
              Submit
            </Button>

            <Button
              variant="contained"
              type="button"
              startIcon={<Close />}
              onClick={() => closeModalOne()}
              sx={{ margin: "6px" }}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CreateCategory;
