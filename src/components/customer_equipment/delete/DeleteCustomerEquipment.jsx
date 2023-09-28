import { useContext } from "react";
import { ToastContext } from "../../../context/toastContext";
import { deleteCustomerEquipment } from "../customerEquipmentFunctions";
import { Close, DeleteForever } from "@mui/icons-material";
import { getFormattedDateAndTime } from "../../../utilities/dateUtils";

import "../../../global_style/style.css";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Button, Typography } from "@mui/material";

const DeleteCustomerEquipment = ({
  customer,
  selectedEquipment,
  closeDetails,
  closeDelete,
}) => {
  const { dispatch } = useContext(ToastContext);

  const activateDeleteCompletionNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Equipment Delete",
        message: "Equipment was deleted from the cloud",
      },
    });
  };

  const activateDeleteFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Equipment Delete",
        message: "There was an error deleting the equipment",
      },
    });
  };

  return (
    <Grid container spacing={1.5}>
      <Grid xs={12} sm={12} md={12} lg={12}>
        <Typography variant="h5" color="orange">
          Unrecoverable Delete
        </Typography>
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={12}>
        <ul>
          <li>
            <Typography variant="body1">All Equipment Information</Typography>
          </li>
          <li>
            <Typography variant="body1">All Warranty Information</Typography>
          </li>
          <li>
            <Typography variant="body1">All Equipment Pictures</Typography>
          </li>
        </ul>
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={6}>
        <Button
          variant="contained"
          type="button"
          color="error"
          startIcon={<DeleteForever />}
          onClick={() =>
            deleteCustomerEquipment(
              customer,
              selectedEquipment,
              activateDeleteCompletionNotification,
              activateDeleteFailureNotification,
              closeDetails,
              closeDelete
            )
          }
          fullWidth
        >
          Confirm
        </Button>
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={6}>
        <Button
          variant="contained"
          type="button"
          startIcon={<Close />}
          onClick={() => closeDelete()}
          fullWidth
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
};

export default DeleteCustomerEquipment;
