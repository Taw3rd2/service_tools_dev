import EquipmentTableHead from "./page_layout_templates/EquipmentTableHead";
import PriceSheetACHeader from "./page_layout_templates/PriceSheetACHeader";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";

const CarrierACPriceTemplate = ({ getUnitData, matchesPrint }) => {
  if (matchesPrint === "print") {
    return (
      <div style={{ textAlign: "center", margin: "16px" }}>
        <PriceSheetACHeader title={"Carrier Air Conditioner Pricing"} />
        <div
          className="printTableHeaderText"
          style={{ margin: "4px", marginTop: "8px" }}
        >
          <strong>24SCA4</strong>
        </div>
        <div className="printTableCellText" style={{ margin: "4px" }}>
          14 Seer Single Speed
        </div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <EquipmentTableHead />
            <TableBody>{getUnitData("24SCA4", "No Rebate")}</TableBody>
          </Table>
        </TableContainer>
        <div className="printTableHeaderText" style={{ margin: "4px" }}>
          <strong>24SCA5</strong>
        </div>
        <div className="printTableCellText" style={{ margin: "4px" }}>
          15 Seer Single Speed
        </div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <EquipmentTableHead />
            <TableBody>{getUnitData("24SCA5", "No Rebate")}</TableBody>
          </Table>
        </TableContainer>
        <div className="printTableHeaderText" style={{ margin: "4px" }}>
          <strong>24VNA6</strong>
        </div>
        <div className="printTableCellText" style={{ margin: "4px" }}>
          26 Seer Variable Speed Infinity
        </div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <EquipmentTableHead />
            <TableBody>{getUnitData("24VNA6", "Undetermined")}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  } else {
    return (
      <div style={{ textAlign: "center" }}>
        <PriceSheetACHeader title={"Carrier Air Conditioner Pricing"} />
        <div className="tableHeaderText" style={{ marginTop: "8px" }}>
          <strong>24SCA4</strong>
        </div>
        <div className="tableCellText">14 Seer Single Speed</div>
        <TableContainer component={Paper} sx={{ maxHeight: "225px" }}>
          <Table size="small" aria-label="simple table" stickyHeader>
            <EquipmentTableHead />
            <TableBody>{getUnitData("24SCA4", "No Rebate")}</TableBody>
          </Table>
        </TableContainer>
        <div className="tableHeaderText">
          <strong>24SCA5</strong>
        </div>
        <div className="tableCellText">15 Seer Single Speed</div>
        <TableContainer component={Paper} sx={{ maxHeight: "225px" }}>
          <Table size="small" aria-label="simple table" stickyHeader>
            <EquipmentTableHead />
            <TableBody>{getUnitData("24SCA5", "No Rebate")}</TableBody>
          </Table>
        </TableContainer>
        <div className="tableHeaderText">
          <strong>24VNA6</strong>
        </div>
        <div className="tableCellText">26 Seer Variable Speed Infinity</div>
        <TableContainer component={Paper} sx={{ maxHeight: "225px" }}>
          <Table size="small" aria-label="simple table" stickyHeader>
            <EquipmentTableHead />
            <TableBody>{getUnitData("24VNA6", "Undetermined")}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
};

export default CarrierACPriceTemplate;
