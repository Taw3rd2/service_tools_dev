import { useContext } from "react";
import { ToastContext } from "../../../context/toastContext";
import {
  CancelPresentation,
  CheckCircle,
  Error,
  Info,
  Warning,
} from "@mui/icons-material";
import "../../../global_style/style.css";

const Toast = () => {
  const { state, dispatch } = useContext(ToastContext);

  const getIcon = (type) => {
    switch (type) {
      case "INFO":
        return <Info />;
      case "SUCCESS":
        return <CheckCircle />;
      case "WARNING":
        return <Warning />;
      case "ERROR":
        return <Error />;
      default:
        return;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case "INFO":
        return "#5bc0de";
      case "SUCCESS":
        return "#5cb85c";
      case "WARNING":
        return "#f0ad4e";
      case "ERROR":
        return "#d9534f";
      default:
        return;
    }
  };

  return (
    <div
      className="notificationContainer notificationPosition"
      style={{ boxSizing: "unset" }}
    >
      {state.map((notification, index) => {
        setTimeout(() => {
          dispatch({
            type: "DELETE_NOTIFICATION",
            payload: notification.id,
          });
        }, 5000);
        return (
          <div
            key={notification.id}
            className="notification toast"
            style={{ backgroundColor: getBackgroundColor(notification.type) }}
          >
            <CancelPresentation
              className="notificationClose"
              onClick={() =>
                dispatch({
                  type: "DELETE_NOTIFICATION",
                  payload: notification.id,
                })
              }
            />
            <div className="notificationIcon">{getIcon(notification.type)}</div>
            <div>
              <p className="notificationTitle">{notification.title}</p>
              <p className="notificationMessage">{notification.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
