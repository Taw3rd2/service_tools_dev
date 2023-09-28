import { lazy, Suspense, useState } from "react";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";
import PartsCatalogList from "./parts_catalog_list/PartsCatalogList";
import BasicSearchBar from "../../../components/basic_components/BasicSearchBar";
import Toast from "../../../components/basic_components/toast/Toast";
import { collection } from "firebase/firestore";

const CreateNewPart = lazy(() => import("./create_part/CreatePart"));
const PartDetails = lazy(() => import("./part_details/PartDetails"));
const DeletePart = lazy(() => import("./delete_part/DeletePart"));
const CreateCrossReference = lazy(() =>
  import("./create_cross_reference/CreateCrossReference")
);
const DeleteCrossReference = lazy(() =>
  import("./delete_cross_reference/DeleteCrossReference")
);
const EditCrossReference = lazy(() =>
  import("./edit_cross_reference/EditCrossReference")
);

//Material Modal
const MaterialModal = lazy(() =>
  import("../../../components/basic_components/material_modal/MaterialModal")
);

function PartsTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`parts-catalog-tabpanel-${index}`}
      aria-labelledby={`parts-catalog-tabpanel-${index}`}
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
    id: `parts-catalog-tabpanel-${index}`,
    "aria-controls": `parts-catalog-tabpanel-${index}`,
  };
}

const PartsCatalog = () => {
  //fetch parts
  const parts = useSyncedCollection(collection(db, "parts"));
  const [searchableParts, setSerchableParts] = useState(parts);
  const [partQuantity, setPartQuantity] = useState(parts.length);

  //search bar
  const [query, setQuery] = useState("");
  const partsCatalogSearch = async (queryInput) => {
    const filteredParts = parts.filter((part) => {
      return (
        part.partNumber.toLowerCase().includes(queryInput.toLowerCase()) ||
        part.partDescription.toLowerCase().includes(queryInput.toLowerCase()) ||
        part.crossReference.some((el) =>
          el.partNumber.toLowerCase().includes(queryInput.toLowerCase())
        )
      );
    });
    setQuery(queryInput);
    setSerchableParts(filteredParts);
  };

  const clearSearchQuery = () => {
    setQuery("");
    setSerchableParts(parts);
  };

  //fetch parts tabs
  const partsTabs = useSyncedCollection(collection(db, "tabs"));

  //keep track of tabs
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

  //Part Details
  const openPartDetails = (part) => {
    openModalOne(
      <PartDetails
        part={part}
        openDeletePart={openDeletePart}
        openCreateCrossReference={openCreateCrossReference}
        openDeleteCrossReference={openDeleteCrossReference}
        openEditCrossReference={openEditCrossReference}
        closeModalOne={closeModalOne}
      />,
      "Part Details",
      "lg"
    );
  };

  //Create Part
  const openCreatePart = () => {
    openModalOne(
      <CreateNewPart closeModalOne={closeModalOne} />,
      "Create Part",
      "sm"
    );
  };

  //Delete Part
  const openDeletePart = (part) => {
    openModalTwo(
      <DeletePart
        partToDelete={part}
        closeModalOne={closeModalOne}
        closeModalTwo={closeModalTwo}
      />,
      "Delete Part",
      "sm"
    );
  };

  //Create Cross Reference
  const openCreateCrossReference = (part) => {
    openModalTwo(
      <CreateCrossReference part={part} closeModalTwo={closeModalTwo} />,
      "Create Cross Reference",
      "sm"
    );
  };

  //Delete Cross Reference
  const openDeleteCrossReference = (part, crossReferenceIndex) => {
    openModalTwo(
      <DeleteCrossReference
        part={part}
        crossReferenceIndex={crossReferenceIndex}
        closeModalTwo={closeModalTwo}
      />,
      "Delete Cross Reference",
      "sm"
    );
  };

  //Edit Cross Reference
  const openEditCrossReference = (part, crossReferenceIndex) => {
    openModalTwo(
      <EditCrossReference
        part={part}
        crossReferenceIndex={crossReferenceIndex}
        closeModalTwo={closeModalTwo}
      />,
      "Edit Cross Reference",
      "sm"
    );
  };

  return (
    <div className="sizeAdjustment">
      <Toast />
      <div style={{ borderBottom: 2, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="parts catalog tabs"
        >
          <Tab label="All" {...a11yProps(0)} />

          {partsTabs.length > 0 &&
            partsTabs
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((tab, index) => (
                <Tab key={tab.id} label={tab.name} {...a11yProps(index + 1)} />
              ))}
        </Tabs>
      </div>
      <PartsTabPanel value={tabValue} index={0}>
        {/* This is index 0 which is all parts */}
        <BasicSearchBar
          value={query}
          setValue={partsCatalogSearch}
          searchLabel={`${partQuantity} Parts`}
          clearSearchQuery={clearSearchQuery}
        />
        {searchableParts.length > 0 ? (
          <PartsCatalogList
            partsList={searchableParts}
            category={"All"}
            openPartDetails={openPartDetails}
            openCreatePart={openCreatePart}
            setPartQuantity={setPartQuantity}
          />
        ) : (
          <PartsCatalogList
            partsList={parts}
            category={"All"}
            openPartDetails={openPartDetails}
            openCreatePart={openCreatePart}
            setPartQuantity={setPartQuantity}
          />
        )}
      </PartsTabPanel>
      {partsTabs.length > 0 &&
        partsTabs
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((tab, index) => (
            <PartsTabPanel key={tab.id} value={tabValue} index={index + 1}>
              {/* This is the balance of all tabs by index */}
              <BasicSearchBar
                value={query}
                setValue={partsCatalogSearch}
                searchLabel={`${partQuantity} Parts`}
                clearSearchQuery={clearSearchQuery}
              />
              {searchableParts.length > 0 ? (
                <PartsCatalogList
                  partsList={searchableParts}
                  category={tab.name}
                  openPartDetails={openPartDetails}
                  openCreatePart={openCreatePart}
                  setPartQuantity={setPartQuantity}
                />
              ) : (
                <PartsCatalogList
                  partsList={parts}
                  category={tab.name}
                  openPartDetails={openPartDetails}
                  openCreatePart={openCreatePart}
                  setPartQuantity={setPartQuantity}
                />
              )}
            </PartsTabPanel>
          ))}
      <h4>List of to do</h4>
      <p>Start Inventory Containers</p>
      <p>ability to export to excel</p>
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
    </div>
  );
};

export default PartsCatalog;
