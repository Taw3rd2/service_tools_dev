import { useEffect, useState } from "react";

import BasicTable from "../../../../components/basic_components/BasicTable";
import Accordion from "../../../../components/basic_components/basic_accordian/Accordion";
import { Button, TableCell, tableCellClasses, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DeleteForever } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.main,
    fontSize: 18,
  },
}));

const EquipmentCatalogList = ({
  listOfEquipment,
  tab,
  category,
  selectEquipment,
  openDeleteCategory,
}) => {
  const [filteredEquipment, setFilteredEquipment] = useState([]);

  useEffect(() => {
    const loadFilteredEquipment = () => {
      setFilteredEquipment(
        listOfEquipment.filter((e) => e.subCategory === category.name)
      );
    };
    return loadFilteredEquipment();
  }, [listOfEquipment, category]);

  const tableHead = (
    <>
      <StyledTableCell align="left">Model</StyledTableCell>
      <StyledTableCell align="left">BTUH</StyledTableCell>
      <StyledTableCell align="left">Voltage</StyledTableCell>
      <StyledTableCell align="left">Size</StyledTableCell>
      <StyledTableCell align="left">Weight</StyledTableCell>
      <StyledTableCell align="left">Cost</StyledTableCell>
    </>
  );

  const tableBody = (
    <>
      {filteredEquipment.length > 0 &&
        filteredEquipment
          .sort((a, b) => a.model.localeCompare(b.model))
          .map((unit, index) => (
            <TableRow
              key={index}
              onClick={() => selectEquipment(unit.id)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell align="left">{unit.model}</TableCell>
              <TableCell align="left">{unit.btu}</TableCell>
              <TableCell align="left">{unit.voltage}</TableCell>
              <TableCell align="left">{unit.size}</TableCell>
              <TableCell align="left">{unit.weight}</TableCell>
              <TableCell align="left">{unit.cost}</TableCell>
            </TableRow>
          ))}
    </>
  );

  const additionalButtons = (
    <>
      {filteredEquipment.length > 0 ? (
        <Button
          size="large"
          variant="outlined"
          startIcon={<DeleteForever />}
          onClick={() =>
            alert(
              "The list has to be empty before you can delete the category."
            )
          }
          style={{ color: "red", margin: "8px" }}
        >
          Delete the Category
        </Button>
      ) : (
        <Button
          size="large"
          variant="outlined"
          startIcon={<DeleteForever />}
          onClick={() => openDeleteCategory(category)}
          style={{ color: "red", margin: "8px" }}
        >
          Delete the Category
        </Button>
      )}
    </>
  );

  return (
    <div className="container">
      <div className="row">
        <div className="singleRowInput">
          <Accordion
            title={`${tab} ${category.name}`}
            height={filteredEquipment.length > 0 ? "245px" : "50px"}
            content={
              <BasicTable
                tableHead={tableHead}
                tableBody={tableBody}
                height={filteredEquipment.length > 0 ? "200px" : "0px"}
                additionalButtons={additionalButtons}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default EquipmentCatalogList;
