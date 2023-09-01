import { useNavigate } from "react-router-dom";

import MainField from "../fields/MainField";
import Spinner from "../../spinner/Spinner";
import {
  Add,
  Edit,
  EmojiEvents,
  Flag,
  HistoryEdu,
  Hvac,
  List,
} from "@mui/icons-material";

import "../../../global_style/style.css";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import ContactCard from "../fields/ContactCard";

const NoServiceCustomer = ({
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
  const navigate = useNavigate();

  const routeToPartsQuoteCreator = () => {
    const selectedEquipment = {
      equipmentName: "",
      equipmentBrand: "",
      equipmentModel: "",
      equipmentSerial: "",
    };
    const quoteData = {
      id: "",
      jobNumber: "",
      quoteDate: new Date(),
      partsList: [],
      laborHours: 1,
      laborRate: 9900,
      addMaintenance: false,
      addRediagnostic: false,
      regularShippingTime: "5-7 days",
      quickShippingTime: "1-3 days",
      regularShippingRate: 25.0,
      quickShippingRate: 75.0,
      shippingNotes: "",
      selectedShipping: "none",
      selectedDiscount: "none",
      disclaimerRed: false,
    };
    navigate("/parts_quote", {
      state: {
        customer: customer,
        selectedEquipment: selectedEquipment,
        quoteData: quoteData,
      },
    });
  };

  if (customer.lastname === "") {
    return <Spinner />;
  } else {
    return (
      <div
        style={{
          flexGrow: 1,
          border: "1px solid teal",
        }}
      >
        <div className="noServiceTitle">
          <div>
            <Flag />
          </div>
          <div>No Service</div>
          <div>
            <Flag />
          </div>
        </div>
        {customer.billingiscommercial && (
          <div className="noServiceTitle">Commercial</div>
        )}

        <div className="row" style={{ margin: "8px" }}>
          <div className="doubleRowInput">
            <MainField
              title={"Customer Information"}
              name={`${customer.firstname} ${customer.lastname}`}
              address={customer.street}
              address2={`${customer.city},${customer.state} ${customer.zip}`}
              business={false}
            />
          </div>
          <div className="doubleRowInput">
            {customer.billingorg && (
              <MainField
                title={"Billing Information"}
                name={customer.billingorg}
                address={customer.billingstreet}
                address2={`${customer.billingcity},${customer.billingstate} ${customer.billingzip}`}
                business={true}
              />
            )}
          </div>
        </div>

        <div className="row" style={{ margin: "8px" }}>
          <div className="doubleRowInput">
            <Typography variant="caption">Contacts</Typography>
            <div style={{ maxHeight: "375px", overflowY: "auto" }}>
              {customer.contacts && customer.contacts.length > 0
                ? customer.contacts.map((contact, i) => (
                    <ContactCard contact={contact} key={i} />
                  ))
                : null}
            </div>
          </div>

          <div className="doubleRowInput">
            <Typography variant="caption">Commercial Contacts</Typography>
            <div style={{ maxHeight: "375px", overflowY: "auto" }}>
              {customer.commercialContacts &&
              customer.commercialContacts.length > 0
                ? customer.commercialContacts.map((contact, i) => (
                    <ContactCard contact={contact} key={i} />
                  ))
                : null}
            </div>
          </div>
        </div>
        <Grid container spacing={2} sx={{ margin: "2px" }}>
          <Grid xs={4}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Edit />}
              onClick={() => openEditCustomerDetails()}
              fullWidth
            >
              Edit Customer
            </Button>
          </Grid>
          <Grid xs={4}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Hvac />}
              onClick={() => openCustomerEquipmentList()}
              fullWidth
            >
              Equipment
            </Button>
          </Grid>
          <Grid xs={4}>
            <Button
              variant="outlined"
              size="large"
              color="success"
              startIcon={<Add />}
              onClick={() => openCreateDispatch()}
              fullWidth
              disabled
            >
              Create Dispatch
            </Button>
          </Grid>
          <Grid xs={4}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Edit />}
              onClick={() => openEditCustomerBilling()}
              fullWidth
            >
              Edit Billing
            </Button>
          </Grid>
          <Grid xs={4}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Add />}
              onClick={() => routeToPartsQuoteCreator()}
              fullWidth
              disabled
            >
              Parts Quote
            </Button>
          </Grid>
          <Grid xs={4}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<HistoryEdu />}
              onClick={() => openDispatchHistory()}
              fullWidth
            >
              Dispatch History
            </Button>
          </Grid>
          <Grid xs={4}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Add />}
              onClick={() => openCreateMaintenance()}
              fullWidth
            >
              Maintenance
            </Button>
          </Grid>
          <Grid xs={4}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<List />}
              onClick={() => openPartsQuoteList()}
              fullWidth
            >
              Quote History
            </Button>
          </Grid>
          <Grid xs={4}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<EmojiEvents />}
              onClick={() => openWarrantyList()}
              fullWidth
            >
              Warranty
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
};

export default NoServiceCustomer;
