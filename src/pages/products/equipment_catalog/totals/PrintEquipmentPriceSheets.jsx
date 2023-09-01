import CarrierACPriceTemplate from "./CarrierACPriceTemplate";
import CarrierFurnacePriceTemplate from "./CarrierFurnacePriceTemplate";
import PayneACPriceTemplate from "./PayneACPriceTemplate";
import PayneFurnacePriceTemplate from "./PayneFurnacePriceTemplate";
import {
  buildAdditionsPrices,
  buildLaborPrices,
  buildMaterialPrices,
  fetchEquipmentByModel,
} from "./equipmentFunctions";
import { db, useSyncedCollection } from "../../../../firebase/firestore.utils";
import { toCurrency } from "../../../../utilities/currencyUtils";
import { TableCell, TableRow, styled, tableCellClasses } from "@mui/material";
import { collection } from "firebase/firestore";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid gray",
  },
}));

const PrintEquipmentPriceSheets = ({ equipmentType, matchesPrint }) => {
  const equipment = useSyncedCollection(collection(db, "equipment"));
  const parts = useSyncedCollection(collection(db, "parts"));
  const services = useSyncedCollection(collection(db, "services"));

  //get unit data

  //return a table body with the size, and cost
  const getUnitData = (unitModel, rebate) => {
    //find the units that match the model number supplied, and store them in filteredUnits
    const foundUnits = fetchEquipmentByModel(unitModel, equipment);

    return foundUnits
      .sort((a, b) => a.model.localeCompare(b.model))
      .map((unit) => {
        const lbr = buildLaborPrices(unit);
        const markedUpMaterial = buildMaterialPrices(unit, parts) * 1.49;
        const materialTaxes = buildMaterialPrices(unit, parts) * 0.06;
        const mat = markedUpMaterial + materialTaxes;
        const ads = buildAdditionsPrices(unit, services);
        const subTotal = lbr + mat + ads;
        const threePercentCCFee = subTotal * 0.03;
        const unitCost = threePercentCCFee + subTotal;
        if (matchesPrint === "print") {
          return (
            <TableRow key={unit.id}>
              <StyledTableCell align="center">
                <div className="printTableCellText">{unit.btu}</div>
              </StyledTableCell>
              <StyledTableCell align="center">
                <div className="printTableCellText">{unit.size}</div>
              </StyledTableCell>
              <StyledTableCell align="center">
                <div className="printTableCellText">
                  {toCurrency(unitCost / 100)}
                </div>
              </StyledTableCell>
              <StyledTableCell align="center">
                <div className="printTableCellText">{rebate}</div>
              </StyledTableCell>
              <StyledTableCell align="center">
                <div className="printTableCellText">{unit.dateUpdated}</div>
              </StyledTableCell>
            </TableRow>
          );
        } else {
          return (
            <TableRow key={unit.id}>
              <StyledTableCell align="center">
                <div className="tableCellText">{unit.btu}</div>
              </StyledTableCell>
              <StyledTableCell align="center">
                <div className="tableCellText">{unit.size}</div>
              </StyledTableCell>
              <StyledTableCell align="center">
                <div className="tableCellText">
                  {toCurrency(unitCost / 100)}
                </div>
              </StyledTableCell>
              <StyledTableCell align="center">
                <div className="tableCellText">{rebate}</div>
              </StyledTableCell>
              <StyledTableCell align="center">
                <div className="tableCellText">{unit.dateUpdated}</div>
              </StyledTableCell>
            </TableRow>
          );
        }
      });
  };

  if (equipmentType === "CarrierFurnace") {
    return (
      <CarrierFurnacePriceTemplate
        getUnitData={getUnitData}
        matchesPrint={matchesPrint}
      />
    );
  } else if (equipmentType === "PayneFurnace") {
    return (
      <PayneFurnacePriceTemplate
        getUnitData={getUnitData}
        matchesPrint={matchesPrint}
      />
    );
  } else if (equipmentType === "CarrierAC") {
    return (
      <CarrierACPriceTemplate
        getUnitData={getUnitData}
        matchesPrint={matchesPrint}
      />
    );
  } else {
    return (
      <PayneACPriceTemplate
        getUnitData={getUnitData}
        matchesPrint={matchesPrint}
      />
    );
  }
};

export default PrintEquipmentPriceSheets;
