import { useContext } from "react";
import { ToastContext } from "../../../context/toastContext";

import { Close, DeleteForever } from "@mui/icons-material";

import { deleteWarranty } from "../warrantyFunctions";
import { getFormattedDateAndTime } from "../../../utilities/dateUtils";

import "../../../global_style/style.css";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const DeleteWarrantyContent = ({
  customer,
  selectedWarranty,
  closeDetails,
  closeDelete,
}) => {
  const { dispatch } = useContext(ToastContext);

  const activateSuccessNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Delete Warranty",
        message: "Removed warranty from the cloud",
      },
    });
  };

  const activateFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Delete Warranty",
        message: "There was an error removing",
      },
    });
  };
  return (
    <div className="container">
      <Typography variant="h5" color="orange">
        Unrecoverable Delete
      </Typography>
      <ul>
        <li>All Warranty information for this unit</li>
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
            color="error"
            onClick={() =>
              deleteWarranty(
                customer,
                selectedWarranty,
                activateSuccessNotification,
                activateFailureNotification,
                closeDetails,
                closeDelete
              )
            }
          >
            Confirm Delete
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            type="button"
            startIcon={<Close />}
            onClick={() => closeDelete()}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default DeleteWarrantyContent;
