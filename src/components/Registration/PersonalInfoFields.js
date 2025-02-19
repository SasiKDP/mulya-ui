import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

const PersonalInfoFields = ({ formData, handleChange, handleBlur, formError }) => {
  return (
    <>
      {/* Employee ID (userId) Field */}
      <Grid item xs={12} sm={6}>
        <TextField
          placeholder="DQINDXXXX"
          label="Employee ID"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={!!formError.userId}
          helperText={formError.userId}
        />
      </Grid>

      {/* Employee Name Field */}
      <Grid item xs={12} sm={6}>
        <TextField
          placeholder="Enter Your Name"
          label="Employee Name"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={!!formError.userName}
          helperText={formError.userName}
        />
      </Grid>

      {/* Employee Designation Field */}
      <Grid item xs={12} sm={6}>
        <TextField
          placeholder="e.g. Marketing Manager"
          label="Employee Designation"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={!!formError.designation}
          helperText={formError.designation}
        />
      </Grid>

      {/* Gender Field */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            value={formData.gender}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Gender"
            name="gender"
            error={!!formError.gender}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
          <Typography variant="caption" color="error">
            {formError.gender}
          </Typography>
        </FormControl>
      </Grid>
    </>
  );
};

export default PersonalInfoFields;
