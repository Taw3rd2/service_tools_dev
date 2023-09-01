import spinner from "./spinner.gif";
import "../../global_style/style.css";

const CalendarSpinner = () => {
  return (
    <div className="calendarSpinner">
      <img src={spinner} alt="Loading..." className="spinnerImg" />
    </div>
  );
};

export default CalendarSpinner;
