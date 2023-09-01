import { db, useSyncedCollection } from "../../../../firebase/firestore.utils";

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "../../../../global_style/style.css";
import { Add, DeleteForever, Edit } from "@mui/icons-material";
import { collection } from "firebase/firestore";

const EquipmentTabList = ({
  openEquipmentTabDetails,
  openDeleteEquipmentTab,
}) => {
  const equipmentTabs = useSyncedCollection(collection(db, "equipmentTabs"));

  return (
    <div className="settingsCard">
      <div className="settingsCardTitle">Equipment Tabs</div>
      <TableContainer
        component={Paper}
        sx={{ overflow: "auto", maxHeight: 275 }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{ width: 25, fontSize: 20, fontWeight: "bold" }}
              >
                #
              </TableCell>
              <TableCell align="left" sx={{ fontSize: 20, fontWeight: "bold" }}>
                Equipment Type
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 20, fontWeight: "bold" }}
              >
                Edit
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 20, fontWeight: "bold" }}
              >
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipmentTabs
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((tab, index) => (
                <TableRow key={tab.id} sx={{ cursor: "pointer" }}>
                  <TableCell align="left" sx={{ fontSize: 20 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: 20 }}>
                    {tab.name}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => openEquipmentTabDetails(tab)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<DeleteForever />}
                      onClick={() => openDeleteEquipmentTab(tab)}
                      style={{ color: "red" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="buttonBar">
        <button
          type="button"
          className="standardButton"
          onClick={() => openEquipmentTabDetails()}
        >
          <Add />
          <span className="iconSeperation">Add Equipment Tab</span>
        </button>
      </div>
    </div>
  );
};

export default EquipmentTabList;
