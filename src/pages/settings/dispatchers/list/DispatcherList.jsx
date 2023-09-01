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

const DispatcherList = ({ openDispatcherDetails, openDeleteDispatcher }) => {
  const dispatchers = useSyncedCollection(collection(db, "dispatchers"));

  return (
    <div className="settingsCard">
      <div className="settingsCardTitle">Dispatchers</div>
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
                Dispatcher
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
            {dispatchers
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((dispatcher, index) => (
                <TableRow key={dispatcher.id} sx={{ cursor: "pointer" }}>
                  <TableCell align="left" sx={{ fontSize: 20 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: 20 }}>
                    {dispatcher.name}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => openDispatcherDetails(dispatcher)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<DeleteForever />}
                      onClick={() => openDeleteDispatcher(dispatcher)}
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
          onClick={() => openDispatcherDetails()}
        >
          <Add />
          <span className="iconSeperation">Add Dispatcher</span>
        </button>
      </div>
    </div>
  );
};

export default DispatcherList;
