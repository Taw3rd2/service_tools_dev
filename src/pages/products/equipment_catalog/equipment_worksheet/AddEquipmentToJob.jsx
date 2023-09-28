import {
  stringPriceToNumber,
  toCurrency,
} from "../../../../utilities/currencyUtils";
import "../../../../global_style/style.css";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db, useSyncedCollection } from "../../../../firebase/firestore.utils";
import { Add, Close, PostAdd } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Button } from "@mui/material";

const AddEquipmentToJob = ({
  additions,
  closeModalOne,
  labor,
  material,
  openSampleJob,
  selectedEquipmentId,
  setAdditions,
  setLabor,
  setMaterial,
}) => {
  const parts = useSyncedCollection(collection(db, "parts"));
  const services = useSyncedCollection(collection(db, "services"));

  //get the unit
  const [btu, setBtu] = useState("");
  const [cost, setCost] = useState("");
  const [dateUpdated, setDateUpdated] = useState(null);
  const [defaultAdditionsList, setDefaultAdditionsList] = useState([]);
  const [defaultLaborList, setDefaultLaborList] = useState([]);
  const [defaultMaterialList, setDefaultMaterialList] = useState([]);
  const [model, setModel] = useState("");
  const [quantity, setQuantity] = useState("");
  const [size, setSize] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [voltage, setVoltage] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "equipment", selectedEquipmentId),
      (doc) => {
        setBtu(doc.data().btu);
        setCost(toCurrency(doc.data().cost / 100));
        setDateUpdated(doc.data().dateUpdated);
        setDefaultAdditionsList(doc.data().defaultAdditionsList);
        setDefaultLaborList(doc.data().defaultLaborList);
        setDefaultMaterialList(doc.data().defaultMaterialList);
        setModel(doc.data().model);
        setQuantity(doc.data().quantity);
        setSize(doc.data().size);
        setSubCategory(doc.data().subCategory);
        setVoltage(doc.data().voltage);
        setWeight(doc.data().weight);
      },
      (error) => {
        console.log(error.message);
      }
    );
    return () => unsubscribe();
  }, [selectedEquipmentId]);

  const loadEquipmentOnly = () => {
    //remove the material, labor, and additions lists, and prepare cost
    const modifiedUnit = {
      btu,
      cost: stringPriceToNumber(cost),
      dateUpdated,
      model,
      quantity,
      size,
      subCategory,
      voltage,
      weight,
    };

    //get the existing material list can copy it to a new array
    const newMaterialArray = material;

    //push the selected unit into the array
    newMaterialArray.push(modifiedUnit);

    setMaterial(newMaterialArray);
    closeModalOne();
  };

  const loadEquipmentMaterialLaborAdditions = async () => {
    //figure out if material or labor has items prior to overwriting the array..
    //make new arrays and push the new elements into the arrays

    //**Material**
    //add material list (at this point, there are only ids and quantitys on each part)
    const loadedMaterialList =
      defaultMaterialList !== undefined ? defaultMaterialList : [];

    //after we fetch the parts information, this is where we will store it
    const fetchedMaterialList = [];

    //do we have a list of ids to work with?
    if (loadedMaterialList.length > 0) {
      //filter through the parts collection to get the list of part objects associated with the equipment
      const filteredParts = parts.filter((part) => {
        return defaultMaterialList.find((prt) => {
          //update the quantity of the found part with the stored quantity on the equipment part list
          part.quantity = prt.quantity;
          return prt.id === part.id;
        });
      });

      //when we are done loading parts, push them to the primary material list
      filteredParts.map((item) => fetchedMaterialList.push(item));
    }

    //bundle the unit selected
    const modifiedUnit = {
      btu,
      cost: stringPriceToNumber(cost),
      dateUpdated,
      model,
      quantity,
      size,
      subCategory,
      voltage,
      weight,
    };

    //get the existing material list from the primary material list
    const newMaterialArray = material;

    //get the unit and add it to the material list
    newMaterialArray.push(modifiedUnit);

    //add the fetched material list to the list
    fetchedMaterialList.map((item) => newMaterialArray.push(item));

    //set the material back to the primary material list (with all material items)
    setMaterial(newMaterialArray);

    //**Labor**
    //add labor list saved to the piece of equipment
    const loadedLaborList =
      defaultLaborList !== undefined ? defaultLaborList : [];

    //get the existing labor list
    const newLaborArray = labor;

    //add the default labor to the list
    loadedLaborList.map((item) => newLaborArray.push(item));

    //set the labor to the main labor list
    setLabor(newLaborArray);

    //**Additions**
    //add additions list (at this point there are only id's and quantitys on each item)
    const loadedAdditionsList =
      defaultAdditionsList !== undefined ? defaultAdditionsList : [];

    //after we fetch the additions information, this is where we will store it
    const fetchedAdditionsList = [];

    //do we have additions ids to work with?
    if (loadedAdditionsList.length > 0) {
      //filter through the services collection to get the list of objects associated with the equipment
      const filteredAdditions = services.filter((service) => {
        return defaultAdditionsList.find((svc) => {
          service.quantity = svc.quantity;
          return svc.id === service.id;
        });
      });

      //when we are done loading additions, push them to the primary additions list
      filteredAdditions.map((item) => fetchedAdditionsList.push(item));
    }

    //get the existing additions list from the primary additions list
    const newAdditionsArray = additions;

    //add the fetched additions list to the list
    fetchedAdditionsList.map((item) => newAdditionsArray.push(item));

    //set the labor to the main labor list
    setAdditions(newAdditionsArray);

    //open the sample job
    openSampleJob();
    //close the modal
    closeModalOne();
  };

  return (
    <div className="container">
      <ul>
        <li className="worksheetDate">
          This unit has a pre defined list of items.
        </li>
        <li className="worksheetDate">
          Would you like to add the equipment and pre defined items to the Job?
        </li>
      </ul>
      <Grid container spacing={1.5}>
        <Grid xs={12}>
          <Button
            variant="contained"
            type="button"
            startIcon={<PostAdd />}
            onClick={() => {
              loadEquipmentMaterialLaborAdditions();
            }}
            fullWidth
          >
            Yes add items and equipment
          </Button>
        </Grid>
        <Grid xs={12}>
          <Button
            variant="contained"
            type="button"
            startIcon={<Add />}
            onClick={() => loadEquipmentOnly()}
            fullWidth
          >
            No just add the equipment selected
          </Button>
        </Grid>
        <Grid xs={12}>
          <Button
            variant="contained"
            type="button"
            startIcon={<Close />}
            onClick={() => closeModalOne()}
            fullWidth
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddEquipmentToJob;
