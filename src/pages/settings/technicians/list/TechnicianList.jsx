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
import { collection } from "firebase/firestore";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import "../../../../global_style/style.css";

const TechnicianList = ({ openTechnicianDetails, openDeleteTechnician }) => {
  const technicians = useSyncedCollection(collection(db, "technicians"));
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
                Technician
              </TableCell>
              <TableCell align="left" sx={{ fontSize: 20, fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 20, fontWeight: "bold" }}
              >
                Color
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 20, fontWeight: "bold" }}
              >
                Edit
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 20, fontWeight: "Bold" }}
              >
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {technicians
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((technician, index) => (
                <TableRow key={technician.id} sx={{ cursor: "pointer" }}>
                  <TableCell align="left" padding="none" sx={{ fontSize: 20 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="left" padding="none" sx={{ fontSize: 20 }}>
                    {technician.name}
                  </TableCell>
                  <TableCell align="left" padding="none" sx={{ fontSize: 20 }}>
                    {technician.email}
                  </TableCell>
                  <TableCell
                    align="center"
                    padding="none"
                    sx={{
                      fontSize: 20,
                      backgroundColor: technician.color,
                      color: "white",
                    }}
                  >
                    {technician.color}
                  </TableCell>
                  <TableCell align="center" padding="none">
                    <IconButton
                      onClick={() => openTechnicianDetails(technician)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center" padding="none">
                    <IconButton
                      onClick={() => openDeleteTechnician(technician)}
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
            onClick={() => openTechnicianDetails()}
            sx={{ marginTop: "8px" }}
          >
            Add Technician
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default TechnicianList;
