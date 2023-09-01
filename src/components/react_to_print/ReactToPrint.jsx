import { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import ComponentToPrint from "../../pages/products/equipment_catalog/totals/ComponentToPrint";
import { Close, Print } from "@mui/icons-material";

export const ReactToPrint = ({ equipmentType, closeModalOne }) => {
  const componentRef = useRef(null);

  const onBeforeGetContentResolve = useRef(null);

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("old boring text");
  const [matchesPrint, setMatchesPrint] = useState("standard");

  const handleAfterPrint = useCallback(() => {
    setMatchesPrint("standard");
  }, []);

  const handleBeforePrint = useCallback(() => {}, []);

  const handleOnBeforeGetContent = useCallback(() => {
    setMatchesPrint("print");
    setLoading(true);
    setText("Loading new text...");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText("New, Updated Text!");
        resolve();
      }, 2000);
    });
  }, [setLoading, setText]);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, []);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "AwesomeFileName",
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (
      text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
  }, [text]);

  return (
    <div>
      {loading && (
        <p className="worksheetTitle" style={{ color: "red" }}>
          Loading into print preview
        </p>
      )}
      <ComponentToPrint
        ref={componentRef}
        text={text}
        equipmentType={equipmentType}
        matchesPrint={matchesPrint}
      />
      <div className="buttonBar">
        <button className="standardButton" onClick={handlePrint}>
          <Print />
          <span className="iconSeperation">Print</span>
        </button>
        <button className="standardButton" onClick={() => closeModalOne()}>
          <Close />
          <span className="iconSeperation">Close</span>
        </button>
      </div>
    </div>
  );
};
