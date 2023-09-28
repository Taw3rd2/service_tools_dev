import { toCurrency } from "../../../utilities/currencyUtils";
import BasicTable from "../../basic_components/BasicTable";
import {
  IconButton,
  TableCell,
  TableRow,
  Typography,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DeleteForever } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.main,
    fontSize: 18,
  },
}));

const PartsQuotePartsList = ({
  openPartDetails,
  quoteValues,
  removePartFromList,
}) => {
  const tableHead = (
    <>
      <StyledTableCell align="center">Qty</StyledTableCell>
      <StyledTableCell align="left">Part number</StyledTableCell>
      <StyledTableCell align="left">Description</StyledTableCell>
      <StyledTableCell align="left">Vendor</StyledTableCell>
      <StyledTableCell align="left">Contact</StyledTableCell>
      <StyledTableCell align="left">Cost Each</StyledTableCell>
      <StyledTableCell align="left">Total</StyledTableCell>
      <StyledTableCell align="left"></StyledTableCell>
    </>
  );

  const tableBody = (
    <>
      {quoteValues.partsList.length > 0 &&
        quoteValues.partsList
          .sort((a, b) => a.partNumber.localeCompare(b.partNumber))
          .map((part, index) => (
            <TableRow key={index} sx={{ cursor: "pointer" }}>
              <TableCell
                sx={{ width: 25 }}
                align="center"
                onClick={() => openPartDetails(part, index)}
              >
                {part.quantity}
              </TableCell>
              <TableCell
                align="left"
                onClick={() => openPartDetails(part, index)}
              >
                {part.partNumber}
              </TableCell>
              <TableCell
                align="left"
                onClick={() => openPartDetails(part, index)}
              >
                {part.partDescription}
              </TableCell>
              <TableCell
                align="left"
                onClick={() => openPartDetails(part, index)}
              >
                {part.partVendor}
              </TableCell>
              <TableCell
                align="left"
                onClick={() => openPartDetails(part, index)}
              >
                {part.vendorContact}
              </TableCell>
              <TableCell
                align="left"
                onClick={() => openPartDetails(part, index)}
              >
                {toCurrency(part.partCost)}
              </TableCell>
              <TableCell
                align="left"
                onClick={() => openPartDetails(part, index)}
              >
                {part.partCost * part.quantity}
              </TableCell>
              <TableCell
                sx={{ width: 25 }}
                align="center"
                onClick={() => removePartFromList(index)}
              >
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => removePartFromList(index)}
                >
                  <DeleteForever />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
    </>
  );

  const additionalButtons = <></>;

  return (
    <div>
      <div className="row">
        <div className="singleRowInput">
          <Typography variant="h5">Material</Typography>
        </div>
      </div>
      <BasicTable
        tableHead={tableHead}
        tableBody={tableBody}
        height={"237px"}
        additionalButtons={additionalButtons}
      />
    </div>
  );
};

export default PartsQuotePartsList;
