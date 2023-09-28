import { useEffect, useRef, useState } from "react";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firestore.utils";

import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import ViewDailySlip from "./view_daily/ViewDailySlip";

import { Fab, Typography } from "@mui/material";
import { Print } from "@mui/icons-material";

const PrintDailySlips = () => {
  const location = useLocation();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventReference = collection(db, "events");
    const eventQuery = query(
      eventReference,
      where("dateScheduled", "==", location.state.date),
      where("techLead", "==", location.state.techLead)
    );

    const unsubscribe = onSnapshot(eventQuery, (snapshot) => {
      setEvents(
        snapshot.docs.map((doc) => ({
          dispatch: { ...doc.data(), id: doc.id },
          customer: { customerId: doc.data().customerId },
        }))
      );
    });

    return () => unsubscribe();
  }, [location.state.date, location.state.techLead]);

  return (
    <div className="sizeAdjustment">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" mr={2}>
          Text is not visible in dark mode yet
        </Typography>
        <Fab
          variant="extended"
          color="primary"
          onClick={handlePrint}
          sx={{ marginTop: "16px", marginRight: "60px" }}
        >
          <Print sx={{ mr: 1 }} />
          Print
        </Fab>
      </div>
      <div
        ref={componentRef}
        style={{
          display: "grid",
          gridTemplateColumns: "48%48%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {events.map((printData, index) => (
          <ViewDailySlip key={index} printData={printData} />
        ))}
      </div>
    </div>
  );
};

export default PrintDailySlips;
