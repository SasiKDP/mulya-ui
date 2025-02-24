import React from "react";
import { Grid, Typography, Divider, Box } from "@mui/material";
import RecruiterMultiSelect from "../MuiComponents/RecruiterMultiSelect";
import JobFormDescription from "./JobFormDescription";

const JobFormRecruiters = ({
  recruiters,
  values,
  setFieldValue,
  errors,
  touched,
  fetchStatus,
  jobDescriptionType,
  setJobDescriptionType,
}) => {
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
        Recruiters & Description
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Flexbox Layout for Proper Alignment */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Stack on small screens, row on large screens
          gap: 3, // Adds spacing between columns
          alignItems: "flex-start", // Ensures alignment at the top
        }}
      >
        {/* Recruiter Selection */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight="600" color="text.primary">
            Select Recruiters
          </Typography>
          <RecruiterMultiSelect
            recruiters={recruiters}
            values={values}
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
            fetchStatus={fetchStatus}
          />
        </Box>

        {/* Job Description */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight="600" color="text.primary">
            Job Description
          </Typography>
          <JobFormDescription
            jobDescriptionType={jobDescriptionType}
            setJobDescriptionType={setJobDescriptionType}
            values={values}
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
          />
        </Box>
      </Box>
    </Grid>
  );
};

export default JobFormRecruiters;
