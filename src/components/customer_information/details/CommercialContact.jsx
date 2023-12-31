import { Add, DeleteForever } from "@mui/icons-material";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const CommercialContact = ({ customerValues, setCustomerValues }) => {
  const handleAdd = () => {
    const contactsArray = [...customerValues.commercialContacts];
    contactsArray.push({
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      contactNotes: "",
    });
    setCustomerValues({ ...customerValues, commercialContacts: contactsArray });
  };

  const handleTextChange = (e, i) => {
    const { name, value } = e.target;
    const onChangeVal = [...customerValues.commercialContacts];
    onChangeVal[i][name] = value;
    setCustomerValues({ ...customerValues, commercialContacts: onChangeVal });
  };

  const handleDelete = (i) => {
    const deleteVal = [...customerValues.commercialContacts];
    deleteVal.splice(i, 1);
    setCustomerValues({ ...customerValues, commercialContacts: deleteVal });
  };
  return (
    <>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {customerValues.commercialContacts.map((val, i) => (
          <div key={i} style={{ margin: "4px" }}>
            <Typography variant="caption">Contact {`${i + 1}`}</Typography>
            <Grid
              container
              spacing={1}
              border="1px solid rgba(0, 128, 128, .4)"
              sx={{ margin: "0px", padding: "4px" }}
            >
              <Grid container xs={12} md={10}>
                <Grid xs={12} md={6}>
                  <TextField
                    label="Contact Name"
                    name="contactName"
                    value={val.contactName}
                    onChange={(e) => handleTextChange(e, i)}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    label="Email"
                    name="contactEmail"
                    value={val.contactEmail}
                    onChange={(e) => handleTextChange(e, i)}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    label="Phone Number"
                    name="contactPhone"
                    value={val.contactPhone}
                    onChange={(e) => handleTextChange(e, i)}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    label="Contact Note"
                    name="contactNotes"
                    value={val.contactNotes}
                    onChange={(e) => handleTextChange(e, i)}
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid
                container
                xs={1}
                justifyContent="center"
                alignItems="center"
              >
                <Grid xs={12} md={2}>
                  <IconButton
                    size="large"
                    onClick={() => handleDelete(i)}
                    color="error"
                  >
                    <DeleteForever />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </div>
        ))}
      </div>
      <Grid
        xs={12}
        container
        justifyContent="flex-end"
        alignItems="center"
        flexDirection="row"
      >
        <Grid>
          <Button
            size="small"
            variant="outlined"
            type="button"
            onClick={handleAdd}
            sx={{ marginTop: "8px" }}
          >
            <Add />
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default CommercialContact;
