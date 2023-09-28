import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2/Grid2";
import EquipmentAddonCard from "../../shared/EquipmentAddonCard";

const EquipmentStatistics = ({
  closeModalThree,
  customer,
  openEditSingleField,
  selectedEquipment,
}) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {selectedEquipment.equipmentName}
        </Typography>
        <Grid container spacing={1.5}>
          <Grid xs={12} sm={12} md={12} lg={6}>
            <EquipmentAddonCard
              cardName="Parts Warranty"
              cardValue={
                selectedEquipment.equipmentWarranty
                  ? selectedEquipment.equipmentWarranty
                  : "Not Entered"
              }
            />
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={6}>
            <EquipmentAddonCard
              cardName="Labor Warranty"
              cardValue={
                selectedEquipment.laborWarranty
                  ? selectedEquipment.laborWarranty
                  : "Not Entered"
              }
            />
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={12}>
            <EquipmentAddonCard
              cardName="Maintenance Expiration"
              cardValue={
                selectedEquipment.equipmentContract
                  ? selectedEquipment.equipmentContract
                  : "Not Entered"
              }
            />
          </Grid>
          <Grid
            xs={12}
            sm={12}
            md={12}
            lg={6}
            onClick={() =>
              openEditSingleField(
                customer.id,
                selectedEquipment.equipmentName,
                "Efficiency",
                "equipmentEff",
                selectedEquipment.equipmentEff
              )
            }
          >
            <EquipmentAddonCard
              cardName="Efficiency"
              cardValue={
                selectedEquipment.equipmentEff
                  ? selectedEquipment.equipmentEff
                  : "Not Entered"
              }
              editable={true}
            />
          </Grid>
          <Grid
            xs={12}
            sm={12}
            md={12}
            lg={6}
            onClick={() =>
              openEditSingleField(
                customer.id,
                selectedEquipment.equipmentName,
                "Size",
                "equipmentBtu",
                selectedEquipment.equipmentBtu
              )
            }
          >
            <EquipmentAddonCard
              cardName="Size"
              cardValue={
                selectedEquipment.equipmentBtu
                  ? selectedEquipment.equipmentBtu
                  : "Not Entered"
              }
              editable={true}
            />
          </Grid>
          <Grid
            xs={12}
            sm={12}
            md={12}
            lg={6}
            onClick={() =>
              openEditSingleField(
                customer.id,
                selectedEquipment.equipmentName,
                "Fuel or Freon",
                "equipmentFuel",
                selectedEquipment.equipmentFuel
              )
            }
          >
            <EquipmentAddonCard
              cardName="Fuel or Freon"
              cardValue={
                selectedEquipment.equipmentFuel
                  ? selectedEquipment.equipmentFuel
                  : "Not Entered"
              }
              editable={true}
            />
          </Grid>
          <Grid
            xs={12}
            sm={12}
            md={12}
            lg={6}
            onClick={() =>
              openEditSingleField(
                customer.id,
                selectedEquipment.equipmentName,
                "Voltage",
                "equipmentVoltage",
                selectedEquipment.equipmentVoltage
              )
            }
          >
            <EquipmentAddonCard
              cardName="Voltage"
              cardValue={
                selectedEquipment.equipmentVoltage
                  ? selectedEquipment.equipmentVoltage
                  : "Not Entered"
              }
              editable={true}
            />
          </Grid>
          <Grid
            xs={12}
            sm={12}
            md={12}
            lg={12}
            onClick={() =>
              openEditSingleField(
                customer.id,
                selectedEquipment.equipmentName,
                "Notes",
                "equipmentNotes",
                selectedEquipment.equipmentNotes
              )
            }
          >
            <EquipmentAddonCard
              cardName="Equipment Notes"
              cardValue={
                selectedEquipment.equipmentNotes
                  ? selectedEquipment.equipmentNotes
                  : "No Notes Entered"
              }
              editable={true}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          onClick={() => closeModalThree()}
          style={{ marginLeft: "auto", marginRight: "8px" }}
        >
          Close
        </Button>
      </CardActions>
    </Card>
  );
};

export default EquipmentStatistics;
