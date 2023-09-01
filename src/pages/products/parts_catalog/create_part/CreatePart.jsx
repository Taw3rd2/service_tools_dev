import { useContext, useState } from "react";
import { collection } from "firebase/firestore";
import {
  db,
  createUnNamedDocument,
  useSyncedCollection,
} from "../../../../firebase/firestore.utils";

import { ArrowUpward, Close } from "@mui/icons-material";
import {
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

const CreatePart = ({ closeModalOne }) => {
  const tabs = useSyncedCollection(collection(db, "tabs"));
  const { dispatch } = useContext(ToastContext);

  const [partValues, setPartValues] = useState({
    category: "Service",
    crossReference: [],
    partCost: 0.0,
    partDataDate: new Date().toLocaleString(),
    partDataServicer: "",
    partDescription: "",
    partLabor: 0.0,
    partNotes: "",
    partNumber: "",
    partVendor: "Carrier",
    quantity: 1,
    url: "",
  });

  const costConversion = (costValue) => {
    if (Number.isFinite(costValue)) {
      return costValue;
    } else {
      return Number(costValue.replace(/[^0-9]+/g, ""));
    }
  };

  const laborConversion = (laborValue) => {
    if (Number.isFinite(laborValue)) {
      return laborValue;
    } else {
      return Number(laborValue.replace(/[^0-9.]+/g, ""));
    }
  };

  const submitNewPart = (e) => {
    e.preventDefault();
    const newPart = {
      category: partValues.category,
      crossReference: partValues.crossReference,
      partCost: costConversion(partValues.partCost),
      partDataDate: partValues.partDataDate,
      partDataServicer: partValues.partDataServicer,
      partDescription: partValues.partDescription,
      partLabor: laborConversion(partValues.partLabor),
      partNotes: partValues.partNotes,
      partNumber: partValues.partNumber,
      partVendor: partValues.partVendor,
      quantity: partValues.quantity,
      url: partValues.url,
    };
    createUnNamedDocument(collection(db, "parts"), newPart)
      .then(() => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedExactTime(new Date()),
            type: "SUCCESS",
            title: "Create Part",
            message: "Created a new part in the cloud",
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
            title: "Create Part",
            message: "There was an error creating",
          },
        });
        console.log("Firebase error: ", error);
      });
  };

  const handelPartValueChange = (prop) => (event) => {
    setPartValues({ ...partValues, [prop]: event.target.value });
  };

  // const handlePartCostChange = (event) => {
  //   const cost = Number(event.target.value.replace(/[^0-9]+/g, ""));
  //   setPartValues({ ...partValues, partCost: cost });
  // };

  // const handlePartLaborChange = (event) => {
  //   const labor = Number(event.target.value.replace(/[^0-9.]+/g, ""));
  //   setPartValues({ ...partValues, partLabor: labor });
  // };

  return (
    <div>
      <form onSubmit={submitNewPart} autoComplete="new password">
        <div className="row">
          <div className="tripleRowInput">
            <TextField
              label="Dispatcher"
              fullWidth
              value={partValues.partDataServicer}
              onChange={handelPartValueChange("partDataServicer")}
            />
          </div>
          <div className="tripleRowInput">
            <TextField
              label="Part Number"
              fullWidth
              value={partValues.partNumber}
              onChange={handelPartValueChange("partNumber")}
              required
            />
          </div>
          <div className="tripleRowInput">
            {tabs.length > 0 && (
              <FormControl fullWidth>
                <InputLabel id="new_part_category_selector">
                  Tab Name
                </InputLabel>
                <Select
                  labelId="new_part_category_selector"
                  id="category"
                  value={partValues.category}
                  label="Tab Name"
                  onChange={handelPartValueChange("category")}
                >
                  {tabs
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
          <div className="singleRowInput">
            <TextField
              label="Part Description"
              value={partValues.partDescription}
              onChange={handelPartValueChange("partDescription")}
              fullWidth
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="tripleRowInput">
            <TextField
              label="Part Vendor"
              value={partValues.partVendor}
              onChange={handelPartValueChange("partVendor")}
              fullWidth
            />
          </div>
          <div className="tripleRowInput">
            <FormControl fullWidth>
              <InputLabel htmlFor="part-cost-input">Part Cost</InputLabel>
              <OutlinedInput
                id="part-cost-input"
                value={partValues.partCost}
                onChange={handelPartValueChange("partCost")}
                fullWidth
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                label="Part Cost"
              />
            </FormControl>
          </div>
          <div className="tripleRowInput">
            <TextField
              label="Part Labor"
              type="number"
              value={partValues.partLabor}
              onChange={handelPartValueChange("partLabor")}
              fullWidth
            />
          </div>
        </div>
        <div className="row">
          <div className="singleRowInput">
            <TextField
              label="Part Notes"
              value={partValues.partNotes}
              onChange={handelPartValueChange("partNotes")}
              fullWidth
            />
          </div>
        </div>
        <div className="row">
          <div className="singleRowInput">
            <p>* = required</p>
          </div>
        </div>
        <div className="buttonBar">
          <button type="submit" className="standardButton">
            <ArrowUpward />
            <span className="iconSeperation">Submit</span>
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
    </div>
  );
};

export default CreatePart;
