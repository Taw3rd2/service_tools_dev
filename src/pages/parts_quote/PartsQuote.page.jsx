import { Suspense, lazy, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContext } from "../../context/toastContext";

import {
  getTotalPartsRetail,
  getTotalPartsTax,
  submitQuoteToFirestore,
  updateQuoteInFirestore,
} from "../../components/parts_quotes/partsQuoteFunctions";

import Toast from "../../components/basic_components/toast/Toast";

import "../../global_style/style.css";
import EquipmentInfo from "../../components/parts_quotes/details/EquipmentInfo";
import PartsQuotePartsList from "../../components/parts_quotes/parts_list/PartsQuotePartsList";
import Labor from "../../components/parts_quotes/details/Labor";
import Shipping from "../../components/parts_quotes/details/Shipping";
import Totals from "../../components/parts_quotes/details/Totals";

import MainField from "../../components/customer_information/fields/MainField";
import ContactCard from "../../components/customer_information/fields/ContactCard";
import PartDetails from "../../components/parts_quotes/details/PartDetails";
import DeletePartsQuote from "../../components/parts_quotes/delete/DeletePartsQuote";

import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Add, Close, DeleteForever, Save } from "@mui/icons-material";
import { getFormattedDateAndTime } from "../../utilities/dateUtils";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MaterialModal from "../../components/basic_components/material_modal/MaterialModal";
const AddPartToList = lazy(() =>
  import("../../components/parts_quotes/parts_list/AddPartToList")
);

const PartsQuote = () => {
  const location = useLocation();
  const customer = location.state.customer;
  const quoteData = location.state.quoteData;
  const selectedEquipment = location.state.selectedEquipment;
  const { dispatch } = useContext(ToastContext);
  const navigate = useNavigate();

  //Modal One3
  const [isModalOneOpen, setModalOneOpen] = useState(false);
  const [modalOneContent, setModalOneContent] = useState(
    <div>Modal One Content</div>
  );
  const [modalOneTitle, setModalOneTitle] = useState("Modal One");
  const [modalOneWidth, setModalOneWidth] = useState("sm");

  const openModalOne = (content, title, width) => {
    setModalOneContent(content);
    setModalOneTitle(title);
    setModalOneWidth(width);
    setModalOneOpen(true);
  };
  const closeModalOne = () => {
    setModalOneContent(<div>Modal One Content</div>);
    setModalOneTitle("Modal One");
    setModalOneWidth("sm");
    setModalOneOpen(false);
  };

  const [equipmentValues, setEquipmentValues] = useState({
    equipmentName: selectedEquipment.equipmentName
      ? selectedEquipment.equipmentName
      : "",
    equipmentBrand: selectedEquipment.equipmentBrand
      ? selectedEquipment.equipmentBrand
      : "",
    equipmentModel: selectedEquipment.equipmentModel
      ? selectedEquipment.equipmentModel
      : "",
    equipmentSerial: selectedEquipment.equipmentSerial
      ? selectedEquipment.equipmentSerial
      : "",
  });

  const [quoteValues, setQuoteValues] = useState({
    addMaintenance: quoteData.addMaintenance ? quoteData.addMaintenance : false,
    addRediagnostic: quoteData.addRediagnostic
      ? quoteData.addRediagnostic
      : false,
    dateQuoted: quoteData.dateQuoted ? quoteData.dateQuoted : null,
    dateStarted: quoteData.dateStarted ? quoteData.dateStarted : new Date(),
    disclaimerRed: quoteData.disclaimerRed ? quoteData.disclaimerRed : false,
    id: quoteData.id ? quoteData.id : "",
    jobNumber: quoteData.jobNumber ? quoteData.jobNumber : "",
    laborHours: quoteData.laborHours ? quoteData.laborHours : 1,
    laborNotes: quoteData.laborNotes ? quoteData.laborNotes : "",
    laborRate: quoteData.laborRate ? quoteData.laborRate : 9900,
    notModelSpecific:
      quoteData !== undefined && quoteData.notModelSpecific !== undefined
        ? quoteData.notModelSpecific
        : false,
    partsList: quoteData.partsList ? quoteData.partsList : [],
    quickShippingRate: quoteData.quickShippingRate
      ? quoteData.quickShippingRate
      : 75.0,
    quickShippingTime: quoteData.quickShippingTime
      ? quoteData.quickShippingTime
      : "1-3 days",
    quoteNotes: quoteData.quoteNotes ? quoteData.quoteNotes : "",
    regularShippingRate: quoteData.regularShippingRate
      ? quoteData.regularShippingRate
      : 0.0,
    regularShippingTime: quoteData.regularShippingTime
      ? quoteData.regularShippingTime
      : "5-7 days",
    selectedDiscount: quoteData.selectedDiscount
      ? quoteData.selectedDiscount
      : "none",
    selectedShipping: quoteData.selectedShipping
      ? quoteData.selectedShipping
      : "none",
    shippingNotes: quoteData.shippingNotes ? quoteData.shippingNotes : "",
  });

  const handleEquipmentValueChange = (prop) => (event) => {
    setEquipmentValues({ ...equipmentValues, [prop]: event.target.value });
  };

  const handleQuoteValueChange = (prop) => (event) => {
    setQuoteValues({ ...quoteValues, [prop]: event.target.value });
  };

  const handleQuoteCheckChange = (prop) => (event) => {
    setQuoteValues({ ...quoteValues, [prop]: event.target.checked });
  };

  const handleQuoteDateChange = (prop) => (value) => {
    setQuoteValues({ ...quoteValues, [prop]: value });
  };

  const handleShippingRateChange = (event) => {
    if (event.target.id === "regularShippingRate") {
      setQuoteValues({
        ...quoteValues,
        regularShippingRate: parseFloat(event.target.value),
      });
    } else {
      setQuoteValues({
        ...quoteValues,
        quickShippingRate: parseFloat(event.target.value),
      });
    }
  };

  const openAddPartToList = () => {
    openModalOne(
      <AddPartToList
        closeModalOne={closeModalOne}
        quoteValues={quoteValues}
        setQuoteValues={setQuoteValues}
      />,
      "Add Material To Quote",
      "md"
    );
  };

  const openPartDetails = (currentPart, partIndex) => {
    openModalOne(
      <PartDetails
        closeModalOne={closeModalOne}
        part={currentPart}
        partIndex={partIndex}
        quoteValues={quoteValues}
        setQuoteValues={setQuoteValues}
      />,
      "Part Details",
      "sm"
    );
  };

  const openDeletePartsQuote = (quote) => {
    openModalOne(
      <DeletePartsQuote
        closeModalOne={closeModalOne}
        customer={customer}
        quote={quote}
        routeToHomepage={routeToHomepage}
      />,
      "Delete Parts Quote",
      "sm"
    );
  };

  const removePartFromList = (partIndex) => {
    const removable = [...quoteValues.partsList];
    removable.splice(partIndex, 1);
    setQuoteValues({ ...quoteValues, partsList: removable });
  };

  const getTotalLabor = () => {
    return quoteValues.laborHours * quoteValues.laborRate;
  };

  const getMaintenance = () => {
    if (quoteValues.addMaintenance) {
      return 12995;
    } else {
      return 0;
    }
  };
  const getRediagnostic = () => {
    if (quoteValues.addRediagnostic) {
      if (
        quoteValues.laborRate === "" ||
        quoteValues.laborRate === undefined ||
        quoteValues.laborRate === null
      ) {
        return 9900;
      } else {
        return parseFloat(quoteValues.laborRate);
      }
    } else {
      return 0;
    }
  };

  const getShipping = () => {
    if (quoteValues.selectedShipping === "regular") {
      return quoteValues.regularShippingRate * 100;
    } else if (quoteValues.selectedShipping === "quick") {
      return quoteValues.quickShippingRate * 100;
    } else {
      return 0;
    }
  };
  const getSubtotal = () => {
    return (
      getTotalPartsTax(quoteValues.partsList) +
      getTotalPartsRetail(quoteValues.partsList) +
      getTotalLabor() +
      getMaintenance() +
      getRediagnostic()
    );
  };
  const getDiscount = () => {
    if (quoteValues.selectedDiscount === "maintenance") {
      const subTotal = getSubtotal() + getShipping();
      return subTotal * 0.1;
    } else {
      return 0;
    }
  };
  const getTotalQuote = () => {
    return getSubtotal() + getShipping() - getDiscount();
  };

  const activateSuccessNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "SUCCESS",
        title: "Parts Quote",
        message: "Parts Quote updated in the cloud",
      },
    });
  };

  const activateFailureNotification = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: getFormattedDateAndTime(new Date()),
        type: "ERROR",
        title: "Parts Quote",
        message: "There was an error updating",
      },
    });
  };

  const saveQuote = () => {
    const partsQuote = {
      dateQuoted: quoteValues.dateQuoted,
      dateStarted: quoteValues.dateStarted,
      equipmentBrand: equipmentValues.equipmentBrand,
      equipmentModel: equipmentValues.equipmentModel,
      equipmentName: equipmentValues.equipmentName,
      equipmentSerial: equipmentValues.equipmentSerial,
      jobNumber: quoteValues.jobNumber,
      laborHours: quoteValues.laborHours,
      laborRate: quoteValues.laborRate,
      maintenance: quoteValues.addMaintenance,
      partsList: quoteValues.partsList,
      quickShippingRate: quoteValues.quickShippingRate,
      quickShippingTime: quoteValues.quickShippingTime,
      quoteNotes: quoteValues.quoteNotes,
      rediagnostic: quoteValues.addRediagnostic,
      regularShippingRate: quoteValues.regularShippingRate,
      regularShippingTime: quoteValues.regularShippingTime,
      selectedDiscount: quoteValues.selectedDiscount,
      selectedShipping: quoteValues.selectedShipping,
      shippingNotes: quoteValues.shippingNotes,
    };

    if (quoteData.id === "") {
      console.log("quoteData has no id: ", quoteData);
      submitQuoteToFirestore(
        customer,
        partsQuote,
        activateSuccessNotification,
        activateFailureNotification
      );
    } else {
      console.log("quoteData has a id", quoteData);
      partsQuote.id = quoteData.id;
      updateQuoteInFirestore(
        customer,
        partsQuote,
        activateSuccessNotification,
        activateFailureNotification
      );
    }
  };

  const routeToHomepage = () => {
    navigate("/homepage");
  };

  return (
    <div className="sizeAdjustment">
      <Toast />
      <div className="row">
        <div className="doubleRowInput">
          <div className="row">
            <div className="doubleRowInput">
              <Typography variant="h5" sx={{ marginBottom: "8px" }}>
                Customer Information
              </Typography>
              {customer.iscommercial ? (
                <MainField
                  title={"Customer Information"}
                  name={`${customer.lastname}`}
                  address={`${customer.street}`}
                  address2={`${customer.city},${customer.state} ${customer.zip}`}
                  business={true}
                />
              ) : (
                <MainField
                  title={"Customer Information"}
                  name={`${customer.firstname} ${customer.lastname}`}
                  address={`${customer.street}`}
                  address2={`${customer.city},${customer.state} ${customer.zip}`}
                  business={false}
                />
              )}
              <Typography variant="caption" ml={1}>
                Contacts
              </Typography>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {customer.contacts && customer.contacts.length > 0
                  ? customer.contacts.map((contact, i) => (
                      <ContactCard contact={contact} key={i} />
                    ))
                  : null}
              </div>
            </div>
            <div className="doubleRowInput">
              <EquipmentInfo
                equipmentValues={equipmentValues}
                handleEquipmentValueChange={handleEquipmentValueChange}
                quoteValues={quoteValues}
                handleQuoteCheckChange={handleQuoteCheckChange}
              />
            </div>
          </div>
        </div>

        <div className="doubleRowInput">
          <div className="row">
            <div className="doubleRowInput">
              <Labor
                quoteValues={quoteValues}
                handleQuoteValueChange={handleQuoteValueChange}
              />
              <Shipping
                quoteValues={quoteValues}
                handleQuoteValueChange={handleQuoteValueChange}
                handleShippingRateChange={handleShippingRateChange}
              />
            </div>
            <div className="doubleRowInput">
              <Totals
                getDiscount={getDiscount}
                getMaintenance={getMaintenance}
                getRediagnostic={getRediagnostic}
                getShipping={getShipping}
                getTotalLabor={getTotalLabor}
                getTotalPartsTax={getTotalPartsTax}
                getTotalQuote={getTotalQuote}
                getSubtotal={getSubtotal}
                quoteValues={quoteValues}
                setQuoteValues={setQuoteValues}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="quadRowInput">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date Customer Quoted"
              value={quoteValues.dateQuoted}
              onChange={handleQuoteDateChange("dateQuoted")}
              color="primary"
              inputProps={{ tabIndex: "8" }}
              renderInput={(params) => (
                <TextField size="small" fullWidth {...params} />
              )}
            />
          </LocalizationProvider>
        </div>
        <div className="quadRowInput">
          <TextField
            label="Job Number"
            size="small"
            value={quoteValues.jobNumber}
            fullWidth
            onChange={handleQuoteValueChange("jobNumber")}
            inputProps={{ tabIndex: "12" }}
          />
        </div>
        <div className="quadRowInput"></div>
        <div className="quadRowInput"></div>
      </div>
      <div className="row">
        <div className="doubleRowInput">
          <TextField
            label="Contact Notes"
            size="small"
            value={quoteValues.quoteNotes}
            onChange={handleQuoteValueChange("quoteNotes")}
            fullWidth
            multiline
            rows={2.25}
          />
        </div>
        <div className="doubleRowInput"></div>
      </div>
      <div className="row">
        <div className="singleRowInput">
          <PartsQuotePartsList
            openAddPartToList={openAddPartToList}
            openPartDetails={openPartDetails}
            quoteValues={quoteValues}
            removePartFromList={removePartFromList}
          />
        </div>
      </div>
      <Grid container spacing={1.5}>
        <Grid xs={12} sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            variant="contained"
            type="button"
            color="error"
            startIcon={<DeleteForever />}
            onClick={() => openDeletePartsQuote(quoteValues)}
            sx={{ marginLeft: "8px" }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            type="button"
            startIcon={<Add />}
            onClick={() => openAddPartToList()}
            sx={{ marginLeft: "8px" }}
          >
            Add Material
          </Button>
          <Button
            variant="contained"
            type="button"
            startIcon={<Save />}
            onClick={() => saveQuote()}
            sx={{ marginLeft: "8px" }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            type="button"
            startIcon={<Close />}
            onClick={() => routeToHomepage()}
            sx={{ marginLeft: "8px" }}
          >
            Close
          </Button>
        </Grid>
      </Grid>
      {isModalOneOpen && (
        <Suspense fallback={<CircularProgress />}>
          <MaterialModal
            isModalOpen={isModalOneOpen}
            closeModal={closeModalOne}
            modalContent={modalOneContent}
            modalTitle={modalOneTitle}
            modalWidth={modalOneWidth}
          />
        </Suspense>
      )}
    </div>
  );
};

export default PartsQuote;
