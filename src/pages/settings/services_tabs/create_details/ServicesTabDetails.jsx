import { useContext, useState } from "react";
import { collection, doc } from "firebase/firestore";
import {
  db,
  createUnNamedDocument,
  updateDocument,
} from "../../../../firebase/firestore.utils";
import { ToastContext } from "../../../../context/toastContext";

import { Button, TextField } from "@mui/material";
import "../../../../global_style/style.css";
import { Add, ArrowUpward, Close } from "@mui/icons-material";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const ServicesTabDetails = ({ servicesTab, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);
  const [name, setName] = useState(
    servicesTab !== undefined ? servicesTab.name : ""
  );

  const submitServicesTab = (event) => {
    event.preventDefault();
    if (servicesTab !== undefined) {
      if (servicesTab.name === name) {
        closeModalOne();
      } else {
        //update the inventory tab
        updateDocument(doc(db, "servicesTabs", servicesTab.id), { name })
          .then(() => {
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "SUCCESS",
                title: "Update Services Tab",
                message: "Updated services tab in the cloud",
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
                title: "Update Services Tab",
                message: "There was a error updating",
              },
            });
            console.log("Firebase error: ", error);
            closeModalOne();
          });
      }
    } else {
      //create a new inventory tab
      createUnNamedDocument(collection(db, "servicesTabs"), { name })
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Create Services Tab",
              message: "Created a new services tab in the cloud",
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
              title: "Create Services Tab",
              message: "There was an error creating",
            },
          });
          console.log("Firebase error: ", error);
          closeModalOne();
        });
    }
  };

  return (
    <form onSubmit={submitServicesTab} autoComplete="new password">
      <div className="row">
        <div className="singleRowInput">
          <TextField
            label="Tab Name"
            value={name}
            fullWidth
            color="primary"
            sx={{ marginTop: "16px" }}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
      </div>
      <Grid
        container
        spacing={1.5}
        sx={{ display: "flex", justifyContent: "end" }}
      >
        <Grid>
          <Button
            variant="contained"
            type="submit"
            startIcon={servicesTab !== undefined ? <ArrowUpward /> : <Add />}
          >
            {servicesTab !== undefined ? "Update" : "Add"}
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            type="button"
            startIcon={<Close />}
            onClick={() => closeModalOne()}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ServicesTabDetails;
