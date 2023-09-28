import { useContext } from "react";
import { ToastContext } from "../../../context/toastContext";
import { deleteCustomer } from "../customerInformationFunctions";
import { Close, DeleteForever } from "@mui/icons-material";
import "../../../global_style/style.css";
import { getFormattedDateAndTime } from "../../../utilities/dateUtils";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Button, Typography } from "@mui/material";

const DeleteCustomer = ({
  customer,
  handleCustomerSelected,
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
        title: "Delete Customer",
        message: "Customer was removed from the cloud",
      },
    });
  };

  const activateDeleteFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Delete Customer",
        message: "There was an error deleting the customer",
      },
    });
  };

  return (
    <Grid container spacing={1.5}>
      <Grid xs={12}>
        <Typography variant="h5" color="orange">
          Unrecoverable Delete
        </Typography>
      </Grid>
      <Grid xs={12}>
        <ul>
          <li>All customer information</li>
          <li>All customer equipment</li>
          <li>All customer warranty information</li>
          <li>All customer maintenance information</li>
          <li>All customer equipment pictures</li>
        </ul>
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={6}>
        {customer !== undefined && (
          <Button
            variant="contained"
            type="button"
            color="error"
            startIcon={<DeleteForever />}
            fullWidth
            onClick={() =>
              deleteCustomer(
                customer,
                handleCustomerSelected,
                activateDeleteCompletionNotification,
                activateDeleteFailureNotification,
                closeDetails,
                closeDelete
              )
            }
          >
            Confirm Delete
          </Button>
        )}
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={6}>
        <Button
          variant="contained"
          type="button"
          startIcon={<Close />}
          fullWidth
          onClick={() => closeDelete()}
        >
          Close
        </Button>
      </Grid>
    </Grid>
  );
};

export default DeleteCustomer;
