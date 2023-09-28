import { useState } from "react";
import { useTheme } from "@mui/material";

import Chevron from "./chevron.svg";
import "./Accordion.css";

const Accordion = ({ title, height, content }) => {
  const [toggleOpen, setToggleOpen] = useState(false);

  const primaryColor = useTheme().palette.primary.main;

  const toggleState = (e) => {
    setToggleOpen(!toggleOpen);
  };

  return (
    <div className="accordion">
      <div
        className="accordion-visible"
        onClick={toggleState}
        style={{ background: primaryColor }}
      >
        <span>{title}</span>
        <img className={toggleOpen ? "active" : ""} src={Chevron} alt="arrow" />
      </div>
      <div
        className={
          toggleOpen ? "accordion-toggle animated" : "accordion-toggle"
        }
        style={{ height: toggleOpen ? `${height}` : "0px" }}
      >
        {content}
      </div>
    </div>
  );
};

export default Accordion;
