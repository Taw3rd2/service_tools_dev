import { TableBody, TableCell, TableRow } from "@mui/material";
import React from "react";
import {
  getDateFromString,
  getFormattedDate,
  getUnixFromDate,
} from "../../../../utilities/dateUtils";
import { greenBodyTableCell, redBodyTableCell } from "../../../../theme/Theme";
import Spinner from "../../../spinner/Spinner";

const EquipmentTableBody = ({ row, openMaintenanceDetails }) => {
  const getStyledTableCell = (stringValue) => {
    const dateValue = getDateFromString(stringValue);
    if (getUnixFromDate(dateValue) < getUnixFromDate(new Date())) {
      return (
        <TableCell align="center" sx={redBodyTableCell}>
          {stringValue}
        </TableCell>
      );
    } else {
      return (
        <TableCell align="center" sx={greenBodyTableCell}>
          {stringValue}
        </TableCell>
      );
    }
  };

  const getCompletedTableCell = (stringValue) => {
    if (stringValue === "Not done yet") {
      return (
        <TableCell align="center" sx={redBodyTableCell}>
          <strong>{stringValue}</strong>
        </TableCell>
      );
    } else {
      return (
        <TableCell align="center" sx={greenBodyTableCell}>
          <strong>{stringValue}</strong>
        </TableCell>
      );
    }
  };

  return (
    <TableBody>
      {row.equipment ? (
        row.equipment
          .sort((a, b) => {
            return a.expirationDate - b.expirationDate;
          })
          .map((unit, index) => (
            <TableRow
              hover
              key={index}
              sx={{ cursor: "pointer" }}
              onClick={() => openMaintenanceDetails(row, unit, index)}
            >
              <TableCell align="left">{unit.equipmentName}</TableCell>
              <TableCell align="left">{unit.equipmentBrand}</TableCell>
              <TableCell align="left">{unit.equipmentModel}</TableCell>
              <TableCell align="left">{unit.equipmentSerial}</TableCell>
              <TableCell align="center">{unit.mNumber}</TableCell>
              <TableCell align="center">${row.salePrice}</TableCell>
              {getStyledTableCell(getFormattedDate(unit.expirationDate))}
              {getCompletedTableCell(getFormattedDate(unit.completedDate))}
            </TableRow>
          ))
      ) : (
        <Spinner />
      )}
    </TableBody>
  );
};

export default EquipmentTableBody;
