import { lazy, Suspense, useState } from "react";

import DispatcherList from "./dispatchers/list/DispatcherList";
import EquipmentTabList from "./equipment_tabs/list/EquipmentTabList";
import InventoryTabList from "./inventory_tabs/list/InventoryTabList";
import LaborRateList from "./labor_rates/list/LaborRateList";
import PaymentList from "./payments/list/PaymentList";
import ServicesTabList from "./services_tabs/list/ServicesTabList";
import TechnicianList from "./technicians/list/TechnicianList";
import WorkList from "./work_list/list/WorkList";
import Toast from "../../components/basic_components/toast/Toast";

import "../../global_style/style.css";
import DeleteTechnician from "./technicians/delete/DeleteTechnician";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Accordion from "../../components/basic_components/basic_accordian/Accordion";
import SetTheme from "./theme/SetTheme";
import { CircularProgress } from "@mui/material";

//Material Modal
const MaterialModal = lazy(() =>
  import("../../components/basic_components/material_modal/MaterialModal")
);
const TechnicianDetailsModal = lazy(() =>
  import("./technicians/create_details/TechnicianDetailsModal")
);

const DeleteDispatcher = lazy(() =>
  import("./dispatchers/delete/DeleteDispatcher")
);
const DeleteEquipmentTab = lazy(() =>
  import("./equipment_tabs/delete/DeleteEquipmentTab")
);
const DeleteInventoryTab = lazy(() =>
  import("./inventory_tabs/delete/DeleteInventoryTab")
);
const DeleteLaborRate = lazy(() =>
  import("./labor_rates/delete/DeleteLaborRate")
);
const DeletePayment = lazy(() => import("./payments/delete/DeletePayment"));
const DeleteServicesTab = lazy(() =>
  import("./services_tabs/delete/DeleteServicesTab")
);
const DeleteWorkListItem = lazy(() =>
  import("./work_list/delete/DeleteWorkListItem")
);

const DispatcherDetails = lazy(() =>
  import("./dispatchers/create_details/DispatcherDetails")
);
const EquipmentTabDetails = lazy(() =>
  import("./equipment_tabs/create_details/EquipmentTabDetails")
);
const InventoryTabDetails = lazy(() =>
  import("./inventory_tabs/create_details/InventoryTabDetails")
);
const LaborRateDetails = lazy(() =>
  import("./labor_rates/create_details/LaborRateDetails")
);
const PaymentDetails = lazy(() =>
  import("./payments/create_details/PaymentDetails")
);
const ServicesTabDetails = lazy(() =>
  import("./services_tabs/create_details/ServicesTabDetails")
);
const TechnicianDetails = lazy(() =>
  import("./technicians/create_details/TechnicianDetails")
);
const WorkListItemDetails = lazy(() =>
  import("./work_list/create_details/WorkListItemDetails")
);

const Settings = () => {
  //ModalOne
  const [isModalOneOpen, setModalOneOpen] = useState(false);
  const [modalOneWidth, setModalOneWidth] = useState("sm");
  const [modalOneContent, setModalOneContent] = useState(
    <div>Modal One Content</div>
  );
  const [modalOneTitle, setModalOneTitle] = useState("Modal One");
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

  //Technician Details Modal
  const [isTechModalOpen, setTechModalOpen] = useState(false);
  const [techModalWidth, setTechModalWidth] = useState("sm");
  const [techModalContent, setTechModalContent] = useState(
    <div>Technician Modal Content</div>
  );
  const [techModalTitle, setTechModalTitle] = useState("Tech Modal");
  const openTechModal = (content, title, width) => {
    setTechModalContent(content);
    setTechModalTitle(title);
    setTechModalWidth(width);
    setTechModalOpen(true);
  };
  const closeTechModal = () => {
    setTechModalContent(<div>Modal One Content</div>);
    setTechModalTitle("Modal One");
    setTechModalWidth("sm");
    setTechModalOpen(false);
  };

  const openDeleteDispatcher = (dispatcher) => {
    openModalOne(
      <DeleteDispatcher
        dispatcher={dispatcher}
        closeModalOne={closeModalOne}
      />,
      "Delete Dispatcher",
      "sm"
    );
  };

  const openDeleteEquipmentTab = (equipmentTab) => {
    openModalOne(
      <DeleteEquipmentTab
        equipmentTab={equipmentTab}
        closeModalOne={closeModalOne}
      />,
      "Delete Equipment Tab",
      "sm"
    );
  };

  const openDeleteInventoryTab = (tab) => {
    openModalOne(
      <DeleteInventoryTab inventoryTab={tab} closeModalOne={closeModalOne} />,
      "Delete Parts Tab",
      "sm"
    );
  };

  const openDeleteLaborRate = (laborRate) => {
    openModalOne(
      <DeleteLaborRate laborRate={laborRate} closeModalOne={closeModalOne} />,
      "Delete Labor Rate",
      "sm"
    );
  };

  const openDeletePayment = (payment) => {
    openModalOne(
      <DeletePayment payment={payment} closeModalOne={closeModalOne} />,
      "Delete Payment",
      "sm"
    );
  };

  const openDeleteServicesTab = (tab) => {
    openModalOne(
      <DeleteServicesTab servicesTab={tab} closeModalOne={closeModalOne} />,
      "Delete Services Tab",
      "sm"
    );
  };

  const openDeleteTechnician = (tech) => {
    openModalOne(
      <DeleteTechnician technician={tech} closeModalOne={closeModalOne} />,
      "Delete Technician",
      "sm"
    );
  };

  const openDeleteWorklistItem = (item) => {
    openModalOne(
      <DeleteWorkListItem workListItem={item} closeModalOne={closeModalOne} />,
      "Delete Work List Item",
      "sm"
    );
  };

  const openDispatcherDetails = (dispatcher) => {
    openModalOne(
      <DispatcherDetails
        dispatcher={dispatcher}
        closeModalOne={closeModalOne}
      />,
      <>{dispatcher !== undefined ? "Dispatcher Details" : "New Dispatcher"}</>,
      "sm"
    );
  };

  const openEquipmentTabDetails = (equipmentTab) => {
    openModalOne(
      <EquipmentTabDetails
        equipmentTab={equipmentTab}
        closeModalOne={closeModalOne}
      />,
      <>
        {equipmentTab !== undefined
          ? "Equipment Tab Details"
          : "New Equipment Tab"}
      </>,
      "sm"
    );
  };

  const openInventoryTabDetails = (tab) => {
    openModalOne(
      <InventoryTabDetails inventoryTab={tab} closeModalOne={closeModalOne} />,
      <>{tab !== undefined ? "Parts Tab Details" : "New Parts Tab"}</>,
      "sm"
    );
  };

  const openLaborRateDetails = (laborRate) => {
    openModalOne(
      <LaborRateDetails laborRate={laborRate} closeModalOne={closeModalOne} />,
      <>{laborRate !== undefined ? "Labor Rate Details" : "New Labor Rate"}</>,
      "sm"
    );
  };

  const openPaymentDetails = (payment) => {
    openModalOne(
      <PaymentDetails payment={payment} closeModalOne={closeModalOne} />,
      <>{payment !== undefined ? "Payment Details" : "New Payment"}</>,
      "sm"
    );
  };

  const openServicesTabDetails = (tab) => {
    openModalOne(
      <ServicesTabDetails servicesTab={tab} closeModalOne={closeModalOne} />,
      <>{tab !== undefined ? "Services Tab Details" : "New Services Tab"}</>,
      "sm"
    );
  };

  const openTechnicianDetails = (tech) => {
    openTechModal(
      <TechnicianDetails technician={tech} closeModalOne={closeTechModal} />,
      <>{tech !== undefined ? "Technician Details" : "New Technician"}</>,
      "sm"
    );
  };

  const openWorkListItemDetails = (item) => {
    openModalOne(
      <WorkListItemDetails workListItem={item} closeModalOne={closeModalOne} />,
      <>
        {item !== undefined ? "Work List Item Details" : "New Worklist Item"}
      </>,
      "sm"
    );
  };

  return (
    <div>
      <Toast />
      <Grid container spacing={1}>
        <Grid xs={8}>
          <Accordion
            title="Inventory Tabs"
            height="260px"
            content={
              <InventoryTabList
                openDeleteInventoryTab={openDeleteInventoryTab}
                openInventoryTabDetails={openInventoryTabDetails}
              />
            }
          />
        </Grid>
        <Grid xs={8}>
          <Accordion
            title="Equipment Tabs"
            height="260px"
            content={
              <EquipmentTabList
                openDeleteEquipmentTab={openDeleteEquipmentTab}
                openEquipmentTabDetails={openEquipmentTabDetails}
              />
            }
          />
        </Grid>
        <Grid xs={8}>
          <Accordion
            title="Services Tabs"
            height="260px"
            content={
              <ServicesTabList
                openDeleteServicesTab={openDeleteServicesTab}
                openServicesTabDetails={openServicesTabDetails}
              />
            }
          />
        </Grid>
        <Grid xs={8}>
          <Accordion
            title="Dispatcher List"
            height="260px"
            content={
              <DispatcherList
                openDispatcherDetails={openDispatcherDetails}
                openDeleteDispatcher={openDeleteDispatcher}
              />
            }
          />
        </Grid>
        <Grid xs={8}>
          <Accordion
            title="Technician List"
            height="260px"
            content={
              <TechnicianList
                openDeleteTechnician={openDeleteTechnician}
                openTechnicianDetails={openTechnicianDetails}
              />
            }
          />
        </Grid>
        <Grid xs={8}>
          <Accordion
            title="Labor List"
            height="260px"
            content={
              <LaborRateList
                openDeleteLaborRate={openDeleteLaborRate}
                openLaborRateDetails={openLaborRateDetails}
              />
            }
          />
        </Grid>
        <Grid xs={8}>
          <Accordion
            title="Payments List"
            height="260px"
            content={
              <PaymentList
                openDeletePayment={openDeletePayment}
                openPaymentDetails={openPaymentDetails}
              />
            }
          />
        </Grid>
        <Grid xs={8}>
          <Accordion
            title="Work list"
            height="260px"
            content={
              <WorkList
                openDeleteWorkListItem={openDeleteWorklistItem}
                openWorkListItemDetails={openWorkListItemDetails}
              />
            }
          />
        </Grid>
        <Grid xs={8}>
          <Accordion title="Theme" height="290px" content={<SetTheme />} />
        </Grid>
      </Grid>
      {isModalOneOpen && (
        <Suspense fallback={<CircularProgress />}>
          <MaterialModal
            closeModal={closeModalOne}
            isModalOpen={isModalOneOpen}
            modalContent={modalOneContent}
            modalTitle={modalOneTitle}
            modalWidth={modalOneWidth}
          />
        </Suspense>
      )}
      {isTechModalOpen && (
        <Suspense fallback={<CircularProgress />}>
          <TechnicianDetailsModal
            closeModal={closeTechModal}
            isModalOpen={isTechModalOpen}
            modalContent={techModalContent}
            modalTitle={techModalTitle}
            modalWidth={techModalWidth}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Settings;
