import { collection } from "firebase/firestore";
import { Suspense, lazy, useState } from "react";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";
import ServicesCatalogList from "./services_catalog_list/ServicesCatalogList";
import BasicSearchBar from "../../../components/basic_components/BasicSearchBar";
import Toast from "../../../components/basic_components/toast/Toast";

const MaterialModal = lazy(() =>
  import("../../../components/basic_components/material_modal/MaterialModal")
);

const CreateService = lazy(() => import("./create_service/CreateService"));
const ServiceDetails = lazy(() => import("./service_details/ServiceDetails"));
const DeleteService = lazy(() => import("./delete_service/DeleteService"));

function ServicesTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`services-catalog-tabpanel-${index}`}
      aria-labelledby={`services-catalog-tabpanel-${index}`}
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
    id: `services-catalog-tabpanel-${index}`,
    "aria-controls": `services-catalog-tabpanel-${index}`,
  };
}

const ServicesCatalog = () => {
  //fetch services
  const services = useSyncedCollection(collection(db, "services"));
  const [searchableServices, setSerchableServices] = useState(services);
  const [servicesQuantity, setServicesQuantity] = useState(services.length);

  //search bar
  const [query, setQuery] = useState("");
  const servicesCatalogSearch = async (queryInput) => {
    const filteredServices = services.filter((service) => {
      return (
        service.partNumber.toLowerCase().includes(queryInput.toLowerCase()) ||
        service.description.toLowerCase().includes(queryInput.toLowerCase())
      );
    });
    setQuery(queryInput);
    setSerchableServices(filteredServices);
  };

  const clearSearchQuery = () => {
    setQuery("");
    setSerchableServices(services);
  };

  //fetch services tabs
  const servicesTabs = useSyncedCollection(collection(db, "servicesTabs"));

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

  //Create Service
  const openCreateService = () => {
    openModalOne(
      <CreateService closeModalOne={closeModalOne} />,
      "Create Service",
      "sm"
    );
  };

  //Delete Service
  const openDeleteService = (service) => {
    openModalTwo(
      <DeleteService
        serviceToDelete={service}
        closeModalOne={closeModalOne}
        closeModalTwo={closeModalTwo}
      />,
      "Delete Service",
      "sm"
    );
  };

  //Service Details
  const openServiceDetails = (service) => {
    openModalOne(
      <ServiceDetails
        service={service}
        openDeleteService={openDeleteService}
        closeModalOne={closeModalOne}
      />,
      "Service Details",
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
          aria-label="services catalog tabs"
        >
          <Tab label="All" {...a11yProps(0)} />

          {servicesTabs.length > 0 &&
            servicesTabs
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((tab, index) => (
                <Tab key={tab.id} label={tab.name} {...a11yProps(index + 1)} />
              ))}
        </Tabs>
      </div>
      <ServicesTabPanel value={tabValue} index={0}>
        <BasicSearchBar
          value={query}
          setValue={servicesCatalogSearch}
          searchLabel={`${servicesQuantity} Items`}
          clearSearchQuery={clearSearchQuery}
        />
        {searchableServices.length > 0 ? (
          <ServicesCatalogList
            servicesList={searchableServices}
            category={"All"}
            openServiceDetails={openServiceDetails}
            openCreateService={openCreateService}
            setServicesQuantity={setServicesQuantity}
          />
        ) : (
          <ServicesCatalogList
            servicesList={services}
            category={"All"}
            openServiceDetails={openServiceDetails}
            openCreateService={openCreateService}
            setServicesQuantity={setServicesQuantity}
          />
        )}
      </ServicesTabPanel>
      {servicesTabs.length > 0 &&
        servicesTabs
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((tab, index) => (
            <ServicesTabPanel key={tab.id} value={tabValue} index={index + 1}>
              {/* This is the balance of all tabs by index */}
              <BasicSearchBar
                value={query}
                setValue={servicesCatalogSearch}
                searchLabel={`${servicesQuantity} Items`}
                clearSearchQuery={clearSearchQuery}
              />
              {searchableServices.length > 0 ? (
                <ServicesCatalogList
                  servicesList={searchableServices}
                  category={tab.name}
                  openServiceDetails={openServiceDetails}
                  openCreateService={openCreateService}
                  setServicesQuantity={setServicesQuantity}
                />
              ) : (
                <ServicesCatalogList
                  servicesList={services}
                  category={tab.name}
                  openServiceDetails={openServiceDetails}
                  openCreateService={openCreateService}
                  setServicesQuantity={setServicesQuantity}
                />
              )}
            </ServicesTabPanel>
          ))}
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
            closeModalT={closeModalTwo}
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

export default ServicesCatalog;
