import { lazy, Suspense, useEffect, useState } from "react";
import { Button, Tab, Tabs } from "@mui/material";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";

import EquipmentCatalogList from "./equipment_catalog_list/EquipmentCalalogList";
import EquipmentWorksheet from "./equipment_worksheet/EquipmentWorksheet";
import Spinner from "../../../components/spinner/Spinner";
import Toast from "../../../components/basic_components/toast/Toast";
import { Add, Print } from "@mui/icons-material";
import { ReactToPrint } from "../../../components/react_to_print/ReactToPrint";
import { collection } from "firebase/firestore";
import SampleJob from "./sample_job/SampleJob";

const ModalOne = lazy(() =>
  import("../../../components/basic_components/modal_one/ModalOne")
);
const ModalTwo = lazy(() =>
  import("../../../components/basic_components/modal_two/ModalTwo")
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

  const openDeleteEquipment = (unit) => {
    openModalOne(
      "20%",
      "Delete Equipment",
      <DeleteEquipment equipmentToDelete={unit} closeModalOne={closeModalOne} />
    );
  };

  const openCreateCategory = (tab) => {
    openModalOne(
      "20%",
      "Create Category",
      <CreateCategory tab={tab} closeModalOne={closeModalOne} />
    );
  };

  const openDeleteCategory = (category) => {
    openModalOne(
      "20%",
      "Delete Category",
      <DeleteCategory
        categoryToDelete={category}
        closeModalOne={closeModalOne}
      />
    );
  };

  const openAddMaterialList = () => {
    openModalOne(
      "30%",
      "Add Equipment To Job",
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
      />
    );
  };

  const openEditLaborList = (unitId) => {
    openModalOne(
      "50%",
      "Edit Pre Defined Labor List",
      <EditLaborList
        unitId={unitId}
        openAddLaborToEquipment={openAddLaborToEquipment}
        closeModalOne={closeModalOne}
      />
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
      "45%",
      "Flat Rate Additions Picker",
      <WorksheetAdditionsPicker
        selectedEquipmentId={selectedEquipmentId}
        closeModalTwo={closeModalTwo}
      />
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
      "45%",
      "Material Picker",
      <WorksheetMaterialPicker
        selectedEquipmentId={selectedEquipmentId}
        closeModalTwo={closeModalTwo}
      />
    );
  };

  const openJobMaterialPicker = () => {
    openModalTwo(
      "45%",
      "Material Picker",
      <JobMaterialPicker
        material={material}
        setMaterial={setMaterial}
        closeModalTwo={closeModalTwo}
      />
    );
  };

  const openAddLaborToEquipment = () => {
    openModalTwo(
      "30%",
      "Add Labor To Equipment",
      <AddLaborToEquipment
        selectedEquipmentId={selectedEquipmentId}
        closeModalTwo={closeModalTwo}
      />
    );
  };

  const openAddLaborToJob = () => {
    openModalTwo(
      "30%",
      "Add Labor To Job",
      <AddLaborToJob
        labor={labor}
        setLabor={setLabor}
        closeModalTwo={closeModalTwo}
      />
    );
  };

  const openAddAdditionsToJob = () => {
    openModalTwo(
      "45%",
      "Additions Picker",
      <JobAdditionsPicker
        additions={additions}
        setAdditions={setAdditions}
        closeModalTwo={closeModalTwo}
      />
    );
  };

  const openPrintEquipmentSheets = (equipmentType) => {
    openModalOne(
      "45%",
      "Equipment Sheets",
      <ReactToPrint
        equipmentType={equipmentType}
        closeModalOne={closeModalOne}
      />
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
    <div className="equipmentCatalogPage">
      <Toast />
      <div className="row" style={{ marginBottom: "0px", display: "flex" }}>
        <div
          className="singleRowInput"
          style={{ alignItems: "center", marginTop: "8px" }}
        >
          <div className="searchBarLabel">Units: {listOfEquipment.length}</div>
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
                      size="small"
                      variant="outlined"
                      startIcon={<Print />}
                      onClick={() => openPrintEquipmentSheets("CarrierFurnace")}
                    >
                      Carrier Furnace Price Sheets
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Print />}
                      onClick={() => openPrintEquipmentSheets("PayneFurnace")}
                    >
                      Payne Furnace Price Sheets
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Print />}
                      onClick={() => openPrintEquipmentSheets("CarrierAC")}
                    >
                      Carrier AC Price Sheets
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Print />}
                      onClick={() => openPrintEquipmentSheets("PayneAC")}
                    >
                      Payne AC Price Sheets
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => openCreateCategory(tab)}
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
        <Suspense fallback={<Spinner />}>
          <ModalTwo
            modalTwoSize={"90%"}
            modalTwoTitle={"Sample Job"}
            modalTwoContent={
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
            closeModalTwo={closeModalTwo}
          />
        </Suspense>
      )}
      {isEditMaterialListOpen && (
        <Suspense fallback={<Spinner />}>
          <ModalOne
            modalOneSize={"50%"}
            modalOneTitle={"Edit Pre Defined Material List"}
            modalOneContent={
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
            closeModalOne={closeModalOne}
          />
        </Suspense>
      )}
      {isEditAdditionsListOpen && (
        <Suspense fallback={<Spinner />}>
          <ModalOne
            modalOneSize={"50%"}
            modalOneTitle={"Edit Pre Defined Additions List"}
            modalOneContent={
              <EditAdditionsList
                selectedEquipmentId={selectedEquipmentId}
                selectedEquipmentValues={selectedEquipmentValues}
                openWorksheetAdditionsPicker={openWorksheetAdditionsPicker}
                closeModalOne={closeEditAdditionsList}
              />
            }
          />
        </Suspense>
      )}
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

export default EquipmentCatalog;
