import React from 'react';
import { TextField } from '@mui/material';

const InputField = ({ label, name, value, onChange, type, fullWidth , ...rest }) => {
  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      {...rest}
      
    />
  );
};

export default InputField;
