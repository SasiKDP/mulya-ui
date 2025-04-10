import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import routeConfig from "./routes/routeConfig";

const AppRoutes = () => useRoutes(routeConfig);

const App = () => {
  return (
    <Router>
      <AppRoutes />
      <ToastContainer /> {/* 👈 This is needed for toast to appear */}
    </Router>
  );
};

export default App;
