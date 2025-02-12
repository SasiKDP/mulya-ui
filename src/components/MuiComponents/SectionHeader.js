import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ListAltIcon from "@mui/icons-material/ListAlt"; // Default icon

const SectionHeader = ({ title, totalCount, onRefresh, isRefreshing, icon = <ListAltIcon />  }) => {
  return (
    <Box
      sx={{
        bgcolor: "rgba(232, 245, 233)", // Light greenish background
        p: 2,
        borderRadius: 2,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
      }}
    >
      {/* Header with Title, Total Count & Reload Icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Title & Total Assigned Count */}
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#1B5E20" }}
          >
            {title}
          </Typography>

          {/* Total Count with Icon */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            {icon} {/* Dynamic Icon */}
            <Typography
              variant="subtitle1"
              sx={{
                color: "#1B5E20",
               
                fontSize: "16px",
                ml: 1, // Margin for spacing between icon & text
              }}
            >
              Total Records : {totalCount}
            </Typography>
          </Box>
        </Box>

        {/* Reload Button */}
        <Tooltip title="Reload Data">
          <IconButton
            onClick={onRefresh}
            disabled={isRefreshing}
            sx={{
              bgcolor: "#1B5E20", // Dark green button background
              color: "#FFFFFF", // White icon color
              "&:hover": { bgcolor: "#145A32" }, // Darker green on hover
              width: 40,
              height: 40, // Ensures equal size
            }}
          >
            <RefreshIcon
              sx={{
                animation: isRefreshing ? "spin 1s linear infinite" : "none",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default SectionHeader;
