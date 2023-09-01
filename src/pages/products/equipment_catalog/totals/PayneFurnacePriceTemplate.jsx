import EquipmentTableHead from "./page_layout_templates/EquipmentTableHead";
import PriceSheetFurnaceHeader from "./page_layout_templates/PriceSheetFurnaceHeader";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";

const PayneFurnacePriceTemplate = ({ getUnitData, matchesPrint }) => {
  if (matchesPrint === "print") {
    return (
      <div style={{ textAlign: "center", margin: "8px" }}>
        <PriceSheetFurnaceHeader title={"Payne Furance Pricing"} />
        <div
          className="printTableHeaderText"
          style={{ margin: "4px", marginTop: "8px" }}
        >
          <strong>PG80ESAA</strong>
        </div>
        <div className="printTableCellText" style={{ margin: "4px" }}>
          80% Single Stage
        </div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <EquipmentTableHead />
            <TableBody>{getUnitData("PG80ESAA", "No Rebate")}</TableBody>
          </Table>
        </TableContainer>
        <div className="printTableHeaderText" style={{ margin: "4px" }}>
          <strong>PG95ESAA</strong>
        </div>
        <div className="printTableCellText" style={{ margin: "4px" }}>
          96% One Stage
        </div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <EquipmentTableHead />
            <TableBody>{getUnitData("PG95ESAA", "Up to $200")}</TableBody>
          </Table>
        </TableContainer>
        <div className="printTableHeaderText" style={{ margin: "4px" }}>
          <strong>PG96VTAA</strong>
        </div>
        <div className="printTableCellText" style={{ margin: "4px" }}>
          96% Two Stage
        </div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <EquipmentTableHead />
            <TableBody>{getUnitData("PG96VTAA", "Up to $200")}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  } else {
    return (
      <div style={{ textAlign: "center" }}>
        <PriceSheetFurnaceHeader title={"Payne Furnace Pricing"} />
        <div className="tableHeaderText" style={{ marginTop: "8px" }}>
          <strong>PG80ESAA</strong>
        </div>
        <div className="tableCellText">80% Single Stage</div>
        <TableContainer component={Paper} sx={{ maxHeight: "225px" }}>
          <Table size="small" aria-label="simple table" stickyHeader>
            <EquipmentTableHead />
            <TableBody>{getUnitData("PG80ESAA", "No Rebate")}</TableBody>
          </Table>
        </TableContainer>

        <div className="tableHeaderText">
          <strong>PG95ESAA</strong>
        </div>
        <div className="tableCellText">96% One Stage</div>
        <TableContainer component={Paper} sx={{ maxHeight: "225px" }}>
          <Table size="small" aria-label="simple table" stickyHeader>
            <EquipmentTableHead />
            <TableBody>{getUnitData("PG95ESAA", "Up to $200")}</TableBody>
          </Table>
        </TableContainer>

        <div className="tableHeaderText">
          <strong>PG96VTAA</strong>
        </div>
        <div className="tableCellText">96% Two Stage</div>
        <TableContainer component={Paper} sx={{ maxHeight: "225px" }}>
          <Table size="small" aria-label="simple table" stickyHeader>
            <EquipmentTableHead />
            <TableBody>{getUnitData("PG96VTAA", "Up to $200")}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
};

export default PayneFurnacePriceTemplate;
