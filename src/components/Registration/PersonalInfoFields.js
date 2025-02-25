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
    <Grid container spacing={2}>
      {/* Employee ID & Employee Name in One Row */}
      <Grid item xs={12} md={6}>
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
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
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
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Grid>

      {/* Employee Designation & Gender in One Row */}
      <Grid item xs={12} md={6}>
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
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl
          fullWidth
          error={!!formError.gender}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        >
          <InputLabel
            sx={{ color: formError.gender ? "error.main" : "text.primary" }}
          >
            Gender
          </InputLabel>
          <Select
            value={formData.gender}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Gender"
            name="gender"
            sx={{
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: formError.gender
                  ? "error.main"
                  : "rgba(0, 0, 0, 0.23)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: formError.gender ? "error.main" : "primary.main",
              },
            }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
          {formError.gender && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 1, fontWeight: 500 }}
            >
              {formError.gender}
            </Typography>
          )}
        </FormControl>
      </Grid>

      {/* Date of Birth & Joining Date in One Row */}
      <Grid item xs={12} md={6}>
        <TextField
          type="date"
          label="Date of Birth"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={!!formError.dob}
          helperText={formError.dob}
          InputLabelProps={{ shrink: true }}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          type="date"
          label="Joining Date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={!!formError.joiningDate}
          helperText={formError.joiningDate}
          InputLabelProps={{ shrink: true }}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default PersonalInfoFields;
