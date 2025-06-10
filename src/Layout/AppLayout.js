// src/components/AppLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useAuthRedirect from "../hooks/useAuthRedirect";

const AppLayout = () => {
  useAuthRedirect(); // ✅ now safely inside Router context

  return (
    <>
      <Outlet />
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
    </>
  );
};

export default AppLayout;
