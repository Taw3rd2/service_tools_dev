import { useContext, useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { ToastContext } from "../../../../context/toastContext";
import {
  db,
  updateDocument,
  useSyncedCollection,
} from "../../../../firebase/firestore.utils";
import BasicTable from "../../../../components/basic_components/BasicTable";
import {
  Button,
  Checkbox,
  TableCell,
  tableCellClasses,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "../../../../global_style/style.css";
import { toCurrency } from "../../../../utilities/currencyUtils";
import { ArrowUpward, Close } from "@mui/icons-material";
import BasicSearchBar from "../../../../components/basic_components/BasicSearchBar";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";
import BasicDisabledSearchBar from "../../../../components/basic_components/BasicDisabledSearchBar";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.main,
    fontSize: 18,
  },
}));

const WorksheetMaterialPicker = ({ selectedEquipmentId, closeModalTwo }) => {
  const { dispatch } = useContext(ToastContext);

  //get the parts list from the parts inventory
  const parts = useSyncedCollection(collection(db, "parts"));

  //set a place to activate and deactivate the search bar
  const [activeSearchBar, setActiveSearchBar] = useState(true);

  //set a place for the existing defaultMaterialArray
  const [tempArray, setTempArray] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "equipment", selectedEquipmentId),
      (doc) => {
        setTempArray(doc.data().defaultMaterialList);
      },
      (error) => {
        console.log(error.message);
      }
    );
    return () => unsubscribe();
  }, [selectedEquipmentId]);

  //Search Bar
  const [selectedParts, setSelectedParts] = useState([]);
  const [searchableParts, setSerchableParts] = useState(parts);
  const [query, setQuery] = useState("");
  const partsCatalogSearch = async (queryInput) => {
    const filteredParts = parts.filter((part) => {
      return (
        part.partNumber.toLowerCase().includes(queryInput.toLowerCase()) ||
        part.partDescription.toLowerCase().includes(queryInput.toLowerCase()) ||
        part.crossReference.some((el) =>
          el.partNumber.toLowerCase().includes(queryInput.toLowerCase())
        )
      );
    });
    setQuery(queryInput);
    setSerchableParts(filteredParts);
  };

  const clearSearchQuery = () => {
    setQuery("");
    setSerchableParts(parts);
  };

  const handleCheckChange = (name) => (event) => {
    setActiveSearchBar(false);
    setSelectedParts({
      ...selectedParts,
      [name]: event.target.checked,
    });
  };

  const addSelectedPartsToMaterialList = () => {
    //if there are no parts in the list to save, close the modal.
    if (selectedParts.length < 1) {
      closeModalTwo();
    } else {
      //make a copy of the existing defaultMaterialList
      const newArr = tempArray;

      //if there are items in searchable parts
      if (searchableParts.length > 0) {
        Object.keys(selectedParts).forEach((item) => {
          //add the id only so it can be searched for later
          let partToBeAdded = {
            id: searchableParts[item].id,
            quantity: 1,
          };
          newArr.push(partToBeAdded);
        });
      } else {
        //a selection was made without searching for parts
        Object.keys(selectedParts).forEach((item) => {
          //add the id only so it can be searched later
          let partToBeAdded = {
            id: parts[item].id,
            quantity: 1,
          };
          newArr.push(partToBeAdded);
        });
      }

      //update the equipment defaultMaterialList with the new array
      updateDocument(doc(db, "equipment", selectedEquipmentId), {
        defaultMaterialList: newArr,
      })
        //update the user
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Update Material List",
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
              title: "Update Material List",
              message: "There was an error updating",
            },
          });
          console.log("Firebase error: ", error);
        });
    }
    closeModalTwo();
  };

  const tableHead = (
    <>
      <StyledTableCell align="left">#</StyledTableCell>
      <StyledTableCell align="left">Part number</StyledTableCell>
      <StyledTableCell align="left">Description</StyledTableCell>
      <StyledTableCell align="left">Hi Temp Cost</StyledTableCell>
      <StyledTableCell align="left">Vendor</StyledTableCell>
      <StyledTableCell align="left">Add?</StyledTableCell>
    </>
  );

  const searchBody = (
    <>
      {searchableParts.length > 0 &&
        searchableParts
          .sort((a, b) => a.partNumber.localeCompare(b.partNumber))
          .map((part, index) => (
            <TableRow key={index} onClick={handleCheckChange(index)}>
              <TableCell sx={{ width: 25 }} align="left">
                {index + 1}
              </TableCell>
              <TableCell align="left">{part.partNumber}</TableCell>
              <TableCell align="left">{part.partDescription}</TableCell>
              <TableCell align="left">
                {toCurrency(part.partCost / 100)}
              </TableCell>
              <TableCell align="left">{part.partVendor}</TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={selectedParts.index}
                  value={index}
                  onChange={handleCheckChange(index)}
                />
              </TableCell>
            </TableRow>
          ))}
    </>
  );

  const emptySearchBody = (
    <>
      {parts.length > 0 &&
        parts
          .sort((a, b) => a.partNumber.localeCompare(b.partNumber))
          .map((part, index) => (
            <TableRow key={index} onClick={handleCheckChange(index)}>
              <TableCell sx={{ width: 25 }} align="left">
                {index + 1}
              </TableCell>
              <TableCell align="left">{part.partNumber}</TableCell>
              <TableCell align="left">{part.partDescription}</TableCell>
              <TableCell align="left">
                {toCurrency(part.partCost / 100)}
              </TableCell>
              <TableCell align="left">{part.partVendor}</TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={selectedParts.index}
                  value={index}
                  onChange={handleCheckChange(index)}
                />
              </TableCell>
            </TableRow>
          ))}
    </>
  );

  const additionalButtons = (
    <>
      {activeSearchBar ? (
        <Button
          variant="contained"
          type="button"
          startIcon={<ArrowUpward />}
          onClick={() => addSelectedPartsToMaterialList()}
          sx={{ marginTop: "8px" }}
        >
          Save Selected And Add To Material List
        </Button>
      ) : (
        <Button
          variant="contained"
          type="button"
          startIcon={<ArrowUpward />}
          onClick={() => addSelectedPartsToMaterialList()}
          color="success"
          sx={{ marginTop: "8px" }}
        >
          Save Selected And Add To Material List
        </Button>
      )}
      <Button
        variant="contained"
        type="button"
        startIcon={<Close />}
        onClick={() => closeModalTwo()}
        sx={{ margin: "8px" }}
      >
        Close
      </Button>
    </>
  );

  return (
    <div className="worksheetContainer">
      {activeSearchBar ? (
        <BasicSearchBar
          value={query}
          setValue={partsCatalogSearch}
          searchLabel={`${parts.length} Parts`}
          clearSearchQuery={clearSearchQuery}
        />
      ) : (
        <BasicDisabledSearchBar
          value={query}
          searchLabel={`${parts.length} Parts`}
        />
      )}
      <BasicTable
        tableHead={tableHead}
        tableBody={query === "" ? emptySearchBody : searchBody}
        height={"400px"}
        additionalButtons={additionalButtons}
      />
    </div>
  );
};

export default WorksheetMaterialPicker;
