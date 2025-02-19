import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  Box,
  Paper,
  Input,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  submitFormData,
  resetForm,
  clearMessages,
} from "../redux/features/candidateSubmissionSlice";
import AttachFileIcon from "@mui/icons-material/AttachFile";

// Validation Schema
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  candidateEmailId: Yup.string()
    .email("Invalid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address in lowercase"
    )
    .required("Email is required"),
  contactNumber: Yup.string()
    .matches(/^\d{10}$/, "Contact number must be exactly 10 digits")
    .required("Contact number is required"),
  currentOrganization: Yup.string().max(
    30,
    "Organization name cannot be more than 30 characters"
  ),
  currentCTC: Yup.string().test(
    "valid-ctc",
    "Please enter a valid CTC value",
    (value) => {
      if (!value) return true;
      const numValue = parseFloat(value.replace(/\s*LPA\s*/g, ""));
      return !isNaN(numValue) && numValue >= 0;
    }
  ),
  expectedCTC: Yup.string().test(
    "valid-ctc",
    "Please enter a valid CTC value",
    (value) => {
      if (!value) return true;
      const numValue = parseFloat(value.replace(/\s*LPA\s*/g, ""));
      return !isNaN(numValue) && numValue >= 0;
    }
  ),
  totalExperience: Yup.number()
    .min(0, "Total experience cannot be negative")
    .max(50, "Total experience cannot be more than 50 years")
    .required("Total experience is required"),
  relevantExperience: Yup.number()
    .min(0, "Relevant experience cannot be negative")
    .max(50, "Relevant experience cannot be more than 50 years")
    .required("Relevant experience is required")
    .test(
      "is-relevant-not-more-than-total",
      "Relevant experience cannot be more than total experience",
      function (value) {
        const { totalExperience } = this.parent;
        if (value > totalExperience) {
          return this.createError({
            message: "Relevant experience cannot be more than total experience",
          });
        }
        return true;
      }
    ),
  communicationSkills: Yup.number()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  requiredTechnologiesRating: Yup.number()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  preferredLocation: Yup.string()
    .max(18, "Location cannot be more than 18 characters")
    .matches(/^[A-Za-z\s]+$/, "Location can only contain letters and spaces"),
  currentLocation: Yup.string()
    .max(18, "Location cannot be more than 18 characters")
    .matches(/^[A-Za-z\s]+$/, "Location can only contain letters and spaces"),
  overallFeedback: Yup.string().max(
    100,
    "Feedback cannot be more than 100 characters"
  ),
});

const CandidateSubmissionForm = ({ jobId, userId, userEmail, closeDialog }) => {
  const dispatch = useDispatch();
  const successMessage = useSelector(
    (state) => state.candidateSubmission.successResponse
  );
  const errorMessage = useSelector(
    (state) => state.candidateSubmission.errorResponse
  );
  const loading = useSelector((state) => state.candidateSubmission.loading);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const initialValues = {
    fullName: "",
    candidateEmailId: "",
    contactNumber: "",
    currentOrganization: "",
    qualification: "",
    totalExperience: "",
    relevantExperience: "",
    currentCTC: "",
    expectedCTC: "",
    noticePeriod: "",
    currentLocation: "",
    preferredLocation: "",
    skills: "",
    communicationSkills: "",
    requiredTechnologiesRating: "",
    overallFeedback: "",
    resumeFile: null,
    resumeFilePath: "",
    userId,
    jobId,
    userEmail,
  };

  // Custom TextField component for Formik
  const FormikTextField = ({ field, form: { touched, errors }, ...props }) => (
    <TextField
      {...field}
      {...props}
      error={touched[field.name] && Boolean(errors[field.name])}
      helperText={touched[field.name] && errors[field.name]}
      fullWidth
      variant="outlined"
      margin="normal"
    />
  );

  // Custom Select component for Formik
  const FormikSelect = ({
    field,
    form: { touched, errors },
    options,
    label,
  }) => (
    <FormControl
      fullWidth
      margin="normal"
      error={touched[field.name] && !!errors[field.name]}
    >
      <InputLabel id={`${field.name}-label`}>{label}</InputLabel>
      <Select {...field} labelId={`${field.name}-label`} label={label}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {touched[field.name] && errors[field.name] && (
        <FormHelperText>{errors[field.name]}</FormHelperText>
      )}
    </FormControl>
  );

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formDataToSubmit = {
        ...values,
        currentCTC: values.currentCTC
          ? `${values.currentCTC.replace(/\s*LPA\s*/g, "")} LPA`
          : "",
        expectedCTC: values.expectedCTC
          ? `${values.expectedCTC.replace(/\s*LPA\s*/g, "")} LPA`
          : "",
      };

      await dispatch(
        submitFormData({
          formData: formDataToSubmit,
          userId,
          jobId,
          userEmail,
        })
      ).unwrap();

      setAlert({
        open: true,
        message: "Candidate submitted successfully",
        severity: "success",
      });

      setTimeout(() => {
        resetForm();
        dispatch(clearMessages());
        closeDialog();
      }, 4000);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message || "Failed to submit form",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      setAlert({
        open: true,
        message: errorMessage,
        severity: "error",
      });

      const timeoutId = setTimeout(() => {
        dispatch(clearMessages());
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [errorMessage, dispatch]);

  return (
    <Paper sx={{ padding: 4, maxWidth: 1200, margin: "auto" }}>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="fullName"
                  component={FormikTextField}
                  label="Full Name"
                  required
                  placeholder="Enter your full name"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="candidateEmailId"
                  component={FormikTextField}
                  label="Candidate Email ID"
                  required
                  type="email"
                  placeholder="Enter your email"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="contactNumber"
                  component={FormikTextField}
                  label="Contact Number"
                  required
                  placeholder="Enter your contact number"
                />
              </Grid>

              {/* Professional Information */}
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="currentOrganization"
                  component={FormikTextField}
                  label="Current Organization"
                  placeholder="Enter your current organization"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="qualification"
                  component={FormikTextField}
                  label="Qualification"
                  placeholder="Enter your qualification"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="totalExperience"
                  component={FormikTextField}
                  label="Total Experience (in years)"
                  type="number"
                  placeholder="e.g., 3.5"
                  InputProps={{
                    inputProps: { min: 0, max: 50, step: 0.1 },
                  }}
                />
              </Grid>

              {/* Experience and CTC */}
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="relevantExperience"
                  component={FormikTextField}
                  label="Relevant Experience (in years)"
                  type="number"
                  placeholder="e.g., 3.5"
                  InputProps={{
                    inputProps: { min: 0, max: 50, step: 0.1 },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="currentCTC"
                  component={FormikTextField}
                  label="Current CTC"
                  placeholder="e.g., 3.5"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">LPA</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="expectedCTC"
                  component={FormikTextField}
                  label="Expected CTC"
                  placeholder="e.g., 3.5"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">LPA</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Location and Notice Period */}
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="noticePeriod"
                  component={FormikSelect}
                  label="Notice Period"
                  options={[
                    { value: "Immediate", label: "Immediate" },
                    { value: "15 days", label: "15 days" },
                    { value: "30 days", label: "30 days" },
                    { value: "45 days", label: "45 days" },
                    { value: "60 days", label: "60 days" },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="currentLocation"
                  component={FormikTextField}
                  label="Current Location"
                  placeholder="Enter your current location"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="preferredLocation"
                  component={FormikTextField}
                  label="Preferred Location"
                  placeholder="Enter your preferred location"
                />
              </Grid>

              {/* Skills and Ratings */}
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="skills"
                  component={FormikTextField}
                  label="Skills (comma-separated)"
                  placeholder="e.g., Java, React, SQL"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="communicationSkills"
                  component={FormikTextField}
                  label="Communication Skills Rating"
                  type="number"
                  placeholder="Enter rating (1-5)"
                  InputProps={{
                    inputProps: { min: 1, max: 5, step: 0.1 },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="requiredTechnologiesRating"
                  component={FormikTextField}
                  label="Required Technologies Rating"
                  type="number"
                  placeholder="Enter rating (1-5)"
                  InputProps={{
                    inputProps: { min: 1, max: 5, step: 0.1 },
                  }}
                />
              </Grid>

              {/* Feedback and Resume */}
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  name="overallFeedback"
                  component={FormikTextField}
                  label="Overall Feedback"
                  multiline
                  rows={2}
                  placeholder="Enter your feedback"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel shrink>Upload Resume</InputLabel>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<AttachFileIcon />}
                    >
                      Upload Resume
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          if (!file) {
                            setFieldValue("resumeFile", null);
                            setFieldValue("resumeFilePath", "");
                            return;
                          }

                          const validTypes = [
                            "application/pdf", // PDF
                            "application/msword", // DOC
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
                          ];

                          if (!validTypes.includes(file.type)) {
                            setAlert({
                              open: true,
                              message:
                                "Invalid file type. Only PDF, DOC, and DOCX are allowed.",
                              severity: "error",
                            });
                            setFieldValue("resumeFile", null);
                            setFieldValue("resumeFilePath", "");
                            return;
                          }

                          setFieldValue("resumeFile", file);
                          setFieldValue("resumeFilePath", file.name);
                        }}
                      />
                    </Button>
                    {values.resumeFilePath && (
                      <Typography variant="body2">
                        Selected: {values.resumeFilePath}
                      </Typography>
                    )}
                  </Box>
                </FormControl>
              </Grid>
            </Grid>

            {/* Submit and Reset Buttons */}
            <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  resetForm();
                  dispatch(resetForm());
                  setAlert({
                    open: true,
                    message: "Form has been reset",
                    severity: "info",
                  });
                }}
                sx={{ minWidth: 120 }}
                disabled={isSubmitting}
              >
                Reset Form
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ minWidth: 120 }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default CandidateSubmissionForm;