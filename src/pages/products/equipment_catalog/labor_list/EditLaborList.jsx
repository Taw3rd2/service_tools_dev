import { useContext, useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import {
  db,
  updateDocument,
  useSyncedCollection,
} from "../../../../firebase/firestore.utils";
import { ToastContext } from "../../../../context/toastContext";
import {
  TableCell,
  tableCellClasses,
  TableRow,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toCurrency } from "../../../../utilities/currencyUtils";
import {
  Add,
  ArrowUpward,
  Close,
  DeleteForever,
  Remove,
} from "@mui/icons-material";
import BasicTable from "../../../../components/basic_components/BasicTable";
import { getFormattedExactTime } from "../../../../utilities/dateUtils";

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

const EditLaborList = ({ unitId, openAddLaborToEquipment, closeModalOne }) => {
  const { dispatch } = useContext(ToastContext);
  const laborRates = useSyncedCollection(collection(db, "laborRate"));
  const [defaultLaborList, setDefaultLaborList] = useState([]);
  const [model, setModel] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [pickerButtonActive, setPickerButtonActive] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "equipment", unitId),
      (doc) => {
        const loadedLaborList = doc.data().defaultLaborList;
        if (loadedLaborList.length > 0) {
          const modifiedLabor = loadedLaborList.filter((lll) => {
            return laborRates.find((lr) => {
              //use the labor rate stored in labor settings
              lll.rate = lr.rate;
              return lll.description === lr.rateDescription;
            });
          });
          setDefaultLaborList(modifiedLabor);
        }
        //setDefaultLaborList(doc.data().defaultLaborList);
        setModel(doc.data().model);
        setSubCategory(doc.data().subCategory);
      },
      (error) => {
        console.log(error.message);
      }
    );
    return () => unsubscribe();
  }, [unitId, laborRates]);

  const updateHours = (value, index) => {
    setPickerButtonActive(false);
    let newArr = defaultLaborList.map((item, i) => {
      if (index === i) {
        return { ...item, hours: value };
      } else {
        return item;
      }
    });
    setDefaultLaborList(newArr);
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
    setPickerButtonActive(false);
    setDefaultLaborList((oldArray) => {
      return oldArray.filter((value, i) => i !== indexToRemove);
    });
  };

  const saveLaborToEquipment = () => {
    if (unitId !== undefined) {
      updateDocument(doc(db, "equipment", unitId), {
        defaultLaborList: defaultLaborList,
      })
        .then(() => {
          setPickerButtonActive(true);
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Update Labor",
              message: "Updated labor in the cloud",
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
              title: "Update Labor",
              message: "There was a error updating",
            },
          });
          console.log("Firebase error: ", error);
        });
    } else {
      closeModalOne();
    }
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
      {defaultLaborList.length > 0 &&
        defaultLaborList
          .sort((a, b) => a.description.localeCompare(b.description))
          .map((item, index) => (
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
      {pickerButtonActive ? (
        <button
          type="button"
          className="standardButton"
          style={{ margin: "8px" }}
          onClick={() => {
            openAddLaborToEquipment();
          }}
        >
          <Add />
          <span className="iconSeperation">Add labor</span>
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
        {`Labor for: ${subCategory} Model: ${model}`}
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
            onClick={() => saveLaborToEquipment()}
          >
            <ArrowUpward />
            <span className="iconSeperation">Save Changes</span>
          </button>
        ) : (
          <button
            type="button"
            className="standardGoButton"
            onClick={() => saveLaborToEquipment()}
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

export default EditLaborList;
