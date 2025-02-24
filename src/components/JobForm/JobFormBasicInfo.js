// src/components/JobForm/JobFormBasicInfo.jsx
import React from "react";
import { Grid, Typography, Divider } from "@mui/material";
import { Field } from "formik";
import { CustomTextField } from "./FormComponents";

const JobFormBasicInfo = () => {
  return (
    <Grid item xs={12}>
      <Typography
        variant="subtitle1"
        color="primary"
        gutterBottom
        fontWeight="500"
      >
        Basic Information
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Field
            name="jobTitle"
            component={CustomTextField}
            fullWidth
            label="Job Title"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Field
            name="clientName"
            component={CustomTextField}
            fullWidth
            label="Client Name"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Field
            name="location"
            component={CustomTextField}
            fullWidth
            label="Location"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default JobFormBasicInfo;