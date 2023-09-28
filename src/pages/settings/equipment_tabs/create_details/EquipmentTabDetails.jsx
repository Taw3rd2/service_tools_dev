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

const EquipmentTabDetails = ({ equipmentTab, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);
  const [name, setName] = useState(
    equipmentTab !== undefined ? equipmentTab.name : ""
  );

  const submitEquipmentTab = (event) => {
    event.preventDefault();
    if (equipmentTab !== undefined) {
      if (equipmentTab.name === name) {
        closeModalOne();
      } else {
        //update the inventory tab
        updateDocument(doc(db, "equipmentTabs", equipmentTab.id), { name })
          .then(() => {
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "SUCCESS",
                title: "Update Equipment Tab",
                message: "Updated equipment tab in the cloud",
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
                title: "Update Equipment Tab",
                message: "There was a error updating",
              },
            });
            console.log("Firebase error: ", error);
            closeModalOne();
          });
      }
    } else {
      //create a new equipment tab
      createUnNamedDocument(collection(db, "equipmentTabs"), { name })
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Create Equipment tab",
              message: "Created a new equipment tab in the cloud",
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
              title: "Create Equipment tab",
              message: "There was an error creating",
            },
          });
          console.log("Firebase error: ", error);
          closeModalOne();
        });
    }
  };

  return (
    <form onSubmit={submitEquipmentTab} autoComplete="new password">
      <div className="row">
        <div className="singleRowInput">
          <TextField
            label="Equipment Type"
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
            startIcon={equipmentTab !== undefined ? <ArrowUpward /> : <Add />}
          >
            {equipmentTab !== undefined ? "Update" : "Add"}
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

export default EquipmentTabDetails;
