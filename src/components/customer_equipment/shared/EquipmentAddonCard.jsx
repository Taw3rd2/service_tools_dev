import { Edit } from "@mui/icons-material";
import { Card, CardContent, Typography } from "@mui/material";

const EquipmentAddonCard = ({ cardName, cardValue, editable }) => {
  return (
    <div>
      {editable ? (
        <div>
          <Typography
            variant="caption"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {cardName} <Edit sx={{ fontSize: 16 }} />
          </Typography>
          <Card elevation={4} sx={{ cursor: "pointer" }}>
            <CardContent>
              <Typography variant="subtitle1">{cardValue}</Typography>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          <Typography variant="caption">{cardName}</Typography>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="subtitle1">{cardValue}</Typography>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EquipmentAddonCard;
