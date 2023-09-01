import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContextProvider } from "./context/toastContext";
import App from "./App";

import "./index.css";
import "react-photo-view/dist/react-photo-view.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ToastContextProvider>
      <App />
    </ToastContextProvider>
  </BrowserRouter>
);
