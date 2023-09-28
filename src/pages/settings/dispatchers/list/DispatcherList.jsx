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
import "../../../../global_style/style.css";
import { Add, DeleteForever, Edit } from "@mui/icons-material";
import { collection } from "firebase/firestore";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import "../../../../global_style/style.css";

const DispatcherList = ({ openDispatcherDetails, openDeleteDispatcher }) => {
  const dispatchers = useSyncedCollection(collection(db, "dispatchers"));

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
                  <TableCell align="left" padding="none" sx={{ fontSize: 20 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="left" padding="none" sx={{ fontSize: 20 }}>
                    {dispatcher.name}
                  </TableCell>
                  <TableCell align="center" padding="none">
                    <IconButton
                      onClick={() => openDispatcherDetails(dispatcher)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center" padding="none">
                    <IconButton
                      onClick={() => openDeleteDispatcher(dispatcher)}
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
            onClick={() => openDispatcherDetails()}
            sx={{ marginTop: "8px" }}
          >
            Add Dispatcher
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default DispatcherList;
