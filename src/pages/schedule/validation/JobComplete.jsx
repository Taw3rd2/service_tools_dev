import { Close } from "@mui/icons-material";
import "../../../global_style/style.css";

const JobComplete = ({ closeModalTwo }) => {
  return (
    <div className="container">
      <div className="deleteWarningText">This job is already complete</div>
      <ul>
        <li>
          This dispatch has been marked "Done" or "Parts Needed" by the
          Technician
        </li>
        <li>Maybe you should start a new job?</li>
      </ul>
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

export default JobComplete;
