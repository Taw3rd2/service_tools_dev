import { useContext, useState } from "react";
import { collection, doc } from "firebase/firestore";
import { ToastContext } from "../../../../context/toastContext";

import {
  db,
  createUnNamedDocument,
  updateDocument,
} from "../../../../firebase/firestore.utils";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

import SlideIn from "../../../../components/basic_components/slide-in/SlideIn";
import { ChromePicker } from "react-color";

import { TextField } from "@mui/material";
import "../../../../global_style/style.css";
import { Add, ArrowUpward, Close } from "@mui/icons-material";

const TechnicianDetails = ({ technician, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);

  const [showPicker, setShowPicker] = useState(false);
  const toggleColorPicker = () => setShowPicker(!showPicker);

  const [techValues, setTechValues] = useState({
    color: technician !== undefined ? technician.color : "",
    email: technician !== undefined ? technician.email : "",
    name: technician !== undefined ? technician.name : "",
  });

  const handleTechValueChange = (prop) => (event) => {
    setTechValues({ ...techValues, [prop]: event.target.value });
  };

  const handleColorChange = (prop, colorValue) => {
    setTechValues({ ...techValues, [prop]: colorValue });
  };

  const submitTechnician = (event) => {
    event.preventDefault();
    if (technician !== undefined) {
      if (
        technician.color === techValues.color &&
        technician.email === techValues.email &&
        technician.name === techValues.name
      ) {
        closeModalOne();
      } else {
        //update technican
        updateDocument(doc(db, "technicians", technician.id), techValues)
          .then(() => {
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "SUCCESS",
                title: "Update Technician",
                message: "Technician updated in the cloud",
              },
            });
            closeModalOne();
          })
          .catch((error) => {
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "ERROR",
                title: "Update Technician",
                message: "There was an issue updating",
              },
            });
            console.log("Firebase error: ", error);
          });
      }
    } else {
      //add new tech
      createUnNamedDocument(collection(db, "technicians"), techValues)
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Add Technician",
              message: "Added technician to the cloud",
            },
          });
          closeModalOne();
        })
        .catch((error) => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "ERROR",
              title: "Add Technician",
              message: "There was a error adding item",
            },
          });
          console.log("Firebase error: ", error);
        });
    }
  };

  return (
    <form
      onSubmit={submitTechnician}
      autoComplete="new-password"
      style={{ zoom: 1.25 }}
    >
      <div className="row">
        <div className="tripleRowInput">
          <TextField
            label="Name"
            value={techValues.name}
            fullWidth
            color="primary"
            sx={{ marginTop: "16px" }}
            onChange={handleTechValueChange("name")}
            required
          />
        </div>
        <div className="tripleRowInput">
          <TextField
            label="Email"
            value={techValues.email}
            fullWidth
            color="primary"
            sx={{ marginTop: "16px" }}
            onChange={handleTechValueChange("email")}
            required
          />
        </div>
        <div className="tripleRowInput">
          <button
            type="button"
            className="standardButton"
            style={{
              padding: "20px",
              marginTop: "16px",
              color: "white",
              backgroundColor: `${techValues.color}`,
            }}
            onClick={toggleColorPicker}
          >
            Set Technician Color
          </button>
        </div>
      </div>

      <div className="row">
        <div style={{ margin: "0 auto" }}>
          <SlideIn startAnimation={showPicker}>
            <ChromePicker
              onChangeComplete={(color) => {
                handleColorChange("color", color.hex);
              }}
              disableAlpha={true}
              color={techValues.color}
            />
          </SlideIn>
        </div>
      </div>

      <div className="buttonBar">
        <button type="submit" className="standardButton">
          {technician !== undefined ? (
            <>
              <ArrowUpward />
              <span className="iconSeperation">Update</span>
            </>
          ) : (
            <>
              <Add />
              <span className="iconSeperation">Add</span>
            </>
          )}
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
    </form>
  );
};

export default TechnicianDetails;
