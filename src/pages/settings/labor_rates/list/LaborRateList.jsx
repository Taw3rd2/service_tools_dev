import { db, useSyncedCollection } from "../../../../firebase/firestore.utils";
import { toCurrency } from "../../../../utilities/currencyUtils";

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

const LaborRateList = ({ openLaborRateDetails, openDeleteLaborRate }) => {
  const laborRate = useSyncedCollection(collection(db, "laborRate"));

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
                Description
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 20, fontWeight: "bold" }}
              >
                Rate
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
            {laborRate &&
              laborRate
                .sort((a, b) => a.rate - b.rate)
                .map((labRate, index) => (
                  <TableRow key={labRate.id} sx={{ cursor: "pointer" }}>
                    <TableCell
                      align="left"
                      padding="none"
                      sx={{ fontSize: 20 }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      align="left"
                      padding="none"
                      sx={{ fontSize: 20 }}
                    >
                      {labRate.rateDescription}
                    </TableCell>
                    <TableCell
                      align="center"
                      padding="none"
                      sx={{ fontSize: 20 }}
                    >
                      {toCurrency(labRate.rate / 100)}
                    </TableCell>
                    <TableCell align="center" padding="none">
                      <IconButton onClick={() => openLaborRateDetails(labRate)}>
                        <Edit />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center" padding="none">
                      <IconButton
                        onClick={() => openDeleteLaborRate(labRate)}
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
            onClick={() => openLaborRateDetails()}
            sx={{ marginTop: "8px" }}
          >
            Add Labor Rate
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default LaborRateList;
