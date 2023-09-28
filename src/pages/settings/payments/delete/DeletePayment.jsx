import { Close, DeleteForever } from "@mui/icons-material";
import { doc } from "firebase/firestore";
import { useContext } from "react";
import { ToastContext } from "../../../../context/toastContext";
import { db, deleteDocument } from "../../../../firebase/firestore.utils";
import "../../../../global_style/style.css";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Button, Typography } from "@mui/material";

const DeletePayment = ({ payment, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const removePayment = async () => {
    if (payment.id) {
      deleteDocument(doc(db, "payments", payment.id))
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Delete Payment",
              message: `${payment.item} removed from the cloud`,
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
              title: "Delete Payment",
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
          This includes <strong>{payment.item}</strong>
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
            onClick={() => removePayment()}
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

export default DeletePayment;
