import { db, useSyncedCollection } from "../../../firebase/firestore.utils";

import {
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
                      <button
                        type="button"
                        className="standardButton"
                        onClick={() =>
                          openEditDayLabel(calendarDateSelected, label)
                        }
                      >
                        <Edit />
                        <span className="iconSeperation">Edit</span>
                      </button>
                    </TableCell>
                    <TableCell align="center">
                      <button
                        type="button"
                        className="deleteButton"
                        onClick={() => openDeleteDayLabel(label)}
                      >
                        <DeleteForever />
                        <span className="iconSeperation">Delete</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="buttonBar">
        <button
          type="button"
          className="standardButton"
          onClick={() => openAddDayLabel(calendarDateSelected)}
        >
          <Add />
          <span className="iconSeperation">Add Label</span>
        </button>
        <button
          type="button"
          className="standardButton"
          onClick={() => closeModalTwo()}
        >
          <Close />
          <span className="iconSeperation">Close</span>
        </button>
      </div>
    </div>
  );
};

export default DayLabelEditor;
