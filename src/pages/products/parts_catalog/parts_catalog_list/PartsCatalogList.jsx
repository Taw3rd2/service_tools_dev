import { useEffect, useState } from "react";
import { toMarkUp, toCurrency } from "../../../../utilities/currencyUtils";
import BasicTable from "../../../../components/basic_components/BasicTable";
import { Add, BorderAll, Storage } from "@mui/icons-material";
import { Button, TableCell, tableCellClasses, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "teal",
    color: "white",
    fontSize: 18,
  },
}));

const PartsCatalogList = ({
  partsList,
  category,
  openPartDetails,
  openCreatePart,
  setPartQuantity,
}) => {
  const [filteredParts, setFilteredParts] = useState([]);
  useEffect(() => {
    if (category === "All") {
      setFilteredParts(partsList);
    } else {
      setFilteredParts(partsList.filter((e) => e.category === category));
    }
    setPartQuantity(filteredParts.length);
  }, [category, partsList, filteredParts.length, setPartQuantity]);

  const tableHead = (
    <>
      <StyledTableCell align="left">#</StyledTableCell>
      <StyledTableCell align="left">Part number</StyledTableCell>
      <StyledTableCell align="left">Description</StyledTableCell>
      <StyledTableCell align="left">Hi Temp Cost</StyledTableCell>
      <StyledTableCell align="left">Customer Cost</StyledTableCell>
      <StyledTableCell align="left">Vendor</StyledTableCell>
      <StyledTableCell align="left">Init</StyledTableCell>
      <StyledTableCell align="left">Date</StyledTableCell>
    </>
  );

  const tableBody = (
    <>
      {partsList.length > 0 &&
        filteredParts
          .sort((a, b) => a.partNumber.localeCompare(b.partNumber))
          .map((part, index) => (
            <TableRow
              key={index}
              onClick={() => openPartDetails(part)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell sx={{ width: 25 }} align="left">
                {index + 1}
              </TableCell>
              <TableCell align="left">{part.partNumber}</TableCell>
              <TableCell align="left">{part.partDescription}</TableCell>
              <TableCell align="left">
                {toCurrency(part.partCost / 100)}
              </TableCell>
              <TableCell align="left">
                {toMarkUp(part.partCost / 100)}
              </TableCell>
              <TableCell align="left">{part.partVendor}</TableCell>
              <TableCell align="left">{part.partDataServicer}</TableCell>
              <TableCell align="left">{part.partDataDate}</TableCell>
            </TableRow>
          ))}
    </>
  );

  const additionalButtons = (
    <>
      <Button
        variant="outlined"
        startIcon={<BorderAll />}
        onClick={() =>
          alert("will open a file rename window then save to Excel Sheey")
        }
        sx={{ margin: "8px" }}
        size="large"
      >
        Export to Excel
      </Button>
      <Button
        variant="outlined"
        startIcon={<Storage />}
        onClick={() => alert("will open ther inventory container window")}
        sx={{ margin: "8px" }}
        size="large"
      >
        Inventory Containers
      </Button>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={() => openCreatePart()}
        sx={{ margin: "8px" }}
        size="large"
      >
        Add New Part
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

export default PartsCatalogList;
