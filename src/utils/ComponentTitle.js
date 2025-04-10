import React from "react";
import { Box, Typography } from "@mui/material";

const ComponentTitle = ({
  title,
  icon,
  variant = "h5",
  align = "start",
  color = "primary",
  children,
  ...rest
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      py={2}
      px={3}
      bgcolor="#FFFFFF"
      border="1px solid #E0E0E0"
      borderRadius={2}
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.02)"
      {...rest}
    >
      <Typography
        variant={variant}
        color={color}
        fontWeight={600}
        display="flex"
        alignItems="center"
        gap={1}
      >
        {icon}
        {title}
      </Typography>

      {/* Right side content: buttons or any elements */}
      {children && <Box display="flex" gap={2}>{children}</Box>}
    </Box>
  );
};

export default ComponentTitle;
