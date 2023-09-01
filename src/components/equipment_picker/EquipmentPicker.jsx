import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Typography,
} from "@mui/material";

import {
  getDefaultHeadTableCell,
  defaultBodyTableCell,
} from "../../theme/Theme";

const EquipmentPicker = ({
  equipment,
  selectedEquipment,
  handleCheckChange,
}) => {
  return (
    <div>
      {equipment.length === 0 ? (
        <Grid2 container spacing={2}>
          <Grid2 xs={12}>
            <Typography variant="h4">
              There is no equipment to apply.
            </Typography>
            <Typography variant="h4">Please add equipment.</Typography>
          </Grid2>
        </Grid2>
      ) : (
        <Grid2 container spacing={2}>
          <Grid2 xs={12}>
            <TableContainer
              component={Paper}
              sx={{
                overflow: "auto",
                maxHeight: 440,
                marginTop: "8px",
              }}
            >
              <Table
                stickyHeader
                size="small"
                aria-label="equipment-picker -table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={getDefaultHeadTableCell(5)}>
                      #
                    </TableCell>
                    <TableCell align="left" sx={getDefaultHeadTableCell(150)}>
                      Name
                    </TableCell>
                    <TableCell align="left" sx={getDefaultHeadTableCell(150)}>
                      Brand
                    </TableCell>
                    <TableCell align="left" sx={getDefaultHeadTableCell(150)}>
                      Model
                    </TableCell>
                    <TableCell align="left" sx={getDefaultHeadTableCell(150)}>
                      Serial
                    </TableCell>
                    <TableCell align="left" sx={getDefaultHeadTableCell(5)}>
                      Add?
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {equipment.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="center" sx={defaultBodyTableCell}>{`${
                        index + 1
                      }.`}</TableCell>
                      <TableCell align="left" sx={defaultBodyTableCell}>
                        {item.equipmentName}
                      </TableCell>
                      <TableCell align="left" sx={defaultBodyTableCell}>
                        {item.equipmentBrand}
                      </TableCell>
                      <TableCell align="left" sx={defaultBodyTableCell}>
                        {item.equipmentModel}
                      </TableCell>
                      <TableCell align="left" sx={defaultBodyTableCell}>
                        {item.equipmentSerial}
                      </TableCell>
                      <TableCell align="center" sx={defaultBodyTableCell}>
                        <Checkbox
                          checked={selectedEquipment.index}
                          value={index}
                          onChange={handleCheckChange(index)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid2>
        </Grid2>
      )}
    </div>
  );
};

export default EquipmentPicker;
