import { useContext } from "react";
import { doc } from "firebase/firestore";
import { db, deleteDocument } from "../../../firebase/firestore.utils";
import { ToastContext } from "../../../context/toastContext";

import { Close, DeleteForever } from "@mui/icons-material";
import "../../../global_style/style.css";
import { getFormattedExactTime } from "../../../utilities/dateUtils";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const DeleteDayLabel = ({ closeModalThree, selectedDayLabel }) => {
  const { dispatch } = useContext(ToastContext);

  const removeLabel = () => {
    deleteDocument(doc(db, "calLabel", selectedDayLabel.id))
      .then(() => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "SUCCESS",
            title: "Delete Day Label",
            message: "Removed the day label from the cloud",
          },
        });
        closeModalThree();
      })
      .catch((error) => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "ERROR",
            title: "Delete Day Label",
            message: "There was an error removing the label",
          },
        });
        console.log("Firestore error: ", error);
      });
  };
  return (
    <div className="container">
      <Typography variant="h5" color="orange">
        Unrecoverable Delete
      </Typography>
      <ul>
        <li>Will remove the day label from the selected day.</li>
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
            onClick={() => removeLabel()}
            color="error"
          >
            Delete
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            type="button"
            startIcon={<Close />}
            onClick={() => closeModalThree()}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default DeleteDayLabel;
