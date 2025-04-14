import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import { Close as CloseIcon, Check } from "@mui/icons-material";
import httpService from "../../Services/httpService";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";


const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

// Validation Schema
const validationSchema = Yup.object().shape({
  jobId: Yup.string().required("Job ID is required"),
  candidateId: Yup.string().required("Candidate ID is required"),
  candidateFullName: Yup.string().required("Candidate name is required"),
  candidateContactNo: Yup.string().required("Contact number is required"),
  candidateEmailId: Yup.string()
    .email("Invalid email format")
    .required("Candidate email is required"),
  userEmail: Yup.string()
    .email("Invalid email format")
    .required("User email is required"),
  clientName: Yup.string().required("Client name is required"),
  clientEmail: Yup.string().email("Invalid email format").nullable(),
  interviewDateTime: Yup.date()
    .required("Interview date and time is required")
    .min(oneMonthAgo, "Interview date and time must be within the last month or in the future"),
  duration: Yup.number()
    .required("Duration is required")
    .min(15, "Duration must be at least 15 minutes")
    .max(60, "Duration cannot exceed 60 minutes"),
  zoomLink: Yup.string().nullable(),
  interviewLevel: Yup.string()
    .required("Interview level is required")
    .oneOf(["INTERNAL", "EXTERNAL", "EXTERNAL-L1", "EXTERNAL-L2", "FINAL"], "Invalid interview level"),
  externalInterviewDetails: Yup.string().nullable(),
  interviewStatus: Yup.string().nullable()
});

const ScheduleInterviewForm = ({ data, onClose, mode = "create" }) => {
  const [notification, setNotification] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });
  
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [interviewResponse, setInterviewResponse] = useState(null);

  const interviewLevels = [
    "INTERNAL",
    "EXTERNAL",
    "EXTERNAL-L1",
    "EXTERNAL-L2",
    "FINAL",
  ];

  const interviewStatuses = [
    "SCHEDULED",
    "RESCHEDULED",
    'REJECTED',
    "CANCELLED",
    "SELECTED",
    'PLACED'
  ];

  // Prepare initial values for Formik
  const getInitialValues = () => {
    if (data) {
      let dateTimeValue = "";
      if (data.interviewDateTime) {
        // Format date to work with input type datetime-local
        const date = new Date(data.interviewDateTime);
        dateTimeValue = date.toISOString().slice(0, 16);
      }

      return {
        candidateContactNo: data.contactNumber || data.candidateContactNo || "",
        candidateEmailId: data.emailId || data.candidateEmailId || "",
        candidateFullName: data.fullName || data.candidateFullName || "",
        candidateId: data.candidateId || "",
        clientEmail: data.clientEmail || "",
        clientName: data.clientName || "",
        duration: data.duration || 30,
        externalInterviewDetails: data.externalInterviewDetails || "",
        interviewDateTime: dateTimeValue,
        interviewLevel: data.interviewLevel || "INTERNAL",
        interviewScheduledTimestamp: data.interviewScheduledTimestamp || "",
        jobId: data.jobId || "",
        userEmail: data.userEmail || "",
        userId: data.userId || "",
        zoomLink: data.zoomLink || "",
        interviewStatus: data.interviewStatus || "SCHEDULED"
      };
    }
    
    // Default values if no data is provided
    return {
      candidateContactNo: "",
      candidateEmailId: "",
      candidateFullName: "",
      candidateId: "",
      clientEmail: "",
      clientName: "",
      duration: 30,
      externalInterviewDetails: "",
      interviewDateTime: "",
      interviewLevel: "INTERNAL",
      interviewScheduledTimestamp: "",
      jobId: "",
      userEmail: "",
      userId: "",
      zoomLink: "",
      interviewStatus: "SCHEDULED"
    };
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      
      // Format values for API
      const payload = {
        candidateId: values.candidateId,
        candidateEmailId: values.candidateEmailId,
        candidateFullName: values.candidateFullName,
        candidateContactNo: values.candidateContactNo,
        interviewDateTime: dayjs(values.interviewDateTime).format(),
        interviewScheduledTimestamp: dayjs(values.interviewDateTime).valueOf(),
        duration: values.duration,
        zoomLink: values.zoomLink,
        interviewLevel: values.interviewLevel,
        interviewStatus: values.interviewStatus,
        clientEmail: values.clientEmail,
        clientName: values.clientName,
        jobId: values.jobId,
        userEmail: values.userEmail,
        userId: values.userId,
        externalInterviewDetails: values.externalInterviewDetails
      };

      let response;
      if (mode === "edit") {
        response = await httpService.put(
          `/candidate/interview-update/${values.userId}/${values.candidateId}`,
          payload
        );
      } else {
        response = await httpService.post(
          `/candidate/interview-schedule/${values.userId}`,
          payload
        );
      }
      
      setInterviewResponse(response.data);
      setSubmissionSuccess(true);
      setNotification({
        open: true, 
        message: mode === "edit" 
          ? "Interview updated successfully" 
          : "Interview scheduled successfully", 
        severity: "success"
      });
      
      // Close form after success
      setTimeout(() => onClose(true), 3000);
    } catch (error) {
      console.error("Error with interview:", error);
      setNotification({
        open: true, 
        message: `Error ${mode === "edit" ? "updating" : "scheduling"} interview: ${
          error.response?.data?.message || error.message
        }`, 
        severity: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Success Message Component
  const SuccessMessage = () => {
    if (!submissionSuccess || !interviewResponse) return null;

    return (
      <Paper elevation={0} sx={{ mb: 3, backgroundColor: "#f0fdf4", p: 2 }}>
        <Alert
          icon={<Check />}
          severity="success"
          sx={{ mb: 2 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Interview {mode === "edit" ? "updated" : "scheduled"} for <strong>Candidate ID:</strong>{" "}
            {interviewResponse.candidateId} successfully and email notifications
            sent.
          </Typography>
        </Alert>
      </Paper>
    );
  };

  return (
    <Box sx={{ width: "100%", p: { xs: 1, sm: 2 }, maxHeight: "80vh", overflow: "auto" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" color="primary">
          {mode === "edit" ? "Update Interview" : "Schedule Interview"}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      
      <SuccessMessage />
      
      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            {/* Candidate Information Section */}
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
                Candidate Information
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="candidateId"
                    as={TextField}
                    label="Candidate ID"
                    fullWidth
                    disabled={mode === "edit"}
                    size="small"
                    error={touched.candidateId && Boolean(errors.candidateId)}
                    helperText={touched.candidateId && errors.candidateId}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="candidateFullName"
                    as={TextField}
                    label="Candidate Name"
                    fullWidth
                    disabled={mode === "edit"}
                    size="small"
                    error={touched.candidateFullName && Boolean(errors.candidateFullName)}
                    helperText={touched.candidateFullName && errors.candidateFullName}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="candidateEmailId"
                    as={TextField}
                    label="Candidate Email"
                    fullWidth
                    disabled={mode === "edit"}
                    size="small"
                    error={touched.candidateEmailId && Boolean(errors.candidateEmailId)}
                    helperText={touched.candidateEmailId && errors.candidateEmailId}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="candidateContactNo"
                    as={TextField}
                    label="Candidate Contact"
                    fullWidth
                    disabled={mode === "edit"}
                    size="small"
                    error={touched.candidateContactNo && Boolean(errors.candidateContactNo)}
                    helperText={touched.candidateContactNo && errors.candidateContactNo}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="userEmail"
                    as={TextField}
                    label="User Email"
                    fullWidth
                    disabled={mode === "edit"}
                    size="small"
                    error={touched.userEmail && Boolean(errors.userEmail)}
                    helperText={touched.userEmail && errors.userEmail}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="jobId"
                    as={TextField}
                    label="Job ID"
                    fullWidth
                    disabled={mode === "edit"}
                    size="small"
                    error={touched.jobId && Boolean(errors.jobId)}
                    helperText={touched.jobId && errors.jobId}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Job and Client Information */}
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
                Client Information
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                 
                    <Field
                      name="clientName"
                      as={TextField}
                      label="Client Name"
                      fullWidth
                      size="small"
                      error={touched.clientName && Boolean(errors.clientName)}
                      helperText={touched.clientName && errors.clientName}
                    />
                  
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    name="clientEmail"
                    as={TextField}
                    label="Client Email"
                    fullWidth
                    size="small"
                    error={touched.clientEmail && Boolean(errors.clientEmail)}
                    helperText={touched.clientEmail && errors.clientEmail}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Interview Details */}
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
                Interview Details
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="interviewDateTime"
                    as={TextField}
                    label="Interview Date & Time"
                    type="datetime-local"
                    fullWidth
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    error={touched.interviewDateTime && Boolean(errors.interviewDateTime)}
                    helperText={touched.interviewDateTime && errors.interviewDateTime}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="duration"
                    as={TextField}
                    label="Duration (minutes)"
                    type="number"
                    fullWidth
                    size="small"
                    InputProps={{ inputProps: { min: 15, max: 60, step: 15 } }}
                    error={touched.duration && Boolean(errors.duration)}
                    helperText={touched.duration && errors.duration}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="zoomLink"
                    as={TextField}
                    label="Meeting Link"
                    fullWidth
                    size="small"
                    error={touched.zoomLink && Boolean(errors.zoomLink)}
                    helperText={touched.zoomLink && errors.zoomLink}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset" required>
                    <FormLabel component="legend">Interview Level</FormLabel>
                    <Field name="interviewLevel">
                      {({ field }) => (
                        <RadioGroup 
                          {...field} 
                          row
                          onChange={(e) => {
                            setFieldValue("interviewLevel", e.target.value);
                            if (!e.target.value.includes("EXTERNAL")) {
                              setFieldValue("externalInterviewDetails", "");
                            }
                          }}
                        >
                          {interviewLevels.map(level => (
                            <FormControlLabel
                              key={level}
                              value={level}
                              control={<Radio />}
                              label={level}
                            />
                          ))}
                        </RadioGroup>
                      )}
                    </Field>
                  </FormControl>
                </Grid>

                {mode === "edit" && (
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Interview Status</FormLabel>
                      <Field name="interviewStatus">
                        {({ field }) => (
                          <RadioGroup {...field} row>
                            {interviewStatuses.map(status => (
                              <FormControlLabel
                                key={status}
                                value={status}
                                control={<Radio />}
                                label={status}
                              />
                            ))}
                          </RadioGroup>
                        )}
                      </Field>
                    </FormControl>
                  </Grid>
                )}

                {values.interviewLevel.includes("EXTERNAL") && (
                  <Grid item xs={12}>
                    <Field
                      name="externalInterviewDetails"
                      as={TextField}
                      label="External Interview Details"
                      multiline
                      rows={3}
                      fullWidth
                      size="small"
                      error={touched.externalInterviewDetails && Boolean(errors.externalInterviewDetails)}
                      helperText={touched.externalInterviewDetails && errors.externalInterviewDetails}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="contained" 
                color="primary" 
                disabled={isSubmitting}
                startIcon={isSubmitting && <CircularProgress size={16} color="inherit" />}
              >
                {mode === "edit" ? "Update" : "Schedule"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ScheduleInterviewForm;