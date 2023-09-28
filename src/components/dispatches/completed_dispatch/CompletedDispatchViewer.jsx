import MainField from "../../customer_information/fields/MainField";
import { Close } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { getFormattedDate } from "../../../utilities/dateUtils";
import { useSyncedDocument } from "../../../firebase/firestore.utils";
import ContactCard from "../../customer_information/fields/ContactCard";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const CompletedDispatchViewer = ({ selectedDispatch, closeModalOne }) => {
  const customer = useSyncedDocument("customers", selectedDispatch.customerId);

  return (
    <>
      <Grid container spacing={1.5} mt={1.5}>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Date Completed"
            fullWidth
            value={getFormattedDate(selectedDispatch.start)}
            color="primary"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Lead Source"
            fullWidth
            value={selectedDispatch.leadSource}
            color="primary"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Dispatcher"
            fullWidth
            value={selectedDispatch.takenBy}
            color="primary"
          />
        </Grid>
        {customer.firstname ? (
          <Grid xs={12} sm={12} md={12} lg={6}>
            <MainField
              title={"Customer Information"}
              name={`${customer.firstname} ${customer.lastname}`}
              address={customer.street}
              address2={`${customer.city},${customer.state} ${customer.zip}`}
              business={false}
            />
          </Grid>
        ) : (
          <Grid xs={12} sm={12} md={12} lg={6}>
            <MainField
              title={"Customer Information"}
              name={customer.lastname}
              address={customer.street}
              address2={`${customer.city}, ${customer.state} ${customer.zip}`}
              business={true}
            />
          </Grid>
        )}
        {customer.firstname ? (
          <Grid xs={12} sm={12} md={12} lg={6}>
            <div style={{ maxHeight: "110px", overflowY: "auto" }}>
              {customer.contacts && customer.contacts.length > 0
                ? customer.contacts.map((contact, i) => (
                    <ContactCard contact={contact} key={i} />
                  ))
                : null}
            </div>
          </Grid>
        ) : (
          <Grid xs={12} sm={12} md={12} lg={6}>
            <div style={{ maxHeight: "110px", overflowY: "auto" }}>
              {customer.contacts && customer.contacts.length > 0
                ? customer.contacts.map((contact, i) => (
                    <ContactCard contact={contact} key={i} />
                  ))
                : null}
            </div>
          </Grid>
        )}

        <Grid xs={12} sm={12} md={12} lg={6}>
          <TextField
            label="Selected Work Ordered"
            fullWidth
            value={selectedDispatch.issue}
            color="primary"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={6}>
          <TextField
            label="Slotted Time"
            fullWidth
            value={selectedDispatch.timeAlotted}
            color="primary"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Tech Lead"
            fullWidth
            value={selectedDispatch.techLead}
            color="primary"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Tech Helper"
            fullWidth
            value={selectedDispatch.techHelper}
            color="primary"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={4}>
          <TextField
            label="Billing Type"
            fullWidth
            value={selectedDispatch.payment}
            color="primary"
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            label="Notes"
            fullWidth
            value={selectedDispatch.notes}
            color="primary"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={6}>
          <TextField
            label="Time Of Day"
            fullWidth
            value={selectedDispatch.timeOfDay}
            color="primary"
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={6}>
          <TextField
            label="Job Number"
            fullWidth
            value={selectedDispatch.jobNumber}
            color="primary"
          />
        </Grid>
      </Grid>

      <Grid container spacing={1.5} justifyContent="end">
        <Grid mt={2}>
          <Button
            variant="contained"
            type="button"
            startIcon={<Close />}
            onClick={() => closeModalOne()}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default CompletedDispatchViewer;
