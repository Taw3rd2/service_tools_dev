import Grid from "@mui/material/Unstable_Grid2/Grid2";
import DefaultMaterial from "../material_list/DefaultMaterial";
import DefaultLabor from "../labor_list/DefaultLabor";
import DefaultAdditions from "../additions_list/DefaultAdditions";
import PricingDetails from "../pricing_details/PricingDetails";
import { Button } from "@mui/material";
import { Close } from "@mui/icons-material";

const SampleJob = ({
  additions,
  closeSampleJob,
  labor,
  material,
  openAddAdditionsToJob,
  openAddLaborToJob,
  openJobMaterialPicker,
  selectedEquipmentId,
  setAdditions,
  setLabor,
  setMaterial,
}) => {
  return (
    <Grid container spacing={1.5}>
      <Grid xs={12} sm={12} md={12} lg={6}>
        <DefaultMaterial
          selectedEquipmentId={selectedEquipmentId}
          material={material}
          setMaterial={setMaterial}
          openJobMaterialPicker={openJobMaterialPicker}
        />
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={6}>
        <DefaultLabor
          selectedEquipmentId={selectedEquipmentId}
          labor={labor}
          setLabor={setLabor}
          openAddLaborToJob={openAddLaborToJob}
        />
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={6}>
        <DefaultAdditions
          selectedEquipmentId={selectedEquipmentId}
          additions={additions}
          setAdditions={setAdditions}
          openAddAdditionsToJob={openAddAdditionsToJob}
        />
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={6}>
        <PricingDetails
          labor={labor}
          material={material}
          additions={additions}
        />
      </Grid>
      <Grid xs={12} sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="outlined"
          type="button"
          startIcon={<Close />}
          onClick={() => closeSampleJob()}
        >
          Close
        </Button>
      </Grid>
    </Grid>
  );
};

export default SampleJob;
