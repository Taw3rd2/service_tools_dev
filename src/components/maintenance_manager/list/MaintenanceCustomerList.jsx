import { useState, Fragment } from "react";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";
import { defaultBodyTableCell } from "../../../theme/Theme";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Close,
  KeyboardArrowDown,
  KeyboardArrowUp,
  List,
} from "@mui/icons-material";
import BasicSearchBar from "../../basic_components/BasicSearchBar";
//import MaintenanceExport from "../../export_to_excel/MaintenanceExport";
import EquipmentTableBody from "./components/EquipmentTableBody";
import { collection } from "firebase/firestore";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const MaintenanceCustomerList = ({
  closeModalOne,
  openMaintenanceDetails,
  openMaintenanceMaterialList,
}) => {
  const maintenance = useSyncedCollection(collection(db, "maintenance"));

  const [searchableMaintenance, setSearchableMaintenance] =
    useState(maintenance);

  //search bar
  const [query, setQuery] = useState("");
  const maintenanceCustomerSearch = async (queryInput) => {
    const filteredMaintenance = maintenance.filter((maint) => {
      return (
        maint.customerName.toLowerCase().includes(queryInput.toLowerCase()) ||
        maint.customerAddress
          .toLowerCase()
          .includes(queryInput.toLowerCase()) ||
        maint.mNumber.toLowerCase().includes(queryInput.toLowerCase())
      );
    });
    setQuery(queryInput);
    setSearchableMaintenance(filteredMaintenance);
  };

  const clearSearchQuery = () => {
    setQuery("");
    setSearchableMaintenance(maintenance);
  };

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    return (
      <Fragment>
        <TableRow
          onClick={() => setOpen(!open)}
          sx={{ "& > *": { borderBottom: "unset", cursor: "pointer" } }}
          hover
        >
          <TableCell align="center">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell align="left" sx={defaultBodyTableCell}>
            {row.customerName}
          </TableCell>
          <TableCell align="left" sx={defaultBodyTableCell}>
            {row.customerAddress}
          </TableCell>
          <TableCell align="center" sx={defaultBodyTableCell}>
            {row.customerPhone}
          </TableCell>
          <TableCell align="center" sx={defaultBodyTableCell}>
            {row.equipment.length}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Grid container spacing={1.5}>
                  <Grid
                    xs={12}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h6" gutterBottom component="div">
                      Maintenance
                    </Typography>
                    <Button
                      variant="contained"
                      type="button"
                      startIcon={<List />}
                      onClick={() =>
                        openMaintenanceMaterialList(row.customerId)
                      }
                    >
                      Maintenance Material List
                    </Button>
                  </Grid>
                </Grid>

                <Table
                  size="small"
                  aria-label="equipment"
                  sx={{ marginBottom: "32px" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" sx={defaultBodyTableCell}>
                        <strong>Equipment</strong>
                      </TableCell>
                      <TableCell align="left" sx={defaultBodyTableCell}>
                        <strong>Brand</strong>
                      </TableCell>
                      <TableCell align="left" sx={defaultBodyTableCell}>
                        <strong>Model Number</strong>
                      </TableCell>
                      <TableCell align="left" sx={defaultBodyTableCell}>
                        <strong>Serial Number</strong>
                      </TableCell>
                      <TableCell align="center" sx={defaultBodyTableCell}>
                        <strong>M-Number</strong>
                      </TableCell>
                      <TableCell align="center" sx={defaultBodyTableCell}>
                        <strong>Sale Price</strong>
                      </TableCell>
                      <TableCell align="center" sx={defaultBodyTableCell}>
                        <strong>Expiration</strong>
                      </TableCell>
                      <TableCell align="center" sx={defaultBodyTableCell}>
                        <strong>Completed</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <EquipmentTableBody
                    row={row}
                    openMaintenanceDetails={openMaintenanceDetails}
                  />
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
    );
  }

  return (
    <div>
      <BasicSearchBar
        value={query}
        setValue={maintenanceCustomerSearch}
        searchLabel={`${maintenance.length} Customers`}
        clearSearchQuery={clearSearchQuery}
      />
      <TableContainer sx={{ overflow: "auto", maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Open</TableCell>
              <TableCell align="left">Customer</TableCell>
              <TableCell align="left">Contract Address</TableCell>
              <TableCell align="center">Phone Number</TableCell>
              <TableCell align="center">Number of Units</TableCell>
            </TableRow>
          </TableHead>

          {searchableMaintenance.length > 0 ? (
            <TableBody>
              {searchableMaintenance
                .sort((a, b) => a.customerName.localeCompare(b.customerName))
                .map((customer) => (
                  <Row key={customer.customerId} row={customer} />
                ))}
            </TableBody>
          ) : (
            <TableBody>
              {maintenance
                .sort((a, b) => a.customerName.localeCompare(b.customerName))
                .map((customer) => (
                  <Row key={customer.customerId} row={customer} />
                ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <div className="buttonBar">
        {/* <MaintenanceExport maintenance={maintenance} /> */}
        <Button
          size="large"
          variant="contained"
          startIcon={<Close />}
          onClick={() => closeModalOne()}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceCustomerList;
