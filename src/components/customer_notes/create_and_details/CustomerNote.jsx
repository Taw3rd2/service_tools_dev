import { useContext, useState } from "react";
import { collection } from "firebase/firestore";
import { ToastContext } from "../../../context/toastContext";

import {
  submitNoteToFirestore,
  updateNoteToFirestore,
} from "../customerNoteFunctions";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";
import {
  getFormattedDate,
  getFormattedDateAndTime,
  getFormattedTime,
} from "../../../utilities/dateUtils";
import { ArrowUpward, Close, DeleteForever } from "@mui/icons-material";
import "../../../global_style/style.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const CustomerNote = ({
  customer,
  selectedNote,
  closeModalOne,
  openDeleteCustomerNote,
}) => {
  const { dispatch } = useContext(ToastContext);
  const dispatchers = useSyncedCollection(collection(db, "dispatchers"));
  const types = [
    { name: "Phone", id: 0 },
    { name: "Note", id: 1 },
  ];

  const [customerNoteValues, setCustomerNoteValues] = useState({
    currentTime:
      selectedNote !== undefined
        ? selectedNote.currentTime.toDate()
        : new Date(),
    details: selectedNote !== undefined ? selectedNote.details : "",
    operator: selectedNote !== undefined ? selectedNote.operator : "Thomas",
    type: selectedNote !== undefined ? selectedNote.type : "Note",
  });

  const handleNoteChange = (prop) => (event) => {
    setCustomerNoteValues({
      ...customerNoteValues,
      [prop]: event.target.value,
    });
  };

  const handleSelectDataChange = (prop) => (event) => {
    setCustomerNoteValues({
      ...customerNoteValues,
      [prop]: event.target.value,
    });
  };

  const submitNote = (e) => {
    e.preventDefault();
    if (selectedNote !== undefined) {
      if (
        selectedNote.details === customerNoteValues.details &&
        selectedNote.operator === customerNoteValues.operator &&
        selectedNote.type === customerNoteValues.type
      ) {
        closeModalOne();
      } else {
        const updatedNote = {
          currentTime: new Date(),
          details: customerNoteValues.details,
          operator: customerNoteValues.operator,
          type: customerNoteValues.type,
        };
        updateNoteToFirestore(
          customer,
          selectedNote.id,
          updatedNote,
          activateSuccessNotification,
          activateFailureNotification,
          closeModalOne
        );
      }
    } else {
      submitNoteToFirestore(
        customer,
        customerNoteValues,
        activateSuccessNotification,
        activateFailureNotification,
        closeModalOne
      );
    }
  };

  const activateSuccessNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Customer Note",
        message: "Customer note added in the cloud",
      },
    });
  };

  const activateFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Customer Note",
        message: "There was an error updating",
      },
    });
  };

  return (
    <div className="container" style={{ width: "100%" }}>
      <div
        className="time"
        style={{
          display: "flex",
          justifyContent: "center",
          fontSize: "22px",
        }}
      >
        {selectedNote !== undefined
          ? getFormattedDateAndTime(selectedNote.currentTime)
          : `${getFormattedDate(new Date())} ${getFormattedTime(new Date())}`}
      </div>
      <div
        className="typeAndOperatorRow"
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        {dispatchers.length > 0 && (
          <FormControl fullWidth>
            <InputLabel id="select-operator-label">Dispatcher</InputLabel>
            <Select
              labelId="select-operator-label"
              id="operator-select"
              value={customerNoteValues.operator}
              label="Dispatcher"
              onChange={handleSelectDataChange("operator")}
              inputProps={{ tabIndex: "1" }}
            >
              {dispatchers
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((dispatcher, index) => (
                  <MenuItem key={index} value={dispatcher.name}>
                    {dispatcher.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
        {dispatchers.length > 0 && (
          <FormControl fullWidth>
            <InputLabel id="select-type-label">Note Type</InputLabel>
            <Select
              labelId="select-type-label"
              id="type-select"
              value={customerNoteValues.type}
              label="Note Type"
              onChange={handleSelectDataChange("type")}
              inputProps={{ tabIndex: "2" }}
            >
              {types
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((type, index) => (
                  <MenuItem key={type.id} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
      </div>

      <TextField
        id="customer-note-details"
        label="Notes"
        multiline
        rows={4}
        value={customerNoteValues.details}
        onChange={handleNoteChange("details")}
        sx={{ marginTop: "16px" }}
        fullWidth
      />

      <div className="buttonBar">
        {selectedNote !== undefined && (
          <button
            type="button"
            className="deleteButton"
            onClick={() => openDeleteCustomerNote(selectedNote)}
          >
            <DeleteForever />
            <span className="iconSeperation">Delete</span>
          </button>
        )}
        <button
          type="button"
          className="standardButton"
          onClick={(e) => submitNote(e)}
        >
          <ArrowUpward />
          <span className="iconSeperation">Save Note</span>
        </button>
        <button
          type="button"
          className="standardButton"
          onClick={() => closeModalOne()}
        >
          <Close />
          <span className="iconSeperation">Close</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerNote;
