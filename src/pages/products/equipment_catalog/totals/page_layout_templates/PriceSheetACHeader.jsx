const PriceSheetACHeader = ({ title }) => {
  return (
    <div>
      <div className="printPageHeaderText">{title}</div>
      <div className="printPageCaptionText">
        <strong>Ranch</strong>: Sq Ft x 18 = BTU's <strong>2-story</strong>: Sq
        Ft x 23 = BTU's
      </div>
      <div className="printPageCaptionText">
        <strong>Thermostat Rebates: $10.00 Programmable, $100.00 WiFi</strong>
      </div>
      <div className="printPageCaptionText">
        <strong>
          Full model numbers are needed for consumers rebate approval
        </strong>
      </div>
    </div>
  );
};

export default PriceSheetACHeader;
