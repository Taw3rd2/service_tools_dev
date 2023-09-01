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

const EmptyMaterialList = ({ openJobMaterialPicker }) => {
  const tableHead = (
    <>
      <StyledTableCell align="center">Qty</StyledTableCell>
      <StyledTableCell align="left">Model/Part#</StyledTableCell>
      <StyledTableCell align="left">Description</StyledTableCell>
      <StyledTableCell align="left">Cost</StyledTableCell>
      <StyledTableCell align="center"></StyledTableCell>
    </>
  );

  const tableBody = (
    <TableRow>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell>No Material Assigned</TableCell>
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
        onClick={() => {
          openJobMaterialPicker();
        }}
      >
        <Add />
        <span className="iconSeperation">
          Add Material From The Parts Catalog
        </span>
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

export default EmptyMaterialList;
