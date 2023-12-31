import { db, useSyncedCollection } from "../../../firebase/firestore.utils";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "../../../global_style/style.css";
import {
  defaultBodyTableCell,
  greenBodyTableCell,
  redBodyTableCell,
} from "../../../theme/Theme";
import {
  getDateFromString,
  getUnixFromDate,
} from "../../../utilities/dateUtils";
import { AddCircleOutline, Close } from "@mui/icons-material";
import { collection } from "firebase/firestore";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const CustomerEquipmentList = ({
  customer,
  closeModalOne,
  openCreateCustomerEquipment,
  openCustomerEquipmentDetails,
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
    <Grid>
      <Grid xs={12}>
        <TableContainer sx={{ overflow: "auto", maxHeight: 440 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell align="left">Equipment Name</TableCell>
                <TableCell align="left">Brand</TableCell>
                <TableCell align="left">Model</TableCell>
                <TableCell align="left">Serial</TableCell>
                <TableCell align="center">Maintenance Expiration</TableCell>
                <TableCell align="center">Parts Expiration</TableCell>
                <TableCell align="center">Labor Expiration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipment.map((unit, index) => (
                <TableRow
                  key={index}
                  onClick={() => openCustomerEquipmentDetails(unit)}
                  sx={{ cursor: "pointer" }}
                  hover
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
      </Grid>
      <Grid
        xs={12}
        sm={12}
        md={12}
        lg={12}
        sx={{ display: "flex", justifyContent: "end", marginTop: "8px" }}
      >
        <Button
          variant="contained"
          type="button"
          startIcon={<AddCircleOutline />}
          onClick={() => openCreateCustomerEquipment()}
          sx={{ marginLeft: "8px" }}
        >
          Add New Equipment
        </Button>
        <Button
          variant="contained"
          type="button"
          startIcon={<Close />}
          onClick={() => closeModalOne()}
          sx={{ marginLeft: "8px" }}
        >
          Close
        </Button>
      </Grid>
    </Grid>
  );
};

export default CustomerEquipmentList;
