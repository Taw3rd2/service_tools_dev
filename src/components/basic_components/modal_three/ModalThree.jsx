import "../../../global_style/style.css";
import { useTheme } from "@mui/material/styles";

const ModalThree = ({
  modalThreeSize,
  modalThreeTitle,
  modalThreeContent,
  closeModalThree,
}) => {
  const theme = useTheme();
  const onBackgroundClick = (e) => {
    e.preventDefault();
    if (e.target === document.getElementById("modalThreeContainer")) {
      closeModalThree();
    }
  };

  return (
    <div
      className="modalContainer"
      id="modalThreeContainer"
      style={{ zIndex: 30 }}
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
          style={{ width: modalThreeSize }}
        >
          <div
            className={
              theme.palette.mode === "light"
                ? "modalTitleLight"
                : "modalTitleDark"
            }
          >
            {modalThreeTitle}
          </div>
          <div className="modalContent">{modalThreeContent}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalThree;
