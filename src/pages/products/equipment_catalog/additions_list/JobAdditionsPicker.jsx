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

const JobAdditionsPicker = ({ additions, setAdditions, closeModalTwo }) => {
  const services = useSyncedCollection(collection(db, "services"));

  //set a place to activate and deactivate the search bar
  const [activeSearchBar, setActiveSearchBar] = useState(true);

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
    if (selectedServices.length < 1) {
      closeModalTwo();
    } else {
      const newArr = additions;
      if (searchableServices.length > 0) {
        Object.keys(selectedServices).forEach((item) => {
          let serviceToBeAdded = {
            category: searchableServices[item].category,
            cost: searchableServices[item].cost,
            dataDate: searchableServices[item].dataDate,
            dataServicer: searchableServices[item].dataServicer,
            description: searchableServices[item].description,
            notes: searchableServices[item].notes,
            partNumber: searchableServices[item].partNumber,
            quantity: searchableServices[item].quantity,
          };
          newArr.push(serviceToBeAdded);
        });
      } else {
        console.log("newArr: ", newArr);
        Object.keys(selectedServices).forEach((item) => {
          let serviceToBeAdded = {
            category: services[item].category,
            cost: services[item].cost,
            dataDate: services[item].dataDate,
            dataServicer: services[item].dataServicer,
            description: services[item].description,
            notes: services[item].notes,
            partNumber: services[item].partNumber,
            quantity: services[item].quantity,
          };
          newArr.push(serviceToBeAdded);
        });
      }
      setAdditions(newArr);
    }
    closeModalTwo();
  };

  const tableHead = (
    <>
      <StyledTableCell align="center">#</StyledTableCell>
      <StyledTableCell align="left">Part Number</StyledTableCell>
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
          sx={{ margin: "8px" }}
        >
          Save Selected And Add To Additions List
        </Button>
      ) : (
        <Button
          variant="contained"
          type="button"
          startIcon={<ArrowUpward />}
          onClick={() => addSelectedServicesToAdditionsList()}
          sx={{ margin: "8px" }}
          color="success"
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
    <div>
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

export default JobAdditionsPicker;
