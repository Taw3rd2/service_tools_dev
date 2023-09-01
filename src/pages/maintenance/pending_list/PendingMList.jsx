import { collection } from "firebase/firestore";
import { db, useSyncedCollection } from "../../../firebase/firestore.utils";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { ArrowForward, Folder } from "@mui/icons-material";

const PendingMList = () => {
  //const maintenance = useSyncedCollection(collection(db, "maintenance"));

  return (
    <List dense sx={{ border: "1px solid black" }}>
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete">
            <ArrowForward />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar>
            <Folder />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Thomas Waldorf" />
      </ListItem>
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete">
            <ArrowForward />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar>
            <Folder />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Barbara Waldorf" />
      </ListItem>
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete">
            <ArrowForward />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar>
            <Folder />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Rebecca Chapman" />
      </ListItem>
    </List>
  );
};

export default PendingMList;
