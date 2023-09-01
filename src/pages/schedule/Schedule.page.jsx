import { lazy, Suspense, useState } from "react";

import { collection } from "firebase/firestore";
import { db, useSyncedCollection } from "../../firebase/firestore.utils";
import { useNavigate } from "react-router-dom";

import Calendar from "./calendar/Calendar.view";
import CalendarSpinner from "../../components/spinner/CalendarSpinner";
import Toast from "../../components/basic_components/toast/Toast";

import { IconButton, Tab, Tabs } from "@mui/material";
import { getFormattedDate } from "../../utilities/dateUtils";

import "../../global_style/style.css";
import { Print } from "@mui/icons-material";
import CalendarCustomerSearch from "../../components/customer_search/CalendarCustomerSearch";

//Modals
const ModalOne = lazy(() =>
  import("../../components/basic_components/modal_one/ModalOne")
);
const ModalTwo = lazy(() =>
  import("../../components/basic_components/modal_two/ModalTwo")
);
const ModalThree = lazy(() =>
  import("../../components/basic_components/modal_three/ModalThree")
);
const CustomerSearchModal = lazy(() =>
  import("../../components/customer_search/customerSearchModal")
);
//Dispatch
const CreateDispatch = lazy(() =>
  import("../../components/dispatches/create_dispatch/CreateDispatch")
);
const DispatchDetails = lazy(() =>
  import("../../components/dispatches/details/DispatchDetails")
);
const DeleteDispatch = lazy(() =>
  import("../../components/dispatches/delete/DeleteDispatch")
);
//Menu
const DailyOptionsMenu = lazy(() =>
  import("../../components/navigation_buttons/DailyOptionsMenu")
);
//Validation
const JobComplete = lazy(() =>
  import("../../pages/schedule/validation/JobComplete")
);
const SameTech = lazy(() => import("../../pages/schedule/validation/SameTech"));
//DayLabels
const DayLabelEditor = lazy(() =>
  import("../schedule/day_labels/DayLabelEditor")
);
const AddDayLabel = lazy(() => import("../schedule/day_labels/AddDayLabel"));
const DeleteDayLabel = lazy(() =>
  import("../schedule/day_labels/DeleteDayLabel")
);
const EditDayLabel = lazy(() => import("../schedule/day_labels/EditDayLabel"));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`calendar-tabpanel-${index}`}
      aria-labelledby={`calendar-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div style={{ padding: "8px" }}>
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `calendar-tab-${index}`,
    "aria-controls": `calendar-tabpanel-${index}`,
  };
}

const Schedule = () => {
  //Fetch Technicians
  const technicians = useSyncedCollection(collection(db, "technicians"));
  const navigate = useNavigate();

  //Tabs
  const [tabValue, setTabValue] = useState(0);
  const handleChangeTab = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

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

  //Modal Two
  const [isModalTwoOpen, setModalTwoOpen] = useState(false);
  const [modalTwoSize, setModalTwoSize] = useState("45%");
  const [modalTwoTitle, setModalTwoTitle] = useState("Modal One");
  const [modalTwoContent, setModalTwoContent] = useState(
    <div>Modal Two Content</div>
  );
  const openModalTwo = (size, title, content) => {
    setModalTwoSize(size);
    setModalTwoTitle(title);
    setModalTwoContent(content);
    setModalTwoOpen(true);
  };
  const closeModalTwo = () => {
    setModalTwoSize("45%");
    setModalTwoTitle("Modal Two");
    setModalTwoContent(<div>Modal Two Content</div>);
    setModalTwoOpen(false);
  };

  //Modal Three
  const [isModalThreeOpen, setModalThreeOpen] = useState(false);
  const [modalThreeSize, setModalThreeSize] = useState("45%");
  const [modalThreeTitle, setModalThreeTitle] = useState("Modal Three");
  const [modalThreeContent, setModalThreeContent] = useState(
    <div>Modal Three Content</div>
  );
  const openModalThree = (size, title, content) => {
    setModalThreeSize(size);
    setModalThreeTitle(title);
    setModalThreeContent(content);
    setModalThreeOpen(true);
  };
  const closeModalThree = () => {
    setModalThreeSize("45%");
    setModalThreeTitle("Modal Two");
    setModalThreeContent(<div>Modal Three Content</div>);
    setModalThreeOpen(false);
  };

  //Customer Search Modal
  const [isCustomerSearchModalOpen, setCustomerSearchModalOpen] =
    useState(false);
  const [customerSearchModalContent, setCustomerSearchContent] = useState(
    <div>Customer Search Content</div>
  );
  const openCustomerSearchModal = (content) => {
    setCustomerSearchContent(content);
    setCustomerSearchModalOpen(true);
  };
  const closeCustomerSearchModal = () => {
    setCustomerSearchContent(<div>Customer Search Content</div>);
    setCustomerSearchModalOpen(false);
  };

  const routeToPrintOneSlip = (selectedDispatch) => {
    console.log("selectedDispatch: ", selectedDispatch);
    navigate(`/print_one_slip/${selectedDispatch.id}`, {
      state: {
        dispatch: selectedDispatch.extendedProps,
        customer: selectedDispatch.customer,
      },
      key: selectedDispatch.id,
    });
  };

  const openDispatchDetails = (selectedDispatch) => {
    openModalOne(
      "25%",
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>Dispatch Details</div>
        <IconButton
          size="small"
          style={{ marginLeft: "auto", marginRight: "8px", color: "teal" }}
          onClick={() => routeToPrintOneSlip(selectedDispatch)}
        >
          <Print fontSize="large" />
        </IconButton>
      </div>,
      <DispatchDetails
        selectedDispatch={selectedDispatch}
        closeModalOne={closeModalOne}
        openJobCompleted={openJobCompleted}
        openSameTech={openSameTech}
        openDeleteDispatch={openDeleteDispatch}
      />
    );
  };

  const openDeleteDispatch = (selectedDispatch) => {
    openModalTwo(
      "20%",
      "Delete Dispatch",
      <DeleteDispatch
        selectedDispatch={selectedDispatch}
        closeModalOne={closeModalOne}
        closeModalTwo={closeModalTwo}
      />
    );
  };

  const openJobCompleted = () => {
    openModalTwo(
      "20%",
      "Invalid",
      <JobComplete closeModalTwo={closeModalTwo} />
    );
  };

  const openSameTech = () => {
    openModalTwo("20%", "Invalid", <SameTech closeModalTwo={closeModalTwo} />);
  };

  const openDailyOptionsMenu = (date) => {
    openModalOne(
      "15%",
      `Daily Options for ${getFormattedDate(date)}`,
      <DailyOptionsMenu
        closeModalOne={closeModalOne}
        closeModalTwo={closeModalTwo}
        calendarDateSelected={date}
        openDayLabelEditor={openDayLabelEditor}
      />
    );
  };

  const openDayLabelEditor = (date) => {
    openModalTwo(
      "30%",
      `Day Labels for ${getFormattedDate(date)}`,
      <DayLabelEditor
        closeModalTwo={closeModalTwo}
        openAddDayLabel={openAddDayLabel}
        openDeleteDayLabel={openDeleteDayLabel}
        openEditDayLabel={openEditDayLabel}
        calendarDateSelected={date}
      />
    );
  };

  const openAddDayLabel = (date) => {
    openModalThree(
      "25%",
      `Add Label for ${getFormattedDate(date)}`,
      <AddDayLabel
        closeModalThree={closeModalThree}
        calendarDateSelected={date}
      />
    );
  };

  const openDeleteDayLabel = (dayLabel) => {
    openModalThree(
      "25%",
      "Delete Day Label",
      <DeleteDayLabel
        closeModalThree={closeModalThree}
        selectedDayLabel={dayLabel}
      />
    );
  };

  const openEditDayLabel = (date, dayLabel) => {
    openModalThree(
      "25%",
      "Edit Day Label",
      <EditDayLabel
        closeModalThree={closeModalThree}
        calendarDateSelected={date}
        selectedDayLabel={dayLabel}
      />
    );
  };

  const openCreateDispatch = (customer, date) => {
    openModalTwo(
      "25%",
      "Create Dispatch",
      <CreateDispatch
        customer={customer}
        date={date}
        closeModalOne={closeModalTwo}
      />
    );
  };

  const openCalendarCustomerSearch = (date) => {
    openCustomerSearchModal(
      <CalendarCustomerSearch
        openCreateDispatch={openCreateDispatch}
        closeModalOne={closeCustomerSearchModal}
        date={date}
      />
    );
  };

  return (
    <div className="schedulePage">
      <Toast />
      <div style={{ borderBottom: 2, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          aria-label="calendar tabs"
        >
          <Tab label="ALL" {...a11yProps(0)} />
          {technicians.length > 0 &&
            technicians.map((technician, index) => (
              <Tab
                key={technician.id}
                label={technician.name}
                style={{
                  backgroundColor: `${technician.color}`,
                  color: "white",
                }}
                {...a11yProps(index + 1)}
              />
            ))}
        </Tabs>
      </div>
      <TabPanel value={tabValue} index={0}>
        <Calendar
          technician={"ALL"}
          technicians={technicians}
          openDispatchDetails={openDispatchDetails}
          openDailyOptionsMenu={openDailyOptionsMenu}
          openCalendarCustomerSearch={openCalendarCustomerSearch}
        />
      </TabPanel>
      {isModalOneOpen && (
        <Suspense fallback={<CalendarSpinner />}>
          <ModalOne
            modalOneSize={modalOneSize}
            modalOneTitle={modalOneTitle}
            modalOneContent={modalOneContent}
            closeModalOne={closeModalOne}
          />
        </Suspense>
      )}
      {isModalTwoOpen && (
        <Suspense fallback={<CalendarSpinner />}>
          <ModalTwo
            modalTwoSize={modalTwoSize}
            modalTwoTitle={modalTwoTitle}
            modalTwoContent={modalTwoContent}
            closeModalTwo={closeModalTwo}
          />
        </Suspense>
      )}
      {isModalThreeOpen && (
        <Suspense fallback={<CalendarSpinner />}>
          <ModalThree
            modalThreeSize={modalThreeSize}
            modalThreeTitle={modalThreeTitle}
            modalThreeContent={modalThreeContent}
            closeModalThree={closeModalThree}
          />
        </Suspense>
      )}
      {isCustomerSearchModalOpen && (
        <Suspense fallback={<CalendarSpinner />}>
          <CustomerSearchModal
            customerSearchModalContent={customerSearchModalContent}
            closeCustomerSearchModal={closeCustomerSearchModal}
          />
        </Suspense>
      )}
      {technicians.length > 0 &&
        technicians.map((technician, index) => (
          <TabPanel key={technician.id} value={tabValue} index={index + 1}>
            <Calendar
              technician={technician.name}
              technicians={technicians}
              openDispatchEditorModal={openDispatchDetails}
              openDailyOptionsMenu={openDailyOptionsMenu}
              openCalendarCustomerSearch={openCalendarCustomerSearch}
            />
          </TabPanel>
        ))}
    </div>
  );
};

export default Schedule;
