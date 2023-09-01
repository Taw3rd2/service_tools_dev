import { useState } from "react";
import { TextField } from "@mui/material";
import "../../../../global_style/style.css";
import {
  toCurrency,
  stringPriceToNumber,
} from "../../../../utilities/currencyUtils";

const PricingDetails = ({ labor, material, additions }) => {
  const hardCodedTax = 0.06;
  const [markUp, setMarkUp] = useState(1.49);

  const getTotalLaborCost = (providedLabor) => {
    let total = 0;

    if (providedLabor.length < 1) {
      return 0;
    } else {
      providedLabor.map((item, index) => {
        const sub = item.hours * item.rate;
        return (total += sub);
      });
      return total;
    }
  };

  const getTotalMaterialCost = (providedMaterial) => {
    let total = 0;
    if (providedMaterial.length < 1) {
      return 0;
    } else {
      providedMaterial.map((item, index) => {
        if (item.partCost) {
          let sub = 0;
          const convertedPartCost = stringPriceToNumber(item.partCost);
          sub = convertedPartCost * item.quantity;
          return (total += sub);
        } else {
          let sub = 0;
          const convertedEquipmentCost = stringPriceToNumber(item.cost);
          sub = convertedEquipmentCost * item.quantity;
          return (total += sub);
        }
      });
      return total;
    }
  };

  const getTotalAdditionsCost = (providedAdditions) => {
    let total = 0;
    if (providedAdditions.length < 1) {
      return 0;
    } else {
      providedAdditions.map((item, index) => {
        let sub = item.quantity * item.cost;
        return (total += sub);
      });
      return total;
    }
  };

  const getTaxedMaterial = (taxRate, mats) => {
    return taxRate * mats;
  };

  const getMarkedUpMaterial = (markUpRate, mats) => {
    return markUpRate * mats;
  };

  const getCreditCardFee = () => {
    const accumulatedAdditions = getTotalAdditionsCost(additions);
    const accumulatedMaterial = getTotalMaterialCost(material);
    const MaterialTax = accumulatedMaterial * hardCodedTax;
    const markedUpMaterial = accumulatedMaterial * markUp;
    const materialTotal = markedUpMaterial + MaterialTax;
    const laborTotal = getTotalLaborCost(labor);

    return (materialTotal + laborTotal + accumulatedAdditions) * 0.03;
  };

  const getJobTotal = () => {
    const accumulatedAdditions = getTotalAdditionsCost(additions);
    const accumulatedMaterial = getTotalMaterialCost(material);
    const MaterialTax = accumulatedMaterial * hardCodedTax;
    const markedUpMaterial = accumulatedMaterial * markUp;
    const materialTotal = markedUpMaterial + MaterialTax;
    const laborTotal = getTotalLaborCost(labor);
    const creditCardFee =
      (materialTotal + laborTotal + accumulatedAdditions) * 0.03;

    return materialTotal + laborTotal + accumulatedAdditions + creditCardFee;
  };

  return (
    <div className="worksheetContainer">
      <div className="row">
        <div className="tripleRowInput">{`Total Labor Selected: ${toCurrency(
          getTotalLaborCost(labor) / 100
        )}`}</div>
        <div className="tripleRowInput">{`Total Material: ${toCurrency(
          getTotalMaterialCost(material) / 100
        )}`}</div>
        <div className="tripleRowInput">{`Total Flat Rate Additions: ${toCurrency(
          getTotalAdditionsCost(additions) / 100
        )}`}</div>
      </div>
      <div className="row">
        <div className="tripleRowInput"></div>
        <div className="tripleRowInput">{`Hard Coded Tax: ${hardCodedTax}`}</div>
        <div className="tripleRowInput"></div>
      </div>
      <div className="row">
        <div className="tripleRowInput"></div>
        <div className="tripleRowInput">{`Total Material Tax: ${toCurrency(
          getTaxedMaterial(hardCodedTax, getTotalMaterialCost(material)) / 100
        )}`}</div>
        <div className="tripleRowInput">{`3% CC Fee: ${toCurrency(
          getCreditCardFee() / 100
        )}`}</div>
      </div>
      <div className="row">
        <div className="tripleRowInput"></div>
        <div className="tripleRowInput">{`Total Marked Up Material: ${toCurrency(
          getMarkedUpMaterial(markUp, getTotalMaterialCost(material)) / 100
        )}`}</div>
        <div className="tripleRowInput"></div>
      </div>
      <div className="row">
        <div className="tripleRowInput"></div>
        <div className="tripleRowInput">
          <TextField
            label="Mark Up"
            fullWidth
            value={markUp}
            onChange={(e) => setMarkUp(e.target.value)}
          />
        </div>
        <div
          className="tripleRowInput"
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "24px",
            color: "blue",
          }}
        >
          <div>{`Job Total: ${toCurrency(getJobTotal() / 100)}`}</div>
        </div>
      </div>
    </div>
  );
};

export default PricingDetails;
