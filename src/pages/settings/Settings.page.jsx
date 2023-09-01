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
import Spinner from "../../components/spinner/Spinner";
import DeleteTechnician from "./technicians/delete/DeleteTechnician";

const ModalOne = lazy(() =>
  import("../../components/basic_components/modal_one/ModalOne")
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
  //Modal One
  const [isModalOneOpen, setModalOneOpen] = useState(false);
  const [modalOneSize, setModalOneSize] = useState("45%");
  const [modalOneTitle, setModalOneTitle] = useState("Modal One");
  const [modalOneContent, setModalOneContent] = useState(
    <div>Modal One Content</div>
  );
  const openModalOne = (size, title, content) => {
    setModalOneSize(size);
    setModalOneTitle(title);
    setModalOneContent(content);
    setModalOneOpen(true);
  };
  const closeModalOne = () => {
    setModalOneSize("45%");
    setModalOneTitle("Modal One");
    setModalOneContent(<div>Modal One Content</div>);
    setModalOneOpen(false);
  };

  const openDeleteDispatcher = (dispatcher) => {
    openModalOne(
      "20%",
      "Delete Dispatcher",
      <DeleteDispatcher dispatcher={dispatcher} closeModalOne={closeModalOne} />
    );
  };

  const openDeleteEquipmentTab = (equipmentTab) => {
    openModalOne(
      "20%",
      "Delete Equipment Tab",
      <DeleteEquipmentTab
        equipmentTab={equipmentTab}
        closeModalOne={closeModalOne}
      />
    );
  };

  const openDeleteInventoryTab = (tab) => {
    openModalOne(
      "20%",
      "Delete Parts Tab",
      <DeleteInventoryTab inventoryTab={tab} closeModalOne={closeModalOne} />
    );
  };

  const openDeleteLaborRate = (laborRate) => {
    openModalOne(
      "20%",
      "Delete Labor Rate",
      <DeleteLaborRate laborRate={laborRate} closeModalOne={closeModalOne} />
    );
  };

  const openDeletePayment = (payment) => {
    openModalOne(
      "20%",
      "Delete Payment",
      <DeletePayment payment={payment} closeModalOne={closeModalOne} />
    );
  };

  const openDeleteServicesTab = (tab) => {
    openModalOne(
      "20%",
      "Delete Services Tab",
      <DeleteServicesTab servicesTab={tab} closeModalOne={closeModalOne} />
    );
  };

  const openDeleteTechnician = (tech) => {
    openModalOne(
      "20%",
      "Delete Technician",
      <DeleteTechnician technician={tech} closeModalOne={closeModalOne} />
    );
  };

  const openDeleteWorklistItem = (item) => {
    openModalOne(
      "20%",
      "Delete Work List Item",
      <DeleteWorkListItem workListItem={item} closeModalOne={closeModalOne} />
    );
  };

  const openDispatcherDetails = (dispatcher) => {
    openModalOne(
      "15%",
      <>{dispatcher !== undefined ? "Dispatcher Details" : "New Dispatcher"}</>,
      <DispatcherDetails
        dispatcher={dispatcher}
        closeModalOne={closeModalOne}
      />
    );
  };

  const openEquipmentTabDetails = (equipmentTab) => {
    openModalOne(
      "20%",
      <>
        {equipmentTab !== undefined
          ? "Equipment Tab Details"
          : "New Equipment Tab"}
      </>,
      <EquipmentTabDetails
        equipmentTab={equipmentTab}
        closeModalOne={closeModalOne}
      />
    );
  };

  const openInventoryTabDetails = (tab) => {
    openModalOne(
      "20%",
      <>{tab !== undefined ? "Parts Tab Details" : "New Parts Tab"}</>,
      <InventoryTabDetails inventoryTab={tab} closeModalOne={closeModalOne} />
    );
  };

  const openLaborRateDetails = (laborRate) => {
    openModalOne(
      "20%",
      <>{laborRate !== undefined ? "Labor Rate Details" : "New Labor Rate"}</>,
      <LaborRateDetails laborRate={laborRate} closeModalOne={closeModalOne} />
    );
  };

  const openPaymentDetails = (payment) => {
    openModalOne(
      "20%",
      <>{payment !== undefined ? "Payment Details" : "New Payment"}</>,
      <PaymentDetails payment={payment} closeModalOne={closeModalOne} />
    );
  };

  const openServicesTabDetails = (tab) => {
    openModalOne(
      "20%",
      <>{tab !== undefined ? "Services Tab Details" : "New Services Tab"}</>,
      <ServicesTabDetails servicesTab={tab} closeModalOne={closeModalOne} />
    );
  };

  const openTechnicianDetails = (tech) => {
    openModalOne(
      "40%",
      <>{tech !== undefined ? "Technician Details" : "New Technician"}</>,
      <TechnicianDetails technician={tech} closeModalOne={closeModalOne} />
    );
  };

  const openWorkListItemDetails = (item) => {
    openModalOne(
      "20%",
      <>
        {item !== undefined ? "Work List Item Details" : "New Worklist Item"}
      </>,
      <WorkListItemDetails workListItem={item} closeModalOne={closeModalOne} />
    );
  };

  return (
    <div className="settings">
      <Toast />
      <div className="settingsRow">
        <div className="settingsTopLeft">
          <InventoryTabList
            openDeleteInventoryTab={openDeleteInventoryTab}
            openInventoryTabDetails={openInventoryTabDetails}
          />
        </div>
        <div className="settingsTopMiddle">
          <EquipmentTabList
            openDeleteEquipmentTab={openDeleteEquipmentTab}
            openEquipmentTabDetails={openEquipmentTabDetails}
          />
        </div>
        <div className="settingsTopRight">
          <ServicesTabList
            openDeleteServicesTab={openDeleteServicesTab}
            openServicesTabDetails={openServicesTabDetails}
          />
        </div>
      </div>
      <div className="settingsRow">
        <div className="settingsBottomLeft">
          <DispatcherList
            openDispatcherDetails={openDispatcherDetails}
            openDeleteDispatcher={openDeleteDispatcher}
          />
        </div>
        <div className="settingsBottomRight">
          <TechnicianList
            openDeleteTechnician={openDeleteTechnician}
            openTechnicianDetails={openTechnicianDetails}
          />
        </div>
      </div>
      <div className="settingsRow">
        <div className="settingsTopLeft">
          <LaborRateList
            openDeleteLaborRate={openDeleteLaborRate}
            openLaborRateDetails={openLaborRateDetails}
          />
        </div>
        <div className="settingsTopMiddle">
          <PaymentList
            openDeletePayment={openDeletePayment}
            openPaymentDetails={openPaymentDetails}
          />
        </div>
        <div className="settingsTopRight">
          <WorkList
            openDeleteWorkListItem={openDeleteWorklistItem}
            openWorkListItemDetails={openWorkListItemDetails}
          />
        </div>
      </div>
      {isModalOneOpen && (
        <Suspense fallback={<Spinner />}>
          <ModalOne
            modalOneSize={modalOneSize}
            modalOneTitle={modalOneTitle}
            modalOneContent={modalOneContent}
            closeModalOne={closeModalOne}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Settings;
