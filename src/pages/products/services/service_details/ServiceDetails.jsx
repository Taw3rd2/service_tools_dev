import { useContext, useState } from "react";
import { collection, doc } from "firebase/firestore";
import {
  db,
  updateDocument,
  useSyncedCollection,
} from "../../../../firebase/firestore.utils";
import { ToastContext } from "../../../../context/toastContext";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";
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
import { ArrowUpward, Close, DeleteForever } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const ServiceDetails = ({ service, openDeleteService, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);
  const servicesTabs = useSyncedCollection(collection(db, "servicesTabs"));

  const onBaseCostLoad = (number) => {
    return parseFloat(number / 100).toFixed(2);
  };

  const [serviceValues, setServiceValues] = useState({
    category: service.category ? service.category : "Maintenance",
    cost: service.cost ? onBaseCostLoad(service.cost) : 0.0,
    dataDate: service.dataDate ? service.dataDate : new Date().toLocaleString(),
    dataServicer: service.dataServicer ? service.dataServicer : "",
    description: service.description ? service.description : "",
    notes: service.notes ? service.notes : "",
    partNumber: service.partNumber ? service.partNumber : "",
    quantity: service.quantity ? service.quantity : 1,
  });

  const handleServiceValueChange = (prop) => (event) => {
    setServiceValues({ ...serviceValues, [prop]: event.target.value });
  };

  const costConversion = (costValue) => {
    if (Number.isFinite(costValue)) {
      return costValue;
    } else {
      return Number(costValue.replace(/[^0-9]+/g, ""));
    }
  };

  const onSubmitService = (e) => {
    e.preventDefault();

    const updatedService = {
      category: serviceValues.category,
      cost: costConversion(serviceValues.cost),
      dataDate: new Date().toLocaleString(),
      dataServicer: serviceValues.dataServicer,
      description: serviceValues.description,
      notes: serviceValues.notes,
      partNumber: serviceValues.partNumber,
      quantity: serviceValues.quantity,
    };

    if (service.id !== undefined) {
      updateDocument(doc(db, "services", service.id), updatedService)
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Update Service",
              message: "Updated service in the cloud",
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
              title: "Update Service",
              message: "There was a error updating",
            },
          });
          console.log("Firebase error: ", error);
        });
    } else {
      console.log("The part ID was undefined...");
    }
    closeModalOne();
  };

  return (
    <div>
      <div className="row">
        <div className="singleRowInput">
          <h3>Updated: {serviceValues.dataDate}</h3>
        </div>
      </div>
      <form autoComplete="new password" onSubmit={onSubmitService}>
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
                  labelId="update_services_category_selector"
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
              type="button"
              startIcon={<DeleteForever />}
              onClick={() => openDeleteService(service)}
              color="error"
            >
              Delete
            </Button>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              type="submit"
              startIcon={<ArrowUpward />}
            >
              Update
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

export default ServiceDetails;
