import { useState } from "react";
import BasicTable from "../../../../components/basic_components/BasicTable";
import QuantityControl from "../../../../components/quantity_control/QuantityControl";
import { toCurrency, toArrayTotal } from "../../../../utilities/currencyUtils";
import { TableCell, tableCellClasses, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Add, ArrowUpward, DeleteForever } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.main,
    fontSize: 18,
  },
}));

const AdditionsList = ({ additions, setAdditions, openAddAdditionsToJob }) => {
  const [pickerButtonActive, setPickerButtonActive] = useState(true);
  const displayTotalAdditionsCost = () => {
    let total = 0;
    if (additions.length < 1) {
      return 0;
    } else {
      additions.map((item, index) => {
        const sub = item.quantity * item.cost;
        return (total += sub);
      });
      return toCurrency(total / 100);
    }
  };

  const removeArrayItem = (indexToRemove) => {
    setAdditions((oldArray) => {
      return oldArray.filter((value, i) => i !== indexToRemove);
    });
  };

  const tableHead = (
    <>
      <StyledTableCell align="center">Qty</StyledTableCell>
      <StyledTableCell align="left">Description</StyledTableCell>
      <StyledTableCell align="left">Cost</StyledTableCell>
      <StyledTableCell align="left">Total</StyledTableCell>
      <StyledTableCell align="center"></StyledTableCell>
    </>
  );

  const tableBody = (
    <>
      {additions.length > 0 &&
        additions.map((item, index) => (
          <TableRow
            key={index}
            sx={
              index % 2
                ? {
                    background: "#e8eded",
                    cursor: "pointer",
                  }
                : {
                    background: "white",
                    cursor: "pointer",
                  }
            }
          >
            <TableCell sx={{ display: "flex", justifyContent: "center" }}>
              <QuantityControl
                listOfItems={additions}
                setListOfItems={setAdditions}
                part={item}
                index={index}
                setPickerButtonActive={setPickerButtonActive}
              />
            </TableCell>
            <TableCell align="left">
              {item.description ? item.description : ""}
            </TableCell>
            <TableCell align="left">{toCurrency(item.cost / 100)}</TableCell>
            <TableCell align="left">
              {toCurrency((item.quantity * item.cost) / 100)}
            </TableCell>
            <TableCell align="center">
              <DeleteForever
                sx={{ color: "teal" }}
                onClick={() => {
                  removeArrayItem(index);
                }}
              />
            </TableCell>
          </TableRow>
        ))}
    </>
  );

  const additionalButtons = (
    <>
      {pickerButtonActive ? (
        <button
          type="button"
          className="standardButton"
          style={{ margin: "8px" }}
          onClick={() => {
            openAddAdditionsToJob();
          }}
        >
          <Add />
          <span className="iconSeperation">Add Items from Services</span>
        </button>
      ) : (
        <button
          type="button"
          className="standardButton"
          style={{ margin: "8px" }}
          onClick={() => {
            openAddAdditionsToJob();
          }}
        >
          <Add />
          <span className="iconSeperation">Add Items from Services</span>
        </button>
      )}
      {pickerButtonActive ? (
        <button
          type="button"
          className="standardButton"
          style={{ margin: "8px" }}
          onClick={() => {
            console.log("Save Changes Clicked");
          }}
        >
          <ArrowUpward />
          <span className="iconSeperation">Save Changes</span>
        </button>
      ) : (
        <button
          type="button"
          className="standardButton"
          style={{ margin: "8px" }}
          onClick={() => {
            console.log("Save Changes Clicked");
          }}
        >
          <ArrowUpward />
          <span className="iconSeperation">Save Changes</span>
        </button>
      )}
    </>
  );

  return (
    <div className="worksheetContainer">
      <BasicTable
        tableHead={tableHead}
        tableBody={tableBody}
        height={additions.length > 0 ? "250px" : "0px"}
        additionalButtons={additionalButtons}
      />
      <div className="row" style={{ marginTop: "8px" }}>
        <div className="doubleRowInput">
          <div className="worksheetDate">
            Total Items: {toArrayTotal(additions, "quantity")}
          </div>
        </div>
        <div className="doubleRowInput">
          <div className="worksheetDate">
            Total Additions Cost: {displayTotalAdditionsCost()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionsList;
