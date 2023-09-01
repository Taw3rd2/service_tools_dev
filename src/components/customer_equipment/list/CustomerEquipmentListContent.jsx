import React from "react";

import { db, useSyncedCollection } from "../../../firebase/firestore.utils";

import {
  getDateFromString,
  getUnixFromDate,
} from "../../../utilities/dateUtils";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { AddCircleOutline, Close } from "@mui/icons-material";

import {
  defaultBodyTableCell,
  defaultTableButton,
  getDefaultHeadTableCell,
  greenBodyTableCell,
  redBodyTableCell,
} from "../../../theme/Theme";
import { collection } from "firebase/firestore";

const CustomerEquipmentListContent = ({
  customer,
  openCustomerEquipmentDetails,
  openCreateCustomerEquipment,
  closeModalOne,
}) => {
  const equipment = useSyncedCollection(
    collection(db, "customers", customer.id, "Equipment")
  );

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

  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12}>
        <TableContainer
          component={Paper}
          sx={{ overflow: "auto", maxHeight: 440, marginTop: "8px" }}
        >
          <Table stickyHeader size="small" aria-label="warranty-list-table">
            <TableHead>
              <TableRow>
                <TableCell align="left" sx={getDefaultHeadTableCell(170)}>
                  Equipment Name
                </TableCell>
                <TableCell align="left" sx={getDefaultHeadTableCell(170)}>
                  Brand
                </TableCell>
                <TableCell align="left" sx={getDefaultHeadTableCell(170)}>
                  Model
                </TableCell>
                <TableCell align="left" sx={getDefaultHeadTableCell(170)}>
                  Serial
                </TableCell>
                <TableCell align="center" sx={getDefaultHeadTableCell(100)}>
                  Maintenance Expiration
                </TableCell>
                <TableCell align="center" sx={getDefaultHeadTableCell(100)}>
                  Parts Expiration
                </TableCell>
                <TableCell align="center" sx={getDefaultHeadTableCell(100)}>
                  Labor Expiration
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipment.map((unit, index) => (
                <TableRow
                  key={index}
                  onClick={() => openCustomerEquipmentDetails(unit)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell align="left" sx={defaultBodyTableCell}>
                    {unit.equipmentName}
                  </TableCell>
                  <TableCell align="left" sx={defaultBodyTableCell}>
                    {unit.equipmentBrand}
                  </TableCell>
                  <TableCell align="left" sx={defaultBodyTableCell}>
                    {unit.equipmentModel}
                  </TableCell>
                  <TableCell align="left" sx={defaultBodyTableCell}>
                    {unit.equipmentSerial}
                  </TableCell>
                  {getStyledTableCell(unit.equipmentContract)}
                  {getStyledTableCell(unit.equipmentWarranty)}
                  {getStyledTableCell(unit.laborWarranty)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid2
          container
          alignItems="flex-start"
          justifyContent="flex-end"
          direction="row"
        >
          <Button
            onClick={() => openCreateCustomerEquipment()}
            variant="outlined"
            color="primary"
            startIcon={<AddCircleOutline />}
            sx={defaultTableButton}
          >
            Add New Equipment
          </Button>
          <Button
            onClick={() => closeModalOne()}
            variant="outlined"
            color="primary"
            startIcon={<Close />}
            sx={defaultTableButton}
          >
            Close
          </Button>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default CustomerEquipmentListContent;
