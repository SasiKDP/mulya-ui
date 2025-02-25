import React from "react";
import { Grid, Typography, Divider, MenuItem, Paper } from "@mui/material";
import { Field } from "formik";
import { CustomSelect } from "./FormComponents";

const JobFormDetails = () => {
  return (
    <Grid item xs={12}>
      
        {/* Header Section */}
        <Typography
          variant="h6"
          color="primary"
          gutterBottom
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          Job Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Job Type, Job Mode, Notice Period */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Field name="jobType" component={CustomSelect} label="Job Type">
              {["Full-time", "Part-time", "Contract"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Field>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Field name="jobMode" component={CustomSelect} label="Job Mode">
              {["Remote", "On-site", "Hybrid"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Field>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Field
              name="noticePeriod"
              component={CustomSelect}
              label="Notice Period"
            >
              {["Immediate", "15 days", "30 days", "45 days", "60 days"].map(
                (option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                )
              )}
            </Field>
          </Grid>
        </Grid>
      
    </Grid>
  );
};

export default JobFormDetails;
