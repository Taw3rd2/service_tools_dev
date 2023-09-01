import { TableCell, TableHead, TableRow } from "@mui/material";

const EquipmentTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell align="center">
          <div className="printTableHeaderText">
            <strong>BTU</strong>
          </div>
        </TableCell>
        <TableCell align="center">
          <div className="printTableHeaderText">
            <strong>Size</strong>
          </div>
        </TableCell>
        <TableCell align="center">
          <div className="printTableHeaderText">
            <strong>Price</strong>
          </div>
        </TableCell>
        <TableCell align="center">
          <div className="printTableHeaderText">
            <strong>Rebate</strong>
          </div>
        </TableCell>
        <TableCell align="center">
          <div className="printTableHeaderText">
            <strong>Updated</strong>
          </div>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default EquipmentTableHead;
