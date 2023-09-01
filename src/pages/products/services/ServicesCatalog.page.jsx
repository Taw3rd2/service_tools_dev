import { collection } from "firebase/firestore";
import { Suspense, lazy, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";
import ServicesCatalogList from "./services_catalog_list/ServicesCatalogList";
import BasicSearchBar from "../../../components/basic_components/BasicSearchBar";
import Spinner from "../../../components/spinner/Spinner";
import Toast from "../../../components/basic_components/toast/Toast";

const ModalOne = lazy(() =>
  import("../../../components/basic_components/modal_one/ModalOne")
);
const ModalTwo = lazy(() =>
  import("../../../components/basic_components/modal_two/ModalTwo")
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

  //Create Service
  const openCreateService = () => {
    openModalOne(
      "40%",
      "Create Service",
      <CreateService closeModalOne={closeModalOne} />
    );
  };

  //Delete Service
  const openDeleteService = (service) => {
    openModalTwo(
      "20%",
      "Delete Service",
      <DeleteService
        serviceToDelete={service}
        closeModalOne={closeModalOne}
        closeModalTwo={closeModalTwo}
      />
    );
  };

  //Service Details
  const openServiceDetails = (service) => {
    openModalOne(
      "35%",
      "Service Details",
      <ServiceDetails
        service={service}
        openDeleteService={openDeleteService}
        closeModalOne={closeModalOne}
      />
    );
  };

  return (
    <div className="servicesPage">
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

export default ServicesCatalog;
