import { useContext, useState } from "react";
import { collection, doc } from "firebase/firestore";
import {
  db,
  updateDocument,
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

const EditDayLabel = ({
  closeModalThree,
  calendarDateSelected,
  selectedDayLabel,
}) => {
  const technicians = useSyncedCollection(collection(db, "technicians"));
  const { dispatch } = useContext(ToastContext);

  const [label, setLabelData] = useState({
    labelDate: selectedDayLabel.labelDate
      ? selectedDayLabel.labelDate
      : calendarDateSelected,
    locationName: selectedDayLabel.locationName
      ? selectedDayLabel.locationName
      : "",
    tech: selectedDayLabel.tech ? selectedDayLabel.tech : "",
  });

  const handleLabelDataChange = (prop) => (event) => {
    setLabelData({ ...label, [prop]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const updatedLabel = {
      labelDate: label.labelDate,
      locationName: label.locationName,
      tech: label.tech,
    };
    updateDocument(doc(db, "calLabel", selectedDayLabel.id), updatedLabel)
      .then(() => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "SUCCESS",
            title: "Update Day Label",
            message: "Updated the day label in the cloud",
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
            title: "Update Day Label",
            message: "There was an error updating",
          },
        });
        console.log("Firestore error: ", error);
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
          <span className="iconSeperation">Update</span>
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

export default EditDayLabel;
