import NoCustomerLoaded from "./views/NoCustomerLoaded.view";
import NoServiceCustomer from "./views/NoServiceCustomer.view";
import ServiceCustomer from "./views/ServiceCustomer.view";

const CustomerInformation = ({
  customer,
  openCreateDispatch,
  openCreateMaintenance,
  openCustomerEquipmentList,
  openDispatchHistory,
  openEditCustomerBilling,
  openEditCustomerDetails,
  openPartsQuoteList,
  openWarrantyList,
}) => {
  if (customer === null || customer.id === "" || customer.id === null) {
    return <NoCustomerLoaded />;
  } else if (customer.noService) {
    return (
      <NoServiceCustomer
        customer={customer}
        openCreateDispatch={openCreateDispatch}
        openCreateMaintenance={openCreateMaintenance}
        openCustomerEquipmentList={openCustomerEquipmentList}
        openDispatchHistory={openDispatchHistory}
        openEditCustomerBilling={openEditCustomerBilling}
        openEditCustomerDetails={openEditCustomerDetails}
        openPartsQuoteList={openPartsQuoteList}
        openWarrantyList={openWarrantyList}
      />
    );
  } else {
    return (
      <ServiceCustomer
        customer={customer}
        openCreateDispatch={openCreateDispatch}
        openCreateMaintenance={openCreateMaintenance}
        openCustomerEquipmentList={openCustomerEquipmentList}
        openDispatchHistory={openDispatchHistory}
        openEditCustomerBilling={openEditCustomerBilling}
        openEditCustomerDetails={openEditCustomerDetails}
        openPartsQuoteList={openPartsQuoteList}
        openWarrantyList={openWarrantyList}
      />
    );
  }
};

export default CustomerInformation;
