import { useContext, useEffect, useState } from "react";
import { ToastContext } from "../../../../context/toastContext";
import BasicTable from "../../../../components/basic_components/BasicTable";
import { Add, ArrowUpward, Close, DeleteForever } from "@mui/icons-material";
import { TableCell, tableCellClasses, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import "../../../../global_style/style.css";
import { toCurrency } from "../../../../utilities/currencyUtils";
import { collection, doc } from "firebase/firestore";
import { db, updateDocument } from "../../../../firebase/firestore.utils";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";
import { useSyncedCollection } from "../../../../firebase/firestore.utils";
import QuantityControl from "../../../../components/quantity_control/QuantityControl";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.main,
    fontSize: 18,
  },
}));

const EditAdditionsList = ({
  selectedEquipmentId,
  selectedEquipmentValues,
  openWorksheetAdditionsPicker,
  closeModalOne,
}) => {
  const services = useSyncedCollection(collection(db, "services"));

  const { dispatch } = useContext(ToastContext);

  const [editableServicesList, setEditableServicesList] = useState([]);
  const [pickerButtonActive, setPickerButtonActive] = useState(true);

  useEffect(() => {
    if (
      //is there a list of services to work with?
      selectedEquipmentValues.defaultAdditionsList &&
      selectedEquipmentValues.defaultAdditionsList.length > 0
    ) {
      //condense so i can read this easier
      const equipmentServicesList =
        selectedEquipmentValues.defaultAdditionsList;

      //filter through the parts collection to get the list of part objects associated with the equipment
      const filteredServices = services.filter((service) => {
        return equipmentServicesList.find((svc) => {
          //update the quantity of the found part with the stored quantity on the equipment parts list
          service.quantity = svc.quantity;
          return svc.id === service.id;
        });
      });

      //push the found list to the editableMaterialList
      setEditableServicesList(filteredServices);
    }
  }, [services, selectedEquipmentValues]);

  const removeArrayItem = (indexToRemove) => {
    setEditableServicesList((oldArray) => {
      return oldArray.filter((value, i) => i !== indexToRemove);
    });
  };

  const saveServicesToEquipment = () => {
    //if there is no services, and we want to save that, save []
    if (editableServicesList.length > 0) {
      //make sure we have a id
      if (selectedEquipmentId !== undefined) {
        const savableArray = [];
        //strip the service to the id, and quantity so later we can query the part for data changes
        editableServicesList.forEach((service) => {
          savableArray.push({ id: service.id, quantity: service.quantity });
        });

        updateDocument(doc(db, "equipment", selectedEquipmentId), {
          defaultAdditionsList: savableArray,
        })
          .then(() => {
            setPickerButtonActive(true);
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "SUCCESS",
                title: "Update Additions",
                message: "Updated additions in the cloud",
              },
            });
          })
          .catch((error) => {
            setPickerButtonActive(true);
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "ERROR",
                title: "Update Additions",
                message: "There was a error updating",
              },
            });
            console.log("Firebase Error", error.message);
          });
      }
    } else {
      //there are no services to save.. save the array as []
      if (selectedEquipmentId !== undefined) {
        updateDocument(doc(db, "equipment", selectedEquipmentId), {
          defaultAdditionsList: [],
        })
          .then(() => {
            setPickerButtonActive(true);
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "SUCCESS",
                title: "Update Additions",
                message: "Updated additions in the cloud",
              },
            });
          })
          .catch((error) => {
            setPickerButtonActive(true);
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: getFormattedExactTime(new Date()),
                type: "ERROR",
                title: "Update Additions",
                message: "There was a error updating",
              },
            });
            console.log("Firebase Error", error.message);
          });
      }
    }
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
      {editableServicesList && editableServicesList.length > 0 ? (
        editableServicesList
          .sort((a, b) => a.partNumber.localeCompare(b.partNumber))
          .map((service, index) => (
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
                  listOfItems={editableServicesList}
                  setListOfItems={setEditableServicesList}
                  part={service}
                  index={index}
                  setPickerButtonActive={setPickerButtonActive}
                />
              </TableCell>
              <TableCell align="left">{service.description}</TableCell>
              <TableCell align="left">
                {toCurrency(service.cost / 100)}
              </TableCell>
              <TableCell align="left">
                {toCurrency((service.quantity * service.cost) / 100)}
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
          ))
      ) : (
        <TableRow>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>No Additions Added Yet</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      )}
    </>
  );

  const additionalButtons = (
    <>
      {pickerButtonActive ? (
        <button
          type="button"
          className="standardButton"
          style={{ margin: "8px" }}
          onClick={() => openWorksheetAdditionsPicker()}
        >
          <Add />
          <span className="iconSeperation">Add New Additions</span>
        </button>
      ) : (
        <button
          type="button"
          className="standardButton"
          style={{ margin: "8px" }}
          disabled
        >
          <Add />
          <span className="iconSeperation">Save to add more</span>
        </button>
      )}
    </>
  );

  return (
    <div className="container">
      <div className="worksheetDate" style={{ marginBottom: "8px" }}>
        {`Loadout for: ${selectedEquipmentValues.subCategory} Model:${selectedEquipmentValues.model}`}
      </div>
      <BasicTable
        tableHead={tableHead}
        tableBody={tableBody}
        height={"400px"}
        additionalButtons={additionalButtons}
      />
      <div className="buttonBar">
        {pickerButtonActive ? (
          <button
            type="button"
            className="standardButton"
            onClick={() => saveServicesToEquipment()}
          >
            <ArrowUpward />
            <span className="iconSeperation">Save Changes</span>
          </button>
        ) : (
          <button
            type="button"
            className="standardGoButton"
            onClick={() => saveServicesToEquipment()}
          >
            <ArrowUpward />
            <span className="iconSeperation">Save Changes</span>
          </button>
        )}
        <button
          type="button"
          className="standardButton"
          onClick={() => closeModalOne()}
        >
          <Close />
          <span className="iconSeperation">Close</span>
        </button>
      </div>
    </div>
  );
};

export default EditAdditionsList;
