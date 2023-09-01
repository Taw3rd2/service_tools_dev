import { forwardRef } from "react";
import PrintEquipmentPriceSheets from "./PrintEquipmentPriceSheets";

const ComponentToPrint = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <PrintEquipmentPriceSheets
        equipmentType={props.equipmentType}
        matchesPrint={props.matchesPrint}
      />
    </div>
  );
});

export default ComponentToPrint;
