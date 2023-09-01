import { TableCell, tableCellClasses, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import BasicTable from "../../../../components/basic_components/BasicTable";
import { Add } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.main,
    fontSize: 18,
  },
}));

const EmptyAdditionsList = ({ openAddAdditionsToJob }) => {
  const tableHead = (
    <>
      <StyledTableCell align="center">Qty</StyledTableCell>
      <StyledTableCell align="left">Description</StyledTableCell>
      <StyledTableCell align="left">Cost</StyledTableCell>
      <StyledTableCell align="left">Total</StyledTableCell>
      <StyledTableCell align="center"></StyledTableCell>
    </>
  );

  const tableBody = (
    <TableRow>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell>No Additions Assigned</TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );

  const additionalButtons = (
    <>
      <button
        type="button"
        className="standardButton"
        style={{ margin: "8px" }}
        onClick={() => openAddAdditionsToJob()}
      >
        <Add />
        <span className="iconSeperation">Add Items from Services</span>
      </button>
    </>
  );

  return (
    <div className="worksheetContainer">
      <BasicTable
        tableHead={tableHead}
        tableBody={tableBody}
        height={"75px"}
        additionalButtons={additionalButtons}
      />
    </div>
  );
};

export default EmptyAdditionsList;
