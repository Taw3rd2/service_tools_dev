import { useEffect, useState } from "react";
import { toCurrency } from "../../../../utilities/currencyUtils";
import BasicTable from "../../../../components/basic_components/BasicTable";
import { Add, BorderAll } from "@mui/icons-material";
import { Button, TableCell, tableCellClasses, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 18,
  },
}));

const ServicesCatalogList = ({
  servicesList,
  category,
  openServiceDetails,
  openCreateService,
  setServicesQuantity,
}) => {
  const [filteredServices, setFilteredServices] = useState([]);
  useEffect(() => {
    if (category === "All") {
      setFilteredServices(servicesList);
    } else {
      setFilteredServices(servicesList.filter((e) => e.category === category));
    }
    setServicesQuantity(filteredServices.length);
  }, [category, servicesList, filteredServices.length, setServicesQuantity]);

  const tableHead = (
    <>
      <StyledTableCell align="left">#</StyledTableCell>
      <StyledTableCell align="left">Part number</StyledTableCell>
      <StyledTableCell align="left">Description</StyledTableCell>
      <StyledTableCell align="left">Customer Cost</StyledTableCell>
      <StyledTableCell align="left">Init</StyledTableCell>
      <StyledTableCell align="left">Date</StyledTableCell>
    </>
  );

  const tableBody = (
    <>
      {servicesList.length > 0 &&
        filteredServices
          .sort((a, b) => a.partNumber.localeCompare(b.partNumber))
          .map((service, index) => (
            <TableRow
              key={index}
              onClick={() => openServiceDetails(service)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell sx={{ width: 25 }} align="left">
                {index + 1}
              </TableCell>
              <TableCell align="left">{service.partNumber}</TableCell>
              <TableCell align="left">{service.description}</TableCell>
              <TableCell align="left">
                {toCurrency(service.cost / 100)}
              </TableCell>
              <TableCell align="left">{service.dataServicer}</TableCell>
              <TableCell align="left">{service.dataDate}</TableCell>
            </TableRow>
          ))}
    </>
  );

  const additionalButtons = (
    <>
      <Button
        variant="contained"
        type="button"
        startIcon={<BorderAll />}
        sx={{ margin: "8px" }}
        disabled
      >
        Export to Excel
      </Button>
      <Button
        variant="contained"
        type="button"
        startIcon={<Add />}
        onClick={() => openCreateService()}
        sx={{ margin: "8px" }}
      >
        Add New Service
      </Button>
    </>
  );

  return (
    <BasicTable
      tableHead={tableHead}
      tableBody={tableBody}
      height={"715px"}
      additionalButtons={additionalButtons}
    />
  );
};

export default ServicesCatalogList;
