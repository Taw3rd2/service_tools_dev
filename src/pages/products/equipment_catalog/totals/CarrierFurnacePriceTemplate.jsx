import EquipmentTableHead from "./page_layout_templates/EquipmentTableHead";
import PriceSheetFurnaceHeader from "./page_layout_templates/PriceSheetFurnaceHeader";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";

const CarrierFurnacePriceTemplate = ({ getUnitData, matchesPrint }) => {
  if (matchesPrint === "print") {
    return (
      <div style={{ textAlign: "center", margin: "8px" }}>
        <PriceSheetFurnaceHeader title="Carrier Furnace Pricing" />
        <div
          className="printTableHeaderText"
          style={{ margin: "4px", marginTop: "8px" }}
        >
          <strong>59SC6A</strong>
        </div>
        <div className="printTableCellText" style={{ margin: "4px" }}>
          96% Single Stage
        </div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <EquipmentTableHead />
            <TableBody>{getUnitData("59SC6A", "Up to $200")}</TableBody>
          </Table>
        </TableContainer>
        <div className="printTableHeaderText" style={{ margin: "4px" }}>
          <strong>59TN6B</strong>
        </div>
        <div className="printTableCellText" style={{ margin: "4px" }}>
          96.7 Two Stage
        </div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <EquipmentTableHead />
            <TableBody>{getUnitData("59TN6B", "Up to $200")}</TableBody>
          </Table>
        </TableContainer>
        <div className="printTableHeaderText" style={{ margin: "4px" }}>
          <strong>59MN7B</strong>
        </div>
        <div className="printTableCellText" style={{ margin: "4px" }}>
          98.5% Variable Speed
        </div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <EquipmentTableHead />
            <TableBody>{getUnitData("59MN7B", "Up to $500")}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  } else {
    return (
      <div style={{ textAlign: "center" }}>
        <PriceSheetFurnaceHeader title={"Carrier Furnace Pricing"} />
        <div className="tableHeaderText" style={{ marginTop: "8px" }}>
          <strong>59SC6A</strong>
        </div>
        <div className="tableCellText">96% Single Stage</div>
        <TableContainer component={Paper} sx={{ maxHeight: "225px" }}>
          <Table size="small" aria-label="simple table" stickyHeader>
            <EquipmentTableHead />
            <TableBody>{getUnitData("59SC6A", "Up to $200")}</TableBody>
          </Table>
        </TableContainer>
        <div className="tableHeaderText" style={{ margin: "4px" }}>
          <strong>59TN6B</strong>
        </div>
        <div className="tableCellText">96.7 Two Stage</div>
        <TableContainer component={Paper} sx={{ maxHeight: "225px" }}>
          <Table size="small" aria-label="simple table" stickyHeader>
            <EquipmentTableHead />
            <TableBody>{getUnitData("59TN6B", "Up to $200")}</TableBody>
          </Table>
        </TableContainer>
        <div className="tableHeaderText">
          <strong>59MN7B</strong>
        </div>
        <div className="tableCellText">98.5% Variable Speed</div>
        <TableContainer component={Paper} sx={{ maxHeight: "225px" }}>
          <Table size="small" aria-label="simple table" stickyHeader>
            <EquipmentTableHead />
            <TableBody>{getUnitData("59MN7B", "Up to $500")}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
};

export default CarrierFurnacePriceTemplate;
