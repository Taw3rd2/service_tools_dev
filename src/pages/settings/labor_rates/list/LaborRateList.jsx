import { db, useSyncedCollection } from "../../../../firebase/firestore.utils";
import { toCurrency } from "../../../../utilities/currencyUtils";

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

const LaborRateList = ({ openLaborRateDetails, openDeleteLaborRate }) => {
  const laborRate = useSyncedCollection(collection(db, "laborRate"));

  return (
    <div className="settingsCard">
      <div className="settingsCardTitle">Labor Rate</div>
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
                    <TableCell align="left" sx={{ fontSize: 20 }}>
                      {index + 1}
                    </TableCell>
                    <TableCell align="left" sx={{ fontSize: 20 }}>
                      {labRate.rateDescription}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: 20 }}>
                      {toCurrency(labRate.rate / 100)}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => openLaborRateDetails(labRate)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DeleteForever />}
                        onClick={() => openDeleteLaborRate(labRate)}
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
          onClick={() => openLaborRateDetails()}
        >
          <Add />
          <span className="iconSeperation">Add Labor Rate</span>
        </button>
      </div>
    </div>
  );
};

export default LaborRateList;
