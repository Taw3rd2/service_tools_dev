import { Add, Remove } from "@mui/icons-material";
import { TextField } from "@mui/material";

const rootStyles = {
  backgroundColor: "#ffd60a",
  border: "1px solid rgba(132, 230, 239, 0.8)",
};

const QuantityControl = ({
  listOfItems,
  setListOfItems,
  part,
  index,
  setPickerButtonActive,
}) => {
  const updateQuantity = (value, index) => {
    let newArr = listOfItems.map((item, i) => {
      if (index === i) {
        return { ...item, quantity: value };
      } else {
        return item;
      }
    });
    setPickerButtonActive(false);
    setListOfItems(newArr);
  };

  const increaseQuantity = (qty, index) => {
    updateQuantity(qty + 1, index);
  };

  const decreaseQuantity = (qty, index) => {
    if (qty < 1) {
      return;
    } else {
      updateQuantity(qty - 1, index);
    }
  };

  return (
    <div className="listItemButtonBar">
      <button
        className="lineItemButton"
        onClick={() => {
          decreaseQuantity(part.quantity, index);
        }}
      >
        <Remove />
      </button>
      <TextField
        size="small"
        id="quantity_text"
        value={part.quantity}
        sx={{
          ...rootStyles,
          marginLeft: "8px",
          width: "50px",
          input: { background: "#FFF", textAlign: "center" },
        }}
      />
      <button
        className="lineItemButton"
        style={{ marginLeft: "8px" }}
        onClick={() => {
          increaseQuantity(part.quantity, index);
        }}
      >
        <Add />
      </button>
    </div>
  );
};

export default QuantityControl;
