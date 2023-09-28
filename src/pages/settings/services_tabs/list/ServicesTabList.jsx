import { db, useSyncedCollection } from "../../../../firebase/firestore.utils";

import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Add, DeleteForever, Edit } from "@mui/icons-material";
import "../../../../global_style/style.css";
import { collection } from "firebase/firestore";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import "../../../../global_style/style.css";

const ServicesTabList = ({ openServicesTabDetails, openDeleteServicesTab }) => {
  const servicesTabs = useSyncedCollection(collection(db, "servicesTabs"));
  return (
    <div className="sizeAdjustment">
      <TableContainer
        component={Paper}
        sx={{ overflow: "auto", maxHeight: 275 }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{ width: 25, fontSize: 20, fontWeight: "bold" }}
              >
                #
              </TableCell>
              <TableCell align="left" sx={{ fontSize: 20, fontWeight: "bold" }}>
                Tab
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 20, fontWeight: "bold" }}
              >
                Edit
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 20, fontWeight: "bold" }}
              >
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicesTabs
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((tab, index) => (
                <TableRow key={tab.id} sx={{ cursor: "pointer" }}>
                  <TableCell align="left" padding="none" sx={{ fontSize: 20 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="left" padding="none" sx={{ fontSize: 20 }}>
                    {tab.name}
                  </TableCell>
                  <TableCell
                    align="center"
                    padding="none"
                    sx={{ fontSize: 20 }}
                  >
                    <IconButton onClick={() => openServicesTabDetails(tab)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                  <TableCell
                    align="center"
                    padding="none"
                    sx={{ fontSize: 20 }}
                  >
                    <IconButton
                      onClick={() => openDeleteServicesTab(tab)}
                      color="error"
                    >
                      <DeleteForever />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid
        container
        spacing={1.5}
        sx={{ display: "flex", justifyContent: "end" }}
      >
        <Grid>
          <Button
            variant="contained"
            type="button"
            startIcon={<Add />}
            onClick={() => openServicesTabDetails()}
            sx={{ marginTop: "8px" }}
          >
            Add Services Tab
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ServicesTabList;
