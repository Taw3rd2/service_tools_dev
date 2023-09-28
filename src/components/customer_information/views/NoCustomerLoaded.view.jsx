import { Box, Typography } from "@mui/material";
import "../../../global_style/style.css";

const NoCustomerLoaded = () => {
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
        variant="body1"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        No Customer Loaded
      </Typography>
    </Box>
  );
};

export default NoCustomerLoaded;
