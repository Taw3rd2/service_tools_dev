import { useState } from "react";
import { db, useSyncedCollection } from "../../../../firebase/firestore.utils";
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
import BasicDisabledSearchBar from "../../../../components/basic_components/BasicDisabledSearchBar";
import { collection } from "firebase/firestore";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.main,
    fontSize: 18,
  },
}));

const JobMaterialPicker = ({ material, setMaterial, closeModalTwo }) => {
  const parts = useSyncedCollection(collection(db, "parts"));

  //set a place to activate and deactivate the search bar
  const [activeSearchBar, setActiveSearchBar] = useState(true);

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
    if (selectedParts.length < 1) {
      closeModalTwo();
    } else {
      const newArr = material;
      if (searchableParts.length > 0) {
        for (const index in selectedParts) {
          if (selectedParts[index]) {
            let partToBeAdded = {
              category: searchableParts[index].category,
              crossReference: searchableParts[index].crossReference,
              id: searchableParts[index].id,
              partCost: searchableParts[index].partCost,
              partDataDate: searchableParts[index].partDataDate,
              partDataServicer: searchableParts[index].partDataServicer,
              partDescription: searchableParts[index].partDescription,
              partLabor: searchableParts[index].partLabor,
              partNotes: searchableParts[index].partNotes,
              partNumber: searchableParts[index].partNumber,
              partVendor: searchableParts[index].partVendor,
              quantity: searchableParts[index].quantity,
              url: searchableParts[index].url,
            };
            newArr.push(partToBeAdded);
          }
        }
      } else {
        for (const index in selectedParts) {
          if (selectedParts[index]) {
            let partToBeAdded = {
              category: parts[index].category,
              crossReference: parts[index].crossReference,
              id: parts[index].id,
              partCost: parts[index].partCost,
              partDataDate: parts[index].partDataDate,
              partDataServicer: parts[index].partDataServicer,
              partDescription: parts[index].partDescription,
              partLabor: parts[index].partLabor,
              partNotes: parts[index].partNotes,
              partNumber: parts[index].partNumber,
              partVendor: parts[index].partVendor,
              quantity: parts[index].quantity,
              url: parts[index].url,
            };
            newArr.push(partToBeAdded);
          }
        }
      }
      setMaterial(newArr);
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
          sx={{ margin: "8px" }}
        >
          Save Selected And Add To Material List
        </Button>
      ) : (
        <Button
          variant="contained"
          type="button"
          color="success"
          startIcon={<ArrowUpward />}
          onClick={() => addSelectedPartsToMaterialList()}
          sx={{ margin: "8px" }}
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

export default JobMaterialPicker;
