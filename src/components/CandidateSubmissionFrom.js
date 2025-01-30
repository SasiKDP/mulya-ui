import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormData,
  submitFormData,
  resetForm,
  clearMessages,
} from "../redux/features/candidateSubmissionSlice";

const CandidateSubmissionForm = ({ jobId, userId, userEmail }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.candidateSubmission.formData);
  const successMessage = useSelector(
    (state) => state.candidateSubmission.successMessage
  );
  const errorMessage = useSelector(
    (state) => state.candidateSubmission.errorMessage
  );
  const loading = useSelector((state) => state.candidateSubmission.loading);
  const candidateId = useSelector(
    (state) => state.candidateSubmission.candidateId
  );
  const employeeId = useSelector(
    (state) => state.candidateSubmission.employeeId
  );
  const submittedJobId = useSelector(
    (state) => state.candidateSubmission.jobId
  );

  const [formError, setFormError] = useState({
    contactNumber: "",
    currentCTC: "",
    expectedCTC: "",
    totalExperience: "",
    relevantExperience: "",
    noticePeriod: "",
    communicationSkills: "",
    requiredTechnologiesRating: "",
    resumeFile: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFormError((prev) => ({
        ...prev,
        resumeFile: "Please select a file.",
      }));
      dispatch(updateFormData({ resumeFile: null, resumeFilePath: "" }));
      return;
    }

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setFormError((prev) => ({
        ...prev,
        resumeFile: "Invalid file type. Only PDF and DOCX are allowed.",
      }));
      dispatch(updateFormData({ resumeFile: null, resumeFilePath: "" }));
      return;
    }

    setFormError((prev) => ({ ...prev, resumeFile: "" }));
    dispatch(updateFormData({ resumeFile: file, resumeFilePath: file.name }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Handle CTC fields
    if (name === "currentCTC" || name === "expectedCTC") {
      // Remove any existing "LPA" and trim
      updatedValue = value.replace(/\s*LPA\s*/g, "").trim();

      // Validate if it's a valid number
      if (updatedValue && !isNaN(updatedValue)) {
        updatedValue = `${updatedValue}`;
      }
    }
    if (
      name === "communicationSkills" ||
      name === "requiredTechnologiesRating"
    ) {
      if (!/^[1-5]?$/.test(value)) {
        setFormError((prev) => ({
          ...prev,
          [name]: "Please enter a number between 1 and 5.",
        }));
        return; // Prevent updating state with invalid value
      }
    }

    setFormError((prev) => ({
      ...prev,
      [name]: validateField(name, updatedValue),
    }));

    dispatch(updateFormData({ [name]: updatedValue }));
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "candidateEmailId":
        if (value && !/^[a-z0-9._%+-]+@gmail\.com$/.test(value.toLowerCase())) {
          error = "Please enter a valid Gmail address in lowercase.";
        }
        break;
      case "currentOrganization":
        if (value && value.length > 30) {
          error = "Organization name cannot be more than 15 characters.";
        }
        break;
      case "contactNumber":
        if (value && !/^\d{10}$/.test(value))
          error = "Contact number must be exactly 10 digits.";
        break;
      case "currentCTC":
      case "expectedCTC":
        const numValue = parseFloat(value.replace(/\s*LPA\s*/g, ""));
        if (value && (isNaN(numValue) || numValue < 0))
          error = "Please enter a valid CTC value.";
        break;
      case "totalExperience":
        if (value && value < 0) {
          error = "Total experience cannot be negative.";
        } else if (value && value > 50) {
          error = "Total experience cannot be more than 50 years.";
        }
        break;
      case "relevantExperience":
        if (value && value < 0) {
          error = "Relevant experience cannot be negative.";
        } else if (value && value > 50) {
          error = "Relevant experience cannot be more than 50 years.";
        }
        break;
      case "communicationSkills":
      case "requiredTechnologiesRating":
        if (value && (value < 1 || value > 5))
          error = "Rating must be between 1 and 5.";
        break;
      case "preferredLocation":
      case "currentLocation":
        if (value && value.length > 18) {
          error = "Location cannot be more than 18 characters.";
        } else if (value && !/^[A-Za-z\s]+$/.test(value)) {
          error = "Location can only contain letters and spaces.";
        }
        break;
      case "overallFeedback":
        if (value && value.length > 100) {
          error = "Feedback cannot be more than 100 characters.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for validation errors
    if (Object.values(formError).some((error) => error !== "")) {
      setAlert({
        open: true,
        message: "Please fix the errors before submitting the form.",
        severity: "error",
      });
      return;
    }

    // Prepare form data with properly formatted CTC values
    const submissionData = {
      ...formData,
      currentCTC: formData.currentCTC
        ? `${formData.currentCTC.replace(/\s*LPA\s*/g, "")} LPA`
        : "",
      expectedCTC: formData.expectedCTC
        ? `${formData.expectedCTC.replace(/\s*LPA\s*/g, "")} LPA`
        : "",
    };

    // Submit the form data, passing userId, jobId, and userEmail directly
    try {
      await dispatch(
        submitFormData({
          formData: submissionData, // Ensure no extra userId, jobId, or userEmail in formData
          userId,
          jobId,
          userEmail,
        })
      ).unwrap();
    } catch (error) {
      setAlert({
        open: true,
        message: error.message || "Failed to submit form",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    // Only dispatch if these values aren't already in form data
    if (!formData.userId || !formData.jobId || !formData.userEmail) {
      dispatch(updateFormData({ userId, jobId, userEmail }));
    }
  }, [userId, jobId, userEmail, dispatch, formData]);

  useEffect(() => {
    if (successMessage) {
      setAlert({
        open: true,
        message: `${successMessage} ${
          candidateId ? `Candidate ID: ${candidateId}` : ""
        } ${employeeId ? `Employee ID: ${employeeId}` : ""} ${
          submittedJobId ? `Job ID: ${submittedJobId}` : ""
        }`,
        severity: "success",
      });

      const timeoutId = setTimeout(() => {
        dispatch(clearMessages());
        dispatch(resetForm());
      }, 5000);

      return () => clearTimeout(timeoutId);
    }

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
  }, [
    successMessage,
    errorMessage,
    candidateId,
    employeeId,
    submittedJobId,
    dispatch,
  ]);

  const renderTextField = (name, label, options = {}) => (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={formData[name] || ""}
      onChange={handleChange}
      error={!!formError[name]}
      helperText={formError[name]}
      variant="outlined"
      margin="normal"
      {...options}
    />
  );

  const renderSelectDropdown = ({
    name,
    label,
    value,
    onChange,
    options,
    error,
  }) => (
    <FormControl fullWidth margin="normal" error={!!error}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        label={label}
      >
        {options.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );

  return (
    <Paper sx={{ padding: 2, maxWidth: 1200, position: "relative" }}>
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

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField("fullName", "Full Name", { required: true })}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField("candidateEmailId", "Candidate Email ID", {
              required: true,
              type: "email",
            })}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField("contactNumber", "Contact Number", {
              required: true,
            })}
          </Grid>

          {/* Professional Information */}
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField("currentOrganization", "Current Organization")}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField("qualification", "Qualification")}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField("totalExperience", "Total Experience (in years)", {
              type: "number",
              InputProps: {
                inputProps: {
                  min: 0,
                  max: 50,
                  step: 0.1, // Allows decimal steps
                },
              },
            })}
          </Grid>

          {/* Experience and CTC */}
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField(
              "relevantExperience",
              "Relevant Experience (in years)",
              {
                type: "number",
                InputProps: {
                  inputProps: {
                    min: 0,
                    max: 50,
                    step: 0.1, // Allows decimal steps
                  },
                },
              }
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField("currentCTC", "Current CTC", {
              type: "text",
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">LPA</InputAdornment>
                ),
              },
            })}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField("expectedCTC", "Expected CTC", {
              type: "text",
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">LPA</InputAdornment>
                ),
              },
            })}
          </Grid>

          {/* Location and Notice Period */}
          <Grid item xs={12} sm={6} md={4}>
            {renderSelectDropdown({
              name: "noticePeriod",
              label: "Notice Period",
              value: formData.noticePeriod,
              onChange: handleChange,
              options: [
                { value: "Immediate", label: "Immediate" },
                { value: "15 days", label: "15 days" },
                { value: "30 days", label: "30 days" },
                { value: "45 days", label: "45 days" },
                { value: "60 days", label: "60 days" },
              ],
              error: formError.noticePeriod,
            })}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField("currentLocation", "Current Location")}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField("preferredLocation", "Preferred Location")}
          </Grid>

          {/* Skills and Ratings */}
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField("skills", "Skills (comma-separated)")}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField(
              "communicationSkills",
              "Communication Skills Rating",
              {
                type: "number",
                InputProps: { inputProps: { min: 1, max: 5 } },
                error: !!formError.communicationSkills,
                helperText: formError.communicationSkills,
              }
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField(
              "requiredTechnologiesRating",
              "Required Technologies Rating",
              {
                type: "number",
                InputProps: { inputProps: { min: 1, max: 5 } },
                error: !!formError.requiredTechnologiesRating,
                helperText: formError.requiredTechnologiesRating,
              }
            )}
          </Grid>

          {/* Feedback and Resume */}
          <Grid item xs={12} sm={6} md={4}>
            {renderTextField("overallFeedback", "Overall Feedback", {
              multiline: true,
              rows: 2,
            })}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth error={!!formError.resumeFile}>
              <InputLabel
                shrink
                htmlFor="resume-file"
                sx={{
                  color: "primary.main", 
                  fontWeight: "bold", 
                  fontSize: "1.1rem", 
                  letterSpacing: "0.5px", 
                }}
              >
                Upload Resume
              </InputLabel>
              <Input
                id="resume-file"
                type="file"
                onChange={handleFileChange}
                inputProps={{ accept: ".pdf,.docx" }}
              />
              {formError.resumeFile && (
                <FormHelperText error>{formError.resumeFile}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              dispatch(resetForm());
              setFormError({}); // Clear form errors
            }}
            sx={{ minWidth: 120 }}
            disabled={loading}
          >
            Reset Form
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CandidateSubmissionForm;
