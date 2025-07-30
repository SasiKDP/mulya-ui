import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, CssBaseline } from "@mui/material";

import usaTheme from "./adroit/Theme/theme";
import defaultTheme from "./indTheme";
import getRouteConfig from "./routes/routeConfig";

const REGION = "IND"; // change to "USA" when needed

const AppRoutes = () => useRoutes(getRouteConfig(REGION));

const App = () => (
  <ThemeProvider theme={REGION === "IND" ? defaultTheme : usaTheme}>
    <CssBaseline />
    <Router>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />
    </Router>
  </ThemeProvider>
);

export default App;
