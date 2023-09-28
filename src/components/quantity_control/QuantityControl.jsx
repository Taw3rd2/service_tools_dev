import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";

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
      <IconButton
        onClick={() => {
          decreaseQuantity(part.quantity, index);
        }}
      >
        <RemoveCircleOutline />
      </IconButton>
      <TextField
        size="small"
        id="quantity_text"
        value={part.quantity}
        sx={{
          marginLeft: "8px",
          width: "50px",
          input: { textAlign: "center" },
        }}
      />
      <IconButton
        onClick={() => {
          increaseQuantity(part.quantity, index);
        }}
        sx={{ marginLeft: "8px" }}
      >
        <AddCircleOutline />
      </IconButton>
    </div>
  );
};

export default QuantityControl;
