import {
  DescriptionOutlined,
  MailOutline,
  Person,
  PhoneOutlined,
} from "@mui/icons-material";
import { Card, Typography } from "@mui/material";

const ContactCard = ({ contact }) => {
  return (
    <Card variant="outlined" sx={{ padding: "8px" }}>
      <Typography variant="caption">Contact</Typography>
      <div style={{ display: "flex" }}>
        <Person color="primary" />
        {contact.contactName ? (
          <Typography variant="body1" sx={{ marginLeft: "4px" }}>
            {contact.contactName}
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ marginLeft: "4px" }}>
            No Contact Name Entered
          </Typography>
        )}
      </div>
      <div style={{ display: "flex" }}>
        <PhoneOutlined color="primary" />
        {contact.contactPhone ? (
          <Typography variant="body1" sx={{ marginLeft: "4px" }}>
            {contact.contactPhone}
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ marginLeft: "4px" }}>
            No Contact Phone Entered
          </Typography>
        )}
      </div>
      {contact.contactEmail ? (
        <div style={{ display: "flex" }}>
          <MailOutline color="primary" />
          <Typography
            variant="body1"
            sx={{ marginLeft: "4px", cursor: "pointer" }}
            onClick={() => {
              window.location.href = `mailto:${contact.contactEmail}`;
            }}
          >
            {contact.contactEmail}
          </Typography>
        </div>
      ) : null}
      {contact.contactNotes ? (
        <div style={{ display: "flex" }}>
          <DescriptionOutlined color="primary" />
          <Typography variant="body1" sx={{ marginLeft: "4px" }}>
            {contact.contactNotes}
          </Typography>
        </div>
      ) : null}
    </Card>
  );
};

export default ContactCard;
