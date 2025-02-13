import React from "react";
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const Sidebar = ({ activeTabs, selectedTab, setSelectedTab, isMobile, setDrawerOpen }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "240px",
        bgcolor: "#e8f5e9", // Light green background
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#555",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: "1rem",
          py: "0.75rem",
          bgcolor: "#c8e6c9",
        }}
      >
        <Box sx={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "center" }}>Menu</Box>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Scrollable List */}
      <List sx={{ p: 0 }}>
        {activeTabs.map((tab) => (
          <ListItem
            button
            key={tab.value}
            selected={selectedTab === tab.value}
            onClick={() => {
              setSelectedTab(tab.value);
              if (isMobile) setDrawerOpen(false);
            }}
            sx={{
              mx: "3%",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              "&:hover": { bgcolor: "#1B3A8C", color: "#FFFFFF" },
              "&.Mui-selected": { bgcolor: "#2A4DBD", color: "#FFFFFF", fontWeight: "bold" },
            }}
          >
            <ListItemIcon sx={{ color: selectedTab === tab.value ? "#233B80" : "inherit" }}>
              {tab.icon}
            </ListItemIcon>
            <ListItemText primary={tab.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
