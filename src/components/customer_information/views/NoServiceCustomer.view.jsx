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

import "../../../global_style/style.css";
import { Box, Button, Typography } from "@mui/material";
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
          sx={{ display: "flex", justifyContent: "center", color: "red" }}
        >
          No Service
        </Typography>

        <Typography
          variant="h4"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {customer.billingiscommercial && <div>Commercial</div>}
        </Typography>

        <Grid container spacing={1.5} sx={{ margin: "4px" }}>
          <Grid xs={12} sm={12} md={12} lg={6}>
            <MainField
              title={"Customer Information"}
              name={`${customer.firstname} ${customer.lastname}`}
              address={customer.street}
              address2={`${customer.city},${customer.state} ${customer.zip}`}
              business={false}
            />
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={6}>
            {customer.billingorg && (
              <MainField
                title={"Billing Information"}
                name={customer.billingorg}
                address={customer.billingstreet}
                address2={`${customer.billingcity},${customer.billingstate} ${customer.billingzip}`}
                business={true}
              />
            )}
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={6}>
            <Typography variant="caption">Contacts</Typography>
            <div style={{ maxHeight: "375px", overflowY: "auto" }}>
              {customer.contacts && customer.contacts.length > 0
                ? customer.contacts.map((contact, i) => (
                    <ContactCard contact={contact} key={i} />
                  ))
                : null}
            </div>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={6}>
            <Typography variant="caption">Commercial Contacts</Typography>
            <div style={{ maxHeight: "375px", overflowY: "auto" }}>
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
              disabled
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
              Edit Billing
            </Button>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={4}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={() => routeToPartsQuoteCreator()}
              fullWidth
              disabled
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

export default NoServiceCustomer;
