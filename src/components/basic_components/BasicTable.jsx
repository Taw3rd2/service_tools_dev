import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const BasicTable = ({ tableHead, tableBody, height, additionalButtons }) => {
  return (
    <Paper variant="outlined">
      <TableContainer
        component={Paper}
        sx={{ overflow: "auto", height: height }}
      >
        <Table
          stickyHeader
          sx={{ minWidth: 500 }}
          size="small"
          aria-label="generic table"
        >
          <TableHead>
            <TableRow>{tableHead}</TableRow>
          </TableHead>
          <TableBody>{tableBody}</TableBody>
        </Table>
      </TableContainer>
      <Grid
        container
        alignItems="flex-start"
        justifyContent="flex-end"
        direction="row"
      >
        {additionalButtons}
      </Grid>
    </Paper>
  );
};

export default BasicTable;
