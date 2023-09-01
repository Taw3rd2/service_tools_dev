import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFormattedDate } from "../../../utilities/dateUtils";
import { useSyncedNestedDocument } from "../../../firebase/firestore.utils";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { styled } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Camera,
  Close,
  DeleteForever,
  Edit,
  ExpandMore,
  MoreVert,
  Repartition,
} from "@mui/icons-material";

//import EquipmentGallery from "../gallery/EquipmentGallery";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const ExpandMoreContent = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CustomerEquipmentCard = ({
  closeBasicSecondModal,
  customer,
  openDeleteCustomerEquipment,
  //openDeleteGalleryImage,
  openEditSingleField,
  openEquipmentGallery,
  openEquipmentStatistics,
  selectedEquipment,
}) => {
  const unit = useSyncedNestedDocument(
    "customers",
    customer.id,
    "Equipment",
    selectedEquipment.equipmentName
  );

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [navExpanded, setNavExpanded] = useState(false);
  const handleExpandNavClick = () => {
    setNavExpanded(!navExpanded);
  };

  const routeToPartsQuoteCreator = () => {
    const selectedEquipment = {
      equipmentName: unit.equipmentName,
      equipmentBrand: unit.equipmentBrand,
      equipmentModel: unit.equipmentModel,
      equipmentSerial: unit.equipmentSerial,
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

  const handleEditInstallDate = () => {
    handleMenuClose();
    openEditSingleField(
      customer.id,
      unit.equipmentName,
      "Equipment Install Date",
      "equipmentInstallDate",
      unit.equipmentInstallDate ? unit.equipmentInstallDate.toDate() : null
    );
  };

  const handleDeleteEquipmentClick = (equip) => {
    handleMenuClose();
    openDeleteCustomerEquipment(equip);
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="equipment name">
            {Array.from(selectedEquipment.equipmentName)[0]}
          </Avatar>
        }
        action={
          <div>
            <IconButton
              id="installDateButton"
              aria-controls={open ? "installDateMenu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              aria-label="installDate"
              onClick={handleMenuClick}
            >
              <MoreVert />
            </IconButton>
            <Menu
              disableScrollLock
              id="installDateMenu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              MenuListProps={{
                "aria-labelledby": "installDateButton",
              }}
            >
              <MenuItem onClick={() => handleEditInstallDate()}>
                <Edit />
                <Typography sx={{ marginLeft: "8px" }}>
                  Edit Install Date
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => routeToPartsQuoteCreator()}>
                <Repartition />
                <Typography sx={{ marginLeft: "8px" }}>
                  Start Parts Quote
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => handleDeleteEquipmentClick(unit)}>
                <DeleteForever color="error" />
                <Typography sx={{ marginLeft: "8px" }} color="red">
                  Delete This Unit
                </Typography>
              </MenuItem>
            </Menu>
          </div>
        }
        title={selectedEquipment.equipmentName}
        subheader={
          unit.equipmentInstallDate
            ? getFormattedDate(unit.equipmentInstallDate)
            : "No Install Date Set"
        }
      />
      {unit.equipmentImageDownloadUrl !== undefined ? (
        <PhotoProvider bannerVisible={false}>
          <PhotoView src={unit.equipmentImageDownloadUrl}>
            <img src={unit.equipmentImageDownloadUrl} alt="" width="100%" />
          </PhotoView>
        </PhotoProvider>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          No Image Loaded
        </div>
      )}
      <CardContent>
        <Typography variant="caption">Brand</Typography>
        <Typography variant="h5">{unit.equipmentBrand}</Typography>
        <Typography variant="caption">Model</Typography>
        <Typography variant="h6">{unit.equipmentModel}</Typography>
        <Typography variant="caption">Serial</Typography>
        <Typography variant="h6">{unit.equipmentSerial}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="Close"
          onClick={() => closeBasicSecondModal()}
          size="large"
          sx={{ marginLeft: "auto" }}
        >
          <Close />
        </IconButton>
        <ExpandMoreContent
          expand={navExpanded}
          onClick={handleExpandNavClick}
          aria-expanded={navExpanded}
          aria-label="show more"
        >
          <ExpandMore />
        </ExpandMoreContent>
      </CardActions>
      <Collapse in={navExpanded} timeout="auto" unmountOnExit>
        <Grid container spacing={1.5} sx={{ margin: "8px" }}>
          <Grid xs={6}>
            <Button
              variant="outlined"
              startIcon={<Camera />}
              onClick={() => openEquipmentGallery(selectedEquipment)}
              fullWidth
            >
              Gallery
            </Button>
          </Grid>
          <Grid xs={6}>
            <Button
              variant="outlined"
              startIcon={<BarChart />}
              fullWidth
              onClick={() => openEquipmentStatistics(selectedEquipment)}
            >
              Stats
            </Button>
          </Grid>
        </Grid>
      </Collapse>
    </Card>
  );
};

export default CustomerEquipmentCard;
