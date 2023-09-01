import { useContext, useState } from "react";
import {
  db,
  updateDocument,
  useSyncedCollection,
} from "../../../../firebase/firestore.utils";
import { ToastContext } from "../../../../context/toastContext";

import { getFormattedExactTime } from "../../../../utilities/dateUtils";

import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "../../../../global_style/style.css";
import {
  currencyFormat,
  toComFlatRate,
  toMarkUp,
  toResFlatRate,
  toRetail,
  toTax,
} from "../../../../utilities/currencyUtils";
import uploadPicture from "../../../../utilities/images/upload_cloud.jpg";
import ProgressBar from "../../../../components/progress_bar/ProgressBar";
import { collection, doc } from "firebase/firestore";
import { Add, ArrowUpward, Close, DeleteForever } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.main,
    fontSize: 18,
  },
}));

const PartDetails = ({
  part,
  openDeletePart,
  openCreateCrossReference,
  openDeleteCrossReference,
  openEditCrossReference,
  closeModalOne,
}) => {
  const { dispatch } = useContext(ToastContext);
  const tabs = useSyncedCollection(collection(db, "tabs"));

  const onBaseCostLoad = (number) => {
    return parseFloat(number / 100).toFixed(2);
  };

  // const stringToNumber = (string) => {
  //   console.log("stringToNumber: ", string);
  //   return Number(string.replace(/[^\d]/g, ""));
  // };

  const [partValues, setPartValues] = useState({
    category: part.category ? part.category : "Service",
    crossReference: part.crossReference ? part.crossReference : [],
    partCost: part.partCost ? onBaseCostLoad(part.partCost) : 0.0,
    partDataDate: part.partDataDate
      ? part.partDataDate
      : new Date().toLocaleString(),
    partDataServicer: part.partDataServicer ? part.partDataServicer : "",
    partDescription: part.partDescription ? part.partDescription : "",
    partLabor: part.partLabor ? part.partLabor : 0.0,
    partNotes: part.partNotes ? part.partNotes : "",
    partNumber: part.partNumber ? part.partNumber : "",
    partVendor: part.partVendor ? part.partVendor : "Carrier",
    quantity: part.quantity ? part.quantity : 1,
    url: part.url ? part.url : "",
  });

  const handelPartValueChange = (prop) => (event) => {
    setPartValues({ ...partValues, [prop]: event.target.value });
  };

  const handleUrlChange = (url) => {
    console.log("url from handler: ", url);
    setPartValues({ ...partValues, url: url });
  };

  const costConversion = (costValue) => {
    if (Number.isFinite(costValue)) {
      return costValue;
    } else {
      return Number(costValue.replace(/[^0-9]+/g, ""));
    }
  };

  const laborConversion = (laborValue) => {
    if (Number.isFinite(laborValue)) {
      return laborValue;
    } else {
      return Number(laborValue.replace(/[^0-9.]+/g, ""));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const updatedPart = {
      category: partValues.category,
      crossReference: partValues.crossReference,
      partCost: costConversion(partValues.partCost),
      partDataDate: new Date().toLocaleString(),
      partDataServicer: partValues.partDataServicer,
      partDescription: partValues.partDescription,
      partLabor: laborConversion(partValues.partLabor),
      partNotes: partValues.partNotes,
      partNumber: partValues.partNumber,
      partVendor: partValues.partVendor,
      quantity: partValues.quantity,
      url: partValues.url,
    };

    if (part.id !== undefined) {
      updateDocument(doc(db, "parts", part.id), updatedPart)
        .then(() => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "SUCCESS",
              title: "Update Part",
              message: "Updated part in the cloud",
            },
          });
          closeModalOne();
        })
        .catch((error) => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: getFormattedExactTime(new Date()),
              type: "ERROR",
              title: "Update Part",
              message: "There was a error updating",
            },
          });
          console.log("Firebase error: ", error);
        });
    } else {
      console.log("The part ID was undefined...");
    }
    closeModalOne();
  };

  //picture handler
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const types = ["image/png", "image/jpeg"];

  const pictureChangeHandler = (e) => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Please select an image file (.png or .jpeg");
    }
  };

  return (
    <>
      <div className="row">
        <div className="doubleRowInput">
          <h3>Part Updated: {partValues.partDataDate}</h3>
        </div>
        <div className="doubleRowInput">
          <h3>Suggested on hand quantities</h3>
        </div>
      </div>

      <form autoComplete="new password" onSubmit={onSubmit}>
        <div className="row">
          <div className="doubleRowInput">
            <div className="row">
              <div className="tripleRowInput">
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Tab</InputLabel>
                  {tabs.length > 0 && (
                    <Select
                      labelId="category-select-label"
                      id="category-select"
                      value={partValues.category}
                      label="Tab"
                      onChange={handelPartValueChange("category")}
                    >
                      {tabs.length > 0 &&
                        tabs
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((tab, index) => (
                            <MenuItem key={tab.id} value={tab.name}>
                              {tab.name}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                </FormControl>
              </div>
              <div className="tripleRowInput">
                <TextField
                  id="part_number"
                  label="Part Number"
                  value={partValues.partNumber}
                  onChange={handelPartValueChange("partNumber")}
                  fullWidth
                  required
                />
              </div>
              <div className="tripleRowInput">
                <TextField
                  id="part_data_servicer"
                  label="Initials"
                  value={partValues.partDataServicer}
                  onChange={handelPartValueChange("partDataServicer")}
                  fullWidth
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="singleRowInput">
                <TextField
                  id="part_description"
                  label="Part Description"
                  value={partValues.partDescription}
                  onChange={handelPartValueChange("partDescription")}
                  fullWidth
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="tripleRowInput">
                <TextField
                  id="part_vendor"
                  label="Part Vendor"
                  value={partValues.partVendor}
                  onChange={handelPartValueChange("partVendor")}
                  fullWidth
                  required
                />
              </div>
              <div className="tripleRowInput">
                <FormControl fullWidth>
                  <InputLabel htmlFor="part-cost-input">Part Cost</InputLabel>
                  <OutlinedInput
                    id="part-cost-input"
                    value={partValues.partCost}
                    onChange={handelPartValueChange("partCost")}
                    fullWidth
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                    label="Part Cost"
                  />
                </FormControl>
              </div>
              <div className="tripleRowInput">
                <TextField
                  id="part_labor"
                  label="Part Labor"
                  value={partValues.partLabor}
                  onChange={handelPartValueChange("partLabor")}
                  fullWidth
                />
              </div>
            </div>
            <div className="row">
              <div className="singleRowInput">
                <TextField
                  id="part_notes"
                  label="Part Notes"
                  value={partValues.partNotes}
                  onChange={handelPartValueChange("partNotes")}
                  multiline
                  maxRows={4}
                  fullWidth
                />
              </div>
            </div>
          </div>
          <div className="doubleRowInput">
            <p>Inventory Control Section</p>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="doubleRowInput">
            <div className="row">
              <div className="doubleRowInput">
                <label htmlFor="base" className="centerInfo">
                  Base Cost
                </label>
                <Typography id="base" variant="h6" align="center" gutterBottom>
                  {currencyFormat(partValues.partCost)}
                </Typography>
              </div>
              <div className="doubleRowInput">
                <label htmlFor="resflat" className="centerInfo">
                  Res Flat Rate
                </label>
                <Typography
                  id="resflat"
                  variant="h6"
                  align="center"
                  gutterBottom
                >
                  {toResFlatRate(partValues.partCost, partValues.partLabor)}
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="doubleRowInput">
                <label htmlFor="markup" className="centerInfo">
                  Mark Up
                </label>
                <Typography
                  id="markup"
                  variant="h6"
                  align="center"
                  gutterBottom
                >
                  {toMarkUp(partValues.partCost)}
                </Typography>
              </div>
              <div className="doubleRowInput">
                <label htmlFor="comflat" className="centerInfo">
                  Com Flat Rate
                </label>
                <Typography
                  id="comflat"
                  variant="h6"
                  align="center"
                  gutterBottom
                >
                  {toComFlatRate(partValues.partCost, partValues.partLabor)}
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="doubleRowInput">
                <label htmlFor="tax" className="centerInfo">
                  Tax
                </label>
                <Typography id="tax" variant="h6" align="center" gutterBottom>
                  {toTax(partValues.partCost)}
                </Typography>
              </div>
              <div className="doubleRowInput">
                <label htmlFor="retail" className="centerInfo">
                  Cash and Carry
                </label>
                <Typography
                  id="retail"
                  variant="h6"
                  align="center"
                  gutterBottom
                >
                  {toRetail(partValues.partCost)}
                </Typography>
              </div>
            </div>
          </div>
          <div className="doubleRowInput pictureFrame">
            {partValues.url === "" || partValues.url === undefined ? (
              <div>
                <label>
                  <img
                    src={uploadPicture}
                    alt="default"
                    style={{
                      width: "100%",
                      objectFit: "contain",
                      maxHeight: "185px",
                    }}
                  />
                  <input
                    type="file"
                    onChange={pictureChangeHandler}
                    style={{ display: "none" }}
                  />
                </label>
                <p className="centerInfo">No picture uploaded yet.</p>
                {error ||
                  (file && (
                    <div className="output">
                      {error && <div className="error">{error}</div>}
                      {file && <div>{file.name}</div>}
                      {file && (
                        <ProgressBar
                          file={file}
                          setFile={setFile}
                          setUrl={handleUrlChange}
                          part={part}
                        />
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div>
                <label>
                  <img
                    src={partValues.url}
                    alt="uploaded part"
                    style={{
                      width: "100%",
                      objectFit: "contain",
                      maxHeight: "185px",
                    }}
                  />
                  <input
                    type="file"
                    onChange={pictureChangeHandler}
                    style={{ display: "none" }}
                  />
                </label>
                {error ||
                  (file && (
                    <div className="output">
                      {error && <div className="error">{error}</div>}
                      {file && <div>{file.name}</div>}
                      {file && (
                        <ProgressBar
                          file={file}
                          setFile={setFile}
                          setUrl={handleUrlChange}
                          part={part}
                        />
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <hr />

        <div style={{ marginLeft: "2px", marginBottom: "8px" }}>
          <label htmlFor="cross_reference_table">
            Part Numbers from other vendors (Cross Reference)
          </label>
        </div>
        <TableContainer
          component={Paper}
          sx={{ overflow: "auto", maxHeight: "200px" }}
          id="cross_reference_table"
        >
          <Table
            stickyHeader
            size="small"
            aria-label="parts cross reference list"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Part Number</StyledTableCell>
                <StyledTableCell align="left">Vendor</StyledTableCell>
                <StyledTableCell align="left">Cost</StyledTableCell>
                <StyledTableCell align="left">Date</StyledTableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left">
                  <button
                    type="button"
                    className="standardButton"
                    onClick={() => openCreateCrossReference(part)}
                  >
                    <Add />
                    <span className="iconSeperation">Add</span>
                  </button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partValues.crossReference &&
                partValues.crossReference.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={
                      index % 2
                        ? { background: "#d9d9d9" }
                        : { background: "white" }
                    }
                  >
                    <TableCell>{item.partNumber}</TableCell>
                    <TableCell>{item.partVendor}</TableCell>
                    <TableCell>{currencyFormat(item.partCost / 100)}</TableCell>
                    <TableCell>{item.partDataDate}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="deleteButton"
                        onClick={() => openDeleteCrossReference(part, index)}
                      >
                        Delete
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="standardButton"
                        onClick={() => openEditCrossReference(part, index)}
                      >
                        Edit
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="buttonBar">
          <button
            type="button"
            className="deleteButton"
            onClick={() => openDeletePart(part)}
          >
            <DeleteForever />
            <span className="iconSeperation">Delete</span>
          </button>
          <button type="submit" className="standardButton">
            <ArrowUpward />
            <span className="iconSeperation">Update</span>
          </button>
          <button
            type="button"
            className="standardButton"
            onClick={() => closeModalOne()}
          >
            <Close />
            <span className="iconSeperation">Close</span>
          </button>
        </div>
      </form>
    </>
  );
};

export default PartDetails;
