// src/components/JobForm/JobFormDescription.jsx
import React from "react";
import { 
  Grid, Typography, Box, Button, 
  FormHelperText, Stack, 
  RadioGroup, FormControlLabel, Radio 
} from "@mui/material";
import { Field } from "formik";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { CustomTextField } from "./FormComponents";

const JobFormDescription = ({ 
  jobDescriptionType, 
  setJobDescriptionType, 
  values, 
  setFieldValue, 
  errors, 
  touched 
}) => {
  return (
    <Grid container spacing={2}>
      {/* Job Description Type Selection */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" fontWeight="500">
          Job Description Input Type
        </Typography>
        <RadioGroup
          row
          value={jobDescriptionType}
          onChange={(event) => setJobDescriptionType(event.target.value)}
        >
          <FormControlLabel
            value="text"
            control={<Radio />}
            label="Text"
          />
          <FormControlLabel
            value="file"
            control={<Radio />}
            label="File Upload"
          />
        </RadioGroup>
      </Grid>

      {/* Job Description Input */}
      <Grid item xs={12} md={8}>
        {jobDescriptionType === "text" ? (
          <Field
            name="jobDescription"
            component={CustomTextField}
            fullWidth
            multiline
            rows={4}
            label="Job Description"
            variant="outlined"
          />
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1 }}
              fontWeight="500"
            >
              Upload Job Description (PDF, DOCX, Image)
            </Typography>

            {/* File Upload Box */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                border: "2px dashed #ccc",
                padding: 3,
                borderRadius: 2,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { borderColor: "primary.main" },
                transition: "border 0.3s ease",
              }}
            >
              {/* Hidden File Input */}
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                style={{ display: "none" }}
                id="job-description-file"
                onChange={(event) => {
                  const file = event.target.files[0];
                  setFieldValue("jobDescriptionFile", file);
                }}
              />

              {/* File Upload Button */}
              <label htmlFor="job-description-file">
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Button
                    component="span"
                    variant="contained"
                    color="primary"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload File
                  </Button>
                  <Typography variant="body2">
                    {values.jobDescriptionFile
                      ? values.jobDescriptionFile.name
                      : "No file selected"}
                  </Typography>
                </Stack>
              </label>
            </Box>

            {/* Error Message */}
            {errors.jobDescriptionFile &&
              touched.jobDescriptionFile && (
                <FormHelperText error>
                  {errors.jobDescriptionFile}
                </FormHelperText>
              )}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default JobFormDescription;