import { Chip } from "@mui/material";
import { useState } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { validateIfPlaced } from "./validatePlacedUtil";
import MuiButton from "../components/muiComponents/MuiButton";
import { CheckCircle as SuccessIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';



export const getStatusColor = (status) => {
  const normalized = status?.trim().toUpperCase();
  const statusColors = {
  SCHEDULED: { bg: "#EDF4FF", text: "#1E40AF" },
  COMPLETED: { bg: "#E9FBE5", text: "#2E7D32" },
  CANCELLED: { bg: "#FAEDED", text: "#B91C1C" },
  RESCHEDULED: { bg: "#FFF4E5", text: "#C2410C" },
  PLACED: { bg: "#F3E8FF", text: "#7E22CE" },
  SELECTED: { bg: "#E0F2F1", text: "#00695C" },
  REJECTED: { bg: "#FFEBEE", text: "#D32F2F" },
  FEEDBACK_PENDING: { bg: "#FFFDE7", text: "#F9A825" } // <-- Added this line
};

  return statusColors[normalized] || { bg: "#F3F4F6", text: "#374151" };
};

export const getStatusChip = (status, row, dispatch) => {
  const normalized = status?.trim().toUpperCase();
  const isMovedToPlacement =row.isPlaced || row.placed; // Get the value from the row object
  const { bg, text } = getStatusColor(status);
  const label = normalized || "SCHEDULED";
  const isPlacedWord = normalized === "PLACED";

  // Check if the status is 'PLACED' and isMovedToPlacement is false to enable the button
  const canAddToPlacement = isPlacedWord && !isMovedToPlacement;

  if (isMovedToPlacement && isPlacedWord) {
    // If moved to placement, show success icon and "Moved to Placement" message
    return (
      <Chip
        label="Placed"
        icon={<SuccessIcon sx={{ color: "green", marginRight: 1 }} />}
        size="small"
        sx={{
          bgcolor: "#e0f7e9", // Light green background
          color: "green",
          fontWeight: 500,
          borderRadius: "999px",
          px: 1.5,
          height: 24,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontSize: "0.75rem",
          cursor: "default",
        }}
      />
    );
  }

  if (canAddToPlacement) {
    // If placed and not moved to placement, show the Add to Placement hyperlink with default styles
    return (
      <Link 
        to="#" // You can replace this with a valid route URL if needed
        onClick={(e) => { 
          e.preventDefault(); // Prevent default link behavior
          validateIfPlaced(status, row, dispatch); // Call the validateIfPlaced function
        }} 
        style={{
         color:'#1B56FD',
          textDecoration: "underline", // Default underline for hyperlink
          fontWeight: "normal", // No bold font
          fontSize: "0.75rem",
          cursor: "pointer",
        }}
      >
        Add to Placement
      </Link>
    );
  }

  return (
    <Chip
      label={label}
      // onClick={() => { normalized === "PLACED" && validateIfPlaced(status, row, dispatch); }}
      size="small"
      sx={{
        bgcolor: bg,
        color: text,
        fontWeight: 500,
        borderRadius: "999px",
        px: 1.5,
        height: 24,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        fontSize: "0.75rem",
        cursor: isPlacedWord ? "pointer" : "default",
        "&:hover": isPlacedWord ? { opacity: 0.9 } : {},
      }}
    />
  );
};


//interview levels

export const getInterviewLevelChip = (level) => {
  const LEVELS = {
    INTERNAL: {
      label: "Internal",
      borderColor: "#1565C0",
      textColor: "#1565C0",
    },

    EXTERNAL: {
      label: "External",
      borderColor: "#6A1B9A",
      textColor: "#6A1B9A",
    },

    "EXTERNAL-L1": {
      label: "External L1",
      borderColor: "#F57C00",
      textColor: "#F57C00",
    },

    "EXTERNAL-L2": {
      label: "External L2",
      borderColor: "#EF6C00",
      textColor: "#EF6C00",
    },

    FINAL: {
      label: "Final",
      borderColor: "#2E7D32",
      textColor: "#2E7D32",
    },

  };

  const key = (level || "").toUpperCase();
  const config = LEVELS[key] || {
    label: level || "Unknown",
    borderColor: "#BDBDBD",
    textColor: "#757575",
  };

  return (
    <Chip
      label={config.label}
      size="small"
      variant="outlined"
      sx={{
        borderColor: config.borderColor,
        color: config.textColor,
        fontWeight: 500,
      }}
    />
  );
};

export const generateExperienceChip = ({
  experience,
  minWidth = 64,
  fontWeight = 400, // Slightly bolder for better readability
  fontSize = "0.85rem",
  variant = "outlined", // Default to outlined, but can be changed
}) => {
  // Color scheme based on experience levels
  let color = "#4caf50"; // Green (high experience)
  if (experience < 1) {
    color = "#f44336"; // Red (low experience)
  } else if (experience < 3) {
    color = "#ff9800"; // Orange (medium experience)
  }

  // Return the MUI Chip component

  return (
    <Chip
      variant={variant}
      label={`${experience} ${experience === 1 ? "Yr" : "Yrs"}`}
      sx={{
        color: color,
        borderColor: variant === "outlined" ? color : undefined,
        backgroundColor: variant === "filled" ? `${color}20` : undefined, // 20% opacity for filled
        fontWeight: fontWeight,
        fontSize: fontSize,
        minWidth: minWidth,
        "& .MuiChip-label": {
          padding: "0 8px", // Adjust label padding
        },
      }}
      size="small"
    />
  );

};

export const generateMobileNumberChip = (value) => {

  const formatMobileNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/\D/g, "");
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7) return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
    return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 10)}`;
  };

  return (
    <Chip
      label={formatMobileNumber(value)}
      variant="outlined"
      sx={{
        fontWeight: 500,
        fontSize: "0.875rem",
        minWidth: 150,
        padding: "5px 10px",
        textTransform: "none",
        borderRadius: 2,
        borderColor: "#F8BBD0", // Soft pink border
        color: "#D81B60", // Deep pink text
        backgroundColor: "transparent", // Transparent background for simplicity
      }}

    />

  );

};
