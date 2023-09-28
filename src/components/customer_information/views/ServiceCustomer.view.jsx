import { useNavigate } from "react-router-dom";

import MainField from "../fields/MainField";
import Spinner from "../../spinner/Spinner";
import {
  Add,
  Edit,
  EmojiEvents,
  HistoryEdu,
  Hvac,
  List,
} from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import ContactCard from "../fields/ContactCard";

const ServiceCustomer = ({
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
      addMaintenance: false,
      addRediagnostic: false,
      dateQuoted: null,
      disclaimerRed: false,
      id: "",
      jobNumber: "",
      laborHours: 1,
      laborRate: 9900,
      partsList: [],
      quickShippingRate: 75.0,
      quickShippingTime: "1-3 days",
      dateStarted: new Date(),
      regularShippingRate: 25.0,
      regularShippingTime: "5-7 days",
      selectedDiscount: "none",
      selectedShipping: "none",
      shippingNotes: "",
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
      <Box
        sx={{
          bgcolor: "background.paper",
          border: 1,
          borderColor: "primary.main",
          maxHeight: "725px",
          overflow: "auto",
        }}
      >
        <Typography
          variant="h4"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {customer.billingiscommercial && <div>Commercial</div>}
        </Typography>

        <Grid container spacing={1.5} sx={{ margin: "4px" }}>
          <Grid xs={12} sm={12} md={12} lg={6}>
            <Typography variant="caption">Customer</Typography>
            <MainField
              title={"Customer Information"}
              name={`${customer.firstname} ${customer.lastname}`}
              address={customer.street}
              address2={`${customer.city},${customer.state} ${customer.zip}`}
              business={false}
            />
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={6}>
            <Typography variant="caption">Commercial</Typography>
            {customer.billingorg ||
            customer.billingstreet ||
            customer.billingcity ||
            customer.billingstate ||
            customer.billingzip ? (
              <MainField
                title={"Billing Information"}
                name={customer.billingorg}
                address={customer.billingstreet}
                address2={`${customer.billingcity},${customer.billingstate} ${customer.billingzip}`}
                business={true}
              />
            ) : null}
          </Grid>

          <Grid xs={12} sm={12} md={12} lg={6}>
            <Typography variant="caption">Contacts</Typography>
            <div style={{ maxHeight: "325px", overflowY: "auto" }}>
              {customer.contacts && customer.contacts.length > 0
                ? customer.contacts.map((contact, i) => (
                    <ContactCard contact={contact} key={i} />
                  ))
                : null}
            </div>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={6}>
            <Typography variant="caption">Commercial Contacts</Typography>
            <div style={{ maxHeight: "325px", overflowY: "auto" }}>
              {customer.commercialContacts &&
              customer.commercialContacts.length > 0
                ? customer.commercialContacts.map((contact, i) => (
                    <ContactCard contact={contact} key={i} />
                  ))
                : null}
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ margin: "2px", marginTop: "16px" }}>
          <Grid xs={12} sm={12} md={12} lg={4}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Edit />}
              onClick={() => openEditCustomerDetails()}
              fullWidth
            >
              Edit Customer
            </Button>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={4}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Hvac />}
              onClick={() => openCustomerEquipmentList()}
              fullWidth
            >
              Equipment
            </Button>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={4}>
            <Button
              variant="outlined"
              size="small"
              color="success"
              startIcon={<Add />}
              onClick={() => openCreateDispatch()}
              fullWidth
            >
              Create Dispatch
            </Button>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={4}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Edit />}
              onClick={() => openEditCustomerBilling()}
              fullWidth
            >
              Edit Commercial
            </Button>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={4}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={() => routeToPartsQuoteCreator()}
              fullWidth
            >
              Parts Quote
            </Button>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={4}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<HistoryEdu />}
              onClick={() => openDispatchHistory()}
              fullWidth
            >
              Dispatch History
            </Button>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={4}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={() => openCreateMaintenance()}
              fullWidth
            >
              Maintenance
            </Button>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={4}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<List />}
              onClick={() => openPartsQuoteList()}
              fullWidth
            >
              Quote History
            </Button>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={4}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EmojiEvents />}
              onClick={() => openWarrantyList()}
              fullWidth
            >
              Warranty
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
};

export default ServiceCustomer;
