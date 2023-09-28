import { db, useSyncedCollection } from "../../../firebase/firestore.utils";

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
import "../../../global_style/style.css";
import { isEqual } from "date-fns";
import { Add, Close, DeleteForever, Edit } from "@mui/icons-material";
import { collection } from "firebase/firestore";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const DayLabelEditor = ({
  closeModalTwo,
  openAddDayLabel,
  openEditDayLabel,
  openDeleteDayLabel,
  calendarDateSelected,
}) => {
  const labels = useSyncedCollection(collection(db, "calLabel"));

  return (
    <div className="container">
      <TableContainer
        component={Paper}
        sx={{ overflow: "auto", maxHeight: 400 }}
      >
        <Table stickyHeader size="medium" sx={{ border: "1px solid black" }}>
          <TableHead>
            <TableRow>
              <TableCell align="left">#</TableCell>
              <TableCell align="left">Technician</TableCell>
              <TableCell align="left">Label</TableCell>
              <TableCell align="center">Edit</TableCell>
              <TableCell align="center">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {labels.length > 0 &&
              labels
                .filter((item) =>
                  isEqual(item.labelDate.toDate(), calendarDateSelected)
                )
                .sort((a, b) => a.tech.localeCompare(b.tech))
                .map((label, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" style={{ fontSize: "20px" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell align="left" style={{ fontSize: "20px" }}>
                      {label.tech}
                    </TableCell>
                    <TableCell align="left" style={{ fontSize: "20px" }}>
                      {label.locationName}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        type="button"
                        startIcon={<Edit />}
                        onClick={() =>
                          openEditDayLabel(calendarDateSelected, label)
                        }
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        type="button"
                        startIcon={<DeleteForever />}
                        onClick={() => openDeleteDayLabel(label)}
                        color="error"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid
        container
        spacing={1.5}
        sx={{ marginTop: "8px", display: "flex", justifyContent: "end" }}
      >
        <Grid>
          <Button
            variant="contained"
            type="button"
            startIcon={<Add />}
            onClick={() => openAddDayLabel(calendarDateSelected)}
          >
            Add Label
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            type="button"
            startIcon={<Close />}
            onClick={() => closeModalTwo()}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default DayLabelEditor;
