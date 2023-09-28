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

const WorksheetAdditionsPicker = ({ selectedEquipmentId, closeModalTwo }) => {
  const { dispatch } = useContext(ToastContext);

  //get the services list from the services inventory
  const services = useSyncedCollection(collection(db, "services"));

  //set a place to activate and deactivate the search bar
  const [activeSearchBar, setActiveSearchBar] = useState(true);

  //set a place for the existing defaultServicesArray
  const [tempArray, setTempArray] = useState([]);

  //fetch the existing services
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "equipment", selectedEquipmentId),
      (doc) => {
        setTempArray(doc.data().defaultAdditionsList);
      },
      (error) => {
        console.log(error.message);
      }
    );
    return () => unsubscribe();
  }, [selectedEquipmentId]);

  //Search Bar
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchableServices, setSerchableServices] = useState(services);
  const [query, setQuery] = useState("");
  const servicesCatalogSearch = async (queryInput) => {
    const filteredServices = services.filter((service) => {
      return (
        service.partNumber.toLowerCase().includes(queryInput.toLowerCase()) ||
        service.description.toLowerCase().includes(queryInput.toLowerCase())
      );
    });
    setQuery(queryInput);
    setSerchableServices(filteredServices);
  };

  const clearSearchQuery = () => {
    setQuery("");
    setSerchableServices(services);
  };

  const handleCheckChange = (name) => (event) => {
    setActiveSearchBar(false);
    setSelectedServices({
      ...selectedServices,
      [name]: event.target.checked,
    });
  };

  const addSelectedServicesToAdditionsList = () => {
    //if there are no services in the list to save, close the modal.
    if (selectedServices.length < 1) {
      closeModalTwo();
    } else {
      console.log("tempArray: ", tempArray);
      //make a copy of the existing defaultAdditionsList
      const newArr = tempArray;

      //if there are items in searchable services
      if (searchableServices.length > 0) {
        Object.keys(selectedServices).forEach((item) => {
          //add the id only so it can be searched for later
          let serviceToBeAdded = {
            id: searchableServices[item].id,
            quantity: 1,
          };
          newArr.push(serviceToBeAdded);
        });
      } else {
        //a selection was made without searching for parts
        Object.keys(selectedServices).forEach((item) => {
          //add the id only so it can be searched later
          let serviceToBeAdded = {
            id: services[item].id,
            quantity: 1,
          };
          newArr.push(serviceToBeAdded);
        });
      }

      //update the equipment defaultAdditionsList with the new array
      updateDocument(doc(db, "equipment", selectedEquipmentId), {
        defaultAdditionsList: newArr,
      })
        //update the user
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Update Additions List",
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
              title: "Update Additions List",
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
      <StyledTableCell align="center">#</StyledTableCell>
      <StyledTableCell align="center">Catalog Number</StyledTableCell>
      <StyledTableCell align="left">Description</StyledTableCell>
      <StyledTableCell align="left">Cost</StyledTableCell>
      <StyledTableCell align="center">Add?</StyledTableCell>
    </>
  );

  const searchBody = (
    <>
      {searchableServices.length > 0 &&
        searchableServices
          .sort((a, b) => a.partNumber.localeCompare(b.partNumber))
          .map((service, index) => (
            <TableRow key={index} onClick={handleCheckChange(index)}>
              <TableCell sx={{ width: 25 }} align="left">
                {index + 1}
              </TableCell>
              <TableCell align="left">{service.partNumber}</TableCell>
              <TableCell align="left">{service.description}</TableCell>
              <TableCell align="left">
                {toCurrency(service.cost / 100)}
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={selectedServices.index}
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
      {services.length > 0 &&
        services
          .sort((a, b) => a.partNumber.localeCompare(b.partNumber))
          .map((service, index) => (
            <TableRow key={index} onClick={handleCheckChange(index)}>
              <TableCell sx={{ width: 25 }} align="left">
                {index + 1}
              </TableCell>
              <TableCell align="left">{service.partNumber}</TableCell>
              <TableCell align="left">{service.description}</TableCell>
              <TableCell align="left">
                {toCurrency(service.cost / 100)}
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={selectedServices.index}
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
          onClick={() => addSelectedServicesToAdditionsList()}
          sx={{ marginTop: "8px" }}
        >
          Save Selected And Add To Additions List
        </Button>
      ) : (
        <Button
          variant="contained"
          type="button"
          startIcon={<ArrowUpward />}
          onClick={() => addSelectedServicesToAdditionsList()}
          color="success"
          sx={{ marginTop: "8px" }}
        >
          Save Selected And Add To Additions List
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
          setValue={servicesCatalogSearch}
          searchLabel={`${services.length} Additions`}
          clearSearchQuery={clearSearchQuery}
        />
      ) : (
        <BasicDisabledSearchBar
          value={query}
          searchLabel={`${services.length} Additions`}
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

export default WorksheetAdditionsPicker;
