// components/LoadingSkeleton.jsx

import React from 'react';
import { Skeleton, Box } from '@mui/material';

const LoadingSkeleton = ({ rows = 3, width = '100%', height = 40, spacing = 2 }) => {
  return (
    <Box display="flex" flexDirection="column" gap={spacing}>
      {[...Array(rows)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width={width}
          height={height}
          animation="wave"
          sx={{ borderRadius: 2 }}
        />
      ))}
    </Box>
  );
};

export default LoadingSkeleton;
