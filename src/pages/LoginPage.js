import React, { useState } from "react";
import { Grid, Box } from "@mui/material";
import LoginLeft from "../components/LogIn/LoginLeft";
import LoginForm from "../components/LogIn/LoginForm";
import Registration from "../components/LogIn/Registration";
import ForgotPassword from "../components/LogIn/ForgotPassword"; // Assuming this component exists

const LoginPage = () => {
  const [currentView, setCurrentView] = useState("login"); // Default view is login

  // Function to switch between views
  const switchView = (view) => {
    setCurrentView(view);
  };

  // Render the appropriate component based on currentView
  const renderComponent = () => {
    switch (currentView) {
      case "login":
        return <LoginForm onSwitchView={switchView} />;
      case "register":
        return <Registration onSwitchView={switchView} />;
      case "forgotPassword":
        return <ForgotPassword onSwitchView={switchView} />;
      default:
        return <LoginForm onSwitchView={switchView} />;
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          display: { xs: "none", sm: "block" },
        }}
      >
        <LoginLeft />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: currentView === "register" ? 800 : 400 }}>
          {renderComponent()}
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;