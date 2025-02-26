import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ListAltIcon from "@mui/icons-material/ListAlt"; // Default icon

const SectionHeader = ({
  title,
  totalCount,
  onRefresh,
  isRefreshing,
  icon = <ListAltIcon fontSize="medium" sx={{ color: "#FFF" }} />,
}) => {
  return (
    <Box
      sx={{
        bgcolor: "#00796b", 
        p: 2,
        borderRadius: 2,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Deeper shadow for elevation
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.3s ease",
      }}
    >
      {/* Title & Total Count Section */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* Dynamic Icon */}
        <Box
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.2)", // Transparent white background
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ ml: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "500", color: "#FFF", letterSpacing: 0.5 }}
          >
            {title}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "#FFF", fontSize: "14px", opacity: 0.8, mt: 0.5 }}
          >
            Total Records: <strong>{totalCount}</strong>
          </Typography>
        </Box>
      </Box>

      {/* Refresh Button */}
      <Tooltip title="Reload Data">
        <IconButton
          onClick={onRefresh}
          disabled={isRefreshing}
          sx={{
            bgcolor: "#FFF",
            color: "#005f56",
            transition: "0.3s",
            "&:hover": { bgcolor: "#00796b", color: "#FFF" },
            width: 44,
            height: 44,
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
  );
};

export default SectionHeader;
