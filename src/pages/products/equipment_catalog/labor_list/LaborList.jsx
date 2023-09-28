import { toCurrency, toArrayTotal } from "../../../../utilities/currencyUtils";
import BasicTable from "../../../../components/basic_components/BasicTable";
import {
  Button,
  IconButton,
  TableCell,
  tableCellClasses,
  TableRow,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Add,
  AddCircleOutline,
  ArrowUpward,
  DeleteForever,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { useState } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.main,
    fontSize: 18,
  },
}));

const LaborList = ({ labor, setLabor, openAddLaborToJob }) => {
  const [pickerButtonActive, setPickerButtonActive] = useState(true);
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
    setPickerButtonActive(false);
    updateHours(hrs + 1, index);
  };

  const decreaseHours = (hrs, index) => {
    setPickerButtonActive(false);
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
          <TableRow key={index}>
            <TableCell sx={{ display: "flex", justifyContent: "center" }}>
              <div className="listItemButtonBar">
                <IconButton
                  onClick={() => {
                    decreaseHours(item.hours, index);
                  }}
                >
                  <RemoveCircleOutline />
                </IconButton>
                <TextField
                  size="small"
                  id="quantity_text"
                  value={item.hours}
                  sx={{
                    marginLeft: "8px",
                    width: "50px",
                    input: { textAlign: "center" },
                  }}
                />
                <IconButton
                  onClick={() => {
                    increaseHours(item.hours, index);
                  }}
                  sx={{ marginLeft: "8px" }}
                >
                  <AddCircleOutline />
                </IconButton>
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
                color="error"
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
        <Button
          variant="contained"
          type="button"
          startIcon={<Add />}
          onClick={() => {
            openAddLaborToJob();
          }}
          sx={{ margin: "8px" }}
        >
          Add labor
        </Button>
      ) : (
        <Button
          variant="contained"
          type="button"
          startIcon={<Add />}
          onClick={() => {
            openAddLaborToJob();
          }}
          sx={{ margin: "8px" }}
          disabled
        >
          Add labor
        </Button>
      )}
      {pickerButtonActive ? (
        <Button
          variant="contained"
          type="button"
          startIcon={<ArrowUpward />}
          onClick={() => {
            setPickerButtonActive(true);
            console.log("Save Changes Clicked");
          }}
          sx={{ margin: "8px" }}
        >
          Save Changes
        </Button>
      ) : (
        <Button
          variant="contained"
          type="button"
          startIcon={<ArrowUpward />}
          onClick={() => {
            setPickerButtonActive(true);
            console.log("Save Changes Clicked");
          }}
          sx={{ margin: "8px" }}
          color="success"
        >
          Save Changes
        </Button>
      )}
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
