import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

const DateField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "Search by date ...",
  required = false,
  fullWidth = true,
  size = "small",
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value}
        onChange={(newValue) => onChange({ target: { name, value: newValue } })}
        renderInput={(params) => (
          <TextField
            {...params}
            required={required}
            fullWidth={fullWidth}
            size={size}
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "text.secondary", mr: 1 }} />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DateField;
