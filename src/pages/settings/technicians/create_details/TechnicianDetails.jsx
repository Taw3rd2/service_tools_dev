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

import { Button, TextField } from "@mui/material";
import "../../../../global_style/style.css";
import { Add, ArrowUpward, Close } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

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
    <form onSubmit={submitTechnician} autoComplete="new-password">
      <Grid container spacing={1.5}>
        <Grid xs={4}>
          <TextField
            label="Name"
            value={techValues.name}
            fullWidth
            color="primary"
            size="small"
            sx={{ marginTop: "16px" }}
            onChange={handleTechValueChange("name")}
            required
          />
        </Grid>
        <Grid xs={4}>
          <TextField
            label="Email"
            value={techValues.email}
            fullWidth
            color="primary"
            size="small"
            sx={{ marginTop: "16px" }}
            onChange={handleTechValueChange("email")}
            required
          />
        </Grid>
        <Grid xs={4}>
          <Button
            variant="contained"
            type="button"
            onClick={toggleColorPicker}
            sx={{
              marginTop: "16px",
              backgroundColor: `${techValues.color}`,
            }}
          >
            Set Tech Color
          </Button>
        </Grid>
      </Grid>

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
      <Grid
        container
        spacing={1.5}
        sx={{ display: "flex", justifyContent: "end" }}
      >
        <Grid>
          <Button
            variant="contained"
            type="submit"
            startIcon={technician !== undefined ? <ArrowUpward /> : <Add />}
          >
            {technician !== undefined ? "Update" : "Add"}
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            type="button"
            startIcon={<Close />}
            onClick={() => closeModalOne()}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default TechnicianDetails;
