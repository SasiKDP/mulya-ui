// src/components/JobForm/JobFormExperience.jsx
import React from "react";
import { Grid, Typography, Divider } from "@mui/material";
import { Field } from "formik";
import { CustomTextField } from "./FormComponents";
import QualificationField from "../../utils/QualificationDropdown";

const JobFormExperience = () => {
  return (
    <Grid item xs={12}>
      <Typography
        variant="subtitle1"
        color="primary"
        gutterBottom
        fontWeight="500"
      >
        Experience & Qualification
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Field
            name="experienceRequired"
            component={CustomTextField}
            fullWidth
            type="number"
            label="Experience Required (years)"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Field
            name="relevantExperience"
            component={CustomTextField}
            fullWidth
            type="number"
            label="Relevant Experience (years)"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <QualificationField />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Field
            name="noOfPositions"
            component={CustomTextField}
            fullWidth
            type="text"
            label="Number of Positions"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Field
            name="salaryPackage"
            component={CustomTextField}
            fullWidth
            type="text"
            label="Salary Package (LPA)"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default JobFormExperience;