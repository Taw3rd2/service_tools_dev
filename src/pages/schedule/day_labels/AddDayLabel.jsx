import { useContext, useState } from "react";
import { collection } from "firebase/firestore";
import {
  db,
  createUnNamedDocument,
  useSyncedCollection,
} from "../../../firebase/firestore.utils";
import { ToastContext } from "../../../context/toastContext";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import "../../../global_style/style.css";
import { ArrowUpward, Close } from "@mui/icons-material";
import { getFormattedExactTime } from "../../../utilities/dateUtils";

const AddDayLabel = ({ closeModalThree, calendarDateSelected }) => {
  const technicians = useSyncedCollection(collection(db, "technicians"));
  const { dispatch } = useContext(ToastContext);

  const [label, setLabelData] = useState({
    labelDate: calendarDateSelected,
    locationName: "",
    tech: "Thomas Waldorf",
  });

  const handleLabelDataChange = (prop) => (event) => {
    setLabelData({ ...label, [prop]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    createUnNamedDocument(collection(db, "calLabel"), label)
      .then(() => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "SUCCESS",
            title: "Day Label",
            message: "Day label added to the cloud",
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
            title: "Day Label",
            message: "Error submitting label information",
          },
        });
        console.log("Firebase error: ", error);
      });
  };

  return (
    <form onSubmit={onSubmit} autoComplete="new-password">
      <div className="row">
        <div className="doubleRowInput">
          {technicians.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="select-tech-lead">Tech Lead</InputLabel>
              <Select
                labelId="select-tech-lead"
                id="tech-lead"
                value={label.tech}
                label="Tech Lead"
                onChange={handleLabelDataChange("tech")}
                inputProps={{ tabIndex: "1" }}
              >
                {technicians
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((technician) => (
                    <MenuItem key={technician.id} value={technician.name}>
                      {technician.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        </div>
        <div className="doubleRowInput">
          <TextField
            label="Location Name"
            required
            fullWidth
            value={label.locationName}
            onChange={handleLabelDataChange("locationName")}
            inputProps={{ tabIndex: "2" }}
          />
        </div>
      </div>
      <div className="buttonBar">
        <button type="submit" className="standardButton">
          <ArrowUpward />
          <span className="iconSeperation">Add Label</span>
        </button>
        <button
          type="button"
          className="standardButton"
          onClick={() => closeModalThree()}
        >
          <Close />
          <span className="iconSeperation">Close</span>
        </button>
      </div>
    </form>
  );
};

export default AddDayLabel;
