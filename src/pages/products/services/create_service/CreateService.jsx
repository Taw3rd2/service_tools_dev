import { useContext, useState } from "react";
import { collection } from "firebase/firestore";
import {
  db,
  createUnNamedDocument,
  useSyncedCollection,
} from "../../../../firebase/firestore.utils";
import { ArrowUpward, Close } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";

import { ToastContext } from "../../../../context/toastContext";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const CreateService = ({ closeModalOne }) => {
  const servicesTabs = useSyncedCollection(collection(db, "servicesTabs"));
  const { dispatch } = useContext(ToastContext);

  const [serviceValues, setServiceValues] = useState({
    category: "Maintenance",
    cost: 0.0,
    dataDate: new Date().toLocaleString(),
    dataServicer: "",
    description: "",
    notes: "",
    partNumber: "",
    quantity: 1,
  });

  const submitNewService = (e) => {
    e.preventDefault();
    const newService = {
      category: serviceValues.category,
      cost: costConversion(serviceValues.cost),
      dataDate: serviceValues.dataDate,
      dataServicer: serviceValues.dataServicer,
      description: serviceValues.description,
      notes: serviceValues.notes,
      partNumber: serviceValues.partNumber,
      quantity: serviceValues.quantity,
    };
    createUnNamedDocument(collection(db, "services"), newService)
      .then(() => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "SUCCESS",
            title: "Create Service",
            message: "Created a new service in the cloud",
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
            title: "Create Service",
            message: "There was an error creating",
          },
        });
        console.log("Firebase error: ", error);
      });
  };

  const costConversion = (costValue) => {
    if (Number.isFinite(costValue)) {
      return costValue;
    } else {
      return Number(costValue.replace(/[^0-9]+/g, ""));
    }
  };

  const handleServiceValueChange = (prop) => (event) => {
    setServiceValues({ ...serviceValues, [prop]: event.target.value });
  };

  return (
    <div>
      <form onSubmit={submitNewService} autoComplete="new password">
        <div className="row">
          <div className="tripleRowInput">
            <TextField
              label="Dispatcher"
              fullWidth
              value={serviceValues.dataServicer}
              onChange={handleServiceValueChange("dataServicer")}
            />
          </div>
          <div className="tripleRowInput">
            <TextField
              label="Part Number"
              fullWidth
              value={serviceValues.partNumber}
              onChange={handleServiceValueChange("partNumber")}
              required
            />
          </div>
          <div className="tripleRowInput">
            {servicesTabs.length > 0 && (
              <FormControl fullWidth>
                <InputLabel id="new_services_category_selector">
                  Tab Name
                </InputLabel>
                <Select
                  labelId="new_services_category_selector"
                  id="category"
                  value={serviceValues.category}
                  label="Tab Name"
                  onChange={handleServiceValueChange("category")}
                >
                  {servicesTabs
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((tab, index) => (
                      <MenuItem key={tab.id} value={tab.name}>
                        {tab.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </div>
        </div>
        <div className="row">
          <div className="doubleRowInput">
            <TextField
              label="Service Description"
              value={serviceValues.description}
              onChange={handleServiceValueChange("description")}
              fullWidth
              required
            />
          </div>
          <div className="doubleRowInput">
            <FormControl fullWidth>
              <InputLabel htmlFor="part-cost-input">Service Cost</InputLabel>
              <OutlinedInput
                id="service-cost-input"
                value={serviceValues.cost}
                onChange={handleServiceValueChange("cost")}
                fullWidth
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                label="Part Cost"
              />
            </FormControl>
          </div>
        </div>
        <div className="row">
          <div className="singleRowInput">
            <TextField
              label="Part Notes"
              value={serviceValues.notes}
              onChange={handleServiceValueChange("notes")}
              fullWidth
            />
          </div>
        </div>
        <div className="row">
          <div className="singleRowInput">
            <p>* = required</p>
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
              startIcon={<ArrowUpward />}
            >
              Submit
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
    </div>
  );
};

export default CreateService;
