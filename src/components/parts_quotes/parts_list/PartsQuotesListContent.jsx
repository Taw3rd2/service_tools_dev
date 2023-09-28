import React from "react";
import { collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { db, useSyncedCollection } from "../../../firebase/firestore.utils";

import { getFormattedDate } from "../../../utilities/dateUtils";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {
  Button,
  Paper,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  TableContainer,
} from "@mui/material";
import { Close } from "@mui/icons-material";

import { defaultBodyTableCell } from "../../../theme/Theme";

const PartsQuotesListContent = ({ customer, closeBasicModal }) => {
  const quoteList = useSyncedCollection(
    collection(db, "customers", customer.id, "partsQuotes")
  );

  const navigate = useNavigate();

  const routeToPartsQuoteDetails = (quote) => {
    if (quote) {
      const quoteData = quote;
      if (quoteData.dateStarted) {
        const dateStartedConversion = quoteData.dateStarted.toDate();
        quoteData.dateStarted = dateStartedConversion;
      }
      if (quoteData.dateQuoted) {
        const dateQuotedConversion = quoteData.dateQuoted.toDate();
        quoteData.dateQuoted = dateQuotedConversion;
      }
      navigate("/parts_quote", {
        state: {
          selectedEquipment: {
            equipmentName: quote.equipmentName,
            equipmentBrand: quote.equipmentBrand,
            equipmentModel: quote.equipmentModel,
            equipmentSerial: quote.equipmentSerial,
          },
          customer: customer,
          quoteData: quoteData,
        },
      });
    }
  };

  return (
    <div style={{ padding: "8px" }}>
      <Grid2 container spacing={2}>
        <Grid2 xs={12}>
          <TableContainer
            component={Paper}
            sx={{ overflow: "auto", maxHeight: 440, marginTop: "8px" }}
          >
            <Table
              stickyHeader
              size="small"
              aria-label="parts-quote-list-table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">Date Started</TableCell>
                  <TableCell align="center">Equipment</TableCell>
                  <TableCell align="center">Date Quoted</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quoteList.map((quote) => (
                  <TableRow
                    key={quote.id}
                    sx={{ cursor: "pointer" }}
                    onClick={() => routeToPartsQuoteDetails(quote)}
                  >
                    <TableCell align="center" sx={defaultBodyTableCell}>
                      {getFormattedDate(quote.dateStarted)}
                    </TableCell>
                    <TableCell align="center" sx={defaultBodyTableCell}>
                      {quote.equipmentName}
                    </TableCell>
                    {quote.dateQuoted ? (
                      <TableCell align="center" sx={defaultBodyTableCell}>
                        {getFormattedDate(quote.dateQuoted)}
                      </TableCell>
                    ) : (
                      <TableCell align="center" sx={defaultBodyTableCell}>
                        {"Not Quoted"}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid2>
      </Grid2>
      <Grid2
        container
        alignItems="flex-start"
        justifyContent="flex-end"
        direction="row"
      >
        <Button
          variant="contained"
          startIcon={<Close />}
          onClick={() => closeBasicModal()}
          sx={{ marginTop: "8px" }}
        >
          Close
        </Button>
      </Grid2>
    </div>
  );
};

export default PartsQuotesListContent;
