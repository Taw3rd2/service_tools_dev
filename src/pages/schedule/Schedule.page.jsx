import { lazy, Suspense, useState } from "react";

import { collection } from "firebase/firestore";
import { db, useSyncedCollection } from "../../firebase/firestore.utils";
import { useNavigate } from "react-router-dom";

import Calendar from "./calendar/Calendar.view";
import Toast from "../../components/basic_components/toast/Toast";

import { CircularProgress, IconButton, Tab, Tabs } from "@mui/material";
import { getFormattedDate } from "../../utilities/dateUtils";

import "../../global_style/style.css";
import { Print } from "@mui/icons-material";
import CalendarCustomerSearch from "../../components/customer_search/CalendarCustomerSearch";

//Material Modal
const MaterialModal = lazy(() =>
  import("../../components/basic_components/material_modal/MaterialModal")
);

//Dispatch
const CancelDispatch = lazy(() =>
  import("../../components/dispatches/cancel_dispatch/CancelDispatch")
);
const CreateDispatch = lazy(() =>
  import("../../components/dispatches/create_dispatch/CreateDispatch")
);
const DispatchDetails = lazy(() =>
  import("../../components/dispatches/details/DispatchDetails")
);
const DeleteDispatch = lazy(() =>
  import("../../components/dispatches/delete/DeleteDispatch")
);
const Holding = lazy(() =>
  import("../../components/dispatches/holding/Holding")
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
      <DispatchDetails
        closeModalOne={closeModalOne}
        openCancelDispatch={openCancelDispatch}
        openDeleteDispatch={openDeleteDispatch}
        openHolding={openHolding}
        openJobCompleted={openJobCompleted}
        openSameTech={openSameTech}
        selectedDispatch={selectedDispatch}
      />,
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>Dispatch Details</div>
        <IconButton
          size="small"
          color="primary"
          style={{ marginLeft: "auto", marginRight: "8px" }}
          onClick={() => routeToPrintOneSlip(selectedDispatch)}
        >
          <Print fontSize="large" />
        </IconButton>
      </div>,
      "md"
    );
  };

  const openHolding = (selectedDispatch) => {
    openModalTwo(
      <Holding
        selectedDispatch={selectedDispatch}
        closeModalOne={closeModalOne}
        closeModalTwo={closeModalTwo}
      />,
      "Move To Holding",
      "sm"
    );
  };

  const openCancelDispatch = (selectedDispatch) => {
    openModalTwo(
      <CancelDispatch
        selectedDispatch={selectedDispatch}
        closeModalOne={closeModalOne}
        closeModalTwo={closeModalTwo}
      />,
      "Cancel Dispatch",
      "sm"
    );
  };

  const openDeleteDispatch = (selectedDispatch) => {
    openModalTwo(
      <DeleteDispatch
        selectedDispatch={selectedDispatch}
        closeModalOne={closeModalOne}
        closeModalTwo={closeModalTwo}
      />,
      "Delete Dispatch",
      "sm"
    );
  };

  const openJobCompleted = () => {
    openModalTwo(
      <JobComplete closeModalTwo={closeModalTwo} />,
      "Invalid",
      "20%"
    );
  };

  const openSameTech = () => {
    openModalTwo(<SameTech closeModalTwo={closeModalTwo} />, "Invalid", "sm");
  };

  const openDailyOptionsMenu = (date) => {
    openModalOne(
      <DailyOptionsMenu
        closeModalOne={closeModalOne}
        closeModalTwo={closeModalTwo}
        calendarDateSelected={date}
        openDayLabelEditor={openDayLabelEditor}
      />,
      `Daily Options for ${getFormattedDate(date)}`,
      "sm"
    );
  };

  const openDayLabelEditor = (date) => {
    openModalTwo(
      <DayLabelEditor
        closeModalTwo={closeModalTwo}
        openAddDayLabel={openAddDayLabel}
        openDeleteDayLabel={openDeleteDayLabel}
        openEditDayLabel={openEditDayLabel}
        calendarDateSelected={date}
      />,
      `Day Labels for ${getFormattedDate(date)}`,
      "md"
    );
  };

  const openAddDayLabel = (date) => {
    openModalThree(
      <AddDayLabel
        closeModalThree={closeModalThree}
        calendarDateSelected={date}
      />,
      `Add Label for ${getFormattedDate(date)}`,
      "sm"
    );
  };

  const openDeleteDayLabel = (dayLabel) => {
    openModalThree(
      <DeleteDayLabel
        closeModalThree={closeModalThree}
        selectedDayLabel={dayLabel}
      />,
      "Delete Day Label",
      "sm"
    );
  };

  const openEditDayLabel = (date, dayLabel) => {
    openModalThree(
      <EditDayLabel
        closeModalThree={closeModalThree}
        calendarDateSelected={date}
        selectedDayLabel={dayLabel}
      />,
      "Edit Day Label",
      "sm"
    );
  };

  const openCreateDispatch = (customer, date) => {
    openModalTwo(
      <CreateDispatch
        customer={customer}
        date={date}
        closeModalOne={closeModalTwo}
      />,
      "Create Dispatch",
      "sm"
    );
  };

  const openCalendarCustomerSearch = (date) => {
    openModalOne(
      <CalendarCustomerSearch
        closeModalOne={closeModalOne}
        date={date}
        openCreateDispatch={openCreateDispatch}
      />,
      "Customer Search",
      "sm"
    );
    // openCustomerSearchModal(
    //   <CalendarCustomerSearch
    //     openCreateDispatch={openCreateDispatch}
    //     closeModalOne={closeCustomerSearchModal}
    //     date={date}
    //   />
    // );
  };

  return (
    <div className="">
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
