import { lazy, Suspense, useEffect, useState } from "react";
import { Button, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";

import EquipmentCatalogList from "./equipment_catalog_list/EquipmentCalalogList";
import EquipmentWorksheet from "./equipment_worksheet/EquipmentWorksheet";
import Toast from "../../../components/basic_components/toast/Toast";
import { Add, Print } from "@mui/icons-material";
import { ReactToPrint } from "../../../components/react_to_print/ReactToPrint";
import { collection } from "firebase/firestore";
import SampleJob from "./sample_job/SampleJob";

//Material Modal
const MaterialModal = lazy(() =>
  import("../../../components/basic_components/material_modal/MaterialModal")
);

const AddEquipmentToJob = lazy(() =>
  import("./equipment_worksheet/AddEquipmentToJob")
);
const DeleteEquipment = lazy(() =>
  import("./delete_equipment/DeleteEquipment")
);
const CreateCategory = lazy(() => import("./create_category/CreateCategory"));
const DeleteCategory = lazy(() => import("./delete_category/DeleteCategory"));
const EditMaterialList = lazy(() => import("./material_list/EditMaterialList"));
const WorksheetMaterialPicker = lazy(() =>
  import("./equipment_worksheet/WorksheetMaterialPicker")
);
const JobMaterialPicker = lazy(() =>
  import("./material_list/JobMaterialPicker")
);
const EditAdditionsList = lazy(() =>
  import("./additions_list/EditAdditionsList")
);
const WorksheetAdditionsPicker = lazy(() =>
  import("./equipment_worksheet/WorksheetAdditionsPicker")
);
const JobAdditionsPicker = lazy(() =>
  import("./additions_list/JobAdditionsPicker")
);
const AddLaborToEquipment = lazy(() =>
  import("./equipment_worksheet/AddLaborToEquipment")
);
const AddLaborToJob = lazy(() => import("./labor_list/AddLaborToJob"));
const EditLaborList = lazy(() => import("./labor_list/EditLaborList"));

const EquipmentTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`equipment-catalog-tabpanel=${index}`}
      aria-labelledby={`equipment-catalog-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <div style={{ padding: "8px" }}>
          <div>{children}</div>
        </div>
      )}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `equipment-catalog-tabpanel=${index}`,
    "aria-controls": `equipment-catalog-tabpanel=${index}`,
  };
};

const EquipmentCatalog = () => {
  //fetch equipment tabs, and sub categories
  const equipmentTabs = useSyncedCollection(collection(db, "equipmentTabs"));
  const subCategories = useSyncedCollection(
    collection(db, "equipmentSubCategories")
  );
  const listOfEquipment = useSyncedCollection(collection(db, "equipment"));

  //keep track of tabs
  const [tabValue, setTabValue] = useState(0);
  const handleChangeTab = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

  //keep track of equipment
  const [loadedEquipment, setLoadedEquipment] = useState([]);

  const onBaseCostLoad = (number) => {
    return parseFloat(number / 100).toFixed(2);
  };

  useEffect(() => {
    const loadEquipment = () => {
      if (listOfEquipment.length > 0) {
        listOfEquipment.map((unit) => {
          return (unit.cost = onBaseCostLoad(unit.cost));
        });
        setLoadedEquipment(listOfEquipment);
      }
    };
    return loadEquipment();
  }, [listOfEquipment]);

  //selected equipment
  const [selectedEquipmentValues, setSelectedEquipmentValues] = useState({
    btu: "",
    cost: "",
    dateUpdated: null,
    defaultLaborList: [],
    defaultMaterialList: [],
    model: "",
    quantity: 1,
    size: "",
    subCategory: "",
    voltage: "",
    weight: "",
  });

  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const selectEquipment = (id) => {
    setSelectedEquipmentId(id);
  };
  const clearSelectedEquipment = () => {
    setSelectedEquipmentId(null);
    setMaterial([]);
    setLabor([]);
    setAdditions([]);
  };

  //Material List
  const [material, setMaterial] = useState([]);

  //Labor List
  const [labor, setLabor] = useState([]);

  //additions List
  const [additions, setAdditions] = useState([]);

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

  const openDeleteEquipment = (unit) => {
    openModalOne(
      <DeleteEquipment
        equipmentToDelete={unit}
        closeModalOne={closeModalOne}
      />,
      "Delete Equipment",
      "sm"
    );
  };

  const openCreateCategory = (tab) => {
    openModalOne(
      <CreateCategory tab={tab} closeModalOne={closeModalOne} />,
      "Create Category",
      "sm"
    );
  };

  const openDeleteCategory = (category) => {
    openModalOne(
      <DeleteCategory
        categoryToDelete={category}
        closeModalOne={closeModalOne}
      />,
      "Delete Category",
      "sm"
    );
  };

  const openAddMaterialList = () => {
    openModalOne(
      <AddEquipmentToJob
        additions={additions}
        closeModalOne={closeModalOne}
        labor={labor}
        material={material}
        openSampleJob={openSampleJob}
        selectedEquipmentId={selectedEquipmentId}
        setAdditions={setAdditions}
        setLabor={setLabor}
        setMaterial={setMaterial}
      />,
      "Add Equipment To Job",
      "sm"
    );
  };

  const openEditLaborList = (unitId) => {
    openModalOne(
      <EditLaborList
        unitId={unitId}
        openAddLaborToEquipment={openAddLaborToEquipment}
        closeModalOne={closeModalOne}
      />,
      "Edit Pre Defined Labor List",
      "lg"
    );
  };

  const [isEditMaterialListOpen, setEditMaterialListOpen] = useState(false);
  const openEditMaterialList = () => {
    setEditMaterialListOpen(true);
  };
  const closeEditMaterialList = () => {
    setEditMaterialListOpen(false);
    closeModalOne();
  };

  const openWorksheetAdditionsPicker = () => {
    openModalTwo(
      <WorksheetAdditionsPicker
        selectedEquipmentId={selectedEquipmentId}
        closeModalTwo={closeModalTwo}
      />,
      "Flat Rate Additions Picker",
      "lg"
    );
  };

  const [isEditAdditionsListOpen, setEditAdditionsListOpen] = useState(false);

  const openEditAdditionsList = () => {
    setEditAdditionsListOpen(true);
  };
  const closeEditAdditionsList = () => {
    setEditAdditionsListOpen(false);
    closeModalOne();
  };

  const openWorksheetMaterialPicker = () => {
    openModalTwo(
      <WorksheetMaterialPicker
        selectedEquipmentId={selectedEquipmentId}
        closeModalTwo={closeModalTwo}
      />,
      "Material Picker",
      "lg"
    );
  };

  const openJobMaterialPicker = () => {
    openModalTwo(
      <JobMaterialPicker
        material={material}
        setMaterial={setMaterial}
        closeModalTwo={closeModalTwo}
      />,
      "Material Picker",
      "sm"
    );
  };

  const openAddLaborToEquipment = () => {
    openModalTwo(
      <AddLaborToEquipment
        selectedEquipmentId={selectedEquipmentId}
        closeModalTwo={closeModalTwo}
      />,
      "Add Labor To Equipment",
      "md"
    );
  };

  const openAddLaborToJob = () => {
    openModalTwo(
      <AddLaborToJob
        labor={labor}
        setLabor={setLabor}
        closeModalTwo={closeModalTwo}
      />,
      "Add Labor To Job",
      "sm"
    );
  };

  const openAddAdditionsToJob = () => {
    openModalTwo(
      <JobAdditionsPicker
        additions={additions}
        setAdditions={setAdditions}
        closeModalTwo={closeModalTwo}
      />,
      "Additions Picker",
      "lg"
    );
  };

  const openPrintEquipmentSheets = (equipmentType) => {
    openModalOne(
      <ReactToPrint
        equipmentType={equipmentType}
        closeModalOne={closeModalOne}
      />,
      "Equipment Sheets",
      "lg"
    );
  };

  const [isSampleJobOpen, setSampleJobOpen] = useState(false);
  const openSampleJob = () => {
    setSampleJobOpen(true);
  };
  const closeSampleJob = () => {
    setSampleJobOpen(false);
    closeModalOne();
  };

  return (
    <div className="sizeAdjustment">
      <Toast />
      <div className="row" style={{ marginBottom: "0px", display: "flex" }}>
        <div
          className="singleRowInput"
          style={{ alignItems: "center", margin: "8px" }}
        >
          <Typography variant="h4">Units: {listOfEquipment.length}</Typography>
        </div>
      </div>
      <div className="row">
        <div className="doubleRowInput">
          <div style={{ borderBottom: 2, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              variant="scrollable"
              scrollButtons={true}
              aria-label="equipment catalog tabs"
            >
              {equipmentTabs.length > 0 &&
                equipmentTabs
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((tab, index) => (
                    <Tab
                      key={index}
                      label={tab.name}
                      {...a11yProps(index + 1)}
                    />
                  ))}
            </Tabs>
          </div>
          {equipmentTabs.length > 0 &&
            equipmentTabs
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((tab, index) => (
                //for each tab we need a equipment panel
                <EquipmentTabPanel key={tab.id} value={tabValue} index={index}>
                  {subCategories.length > 0 &&
                    subCategories
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((category, index) => (
                        <div key={category.id}>
                          {category.equipmentTab === tab.name && (
                            <EquipmentCatalogList
                              listOfEquipment={loadedEquipment}
                              tab={tab.name}
                              category={category}
                              openDeleteCategory={openDeleteCategory}
                              selectEquipment={selectEquipment}
                            />
                          )}
                        </div>
                      ))}
                  <div className="buttonBar">
                    <Button
                      variant="contained"
                      type="button"
                      startIcon={<Print />}
                      onClick={() => openPrintEquipmentSheets("CarrierFurnace")}
                      size="small"
                    >
                      Carrier Furnace Price Sheets
                    </Button>
                    <Button
                      variant="contained"
                      type="button"
                      startIcon={<Print />}
                      onClick={() => openPrintEquipmentSheets("PayneFurnace")}
                      size="small"
                    >
                      Payne Furnace Price Sheets
                    </Button>
                    <Button
                      variant="contained"
                      type="button"
                      startIcon={<Print />}
                      onClick={() => openPrintEquipmentSheets("CarrierAC")}
                      size="small"
                    >
                      Carrier AC Price Sheets
                    </Button>
                    <Button
                      variant="contained"
                      type="button"
                      startIcon={<Print />}
                      onClick={() => openPrintEquipmentSheets("PayneAC")}
                      size="small"
                    >
                      Payne AC Price Sheets
                    </Button>
                    <Button
                      variant="contained"
                      type="button"
                      startIcon={<Add />}
                      onClick={() => openCreateCategory(tab)}
                      size="small"
                    >
                      {`Add ${tab.name} Category`}
                    </Button>
                  </div>
                </EquipmentTabPanel>
              ))}
        </div>
        <div className="doubleRowInput" style={{ marginRight: "8px" }}>
          <EquipmentWorksheet
            selectedEquipmentId={selectedEquipmentId}
            selectedEquipmentValues={selectedEquipmentValues}
            setSelectedEquipmentValues={setSelectedEquipmentValues}
            clearSelectedEquipment={clearSelectedEquipment}
            openDeleteEquipment={openDeleteEquipment}
            openAddMaterialList={openAddMaterialList}
            openEditLaborList={openEditLaborList}
            openEditMaterialList={openEditMaterialList}
            openEditAdditionsList={openEditAdditionsList}
          />
        </div>
      </div>
      {isSampleJobOpen && (
        <Suspense fallback={<CircularProgress />}>
          <MaterialModal
            closeModal={closeModalTwo}
            isModalOpen={isSampleJobOpen}
            modalContent={
              <SampleJob
                additions={additions}
                closeSampleJob={closeSampleJob}
                labor={labor}
                material={material}
                openAddAdditionsToJob={openAddAdditionsToJob}
                openAddLaborToJob={openAddLaborToJob}
                openJobMaterialPicker={openJobMaterialPicker}
                selectedEquipmentId={selectedEquipmentId}
                setAdditions={setAdditions}
                setLabor={setLabor}
                setMaterial={setMaterial}
              />
            }
            modalTitle={"Sample Job"}
            modalWidth={"xl"}
          />
        </Suspense>
      )}
      {isEditMaterialListOpen && (
        <Suspense fallback={<CircularProgress />}>
          <MaterialModal
            closeModal={closeModalOne}
            isModalOpen={isEditMaterialListOpen}
            modalContent={
              <EditMaterialList
                selectedEquipmentId={selectedEquipmentId}
                selectedEquipmentValues={selectedEquipmentValues}
                setSelectedEquipmentValues={setSelectedEquipmentValues}
                material={material}
                setMaterial={setMaterial}
                openWorksheetMaterialPicker={openWorksheetMaterialPicker}
                closeModalOne={closeEditMaterialList}
              />
            }
            modalTitle={"Edit Pre Defined Material List"}
            modalWidth={"md"}
          />
        </Suspense>
      )}
      {isEditAdditionsListOpen && (
        <Suspense fallback={<CircularProgress />}>
          <MaterialModal
            closeModal={closeModalOne}
            isModalOpen={isEditAdditionsListOpen}
            modalContent={
              <EditAdditionsList
                selectedEquipmentId={selectedEquipmentId}
                selectedEquipmentValues={selectedEquipmentValues}
                openWorksheetAdditionsPicker={openWorksheetAdditionsPicker}
                closeModalOne={closeEditAdditionsList}
              />
            }
            modalTitle={"Edit Pre Defined Additions List"}
            modalWidth={"md"}
          />
        </Suspense>
      )}
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
      {isModalTwoOpen && (
        <Suspense fallback={<CircularProgress />}>
          <MaterialModal
            closeModalTwo={closeModalTwo}
            isModalOpen={isModalTwoOpen}
            modalContent={modalTwoContent}
            modalTitle={modalTwoTitle}
            modalWidth={modalTwoWidth}
          />
        </Suspense>
      )}
    </div>
  );
};

export default EquipmentCatalog;
