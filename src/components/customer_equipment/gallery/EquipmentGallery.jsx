import { Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { PhotoProvider, PhotoView } from "react-photo-view";

const EquipmentGallery = ({
  closeModalThree,
  //openDeleteGalleryImage,
  selectedEquipment,
}) => {
  return (
    <Grid container spacing={1.5}>
      <Grid xs={12}>
        <PhotoProvider
          bannerVisible={false}
          // toolbarRender={({ onScale, scale }) => {
          //   return (
          //     <>
          //       <Button
          //         variant="outlined"
          //         size="small"
          //         color="error"
          //         //this is not correct your not del the primary
          //         onClick={() =>
          //           openDeleteGalleryImage(
          //             selectedEquipment.equipmentImageDownloadUrl,
          //             selectedEquipment
          //           )
          //         }
          //         sx={{ marginRight: "8px" }}
          //       >
          //         Delete
          //       </Button>
          //     </>
          //   );
          // }}
        >
          {selectedEquipment.equipmentGallery.map((item, index) => (
            <PhotoView key={index} src={item.imageUrl}>
              <img src={item.imageUrl} alt="" height="200" width="auto" />
            </PhotoView>
          ))}
        </PhotoProvider>
      </Grid>
      <Grid xs={12} sx={{ display: "flex", justifyContent: "end" }}>
        <Button variant="outlined" onClick={() => closeModalThree()}>
          Close
        </Button>
      </Grid>
    </Grid>
  );
};

export default EquipmentGallery;
