import { useEffect, useState } from "react";
import { db } from "../../../firebase/firestore.utils";

import { collection, onSnapshot } from "firebase/firestore";

import NoCustomerLoaded from "../../customer_information/views/NoCustomerLoaded.view";

import {
  getFormattedTime,
  getFormattedDate,
  getUnixFromDate,
} from "../../../utilities/dateUtils";

import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { NoteAdd } from "@mui/icons-material";

const CustomerNotesList = ({
  customer,
  openCreateCustomerNote,
  openCustomerNoteDetails,
}) => {
  const setNoCustomerLoaded = () => {
    console.log("No Customer Loaded");
  };

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (customer === null || customer.id === "") {
      setNoCustomerLoaded();
    } else {
      console.log("useSyncedCustomerNotes fired");
      const customerNotesColRef = collection(
        db,
        "customers",
        customer.id,
        "Activity"
      );
      const subscription = onSnapshot(customerNotesColRef, (snapshot) => {
        const source = snapshot.metadata.fromCache ? "local cache" : "server";
        console.log("customer notes data came from " + source);

        const notesArray = [];
        snapshot.forEach((doc) => {
          notesArray.push({
            ...doc.data(),
            id: doc.id,
            sortingDate: getUnixFromDate(doc.data().currentTime.toDate()),
          });
        });
        setNotes(notesArray);
        return () => subscription.unsubscribe();
      });
    }
  }, [customer]);

  // useEffect(() => {
  //   if (customer === null || customer.id === "") {
  //     setNoCustomerLoaded();
  //   } else {
  //     const customerNotesColRef = collection(
  //       db,
  //       "customers",
  //       customer.id,
  //       "Activity"
  //     );

  //     const subscribeToNotes = async () => {
  //       const data = await getDocs(customerNotesColRef);
  //       setNotes(
  //         data.docs.map((doc) => ({
  //           ...doc.data(),
  //           id: doc.id,
  //           sortingDate: getUnixFromDate(doc.data().currentTime.toDate()),
  //         }))
  //       );
  //     };
  //     subscribeToNotes();

  // const unsubscribe = onSnapshot(
  //   collection(db, "customers", customer.id, "Activity"),
  //   (snapshot) => {
  //     setNotes(
  //       snapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //         sortingDate: getUnixFromDate(doc.data().currentTime.toDate()),
  //       }))
  //     );
  //   },
  //   (error) => {
  //     console.log(error.message);
  //   }
  // );
  // return () => unsubscribe();
  //   }
  // }, [customer]);

  if (customer === null || customer.id === "") {
    return <NoCustomerLoaded />;
  } else {
    return (
      <Box
        sx={{
          bgcolor: "background.paper",
          border: 1,
          borderColor: "primary.main",
          padding: "4px",
        }}
      >
        {customer.firstname ? (
          <Typography variant="h5" gutterBottom>
            {customer.firstname} {customer.lastname} Notes
          </Typography>
        ) : (
          <Typography variant="h5" gutterBottom color="primary">
            {customer.lastname} Notes
          </Typography>
        )}
        <TableContainer
          component={Paper}
          sx={{ overflow: "auto", maxHeight: 275 }}
        >
          <Table stickyHeader size="small" aria-label="customer-notes-table">
            <TableHead>
              <TableRow>
                <TableCell align="left" sx={{ minWidth: "40px" }}>
                  Operator
                </TableCell>
                <TableCell align="left" sx={{ minWidth: "40px" }}>
                  Type
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    minWidth: "40px",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    minWidth: "40px",
                  }}
                >
                  Time
                </TableCell>
                <TableCell align="left">Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes
                .sort((a, b) => (a.sortingDate < b.sortingDate ? 1 : -1))
                .map((note) => (
                  <TableRow
                    key={note.id}
                    onClick={() => openCustomerNoteDetails(note)}
                    sx={{ cursor: "pointer" }}
                    hover
                  >
                    <TableCell align="left">{note.operator}</TableCell>
                    <TableCell align="left">{note.type}</TableCell>
                    <TableCell align="left">
                      {getFormattedDate(note.currentTime)}
                    </TableCell>
                    <TableCell align="left">
                      {getFormattedTime(note.currentTime)}
                    </TableCell>
                    <TableCell align="left">{note.details}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="buttonBar">
          {customer.id ? (
            <Button
              variant="outlined"
              startIcon={<NoteAdd />}
              onClick={() => openCreateCustomerNote()}
            >
              Add New Note
            </Button>
          ) : (
            <Button
              disabled
              variant="outlined"
              startIcon={<NoteAdd />}
              onClick={() => openCreateCustomerNote()}
            >
              Add New Note
            </Button>
          )}
        </div>
      </Box>
    );
  }
};

export default CustomerNotesList;
