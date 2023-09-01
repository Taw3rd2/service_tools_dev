import "../../../global_style/style.css";
import { useTheme } from "@mui/material/styles";

const ModalTwo = ({
  modalTwoSize,
  modalTwoTitle,
  modalTwoContent,
  closeModalTwo,
}) => {
  const theme = useTheme();
  const onBackgroundClick = (e) => {
    e.preventDefault();
    if (e.target === document.getElementById("modalTwoContainer")) {
      closeModalTwo();
    }
  };

  return (
    <div
      className="modalContainer"
      id="modalTwoContainer"
      style={{ zIndex: 20 }}
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
          style={{ width: modalTwoSize }}
        >
          <div
            className={
              theme.palette.mode === "light"
                ? "modalTitleLight"
                : "modalTitleDark"
            }
          >
            {modalTwoTitle}
          </div>
          <div className="modalContent">{modalTwoContent}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalTwo;
