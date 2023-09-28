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

const WorkList = ({ openWorkListItemDetails, openDeleteWorkListItem }) => {
  const workList = useSyncedCollection(collection(db, "workList"));

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
                  <TableCell align="left" padding="none" sx={{ fontSize: 20 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="left" padding="none" sx={{ fontSize: 20 }}>
                    {option.item}
                  </TableCell>
                  <TableCell
                    align="center"
                    padding="none"
                    sx={{ fontSize: 20 }}
                  >
                    {option.shorthand}
                  </TableCell>
                  <TableCell
                    align="center"
                    padding="none"
                    sx={{ fontSize: 20 }}
                  >
                    <IconButton onClick={() => openWorkListItemDetails(option)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                  <TableCell align="left" padding="none" sx={{ fontSize: 20 }}>
                    <IconButton
                      onClick={() => openDeleteWorkListItem(option)}
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
            onClick={() => openWorkListItemDetails()}
            sx={{ marginTop: "8px" }}
          >
            Add Work Item
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default WorkList;
