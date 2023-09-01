import React from "react";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Button, Typography } from "@mui/material";
import { Close, DeleteForever } from "@mui/icons-material";
import { defaultRedButton, defaultTableButton } from "../../theme/Theme";

import { deletePartsQuote } from "../parts_quotes/delete/DeletePartsQuote";

const DeleteContent = ({ customer, itemToDelete, closeModal }) => {
  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 xs={12}>
          <Typography variant="body1" gutterBottom>
            {`Unrecoverable delete!`}
          </Typography>
        </Grid2>
      </Grid2>
      <Grid2
        container
        alignItems="flex-start"
        justifyContent="flex-end"
        direction="row"
      >
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DeleteForever />}
          sx={defaultRedButton}
          onClick={() => deletePartsQuote(customer, itemToDelete, closeModal)}
        >
          Confirm Delete
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Close />}
          sx={defaultTableButton}
          onClick={() => closeModal()}
        >
          Close
        </Button>
      </Grid2>
    </>
  );
};

export default DeleteContent;
