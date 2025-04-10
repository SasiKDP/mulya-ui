import React from 'react';
import { Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material';

const MuiSelect = ({
  label,
  value,
  onChange,
  options,
  variant = 'outlined',
  size = 'medium',
  helperText = '',
  fullWidth = false,
  error = false,
  ...props
}) => {
  return (
    <FormControl variant={variant} size={size} fullWidth={fullWidth} error={error}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange} {...props}>
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default MuiSelect;
