import spinner from "./spinner.gif";
import "./spinner.css";

const Spinner = () => {
  return (
    <div className="spinnerContainer">
      <img src={spinner} alt="Loading..." className="spinnerImage" />
    </div>
  );
};

export default Spinner;
