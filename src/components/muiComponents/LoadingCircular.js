import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingCircular = ({ size = 40, thickness = 3.6, color = 'primary' }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="transparent" // Ensuring transparency
    >
      <CircularProgress size={size} thickness={thickness} color={color} />
    </Box>
  );
};

export default LoadingCircular;
