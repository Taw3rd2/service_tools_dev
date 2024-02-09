import React, { useEffect, useState, lazy, Suspense } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firestore.utils";

import CustomerInformation from "../../components/customer_information/CustomerInformation.component";
import CustomerSearch from "../../components/customer_search/CustomerSearch.component";
import Toast from "../../components/basic_components/toast/Toast";
import CustomerNotesList from "../../components/customer_notes/list/CustomerNotesList";

import "../../global_style/style.css";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import EquipmentStatistics from "../../components/customer_equipment/details/equipment_statistics/EquipmentStatistics";
import { CircularProgress } from "@mui/material";

//Material Modal
const MaterialModal = lazy(() =>
  import("../../components/basic_components/material_modal/MaterialModal")
);

//Customer
const CreateCustomer = lazy(() =>
  import("../../components/customer_information/create/CreateCustomerCard")
);
const DeleteCustomer = lazy(() =>
  import("../../components/customer_information/delete/DeleteCustomer")
);
const EditCustomerDetails = lazy(() =>
  import("../../components/customer_information/details/EditCustomerDetails")
);
const EditCustomerBilling = lazy(() =>
  import("../../components/customer_information/details/EditCustomerBilling")
);
//Customer Notes
const CustomerNote = lazy(() =>
  import("../../components/customer_notes/create_and_details/CustomerNote")
);
const DeleteCustomerNote = lazy(() =>
  import("../../components/customer_notes/delete_note/DeleteCustomerNote")
);
//Customer Equipment
const CreateCustomerEquipment = lazy(() =>
  import("../../components/customer_equipment/create/CreateCustomerEquipment")
);
const DeleteCustomerEquipment = lazy(() =>
  import("../../components/customer_equipment/delete/DeleteCustomerEquipment")
);
const CustomerEquipmentList = lazy(() =>
  import("../../components/customer_equipment/list/CustomerEquipmentList")
);
const CustomerEquipmentCard = lazy(() =>
  import("../../components/customer_equipment/details/CustomerEquipmentCard")
);
const EquipmentGallery = lazy(() =>
  import("../../components/customer_equipment/gallery/EquipmentGallery")
);
const DeleteGalleryImage = lazy(() =>
  import(
    "../../components/customer_equipment/gallery/delete/DeleteGalleryImage"
  )
);
const EditSingleField = lazy(() =>
  import("../../components/customer_equipment/shared/EditSingleField")
);
//Dispatch
const CreateDispatch = lazy(() =>
  import("../../components/dispatches/create_dispatch/CreateDispatch")
);
const DispatchHistoryList = lazy(() =>
  import("../../components/dispatches/dispatch_history/DispatchList")
);
const CompletedDispatchViewer = lazy(() =>
  import(
    "../../components/dispatches/completed_dispatch/CompletedDispatchViewer"
  )
);
//Maintenance Content
const CreateMaintenance = lazy(() =>
  import("../../components/maintenance_manager/create/CreateMaintenanceContent")
);
const DeleteMaintenanceContent = lazy(() =>
  import("../../components/maintenance_manager/delete/DeleteMaintenanceContent")
);
const MaintenanceList = lazy(() =>
  import("../../components/maintenance_manager/list/MaintenanceCustomerList")
);
const MaintenanceDetails = lazy(() =>
  import(
    "../../components/maintenance_manager/details/MaintenanceDetailsContent"
  )
);
const MaintenanceMaterialList = lazy(() =>
  import(
    "../../components/maintenance_manager/maintenance_material/list/MaintenanceMaterialList"
  )
);
//Warranty Content
const CreateWarranty = lazy(() =>
  import("../../components/warranty_manager/create/CreateWarrantyContent")
);
const DeleteWarrantyContent = lazy(() =>
  import("../../components/warranty_manager/delete/DeleteWarrantyContent")
);
const WarrantyList = lazy(() =>
  import("../../components/warranty_manager/list/WarrantyList")
);
const WarrantyDetails = lazy(() =>
  import("../../components/warranty_manager/details/WarrantyDetailsContent")
);
//Parts Quote Content
const PartsQuoteList = lazy(() =>
  import("../../components/parts_quotes/parts_list/PartsQuotesListContent")
);

const HomePage = () => {
  //CustomerSearch
  const [customer, setCustomer] = useState({ id: "" });
  const [client, setClient] = useState({ id: "" });
  const handleCustomerSelected = (customer) => {
    setCustomer(customer);
  };

  const handleEventSelected = (event) => {
    if (event) {
      const tempCustomer = { id: event.customerId };
      console.log("event: ", event);
      setCustomer(tempCustomer);
    } else {
      setCustomer({ id: "" });
    }
  };

  //keep customer data display current
  useEffect(() => {
    if (customer === null || customer.id === "") {
      setClient({ id: "" });
    } else {
      console.log("homepage useEffect");
      const subscribeToCustomer = onSnapshot(
        doc(db, "customers", customer.id),
        (doc) => {
          setClient({ ...doc.data(), id: doc.id });
        }
      );
      return () => subscribeToCustomer();
    }
  }, [customer]);

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

  //ModalTwo
  const [isModalTwoOpen, setModalTwoOpen] = useState(false);
  const [modalTwoContent, setModalTwoContent] = useState(
    <div>Modal Two Content</div>
  );
  const [modalTwoTitle, setModalTwoTitle] = useState("Modal Two");
  const [modalTwoWidth, setModalTwoWidth] = useState("sm");
  const openModalTwo = (content, title, width) => {
    setModalTwoContent(content);
    setModalTwoTitle(title);
    setModalTwoWidth(width);
    setModalTwoOpen(true);
  };
  const closeModalTwo = () => {
    setModalTwoContent(<div>Modal Two Content</div>);
    setModalTwoTitle("Modal Two");
    setModalTwoWidth("sm");
    setModalTwoOpen(false);
  };

  //ModalThree
  const [isModalThreeOpen, setModalThreeOpen] = useState(false);
  const [modalThreeContent, setModalThreeContent] = useState(
    <div>Modal Three Content</div>
  );
  const [modalThreeTitle, setModalThreeTitle] = useState("Modal Three");
  const [modalThreeWidth, setModalThreeWidth] = useState("sm");
  const openModalThree = (content, title, width) => {
    setModalThreeContent(content);
    setModalThreeTitle(title);
    setModalThreeWidth(width);
    setModalThreeOpen(true);
  };
  const closeModalThree = () => {
    setModalThreeContent(<div>Modal Three Content</div>);
    setModalThreeTitle("Modal Three");
    setModalThreeWidth("sm");
    setModalThreeOpen(false);
  };

  //ModalFour
  const [isModalFourOpen, setModalFourOpen] = useState(false);
  const [modalFourContent, setModalFourContent] = useState(
    <div>Modal Four Content</div>
  );
  const [modalFourTitle, setModalFourTitle] = useState("Modal Four");
  const [modalFourWidth, setModalFourWidth] = useState("sm");
  const openModalFour = (content, title, width) => {
    setModalFourContent(content);
    setModalFourTitle(title);
    setModalFourWidth(width);
    setModalFourOpen(true);
  };
  const closeModalFour = () => {
    setModalFourContent(<div>Modal Three Content</div>);
    setModalFourTitle("Modal Three");
    setModalFourWidth("sm");
    setModalFourOpen(false);
  };

  const openEditSingleField = (
    customerId,
    equipmentId,
    fieldName,
    fieldKey,
    fieldValue
  ) => {
    openModalFour(
      <EditSingleField
        customerId={customerId}
        equipmentId={equipmentId}
        fieldName={fieldName}
        fieldKey={fieldKey}
        fieldValue={fieldValue}
        closeEditSingleField={closeModalFour}
      />,
      "",
      "sm"
    );
  };

  const openCreateCustomer = () => {
    openModalOne(
      <CreateCustomer closeModalOne={closeModalOne} />,
      "Create Customer",
      "sm"
    );
  };

  const openEditCustomerDetails = () => {
    openModalOne(
      <EditCustomerDetails
        customer={client}
        openDeleteCustomer={openDeleteCustomer}
        closeModalOne={closeModalOne}
      />,
      "Edit Customer Details",
      "sm"
    );
  };

  const openEditCustomerBilling = () => {
    openModalOne(
      <EditCustomerBilling customer={client} closeModalOne={closeModalOne} />,
      "Edit Customer Billing Information",
      "sm"
    );
  };

  const openDeleteCustomer = () => {
    openModalTwo(
      <DeleteCustomer
        customer={client}
        handleCustomerSelected={handleCustomerSelected}
        closeDetails={closeModalOne}
        closeDelete={closeModalTwo}
      />,
      "Delete Customer",
      "sm"
    );
  };

  const openCreateDispatch = () => {
    openModalOne(
      <CreateDispatch customer={client} closeModalOne={closeModalOne} />,
      "Create Dispatch",
      "sm"
    );
  };

  const openCreateCustomerNote = () => {
    openModalOne(
      <CustomerNote customer={client} closeModalOne={closeModalOne} />,
      "Note",
      "sm"
    );
  };

  const openDeleteCustomerNote = (note) => {
    openModalTwo(
      <DeleteCustomerNote
        customer={client}
        selectedNote={note}
        closeDetails={closeModalOne}
        closeDelete={closeModalTwo}
      />,
      "Delete Note",
      "sm"
    );
  };

  const openCustomerNoteDetails = (note) => {
    openModalOne(
      <CustomerNote
        customer={client}
        closeModalOne={closeModalOne}
        selectedNote={note}
        openDeleteCustomerNote={openDeleteCustomerNote}
      />,
      "Note Details",
      "sm"
    );
  };

  const openCreateCustomerEquipment = () => {
    openModalTwo(
      <CreateCustomerEquipment
        customer={client}
        closeModalTwo={closeModalTwo}
      />,
      "Create Equipment",
      "lg"
    );
  };

  const openDeleteCustomerEquipment = (equipment) => {
    openModalThree(
      <DeleteCustomerEquipment
        customer={client}
        selectedEquipment={equipment}
        closeDetails={closeModalTwo}
        closeDelete={closeModalThree}
      />,
      "Delete Equipment",
      "sm"
    );
  };

  const openEquipmentGallery = (unit) => {
    openModalThree(
      <EquipmentGallery
        closeModalThree={closeModalThree}
        openDeleteGalleryImage={openDeleteGalleryImage}
        selectedEquipment={unit}
      />,
      "",
      "sm"
    );
  };

  const openEquipmentStatistics = (unit) => {
    openModalThree(
      <EquipmentStatistics
        closeModalThree={closeModalThree}
        customer={client}
        openEditSingleField={openEditSingleField}
        selectedEquipment={unit}
      />,
      "",
      "sm"
    );
  };

  const openCustomerEquipmentDetails = (equipment) => {
    openModalTwo(
      <CustomerEquipmentCard
        closeBasicSecondModal={closeModalTwo}
        customer={client}
        openDeleteCustomerEquipment={openDeleteCustomerEquipment}
        openDeleteGalleryImage={openDeleteGalleryImage}
        openEditSingleField={openEditSingleField}
        openEquipmentGallery={openEquipmentGallery}
        openEquipmentStatistics={openEquipmentStatistics}
        selectedEquipment={equipment}
      />,
      "Equipment Details",
      "sm"
    );
  };

  const openCustomerEquipmentList = () => {
    openModalOne(
      <CustomerEquipmentList
        closeModalOne={closeModalOne}
        customer={client}
        openCreateCustomerEquipment={openCreateCustomerEquipment}
        openCustomerEquipmentDetails={openCustomerEquipmentDetails}
      />,
      "Customer Equipment",
      "xl"
    );
  };

  const openDeleteGalleryImage = (img, equip) => {
    openModalFour(
      <DeleteGalleryImage
        customer={customer}
        selectedEquipment={equip}
        selectedImage={img}
        closeImageViewer={closeModalThree}
        closeDelete={closeModalFour}
      />,
      "Delete Gallery Image",
      "sm"
    );
  };

  const openDispatchDetails = (dispatch) => {
    openModalTwo(
      <CompletedDispatchViewer
        selectedDispatch={dispatch}
        closeModalOne={closeModalTwo}
      />,
      "Dispatch Details",
      "sm"
    );
  };

  const openDispatchHistory = () => {
    openModalOne(
      <DispatchHistoryList
        customer={client}
        openDispatchDetails={openDispatchDetails}
        closeModalOne={closeModalOne}
      />,
      "Dispatch History",
      "lg"
    );
  };

  const openCreateWarranty = () => {
    openModalTwo(
      <CreateWarranty customer={client} closeModalTwo={closeModalTwo} />,
      "Create New Warranty",
      "lg"
    );
  };

  const openWarrantyDetails = (warr) => {
    openModalTwo(
      <WarrantyDetails
        customer={client}
        selectedWarranty={warr}
        openDeleteWarranty={openDeleteWarranty}
        closeModalTwo={closeModalTwo}
      />,
      `${warr.equipmentName} Warranty Details`,
      "md"
    );
  };

  const openDeleteWarranty = (warr) => {
    openModalThree(
      <DeleteWarrantyContent
        customer={client}
        selectedWarranty={warr}
        closeDetails={closeModalTwo}
        closeDelete={closeModalThree}
      />,
      "Delete Warranty",
      "sm"
    );
  };

  const openWarrantyList = () => {
    openModalOne(
      <WarrantyList
        customer={client}
        openWarrantyDetails={openWarrantyDetails}
        openCreateWarranty={openCreateWarranty}
        closeModalOne={closeModalOne}
      />,
      "Warranty",
      "lg"
    );
  };

  const openCreateMaintenance = () => {
    openModalOne(
      <CreateMaintenance
        customer={client}
        closeModalTwo={closeModalOne}
        openMaintenanceMaterialList={openMaintenanceMaterialList}
      />,
      "Create New Maintenance",
      "lg"
    );
  };

  const openMaintenanceDetails = (maint, equipment, equipmentIndex) => {
    openModalTwo(
      <MaintenanceDetails
        closeModalTwo={closeModalTwo}
        customer={client}
        equipmentIndex={equipmentIndex}
        openDeleteMaintenance={openDeleteMaintenance}
        selectedMaintenance={maint}
        unit={equipment}
      />,
      `${equipment.equipmentName} Maintenance Details`,
      "md"
    );
  };

  const openDeleteMaintenance = (maint, equipment) => {
    openModalThree(
      <DeleteMaintenanceContent
        customer={client}
        selectedMaintenance={maint}
        unit={equipment}
        closeDetailsModal={closeModalTwo}
        closeDeleteModal={closeModalThree}
      />,
      `Delete Maintenance for ${equipment.equipmentName}`,
      "sm"
    );
  };

  const openMaintenanceList = () => {
    openModalOne(
      <MaintenanceList
        closeModalOne={closeModalOne}
        customer={client}
        openMaintenanceDetails={openMaintenanceDetails}
        openMaintenanceMaterialList={openMaintenanceMaterialList}
      />,
      "Maintenance List",
      "lg"
    );
  };

  const openMaintenanceMaterialList = (custId) => {
    openModalTwo(
      <MaintenanceMaterialList
        closeModalTwo={closeModalTwo}
        customerId={custId}
      />,
      "Maintenance Material",
      "lg"
    );
  };

  const openPartsQuoteList = () => {
    openModalOne(
      <PartsQuoteList customer={client} closeBasicModal={closeModalOne} />,
      "Parts Quotes",
      "lg"
    );
  };

  return (
    <div className="sizeAdjustment">
      <Toast />
      <Grid container spacing={1.5} m={1}>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <CustomerSearch
            handleCustomerSelected={handleCustomerSelected}
            handleEventSelected={handleEventSelected}
            openCreateCustomer={openCreateCustomer}
            openMaintenanceList={openMaintenanceList}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <CustomerInformation
            customer={client}
            openCreateDispatch={openCreateDispatch}
            openCreateMaintenance={openCreateMaintenance}
            openCustomerEquipmentList={openCustomerEquipmentList}
            openDispatchHistory={openDispatchHistory}
            openEditCustomerBilling={openEditCustomerBilling}
            openEditCustomerDetails={openEditCustomerDetails}
            openPartsQuoteList={openPartsQuoteList}
            openWarrantyList={openWarrantyList}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <CustomerNotesList
            customer={client}
            openCreateCustomerNote={openCreateCustomerNote}
            openCustomerNoteDetails={openCustomerNoteDetails}
          />
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
      {isModalTwoOpen && (
        <Suspense fallback={<CircularProgress />}>
          <MaterialModal
            isModalOpen={isModalTwoOpen}
            closeModal={closeModalTwo}
            modalContent={modalTwoContent}
            modalTitle={modalTwoTitle}
            modalWidth={modalTwoWidth}
          />
        </Suspense>
      )}
      {isModalThreeOpen && (
        <Suspense fallback={<CircularProgress />}>
          <MaterialModal
            isModalOpen={isModalThreeOpen}
            closeModal={closeModalThree}
            modalContent={modalThreeContent}
            modalTitle={modalThreeTitle}
            modalWidth={modalThreeWidth}
          />
        </Suspense>
      )}
      {isModalFourOpen && (
        <Suspense fallback={<CircularProgress />}>
          <MaterialModal
            isModalOpen={isModalFourOpen}
            closeModal={closeModalFour}
            modalContent={modalFourContent}
            modalTitle={modalFourTitle}
            modalWidth={modalFourWidth}
          />
        </Suspense>
      )}
    </div>
  );
};

export default HomePage;
