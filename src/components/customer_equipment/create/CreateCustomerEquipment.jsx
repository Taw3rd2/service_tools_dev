import { useContext, useState } from "react";
import { ToastContext } from "../../../context/toastContext";

import {
  getFormattedDate,
  getFormattedDateAndTime,
} from "../../../utilities/dateUtils";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowUpward, Close } from "@mui/icons-material";
import { red } from "@mui/material/colors";

import EquipmentAddonCard from "../shared/EquipmentAddonCard";
import { doc } from "firebase/firestore";
import { db, createNamedDocument } from "../../../firebase/firestore.utils";

import "../../../global_style/style.css";

const CreateCustomerEquipment = ({ customer, closeModalTwo }) => {
  const { dispatch } = useContext(ToastContext);
  const [equipmentValues, setEquipmentValues] = useState({
    equipmentName: "",
    equipmentInstallDate: new Date(),
    equipmentBrand: "",
    equipmentModel: "",
    equipmentSerial: "",
    equipmentFuel: "",
    equipmentVoltage: "",
    equipmentEff: "",
    equipmentBtu: "",
  });

  const equipmentWarranty = "";
  const equipmentLabor = "";
  const equipmentContract = "";
  const equipmentNotes = "";

  const submitNewEquipment = (e) => {
    e.preventDefault();
    const newEquipment = {
      customerId: customer.id,
      equipmentWarranty,
      equipmentLabor,
      equipmentContract,
      equipmentNotes,
      equipmentBrand: equipmentValues.equipmentBrand,
      equipmentBtu: equipmentValues.equipmentBtu,
      equipmentEff: equipmentValues.equipmentEff,
      equipmentFuel: equipmentValues.equipmentFuel,
      equipmentModel: equipmentValues.equipmentModel,
      equipmentName: equipmentValues.equipmentName,
      equipmentSerial: equipmentValues.equipmentSerial,
      equipmentVoltage: equipmentValues.equipmentVoltage,
      equipmentInstallDate: equipmentValues.equipmentInstallDate,
    };
    const equipmentDocumentRef = doc(
      db,
      "customers",
      customer.id,
      "Equipment",
      equipmentValues.equipmentName
    );
    createNamedDocument(equipmentDocumentRef, newEquipment)
      .then(() => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedDateAndTime(new Date()),
            type: "SUCCESS",
            title: "Create New Equipment",
            message: "New equipment added to the customer",
          },
        });
        closeModalTwo();
      })
      .catch((error) => {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            id: getFormattedDateAndTime(new Date()),
            type: "ERROR",
            title: "Create New Equipment",
            message: "There was a problem adding the equipment",
          },
        });
        console.log("Firestore Error: ", error);
      });
  };

  const handleEquipmentChange = (prop) => (event) => {
    setEquipmentValues({ ...equipmentValues, [prop]: event.target.value });
  };

  const handleInstallDateChange = (prop, value) => {
    setEquipmentValues({ ...equipmentValues, [prop]: value });
  };

  return (
    <div>
      <form onSubmit={submitNewEquipment} autoComplete="new password">
        <div className="row">
          <div className="doubleRowInput">
            <div className="singleRowInput" style={{ paddingTop: "8px" }}>
              <TextField
                label="Equipment Name"
                value={equipmentValues.equipmentName}
                onChange={handleEquipmentChange("equipmentName")}
                inputProps={{ tabIndex: "1" }}
                fullWidth
                required
              />
            </div>
            <div className="singleRowInput" style={{ paddingTop: "8px" }}>
              <TextField
                label="Equipment Brand"
                value={equipmentValues.equipmentBrand}
                onChange={handleEquipmentChange("equipmentBrand")}
                inputProps={{ tabIndex: "2" }}
                fullWidth
                required
              />
            </div>
            <div className="singleRowInput" style={{ paddingTop: "8px" }}>
              <TextField
                label="Equipment Model"
                value={equipmentValues.equipmentModel}
                onChange={handleEquipmentChange("equipmentModel")}
                inputProps={{ tabIndex: "3" }}
                fullWidth
              />
            </div>
            <div className="singleRowInput" style={{ paddingTop: "8px" }}>
              <TextField
                label="Equipment Serial"
                value={equipmentValues.equipmentSerial}
                onChange={handleEquipmentChange("equipmentSerial")}
                inputProps={{ tabIndex: "4" }}
                fullWidth
              />
            </div>
            <div className="singleRowInput" style={{ paddingTop: "8px" }}>
              <TextField
                label="Equipment Size"
                value={equipmentValues.equipmentBtu}
                onChange={handleEquipmentChange("equipmentBtu")}
                inputProps={{ tabIndex: "5" }}
                fullWidth
              />
            </div>
            <div className="singleRowInput" style={{ paddingTop: "8px" }}>
              <TextField
                label="Equipment Efficiency"
                value={equipmentValues.equipmentEff}
                onChange={handleEquipmentChange("equipmentEff")}
                inputProps={{ tabIndex: "6" }}
                fullWidth
              />
            </div>
            <div className="singleRowInput" style={{ paddingTop: "8px" }}>
              <TextField
                label="Equipment Fuel or Freon Type"
                value={equipmentValues.equipmentFuel}
                onChange={handleEquipmentChange("equipmentFuel")}
                inputProps={{ tabIndex: "7" }}
                fullWidth
              />
            </div>
            <div className="singleRowInput" style={{ paddingTop: "8px" }}>
              <TextField
                label="Equipment Voltage"
                value={equipmentValues.equipmentVoltage}
                onChange={handleEquipmentChange("equipmentVoltage")}
                inputProps={{ tabIndex: "8" }}
                fullWidth
              />
            </div>
            <div className="singleRowInput" style={{ paddingTop: "8px" }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Equipment Installation Date"
                  fullWidth
                  value={equipmentValues.equipmentInstallDate}
                  onChange={(newValue) => {
                    handleInstallDateChange("equipmentInstallDate", newValue);
                  }}
                  color="primary"
                  renderInput={(params) => (
                    <TextField {...params} sx={{ width: "100%" }} />
                  )}
                  inputProps={{ tabIndex: "9" }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="doubleRowInput">
            <Card sx={{ maxWidth: 345, marginTop: "8px" }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="new equipment">
                    {equipmentValues.equipmentName.length < 1
                      ? ""
                      : Array.from(equipmentValues.equipmentName)[0]}
                  </Avatar>
                }
                title={equipmentValues.equipmentName}
                subheader={
                  equipmentValues.equipmentInstallDate
                    ? getFormattedDate(equipmentValues.equipmentInstallDate)
                    : "No Install Date Entered"
                }
              />
              <Typography
                variant="h5"
                color="primary"
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {equipmentValues.equipmentBrand}
              </Typography>
              <CardContent>
                <Typography variant="caption" color="primary">
                  Model Number
                </Typography>
                <Typography variant="h6">
                  {equipmentValues.equipmentModel}
                </Typography>

                <Typography variant="caption" color="primary">
                  Serial Number
                </Typography>
                <Typography variant="h6">
                  {equipmentValues.equipmentSerial}
                </Typography>
                <div className="row">
                  <div className="singleRowInput">
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      Additional Information
                    </Typography>
                  </div>
                </div>
                <div className="row">
                  <div className="doubleRowInput">
                    <EquipmentAddonCard
                      cardName="Fuel / Freon Type"
                      cardValue={equipmentValues.equipmentFuel}
                    />
                  </div>
                  <div className="doubleRowInput">
                    <EquipmentAddonCard
                      cardName="Voltage"
                      cardValue={equipmentValues.equipmentVoltage}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="doubleRowInput">
                    <EquipmentAddonCard
                      cardName="Efficiency"
                      cardValue={equipmentValues.equipmentEff}
                    />
                  </div>
                  <div className="doubleRowInput">
                    <EquipmentAddonCard
                      cardName="Size"
                      cardValue={equipmentValues.equipmentBtu}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="buttonBar">
          <button type="submit" className="standardButton" tabIndex={10}>
            <ArrowUpward />
            <span className="iconSeperation">Create</span>
          </button>
          <button
            type="button"
            className="standardButton"
            onClick={() => closeModalTwo()}
            tabIndex={11}
          >
            <Close />
            <span className="iconSeperation">Cancel</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomerEquipment;
