import "../../global_style/style.css";

const customerSearchModal = ({
  customerSearchModalContent,
  closeCustomerSearchModal,
}) => {
  const onBackgroundClick = (e) => {
    e.preventDefault();
    if (e.target === document.getElementById("customerSearchModalContainer")) {
      closeCustomerSearchModal();
    }
  };

  return (
    <div>
      <div
        className="modalContainer"
        id="customerSearchModalContainer"
        style={{ zIndex: 10 }}
        onClick={(e) => onBackgroundClick(e)}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="customerSearchModal" style={{ width: "25%" }}>
            <div className="modalTitleDark">Dispatch Starter</div>
            <div className="modalContent">{customerSearchModalContent}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default customerSearchModal;
