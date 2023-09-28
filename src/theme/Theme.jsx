import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      //main: "#007f7f",
      main: "#4287f5",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#007f7f",
    },
    secondary: {
      main: "#f50057",
    },
  },
  // components: {
  //   MuiSelect: {
  //     styleOverrides: {
  //       root: {
  //         "&.MuiSelect-root": {
  //           backgroundColor: "#000",
  //           color: "#fff",
  //         },
  //       },
  //     },
  //   },
  // },
});

export const getRootModalStyle = (width) => {
  return {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width,
    backgroundColor: lightTheme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: 24,
    //padding: "16px",
  };
};

export const defaultBodyTableCell = {
  fontSize: 18,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

export const getDefaultHeadTableCell = (width) => {
  return {
    minWidth: width,
    fontSize: 18,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    background: lightTheme.palette.primary.light,
    color: lightTheme.palette.primary.contrastText,
  };
};

export const redBodyTableCell = {
  fontSize: 18,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  color: "orange",
};

export const greenBodyTableCell = {
  fontSize: 18,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  color: "green",
};

export const defaultTableButton = {
  marginTop: "16px",
  marginLeft: "8px",
  background: lightTheme.palette.primary.contrastText,
};

export const defaultRedButton = {
  marginTop: "16px",
  marginLeft: "8px",
  background: lightTheme.palette.primary.contrastText,
  color: "red",
};
