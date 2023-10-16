import { ArrowUpward, Close } from "@mui/icons-material";
import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { getUnixTime } from "date-fns";

const AddDispatchLog = ({ closeModalTwo, disp, handleDispatchLogChange }) => {
  const currentAuth = getAuth();
  const [logText, setLogText] = useState("");
  const [errorActive, setErrorActive] = useState(false);

  const submitDispatchText = (e) => {
    e.preventDefault();
    if (logText) {
      setErrorActive(false);
      const log = {
        activity: logText,
        activityTime: new Date(),
        name: currentAuth.currentUser.displayName,
        sortingDate: getUnixTime(new Date()),
      };
      const newLogArray = disp.extendedProps.dispatchLog?.length
        ? disp.extendedProps.dispatchLog
        : [];
      newLogArray.push(log);
      handleDispatchLogChange(newLogArray);
      closeModalTwo();
    } else {
      setErrorActive(true);
    }
  };

  return (
    <form
      autoComplete="new password"
      onSubmit={submitDispatchText}
      style={{ margin: "6px" }}
    >
      <TextField
        id="add-dispatch-text"
        label="New Log"
        multiline
        rows={3}
        value={logText}
        onChange={(event) => {
          setLogText(event.target.value);
        }}
      />
      <div style={{ display: "flex" }}>
        <Button
          variant="contained"
          type="submit"
          startIcon={<ArrowUpward />}
          fullWidth
          sx={{ marginTop: "4px", marginRight: "2px" }}
        >
          Add
        </Button>
        <Button
          variant="contained"
          type="button"
          startIcon={<Close />}
          onClick={() => closeModalTwo()}
          fullWidth
          sx={{ marginTop: "4px" }}
        >
          Close
        </Button>
      </div>
      {errorActive && (
        <Typography variant="caption">Should we just log nothing?</Typography>
      )}
    </form>
  );
};

export default AddDispatchLog;
