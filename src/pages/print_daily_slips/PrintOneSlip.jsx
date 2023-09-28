import { useRef } from "react";
import { useLocation } from "react-router-dom";

//import PrintDailySlip from "./print_daily/PrintDailySlip";
import ViewDailySlip from "./view_daily/ViewDailySlip";

import { Fab, Typography } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { Print } from "@mui/icons-material";

const PrintOneSlip = () => {
  //const matchesPrint = useMediaQuery("print");
  const location = useLocation();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const dispatches = [];
  const customerAndDispatch = location.state;

  dispatches.push(customerAndDispatch);

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
        {dispatches.map((printData, index) => (
          <ViewDailySlip key={index} printData={printData} />
        ))}
      </div>
    </div>
  );
};

export default PrintOneSlip;
