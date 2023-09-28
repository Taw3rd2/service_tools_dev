import { useContext } from "react";
import { ToastContext } from "../../../../context/toastContext";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

import { doc } from "firebase/firestore";
import { db, deleteDocument } from "../../../../firebase/firestore.utils";

import { Close, DeleteForever } from "@mui/icons-material";
import "../../../../global_style/style.css";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const DeleteEquipment = ({ equipmentToDelete, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const removeEquipment = async () => {
    if (equipmentToDelete.id) {
      deleteDocument(doc(db, "equipment", equipmentToDelete.id))
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Delete Equipment",
              message: `${equipmentToDelete.model} removed from the cloud`,
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
              title: "Delete Equipment",
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
          This includes <strong>Model: {equipmentToDelete.model}</strong>
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
            onClick={() => removeEquipment()}
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

export default DeleteEquipment;
