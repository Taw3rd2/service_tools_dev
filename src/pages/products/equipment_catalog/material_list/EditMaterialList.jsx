import { useContext, useEffect, useState } from "react";
import { collection, doc } from "firebase/firestore";
import {
  db,
  updateDocument,
  useSyncedCollection,
} from "../../../../firebase/firestore.utils";
import { ToastContext } from "../../../../context/toastContext";
import BasicTable from "../../../../components/basic_components/BasicTable";
import { Add, ArrowUpward, Close, DeleteForever } from "@mui/icons-material";
import QuantityControl from "../../../../components/quantity_control/QuantityControl";
import { Button, TableCell, tableCellClasses, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import "../../../../global_style/style.css";
import { toCurrency } from "../../../../utilities/currencyUtils";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.main,
    fontSize: 18,
  },
}));

const EditMaterialList = ({
  selectedEquipmentId,
  selectedEquipmentValues,
  openWorksheetMaterialPicker,
  closeModalOne,
}) => {
  const parts = useSyncedCollection(collection(db, "parts"));

  const { dispatch } = useContext(ToastContext);

  const [editableMaterialList, setEditableMaterialList] = useState([]);
  const [pickerButtonActive, setPickerButtonActive] = useState(true);

  useEffect(() => {
    if (
      //is there a list of parts to work with?
      selectedEquipmentValues.defaultMaterialList &&
      selectedEquipmentValues.defaultMaterialList.length > 0
    ) {
      //condense so i can read this easier
      const equipmentMaterialList = selectedEquipmentValues.defaultMaterialList;

      //filter through the parts collection to get the list of part objects associated with the equipment
      const filteredParts = parts.filter((part) => {
        return equipmentMaterialList.find((prt) => {
          //update the quantity of the found part with the stored quantity on the equipment parts list
          part.quantity = prt.quantity;
          return prt.id === part.id;
        });
      });

      //push the found list to the editableMaterialList
      setEditableMaterialList(filteredParts);
    }
  }, [parts, selectedEquipmentValues.defaultMaterialList]);

  const removeArrayItem = (indexToRemove) => {
    setEditableMaterialList((oldArray) => {
      return oldArray.filter((value, i) => i !== indexToRemove);
    });
  };

  const saveMaterialToEquipment = () => {
    //if there is no parts and we want to save that, save []
    if (editableMaterialList.length > 0) {
      //make sure we have a id
      if (selectedEquipmentId !== undefined) {
        //in retrospect, im not sure why i did this? troubleshooting?
        //set the selectedEquipmentValues to the new values.
        // setSelectedEquipmentValues({
        //   ...selectedEquipmentValues,
        //   defaultMaterialList: editableMaterialList,
        // });

        const savableArray = [];
        //strip the part to id, and quantity so later we can query the part for data changes
        editableMaterialList.forEach((part) => {
          savableArray.push({ id: part.id, quantity: part.quantity });
        });

        updateDocument(doc(db, "equipment", selectedEquipmentId), {
          defaultMaterialList: savableArray,
        })
          .then(() => {
            setPickerButtonActive(true);
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "SUCCESS",
                title: "Update Part",
                message: "Updated part in the cloud",
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
                title: "Update Part",
                message: "There was a error updating",
              },
            });
            console.log("Firebase Error", error.message);
          });
      }
    } else {
      //there are no parts to save.. save the array as []
      if (selectedEquipmentId !== undefined) {
        updateDocument(doc(db, "equipment", selectedEquipmentId), {
          defaultMaterialList: [],
        })
          .then(() => {
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "SUCCESS",
                title: "Update Part",
                message: "Updated part in the cloud",
              },
            });
          })
          .catch((error) => {
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "ERROR",
                title: "Update Part",
                message: "There was a error updating",
              },
            });
            console.log("Firebase Error", error.message);
          });
      }
    }
  };

  const tableHead = (
    <>
      <StyledTableCell align="center">Qty</StyledTableCell>
      <StyledTableCell align="left">Part number</StyledTableCell>
      <StyledTableCell align="left">Description</StyledTableCell>
      <StyledTableCell align="left">Hi Temp Cost</StyledTableCell>
      <StyledTableCell align="left">Vendor</StyledTableCell>
      <StyledTableCell align="left">Date</StyledTableCell>
      <StyledTableCell align="center"></StyledTableCell>
    </>
  );

  const tableBody = (
    <>
      {editableMaterialList && editableMaterialList.length > 0 ? (
        editableMaterialList
          .sort((a, b) => a.partNumber.localeCompare(b.partNumber))
          .map((part, index) => (
            <TableRow key={index}>
              <TableCell sx={{ display: "flex", justifyContent: "center" }}>
                <QuantityControl
                  listOfItems={editableMaterialList}
                  setListOfItems={setEditableMaterialList}
                  part={part}
                  index={index}
                  setPickerButtonActive={setPickerButtonActive}
                />
              </TableCell>
              <TableCell align="left">
                {part.partNumber ? part.partNumber : part.model}
              </TableCell>
              <TableCell align="left">
                {part.partDescription ? part.partDescription : part.subCategory}
              </TableCell>
              <TableCell align="left">
                {toCurrency(
                  part.partCost ? part.partCost / 100 : part.cost / 100
                )}
              </TableCell>
              <TableCell align="left">{part.partVendor}</TableCell>
              <TableCell align="left">{part.partDataDate}</TableCell>
              <TableCell align="center">
                <DeleteForever
                  color="error"
                  onClick={() => {
                    removeArrayItem(index);
                  }}
                />
              </TableCell>
            </TableRow>
          ))
      ) : (
        <TableRow>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>No Parts Added Yet</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      )}
    </>
  );

  const additionalButtons = (
    <>
      {pickerButtonActive ? (
        <Button
          variant="contained"
          type="button"
          startIcon={<Add />}
          onClick={() => openWorksheetMaterialPicker()}
          sx={{ margin: "8px" }}
        >
          Add Material From The Parts Catalog
        </Button>
      ) : (
        <Button
          variant="contained"
          type="button"
          startIcon={<Add />}
          sx={{ margin: "8px" }}
          disabled
        >
          Add Material From The Parts Catalog
        </Button>
      )}
    </>
  );

  return (
    <div className="container">
      <div className="worksheetDate" style={{ marginBottom: "8px" }}>
        {`Loadout for: ${selectedEquipmentValues.subCategory} Model:${selectedEquipmentValues.model}`}
      </div>
      <BasicTable
        tableHead={tableHead}
        tableBody={tableBody}
        height={"400px"}
        additionalButtons={additionalButtons}
      />
      <div className="buttonBar">
        {pickerButtonActive ? (
          <Button
            variant="contained"
            type="button"
            startIcon={<ArrowUpward />}
            onClick={() => saveMaterialToEquipment()}
          >
            Save Changes
          </Button>
        ) : (
          <Button
            variant="contained"
            type="button"
            startIcon={<ArrowUpward />}
            onClick={() => saveMaterialToEquipment()}
            color="success"
          >
            Save Changes
          </Button>
        )}
        <Button
          variant="contained"
          type="button"
          startIcon={<Close />}
          onClick={() => closeModalOne()}
          sx={{ marginLeft: "8px" }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default EditMaterialList;
