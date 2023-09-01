import "../../../global_style/style.css";
import { useTheme } from "@mui/material/styles";

const ModalOne = ({
  modalOneSize,
  modalOneTitle,
  modalOneContent,
  closeModalOne,
}) => {
  const theme = useTheme();

  const onBackgroundClick = (e) => {
    e.preventDefault();
    if (e.target === document.getElementById("modalOneContainer")) {
      closeModalOne();
    }
  };

  return (
    <div
      className="modalContainer"
      id="modalOneContainer"
      style={{ zIndex: 10 }}
      onClick={(e) => onBackgroundClick(e)}
    >
      <div
        onWheelCapture={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={
            theme.palette.mode === "light" ? "modalLight" : "modalDark"
          }
          style={{ width: modalOneSize }}
        >
          <div
            className={
              theme.palette.mode === "light"
                ? "modalTitleLight"
                : "modalTitleDark"
            }
          >
            {modalOneTitle}
          </div>
          <div className="modalContent">{modalOneContent}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalOne;
