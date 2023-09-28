import React, { useContext, useState } from "react";
import { ToastContext } from "../../../context/toastContext";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firestore.utils";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { Button, TextField } from "@mui/material";
import { ArrowUpward, Close } from "@mui/icons-material";
import { getFormattedDateAndTime } from "../../../utilities/dateUtils";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const EditSingleField = ({
  customerId,
  equipmentId,
  fieldName,
  fieldKey,
  fieldValue,
  closeEditSingleField,
}) => {
  const { dispatch } = useContext(ToastContext);

  const defaultFieldValue =
    fieldKey === "equipmentInstallDate" ? new Date() : "";

  const [val, setVal] = useState(fieldValue ? fieldValue : defaultFieldValue);

  const handleDateChange = (value) => {
    setVal(value);
  };

  const submitToFirestore = async (event) => {
    event.preventDefault();

    const documentReference = doc(
      db,
      "customers",
      customerId,
      "Equipment",
      equipmentId
    );

    await updateDoc(documentReference, { [fieldKey]: val })
      .then(() => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedDateAndTime(new Date()),
            type: "SUCCESS",
            title: "Field Update",
            message: "The equipment field was updated",
          },
        });
        closeEditSingleField();
      })
      .catch((error) => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedDateAndTime(new Date()),
            type: "ERROR",
            title: "Field Update",
            message: "The equipment field was not updated",
          },
        });
        console.log("Firebase error: ", error);
      });
  };

  return (
    <form
      onSubmit={submitToFirestore}
      autoComplete="new password"
      style={{ padding: "16px" }}
    >
      {fieldKey === "equipmentInstallDate" ? (
        <Grid container spacing={1.5}>
          <Grid xs={12} sm={12} md={12} lg={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={fieldName}
                fullWidth
                value={val}
                onChange={(newValue) => {
                  handleDateChange(newValue);
                }}
                color="primary"
                required
                renderInput={(params) => (
                  <TextField {...params} sx={{ width: "100%" }} />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={6}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<ArrowUpward />}
              fullWidth
            >
              Update
            </Button>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={6}>
            <Button
              type="button"
              variant="contained"
              startIcon={<Close />}
              onClick={() => closeEditSingleField()}
              fullWidth
            >
              Close
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={1.5}>
          <Grid xs={12} sm={12} md={12} lg={12}>
            <TextField
              value={val}
              label={fieldName}
              fullWidth
              required
              multiline
              maxRows={4}
              onChange={(e) => setVal(e.target.value)}
            />
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={6}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<ArrowUpward />}
              fullWidth
            >
              Update
            </Button>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={6}>
            <Button
              type="button"
              variant="contained"
              startIcon={<Close />}
              onClick={() => closeEditSingleField()}
              fullWidth
            >
              Close
            </Button>
          </Grid>
        </Grid>
      )}
    </form>
  );
};

export default EditSingleField;
