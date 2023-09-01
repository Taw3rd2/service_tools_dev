import { Close } from "@mui/icons-material";
import "../../../global_style/style.css";

const SameTech = ({ closeModalTwo }) => {
  return (
    <div className="container">
      <div className="deleteWarningText">
        Lead and Helper can not be the same
      </div>
      <div className="buttonBar">
        <button
          type="button"
          className="standardButton"
          onClick={() => closeModalTwo()}
        >
          <Close />
          <span className="iconSeperation">Close</span>
        </button>
      </div>
    </div>
  );
};

export default SameTech;
