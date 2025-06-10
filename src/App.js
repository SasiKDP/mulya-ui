import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import routeConfig from "./routes/routeConfig";
import { useAutoRefreshToken } from './hooks/useAutoRefreshToken';
import useLogoutOnUnload from './hooks/useLogoutOnUnload';
import useLogoutOnReload from "./hooks/useLogoutOnReload";

const AppRoutes = () => useRoutes(routeConfig);

const App = () => {
  useAutoRefreshToken();
  useLogoutOnUnload(); 
  useLogoutOnReload(); 

  return (
    <Router>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
};

export default App;
