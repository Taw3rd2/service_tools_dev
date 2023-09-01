import EquipmentTableHead from "./page_layout_templates/EquipmentTableHead";
import PriceSheetACHeader from "./page_layout_templates/PriceSheetACHeader";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";

const PayneACPriceTemplate = ({ getUnitData, matchesPrint }) => {
  if (matchesPrint === "print") {
    return (
      <div style={{ textAlign: "center", margin: "8px" }}>
        <PriceSheetACHeader title={"Payne Air Conditioner Pricing"} />
        <div
          className="printTableHeaderText"
          style={{ margin: "4px", marginTop: "8px" }}
        >
          <strong>PA4SAN</strong>
        </div>
        <div className="printTableCellText" style={{ margin: "4px" }}>
          14 Seer Single Speed
        </div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <EquipmentTableHead />
            <TableBody>{getUnitData("PA4SAN", "No Rebate")}</TableBody>
          </Table>
        </TableContainer>

        <div className="printTableHeaderText" style={{ margin: "4px" }}>
          <strong>PA5SAN</strong>
        </div>
        <div className="printTableCellText" style={{ margin: "4px" }}>
          15 Seer Single Speed
        </div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <EquipmentTableHead />
            <TableBody>{getUnitData("PA5SAN", "No Rebate")}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  } else {
    return (
      <div style={{ textAlign: "center" }}>
        <PriceSheetACHeader title={"Payne Air Conditioner Pricing"} />
        <div className="tableHeaderText" style={{ marginTop: "8px" }}>
          <strong>PA4SAN</strong>
        </div>
        <div className="tableCellText">14 Seer Single Speed</div>
        <TableContainer component={Paper} sx={{ maxHeight: "225px" }}>
          <Table size="small" aria-label="simple table" stickyHeader>
            <EquipmentTableHead />
            <TableBody>{getUnitData("PA4SAN", "No Rebate")}</TableBody>
          </Table>
        </TableContainer>
        <div className="tableHeaderText">
          <strong>PA5SAN</strong>
        </div>
        <div className="tableCellText">15 Seer Single Speed</div>
        <TableContainer component={Paper} sx={{ maxHeight: "225px" }}>
          <Table size="small" aria-label="simple table" stickyHeader>
            <EquipmentTableHead />
            <TableBody>{getUnitData("PA5SAN", "No Rebate")}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
};

export default PayneACPriceTemplate;
