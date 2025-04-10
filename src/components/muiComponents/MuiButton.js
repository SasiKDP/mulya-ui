import React from 'react';
import { Button } from '@mui/material';

const MuiButton = function(props) {
  const {
    color = 'primary',
    variant = 'contained',
    size = 'medium',
    onClick,
    children,
    ...restProps // Collect remaining props
  } = props;

  return React.createElement(
    Button,
    {
      color: color,
      variant: variant,
      size: size,
      onClick: onClick,
      ...restProps, // Spread the rest of the props
    },
    children
  );
};

export default MuiButton;