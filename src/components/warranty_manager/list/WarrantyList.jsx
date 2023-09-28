import { db, useSyncedCollection } from "../../../firebase/firestore.utils";
import {
  getDateFromString,
  getUnixFromDate,
  getWarrantyFormattedDate,
} from "../../../utilities/dateUtils";
import "../../../global_style/style.css";
import { AddCircleOutline, Close } from "@mui/icons-material";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  defaultBodyTableCell,
  greenBodyTableCell,
  redBodyTableCell,
} from "../../../theme/Theme";
import { collection } from "firebase/firestore";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const WarrantyList = ({
  customer,
  openWarrantyDetails,
  openCreateWarranty,
  closeModalOne,
}) => {
  const equipment = useSyncedCollection(
    collection(db, "customers", customer.id, "Equipment")
  );

  const newWarranties = [];
  equipment.forEach((unit) => {
    let warr = {
      key: "",
      equipment: "",
      equipmentName: "",
      equipmentBrand: "",
      equipmentModel: "",
      equipmentSerial: "",
      jobNumber: "",
      startDate: "",
      partsExpirationDate: "",
      laborExpirationDate: "",
    };

    if (typeof unit.warranty != "undefined") {
      warr.id = unit.id;
      warr.key = unit.warranty.key;
      warr.equipment = unit.warranty.equipment;
      warr.equipmentBrand = unit.warranty.equipmentBrand;
      warr.equipmentModel = unit.warranty.equipmentModel;
      warr.equipmentSerial = unit.warranty.equipmentSerial;
      warr.equipmentName = unit.warranty.equipmentName;
      warr.jobNumber = unit.warranty.jobNumber;
      warr.startDate = unit.warranty.startDate;
      warr.partsExpirationDate = unit.warranty.partsExpirationDate;
      warr.laborExpirationDate = unit.warranty.laborExpirationDate;
      newWarranties.push(warr);
    }
  });

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
    <div>
      <TableContainer sx={{ overflow: "auto", maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Job Number</TableCell>
              <TableCell align="left">Equipment</TableCell>
              <TableCell align="center">Start Date</TableCell>
              <TableCell align="center">Parts Expiration</TableCell>
              <TableCell align="center">Labor Expiration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newWarranties.map((warranty) => (
              <TableRow
                key={warranty.id}
                sx={{ cursor: "pointer" }}
                onClick={() => openWarrantyDetails(warranty)}
                hover
              >
                <TableCell align="center" sx={defaultBodyTableCell}>
                  {warranty.jobNumber}
                </TableCell>
                <TableCell align="left" sx={defaultBodyTableCell}>
                  {warranty.equipmentName}
                </TableCell>
                <TableCell align="center" sx={defaultBodyTableCell}>
                  {getWarrantyFormattedDate(warranty.startDate)}
                </TableCell>
                {getStyledTableCell(
                  getWarrantyFormattedDate(warranty.partsExpirationDate)
                )}
                {getStyledTableCell(
                  getWarrantyFormattedDate(warranty.laborExpirationDate)
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid
        container
        spacing={1.5}
        sx={{ display: "flex", justifyContent: "end", marginTop: "8px" }}
      >
        <Grid>
          <Button
            variant="contained"
            type="button"
            onClick={() => openCreateWarranty()}
            startIcon={<AddCircleOutline />}
          >
            Create New Warranty
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            type="button"
            onClick={() => closeModalOne()}
            startIcon={<Close />}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default WarrantyList;
