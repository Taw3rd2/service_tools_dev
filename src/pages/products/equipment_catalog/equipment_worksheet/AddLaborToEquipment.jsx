import { useContext, useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import {
  db,
  updateDocument,
  useSyncedCollection,
} from "../../../../firebase/firestore.utils";
import { ArrowUpward, Close } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  stringPriceToNumber,
  toCurrency,
} from "../../../../utilities/currencyUtils";
import { ToastContext } from "../../../../context/toastContext";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const AddLaborToEquipment = ({ selectedEquipmentId, closeModalTwo }) => {
  const { dispatch } = useContext(ToastContext);
  const laborRates = useSyncedCollection(collection(db, "laborRate"));

  // a place to store the fetched equipment labor
  const [tempArray, setTempArray] = useState([]);

  //**set the labor rate here
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "equipment", selectedEquipmentId),
      (doc) => {
        //equipment saved labor list
        const loadedLaborList = doc.data().defaultLaborList;

        //do we have any labor items to work with?
        if (loadedLaborList.length > 0) {
          const modifiedLabor = loadedLaborList.filter((lll) => {
            return laborRates.find((lr) => {
              //use the labor rate stored in labor settings
              lll.rate = lr.rate;
              return lll.description === lr.rateDescription;
            });
          });
          setTempArray(modifiedLabor);
        }

        //if the description matches, change the rate to the fetched rate
        //setTempArray(doc.data().defaultLaborList);
      },
      (error) => {
        console.log(error.message);
      }
    );
    return () => unsubscribe();
  }, [laborRates, selectedEquipmentId]);

  const [laborValues, setLaborValues] = useState({
    description: "",
    hours: "",
    rate: "",
  });

  const submitLabor = (e) => {
    e.preventDefault();
    if (selectedEquipmentId === undefined) {
      console.log("No ID found");
    } else {
      const newArr = tempArray;

      const laborToAdd = {
        description: laborValues.description,
        hours: stringPriceToNumber(laborValues.hours),
        rate: stringPriceToNumber(laborValues.rate),
      };
      newArr.push(laborToAdd);

      updateDocument(doc(db, "equipment", selectedEquipmentId), {
        defaultLaborList: newArr,
      })
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Update Labor List",
              message: "Updated list in the cloud",
            },
          });
        })
        .catch((error) => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "ERROR",
              title: "Update Labor List",
              message: "There was an error updating",
            },
          });
          console.log("Firebase error: ", error);
        });
      closeModalTwo();
    }

    closeModalTwo();
  };

  const handleValueChange = (prop) => (event) => {
    setLaborValues({
      ...laborValues,
      [prop]: event.target.value,
    });
  };

  const handleRateDescriptionChange = (event) => {
    const laborRateDescription = event.target.value;
    const foundRate = laborRates.find(
      (r) => r.rateDescription === laborRateDescription
    );
    setLaborValues({
      ...laborValues,
      rate: foundRate.rate,
      description: foundRate.rateDescription,
    });
  };

  return (
    <form onSubmit={submitLabor} autoComplete="new password">
      <div className="row" style={{ marginTop: "6px" }}>
        <div className="tripleRowInput">
          <FormControl fullWidth>
            <InputLabel id="labor-rate-selector">Select Labor Type</InputLabel>
            <Select
              labelId="labor-rate-selector"
              label="Select Labor Type"
              id="labor_rate_selector"
              value={laborValues.description}
              onChange={(e) => handleRateDescriptionChange(e)}
              required
            >
              {laborRates
                .sort((a, b) =>
                  a.rateDescription.localeCompare(b.rateDescription)
                )
                .map((laborRate, index) => (
                  <MenuItem key={index} value={laborRate.rateDescription}>
                    {laborRate.rateDescription}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <div className="tripleRowInput">
          <TextField
            label="Labor Rate"
            value={`${toCurrency(laborValues.rate / 100)}`}
            fullWidth
            disabled
            required
          />
        </div>
        <div className="tripleRowInput">
          <TextField
            label="Hours"
            value={laborValues.hours}
            onChange={handleValueChange("hours")}
            fullWidth
            required
          />
        </div>
      </div>
      <Grid
        container
        spacing={1.5}
        sx={{ display: "flex", justifyContent: "end" }}
      >
        <Grid>
          <Button variant="contained" type="submit" startIcon={<ArrowUpward />}>
            Submit
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            type="button"
            startIcon={<Close />}
            onClick={() => closeModalTwo()}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddLaborToEquipment;
