import { lazy, Suspense, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";
import PartsCatalogList from "./parts_catalog_list/PartsCatalogList";
import BasicSearchBar from "../../../components/basic_components/BasicSearchBar";
import Spinner from "../../../components/spinner/Spinner";
import Toast from "../../../components/basic_components/toast/Toast";
import { collection } from "firebase/firestore";

const ModalOne = lazy(() =>
  import("../../../components/basic_components/modal_one/ModalOne")
);
const ModalTwo = lazy(() =>
  import("../../../components/basic_components/modal_two/ModalTwo")
);

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
  const [modalTwoTitle, setModalTwoTitle] = useState("Modal Two");
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

  //Part Details
  const openPartDetails = (part) => {
    openModalOne(
      "800px",
      "Part Details",
      <PartDetails
        part={part}
        openDeletePart={openDeletePart}
        openCreateCrossReference={openCreateCrossReference}
        openDeleteCrossReference={openDeleteCrossReference}
        openEditCrossReference={openEditCrossReference}
        closeModalOne={closeModalOne}
      />
    );
  };

  //Create Part
  const openCreatePart = () => {
    openModalOne(
      "40%",
      "Create Part",
      <CreateNewPart closeModalOne={closeModalOne} />
    );
  };

  //Delete Part
  const openDeletePart = (part) => {
    openModalTwo(
      "20%",
      "Delete Part",
      <DeletePart
        partToDelete={part}
        closeModalOne={closeModalOne}
        closeModalTwo={closeModalTwo}
      />
    );
  };

  //Create Cross Reference
  const openCreateCrossReference = (part) => {
    openModalTwo(
      "40%",
      "Create Cross Reference",
      <CreateCrossReference part={part} closeModalTwo={closeModalTwo} />
    );
  };

  //Delete Cross Reference
  const openDeleteCrossReference = (part, crossReferenceIndex) => {
    openModalTwo(
      "20%",
      "Delete Cross Reference",
      <DeleteCrossReference
        part={part}
        crossReferenceIndex={crossReferenceIndex}
        closeModalTwo={closeModalTwo}
      />
    );
  };

  //Edit Cross Reference
  const openEditCrossReference = (part, crossReferenceIndex) => {
    openModalTwo(
      "40%",
      "Edit Cross Reference",
      <EditCrossReference
        part={part}
        crossReferenceIndex={crossReferenceIndex}
        closeModalTwo={closeModalTwo}
      />
    );
  };

  return (
    <div className="partsCatalogPage">
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
        <Suspense fallback={<Spinner />}>
          <ModalOne
            modalOneSize={modalOneSize}
            modalOneTitle={modalOneTitle}
            modalOneContent={modalOneContent}
            closeModalOne={closeModalOne}
          />
        </Suspense>
      )}
      {isModalTwoOpen && (
        <Suspense fallback={<Spinner />}>
          <ModalTwo
            modalTwoSize={modalTwoSize}
            modalTwoTitle={modalTwoTitle}
            modalTwoContent={modalTwoContent}
            closeModalTwo={closeModalTwo}
          />
        </Suspense>
      )}
    </div>
  );
};

export default PartsCatalog;
