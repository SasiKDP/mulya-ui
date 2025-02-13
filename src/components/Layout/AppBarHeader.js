import React from "react";
import { AppBar, Toolbar, IconButton, Box, Avatar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const AppBarHeader = ({ handleDrawerToggle, logo, userId, profileImage }) => {
  return (
    <AppBar position="fixed" sx={{ bgcolor: "#e8f5e9", color: "text.primary", boxShadow: 1 }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <img src={logo} alt="Logo" style={{ height: 40 }} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="subtitle2">{userId}</Typography>
          <Avatar sx={{ cursor: "pointer", bgcolor: "primary.main" }}>
            {profileImage ? <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%" }} /> : <AccountCircleIcon />}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarHeader;
