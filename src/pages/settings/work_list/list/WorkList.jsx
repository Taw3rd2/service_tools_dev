import { db, useSyncedCollection } from "../../../../firebase/firestore.utils";

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
import "../../../../global_style/style.css";
import { Add, DeleteForever, Edit } from "@mui/icons-material";
import { collection } from "firebase/firestore";

const WorkList = ({ openWorkListItemDetails, openDeleteWorkListItem }) => {
  const workList = useSyncedCollection(collection(db, "workList"));

  return (
    <div className="settingsCard">
      <div className="settingsCardTitle">Work List</div>
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
                Work Item
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 20, fontWeight: "bold" }}
              >
                Shorthand
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
            {workList
              .sort((a, b) => a.item.localeCompare(b.item))
              .map((option, index) => (
                <TableRow key={option.id} sx={{ cursor: "pointer" }}>
                  <TableCell align="left" sx={{ fontSize: 20 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: 20 }}>
                    {option.item}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: 20 }}>
                    {option.shorthand}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: 20 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => openWorkListItemDetails(option)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: 20 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<DeleteForever />}
                      onClick={() => openDeleteWorkListItem(option)}
                      style={{ color: "red" }}
                    >
                      Delete
                    </Button>
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
          onClick={() => openWorkListItemDetails()}
        >
          <Add />
          <span className="iconSeperation">Add Work Item</span>
        </button>
      </div>
    </div>
  );
};

export default WorkList;
