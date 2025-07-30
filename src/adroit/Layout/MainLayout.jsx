import React, { useState } from "react";
import { Box, Toolbar, useTheme, useMediaQuery } from "@mui/material";
import AppHeader from "./AppHeader";
import SideNav from "./SideNav";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSideNavToggle = () => {
    setSideNavCollapsed(!sideNavCollapsed);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppHeader
        onMenuToggle={handleDrawerToggle}
        onSideNavToggle={handleSideNavToggle}
        sideNavCollapsed={sideNavCollapsed}
      />
      <SideNav
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        collapsed={sideNavCollapsed}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: { md: `calc(100% - 200px)` },
        }}
      >
        <Toolbar /> {/* This creates space for the fixed AppBar */}
        <Box sx={{ flexGrow: 1, p: 3 }}>{children}</Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;
