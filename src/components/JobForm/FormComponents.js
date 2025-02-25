// src/utils/FormComponents.jsx
import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";

// Shared text field styling
export const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "#f8f9fa",
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
    },
  },
};

// Custom TextField component for Formik
export const CustomTextField = ({ field, form: { touched, errors }, ...props }) => (
  <TextField
    {...field}
    {...props}
    error={touched[field.name] && Boolean(errors[field.name])}
    helperText={touched[field.name] && errors[field.name]}
    sx={textFieldStyle}
  />
);

// Custom Select component for Formik
export const CustomSelect = ({
  field,
  form: { touched, errors },
  children,
  ...props
}) => (
  <FormControl
    fullWidth
    error={touched[field.name] && Boolean(errors[field.name])}
  >
    <InputLabel>{props.label}</InputLabel>
    <Select {...field} {...props}>
      {children}
    </Select>
    {touched[field.name] && errors[field.name] && (
      <FormHelperText>{errors[field.name]}</FormHelperText>
    )}
  </FormControl>
);