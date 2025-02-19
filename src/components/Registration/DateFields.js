import React from 'react';
import { Grid, TextField } from '@mui/material';

const DateFields = ({ formData, handleChange, handleBlur, formError, handleJoiningDateChange }) => {
  return (
    <>
      <Grid item xs={12} md={6}>
        <TextField
          label="Date of Birth"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={!!formError.dob}
          helperText={formError.dob}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Joining Date"
          name="joiningDate"
          type="date"
          value={formData.joiningDate}
          onChange={handleJoiningDateChange}
          onBlur={handleBlur}
          error={!!formError.joiningDate}
          helperText={formError.joiningDate}
          fullWidth
          InputLabelProps={{ shrink: true }}
          InputProps={{
            inputProps: {
              min: new Date(new Date().setMonth(new Date().getMonth() - 1))
                .toISOString()
                .split("T")[0],
              max: new Date(new Date().setMonth(new Date().getMonth() + 1))
                .toISOString()
                .split("T")[0],
            },
          }}
        />
      </Grid>
    </>
  );
};

export default DateFields;