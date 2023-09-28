import { useContext } from "react";
import { ToastContext } from "../../../context/toastContext";
import { getFormattedDateAndTime } from "../../../utilities/dateUtils";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Button, Typography } from "@mui/material";
import { Close, DeleteForever } from "@mui/icons-material";
import { deletePartsQuote } from "../partsQuoteFunctions";

const DeletePartsQuote = ({
  closeModalOne,
  customer,
  quote,
  routeToHomepage,
}) => {
  const { dispatch } = useContext(ToastContext);

  const activateDeleteCompletionNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Quote Delete",
        message: "Quote was deleted from the cloud",
      },
    });
  };

  const activateDeleteFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Quote Delete",
        message: "There was an error deleting the quote",
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
            <Typography variant="body1">All Quote Information</Typography>
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
            deletePartsQuote(
              activateDeleteCompletionNotification,
              activateDeleteFailureNotification,
              closeModalOne,
              customer,
              quote,
              routeToHomepage
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
          onClick={() => closeModalOne()}
          fullWidth
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
};

export default DeletePartsQuote;
