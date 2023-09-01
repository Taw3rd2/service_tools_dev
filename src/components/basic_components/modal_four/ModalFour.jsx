import "../../../global_style/style.css";
import { useTheme } from "@mui/material/styles";

const ModalFour = ({
  modalFourSize,
  modalFourTitle,
  modalFourContent,
  closeModalFour,
}) => {
  const theme = useTheme();
  const onBackgroundClick = (e) => {
    e.preventDefault();
    if (e.target === document.getElementById("modalFourContainer")) {
      closeModalFour();
    }
  };

  return (
    <div
      className="modalContainer"
      id="modalFourContainer"
      style={{ zIndex: 40 }}
      onClick={(e) => onBackgroundClick(e)}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={
            theme.palette.mode === "light" ? "modalLight" : "modalDark"
          }
          style={{ width: modalFourSize }}
        >
          <div
            className={
              theme.palette.mode === "light"
                ? "modalTitleLight"
                : "modalTitleDark"
            }
          >
            {modalFourTitle}
          </div>
          <div className="modalContent">{modalFourContent}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalFour;
