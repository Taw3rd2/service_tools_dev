import { useState } from "react";
import BasicTable from "../../../../components/basic_components/BasicTable";
import QuantityControl from "../../../../components/quantity_control/QuantityControl";
import {
  toCurrency,
  toArrayTotal,
  stringPriceToNumber,
} from "../../../../utilities/currencyUtils";
import { Button, TableCell, tableCellClasses, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Add, ArrowUpward, DeleteForever } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.main,
    fontSize: 18,
  },
}));

const MaterialList = ({ material, setMaterial, openJobMaterialPicker }) => {
  const [pickerButtonActive, setPickerButtonActive] = useState(true);

  const getTotalMaterialCost = () => {
    let total = 0;
    if (material.length < 1) {
      return 0;
    } else {
      material.map((item, index) => {
        let sub = 0;
        if (item.partCost) {
          const convertedPartCost = stringPriceToNumber(item.partCost);
          sub = convertedPartCost * item.quantity;
        } else {
          const convertedEquipmentCost = stringPriceToNumber(item.cost);
          sub = convertedEquipmentCost * item.quantity;
        }
        return (total += sub);
      });
      return total;
    }
  };

  const removeArrayItem = (indexToRemove) => {
    setMaterial((oldArray) => {
      return oldArray.filter((value, i) => i !== indexToRemove);
    });
  };

  const tableHead = (
    <>
      <StyledTableCell align="center">Qty</StyledTableCell>
      <StyledTableCell align="left">Model/Part#</StyledTableCell>
      <StyledTableCell align="left">Description</StyledTableCell>
      <StyledTableCell align="left">Cost</StyledTableCell>
      <StyledTableCell align="center"></StyledTableCell>
    </>
  );

  const tableBody = (
    <>
      {material.length > 0 &&
        material.map((item, index) => (
          <TableRow key={index} sx={{ cursor: "pointer" }}>
            <TableCell sx={{ display: "flex", justifyContent: "center" }}>
              <QuantityControl
                listOfItems={material}
                setListOfItems={setMaterial}
                part={item}
                index={index}
                setPickerButtonActive={setPickerButtonActive}
              />
            </TableCell>
            <TableCell align="left">
              {item.partNumber ? item.partNumber : item.model}
            </TableCell>
            <TableCell align="left">
              {item.partDescription ? item.partDescription : item.subCategory}
            </TableCell>
            <TableCell align="left">
              {toCurrency(
                item.partCost ? item.partCost / 100 : item.cost / 100
              )}
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
            openJobMaterialPicker();
          }}
          sx={{ margin: "8px" }}
        >
          Add Material From Parts
        </Button>
      ) : (
        <Button
          variant="contained"
          type="button"
          startIcon={<Add />}
          onClick={() => {
            openJobMaterialPicker();
          }}
          sx={{ margin: "8px" }}
          disabled
        >
          Add Material From Parts
        </Button>
      )}
      {pickerButtonActive ? (
        <Button
          variant="contained"
          type="button"
          startIcon={<ArrowUpward />}
          onClick={() => {
            console.log("Save Changes");
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
            console.log("Save Changes");
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
        height={material.length > 0 ? "250px" : "0px"}
        additionalButtons={additionalButtons}
      />
      <div className="row" style={{ marginTop: "8px" }}>
        <div className="doubleRowInput">
          <div className="worksheetDate">
            Total Items: {toArrayTotal(material, "quantity")}
          </div>
        </div>
        <div className="doubleRowInput">
          <div className="worksheetDate">
            Total Material: {toCurrency(getTotalMaterialCost() / 100)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialList;
