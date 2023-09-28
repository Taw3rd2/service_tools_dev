import { collection, query, where } from "firebase/firestore";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";
import { getFormattedDate } from "../../../utilities/dateUtils";
import { Close } from "@mui/icons-material";
import "../../../global_style/style.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Button,
} from "@mui/material";
import { defaultBodyTableCell } from "../../../theme/Theme";

const DispatchList = ({ customer, openDispatchDetails, closeModalOne }) => {
  const dispatchQuery = query(
    collection(db, "events"),
    where("customerId", "==", customer.id)
  );
  const dispatches = useSyncedCollection(dispatchQuery);

  return (
    <div>
      <TableContainer sx={{ overflow: "auto", maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Issue</TableCell>
              <TableCell align="center">Job Number</TableCell>
              <TableCell align="center">Tech Lead</TableCell>
              <TableCell align="center">Tech Assisting</TableCell>
              <TableCell align="left">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dispatches.length > 0 &&
              dispatches
                .sort((a, b) => b.scheduledDate - a.scheduledDate)
                .map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ cursor: "pointer" }}
                    onClick={() => openDispatchDetails(item)}
                    hover
                  >
                    <TableCell align="center" sx={defaultBodyTableCell}>
                      {getFormattedDate(item.dateScheduled)}
                    </TableCell>
                    <TableCell align="center" sx={defaultBodyTableCell}>
                      {item.issue}
                    </TableCell>
                    <TableCell align="center" sx={defaultBodyTableCell}>
                      {item.jobNumber}
                    </TableCell>
                    <TableCell align="center" sx={defaultBodyTableCell}>
                      {item.techLead}
                    </TableCell>
                    <TableCell align="center" sx={defaultBodyTableCell}>
                      {item.techHelper}
                    </TableCell>
                    <TableCell align="left" sx={defaultBodyTableCell}>
                      {item.status}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="buttonBar">
        <Button
          variant="contained"
          type="button"
          onClick={() => closeModalOne()}
          startIcon={<Close />}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default DispatchList;
