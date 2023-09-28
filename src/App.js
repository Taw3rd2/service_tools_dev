import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/firestore.utils";
import React, { lazy, Suspense, useMemo, useState, useEffect } from "react";

import { Routes, Route } from "react-router-dom";
import PrintDailySlips from "./pages/print_daily_slips/PrintDailySlips.page";
import PrintOneSlip from "./pages/print_daily_slips/PrintOneSlip";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CircularProgress, CssBaseline } from "@mui/material";
import Navbar from "./components/topbar/Navbar";
import { doc, onSnapshot } from "firebase/firestore";

//const GeneralLedger = lazy(() => import("./pages/accounting/GeneralLedger.page"))
const HomePage = lazy(() => import("./pages/homepage/HomePage.page"));
//const Invoice = lazy(() => import("./pages/invoice/Invoice.page"))
const EquipmentCatalog = lazy(() =>
  import("./pages/products/equipment_catalog/EquipmentCatalog.page")
);
//const Maintenance = lazy(() => import("../src/pages/maintenance/Maintenance"));
const PartsCatalog = lazy(() =>
  import("./pages/products/parts_catalog/PartsCatalog.page")
);
const PartsQuote = lazy(() => import("./pages/parts_quote/PartsQuote.page"));
const Schedule = lazy(() => import("./pages/schedule/Schedule.page"));
const ServicesCatalog = lazy(() =>
  import("./pages/products/services/ServicesCatalog.page")
);
const Settings = lazy(() => import("./pages/settings/Settings.page"));
const SignIn = lazy(() => import("./pages/sign-in/SignIn"));

function App() {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        setLoading(false);
      } else {
        setAuthUser(null);
        setLoading(false);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const [themeColor, setThemeColor] = useState({
    color: "#4287f5",
    mode: "dark",
  });
  useEffect(() => {
    const themeId = "BZ2zpDOt130MnEM9STLL";
    const subscribeToTheme = onSnapshot(doc(db, "theme", themeId), (doc) => {
      setThemeColor({ ...doc.data() });
    });

    return () => {
      subscribeToTheme();
    };
  }, []);

  const getDesignTokens = (mode) => ({
    palette: {
      mode,
      ...(mode === themeColor.mode
        ? {
            primary: {
              main: themeColor.color,
            },
            secondary: {
              main: "#f50057", //red
            },
          }
        : {
            background: {
              default: "#333", //black
              paper: "#333", //black
            },
            primary: {
              main: themeColor.color, //dark teal
            },
            secondary: {
              main: "#f50057", //red
            },
          }),
    },
  });

  //const [mode, setMode] = useState("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        const previousMode = themeColor.mode;
        console.log("previousMode: ", previousMode);
        setThemeColor({
          ...themeColor,
          mode: previousMode === "light" ? "dark" : "light",
        });
        console.log("current mode: ", themeColor.mode);
        //setThemeColor((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [themeColor]
  );

  const currentTheme = useMemo(
    () => createTheme(getDesignTokens(themeColor.mode)),
    [themeColor]
  );

  return loading ? (
    <CircularProgress />
  ) : (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {authUser ? <Navbar authUser={authUser} colorMode={colorMode} /> : null}
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <SignIn />} />
          <Route
            path="/homepage"
            element={authUser ? <HomePage /> : <SignIn />}
          />
          <Route
            path="/schedule"
            element={authUser ? <Schedule /> : <SignIn />}
          />
          {/* <Route
            path="/maintenance"
            element={authUser ? <Maintenance /> : <SignIn />}
          /> */}
          <Route
            path="/equipment_catalog"
            element={authUser ? <EquipmentCatalog /> : <SignIn />}
          />
          <Route
            path="/parts_catalog"
            element={authUser ? <PartsCatalog /> : <SignIn />}
          />
          <Route
            path="/parts_quote"
            element={authUser ? <PartsQuote /> : <SignIn />}
          />
          <Route
            path="/services_catalog"
            element={authUser ? <ServicesCatalog /> : <SignIn />}
          />
          {/* <Route  
            path="/accounting"
            element = {currentUser ? <GeneralLedger /> : <SignIn />}
          /> 
          <Route  
            path="/invoice"
            element = {currentUser ? <Invoice /> :  <SignIn />}
          /> */}
          <Route
            path="/settings"
            element={authUser ? <Settings /> : <SignIn />}
          />
          <Route
            path="/print_daily_slips/:state"
            element={authUser ? <PrintDailySlips /> : <SignIn />}
          />
          <Route
            path="/print_one_slip/:state"
            element={authUser ? <PrintOneSlip /> : <SignIn />}
          />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>Theres nothing here!</p>
              </main>
            }
          />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
