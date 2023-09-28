import { useContext } from "react";
import { doc } from "firebase/firestore";
import { db, deleteDocument } from "../../../../firebase/firestore.utils";
import { ToastContext } from "../../../../context/toastContext";

import { Close, DeleteForever } from "@mui/icons-material";
import "../../../../global_style/style.css";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const DeleteInventoryTab = ({ inventoryTab, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const removeInventoryTab = async () => {
    if (inventoryTab.id) {
      deleteDocument(doc(db, "tabs", inventoryTab.id))
        .then(() => {
          dispatch({
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Delete Inventory Tab",
              message: `${inventoryTab.name} removed from the cloud`,
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
              title: "Delete Inventory Tab",
              message: "There was an error deleting",
            },
          });
          console.log("Firebase error: ", error);
        });
    }
  };

  return (
    <div className="container">
      <Typography variant="h5" color="orange">
        Unrecoverable Delete!
      </Typography>
      <ul>
        <li>
          This includes <strong>{inventoryTab.name}</strong>
        </li>
      </ul>
      <Grid
        container
        spacing={1.5}
        sx={{ display: "flex", justifyContent: "end" }}
      >
        <Grid>
          <Button
            variant="contained"
            type="button"
            startIcon={<DeleteForever />}
            onClick={() => removeInventoryTab()}
            color="error"
          >
            Confirm Delete
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
    </div>
  );
};

export default DeleteInventoryTab;
