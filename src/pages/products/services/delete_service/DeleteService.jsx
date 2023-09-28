import { useContext } from "react";
import { doc } from "firebase/firestore";
import { db, deleteDocument } from "../../../../firebase/firestore.utils";

import { ToastContext } from "../../../../context/toastContext";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

import { Close, DeleteForever } from "@mui/icons-material";
import "../../../../global_style/style.css";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const DeleteService = ({ serviceToDelete, closeModalOne, closeModalTwo }) => {
  const { dispatch } = useContext(ToastContext);

  const removeService = async () => {
    if (serviceToDelete.id) {
      deleteDocument(doc(db, "services", serviceToDelete.id))
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Delete Service",
              message: `${serviceToDelete.partnumber} removed from the cloud`,
            },
          });
          closeModalTwo();
          closeModalOne();
        })
        .catch((error) => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "ERROR",
              title: "Delete Service",
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
          This includes <strong>{serviceToDelete.partNumber}</strong>
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
            onClick={() => removeService()}
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
            onClick={() => closeModalTwo()}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default DeleteService;
