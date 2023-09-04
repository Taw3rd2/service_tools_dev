import Grid from "@mui/material/Unstable_Grid2/Grid2";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AddCircleOutline,
  ArrowUpward,
  Close,
  DeleteForever,
} from "@mui/icons-material";
import { toArrayTotal, toCurrency } from "../../../../utilities/currencyUtils";
import QuantityControl from "../../../quantity_control/QuantityControl";
import { Suspense, lazy, useContext, useEffect, useState } from "react";
import {
  db,
  updateDocument,
  useSyncedCollection,
  useSyncedNestedDocument,
} from "../../../../firebase/firestore.utils";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import Spinner from "../../../spinner/Spinner";
import ModalThree from "../../../basic_components/modal_three/ModalThree";
import { ToastContext } from "../../../../context/toastContext";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";
import { getPartDetailsFromIds } from "../../maintenance_functions/maintenanceFuctions";
const JobMaterialPicker = lazy(() =>
  import(
    "../../../../pages/products/equipment_catalog/material_list/JobMaterialPicker"
  )
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.main,
    fontSize: 18,
  },
}));

const MaintenanceMaterialList = ({ closeModalTwo, customerId }) => {
  const { dispatch } = useContext(ToastContext);

  const partsInventory = useSyncedCollection(collection(db, "parts"));
  const loadedMaterialList = useSyncedNestedDocument(
    "customers",
    customerId,
    "maintenanceMaterial",
    "material"
  );

  const [material, setMaterial] = useState([]);

  console.log("material: ", material);

  useEffect(() => {
    if (customerId) {
      const matListRef = doc(
        db,
        "customers",
        customerId,
        "maintenanceMaterial",
        "material"
      );
      const subscription = onSnapshot(matListRef, (doc) => {
        if (doc.data() && doc.data().materialArray) {
          const tempArray = doc.data().materialArray;
          setMaterial(getPartDetailsFromIds(partsInventory, tempArray));
        }
        return () => subscription.unsubscribe();
      });
    }
  }, [customerId, partsInventory]);

  const [pickerButtonActive, setPickerButtonActive] = useState(true);

  const removeArrayItem = (indexToRemove) => {
    setMaterial((oldArray) => {
      return oldArray.filter((value, i) => i !== indexToRemove);
    });
  };

  const [isModalThreeOpen, setModalThreeOpen] = useState(false);
  const [modalThreeSize, setModalThreeSize] = useState("45%");
  const [modalThreeTitle, setModalThreeTitle] = useState("Modal Three");
  const [modalThreeContent, setModalThreeContent] = useState(
    <div>Modal Three Content</div>
  );
  const openModalThree = (size, title, content) => {
    setModalThreeSize(size);
    setModalThreeTitle(title);
    setModalThreeContent(content);
    setModalThreeOpen(true);
  };
  const closeModalThree = () => {
    setModalThreeSize("45%");
    setModalThreeTitle("Modal Three");
    setModalThreeContent(<div>Modal Three Content</div>);
    setModalThreeOpen(false);
  };

  const openMaterialPicker = () => {
    openModalThree(
      "100%",
      "Material Picker",
      <JobMaterialPicker
        material={material}
        setMaterial={setMaterial}
        closeModalTwo={closeModalThree}
      />
    );
  };

  const saveMaterialToFirestore = async () => {
    console.log("material: ", material);
    //ensure we didnt lag and loose the customer somewhere...
    if (customerId) {
      const saveableArray = [];

      material.forEach((item) => {
        saveableArray.push({ id: item.id, quantity: item.quantity });
      });

      console.log("saveableArray: ", saveableArray);

      //if there is no material saved, create a new list
      if (loadedMaterialList) {
        await setDoc(
          doc(db, "customers", customerId, "maintenanceMaterial", "material"),
          {
            materialArray: saveableArray,
          }
        )
          .then(() => {
            setPickerButtonActive(true);
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "SUCCESS",
                title: "Maintenance List Added",
                message: "Added list to the cloud",
              },
            });
          })
          .catch((error) => {
            setPickerButtonActive(true);
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "ERROR",
                title: "Maintenance List Add Issue",
                message: "There was a error adding",
              },
            });
            console.log("Firebase Error", error.message);
          });
      } else {
        //there is a document to save to in mainteanceMaterial, update it
        updateDocument(
          doc(db, "customers", customerId, "maintenanceMaterial", "material"),
          {
            materialArray: saveableArray,
          }
        )
          .then(() => {
            setPickerButtonActive(true);
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "SUCCESS",
                title: "Maintenance List Updated",
                message: "Updated list to the cloud",
              },
            });
          })
          .catch((error) => {
            setPickerButtonActive(true);
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "ERROR",
                title: "Maintenance List Update Issue",
                message: "There was a error updating",
              },
            });
            console.log("Firebase Error", error.message);
          });
      }
    }
  };

  return (
    <Grid container spacing={1.5}>
      <Grid xs={12}>
        {customerId}
        <TableContainer
          component={Paper}
          sx={{
            overflow: "auto",
            maxHeight: "250px",
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Qty</StyledTableCell>
                <StyledTableCell align="left">Description</StyledTableCell>
                <StyledTableCell align="left">Vendor</StyledTableCell>
                <StyledTableCell align="left">Cost</StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {material && material.length > 0 ? (
                material.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <QuantityControl
                        listOfItems={material}
                        setListOfItems={setMaterial}
                        part={item}
                        index={index}
                        setPickerButtonActive={setPickerButtonActive}
                      />
                    </TableCell>

                    <TableCell align="left">
                      {item.partDescription
                        ? item.partDescription
                        : "No Description Entered"}
                    </TableCell>
                    <TableCell align="left">
                      {item.partVendor ? item.partVendor : "No Vendor Entered"}
                    </TableCell>
                    <TableCell align="left">
                      {toCurrency(
                        item.partCost ? item.partCost / 100 : "No Cost Entered"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => {
                          removeArrayItem(index);
                        }}
                      >
                        <DeleteForever sx={{ color: "red" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography variant="inherit">
                      No Material Entered
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid
        xs={12}
        sx={{ display: "flex", justifyContent: "end", marginTop: "8px" }}
      >
        <Button
          variant="contained"
          type="button"
          startIcon={<ArrowUpward />}
          onClick={() => saveMaterialToFirestore()}
          sx={{ marginLeft: "8px", marginTop: "8px", marginBottom: "8px" }}
        >
          Save
        </Button>
        {pickerButtonActive ? (
          <Button
            variant="contained"
            type="button"
            startIcon={<AddCircleOutline />}
            onClick={() => openMaterialPicker()}
            sx={{ marginLeft: "8px", marginTop: "8px", marginBottom: "8px" }}
          >
            Add New Item
          </Button>
        ) : (
          <Button
            disabled
            variant="contained"
            type="button"
            startIcon={<AddCircleOutline />}
            onClick={() => openMaterialPicker()}
            sx={{ marginLeft: "8px", marginTop: "8px", marginBottom: "8px" }}
          >
            Add New Item
          </Button>
        )}
        <Button
          variant="contained"
          type="button"
          startIcon={<Close />}
          onClick={() => closeModalTwo()}
          sx={{ marginLeft: "8px", marginTop: "8px", marginBottom: "8px" }}
        >
          Close
        </Button>
      </Grid>

      <Grid xs={12} sm={12} md={12} lg={6}>
        <Typography variant="inherit">
          Total Items:{" "}
          {material && material.length > 0
            ? toArrayTotal(material, "quantity")
            : 0}
        </Typography>
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={6}>
        <Typography variant="inherit">
          Total Material:{" "}
          {material && material.length > 0 ? toCurrency(0) : toCurrency(0)}
        </Typography>
      </Grid>
      {isModalThreeOpen && (
        <Suspense fallback={<Spinner />}>
          <ModalThree
            modalThreeSize={modalThreeSize}
            modalThreeTitle={modalThreeTitle}
            modalThreeContent={modalThreeContent}
            closeModalThree={closeModalThree}
          />
        </Suspense>
      )}
    </Grid>
  );
};

export default MaintenanceMaterialList;
