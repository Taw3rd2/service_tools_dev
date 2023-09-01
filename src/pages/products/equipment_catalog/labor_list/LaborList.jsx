import { toCurrency, toArrayTotal } from "../../../../utilities/currencyUtils";
import BasicTable from "../../../../components/basic_components/BasicTable";
import {
  TableCell,
  tableCellClasses,
  TableRow,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Add, ArrowUpward, DeleteForever, Remove } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.main,
    fontSize: 18,
  },
}));

const rootStyles = {
  backgroundColor: "#ffd60a",
  border: "1px solid rgba(132, 230, 239, 0.8)",
};

const LaborList = ({ labor, setLabor, openAddLaborToJob }) => {
  const displayTotalLaborCost = () => {
    let total = 0;
    if (labor.length < 1) {
      return 0;
    } else {
      labor.map((item, index) => {
        const sub = item.hours * item.rate;
        return (total += sub);
      });
      return toCurrency(total / 100);
    }
  };

  const updateHours = (value, index) => {
    let newArr = labor.map((item, i) => {
      if (index === i) {
        return { ...item, hours: value };
      } else {
        return item;
      }
    });
    setLabor(newArr);
  };

  const increaseHours = (hrs, index) => {
    updateHours(hrs + 1, index);
  };

  const decreaseHours = (hrs, index) => {
    if (hrs < 1) {
      return;
    } else {
      updateHours(hrs - 1, index);
    }
  };

  const removeArrayItem = (indexToRemove) => {
    setLabor((oldArray) => {
      return oldArray.filter((value, i) => i !== indexToRemove);
    });
  };

  const tableHead = (
    <>
      <StyledTableCell align="center">Hrs</StyledTableCell>
      <StyledTableCell align="left">Description</StyledTableCell>
      <StyledTableCell align="left">Labor Rate</StyledTableCell>
      <StyledTableCell align="left">Cost</StyledTableCell>
      <StyledTableCell align="center"></StyledTableCell>
    </>
  );

  const tableBody = (
    <>
      {labor.length > 0 &&
        labor.map((item, index) => (
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
              <div className="listItemButtonBar">
                <button
                  className="lineItemButton"
                  onClick={() => {
                    decreaseHours(item.hours, index);
                  }}
                >
                  <Remove />
                </button>
                <TextField
                  size="small"
                  id="quantity_text"
                  value={item.hours}
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
                    increaseHours(item.hours, index);
                  }}
                >
                  <Add />
                </button>
              </div>
            </TableCell>
            <TableCell align="left">
              {item.description ? item.description : ""}
            </TableCell>
            <TableCell align="left">{toCurrency(item.rate / 100)}</TableCell>
            <TableCell align="left">
              {toCurrency((item.hours * item.rate) / 100)}
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
      <button
        type="button"
        className="standardButton"
        style={{ margin: "8px" }}
        onClick={() => {
          openAddLaborToJob();
        }}
      >
        <Add />
        <span className="iconSeperation">Add labor</span>
      </button>
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
    </>
  );

  return (
    <div className="worksheetContainer">
      <BasicTable
        tableHead={tableHead}
        tableBody={tableBody}
        height={labor.length > 0 ? "250px" : "0px"}
        additionalButtons={additionalButtons}
      />
      <div className="row" style={{ marginTop: "8px" }}>
        <div className="doubleRowInput">
          <div className="worksheetDate">
            Total Hours: {toArrayTotal(labor, "hours")}
          </div>
        </div>
        <div className="doubleRowInput">
          <div className="worksheetDate">
            Total Labor: {displayTotalLaborCost()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaborList;
