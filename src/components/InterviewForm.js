import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormField,
  resetForm,
  submitInterviewForm,
  clearError,
} from "../redux/features/interviewSheduleSlice";
import {
  Button,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Paper,
} from "@mui/material";
import { Check } from 'lucide-react';
import dayjs from "dayjs";

const InterviewForm = ({
  jobId,
  candidateId,
  candidateFullName,
  candidateContactNo,
  clientName,
  userId,
  candidateEmailId,
  userEmail,
  handleCloseInterviewDialog,
}) => {
  const dispatch = useDispatch();
  const { formData, isSubmitting, submissionSuccess, error, interviewResponse } = useSelector(
    (state) => state.interviewForm
  );

  const [dateError, setDateError] = useState("");
  const [formError, setFormError] = useState("");

  // Initialize form data
  useEffect(() => {
    dispatch(updateFormField({ name: "jobId", value: jobId }));
    dispatch(updateFormField({ name: "candidateId", value: candidateId }));
    dispatch(updateFormField({ name: "candidateFullName", value: candidateFullName }));
    dispatch(updateFormField({ name: "candidateContactNo", value: candidateContactNo }));
    dispatch(updateFormField({ name: "clientName", value: clientName }));
    dispatch(updateFormField({ name: "userId", value: userId }));
    dispatch(updateFormField({ name: "candidateEmailId", value: candidateEmailId }));
    dispatch(updateFormField({ name: "userEmail", value: userEmail }));
  }, [
    jobId,
    candidateId,
    candidateFullName,
    candidateContactNo,
    clientName,
    userId,
    userEmail,
    candidateEmailId,
    dispatch,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ name, value }));
    if (formError) setFormError("");
  };

  const handleDateTimeChange = (fieldName, newValue) => {
    const now = dayjs();

    if (newValue && !dayjs(newValue).isValid()) {
      setDateError("Please select a valid date and time.");
      return;
    }

    if (fieldName === "interviewDateTime") {
      if (newValue && dayjs(newValue).isBefore(now)) {
        setDateError("Interview date and time must be in the future.");
        return;
      }
      setDateError("");

      dispatch(updateFormField({ name: "interviewDateTime", value: newValue }));
      const timestamp = newValue ? dayjs(newValue).valueOf() : null;
      dispatch(updateFormField({ 
        name: "interviewScheduledTimestamp", 
        value: timestamp 
      }));
    }
  };

  const validateForm = () => {
    const requiredFields = {
      interviewDateTime: "Interview date and time",
      duration: "Duration",
      zoomLink: "Zoom link",
      interviewLevel: "Interview level",
      clientEmail: "Client email"
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        setFormError(`${label} is required`);
        return false;
      }
    }

    if (formData.interviewLevel === "External" && !formData.externalInterviewDetails) {
      setFormError("External interview details are required");
      return false;
    }

    if (dateError) {
      setFormError(dateError);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSubmit = {
      ...formData,
      interviewDateTime: dayjs(formData.interviewDateTime).format(),
    };

    dispatch(submitInterviewForm(formDataToSubmit));
  };

  // Auto close dialog on success
  useEffect(() => {
    if (submissionSuccess) {
      setTimeout(() => {
        handleCloseInterviewDialog();
        dispatch(resetForm());
      }, 3000);
    }
  }, [submissionSuccess, dispatch, handleCloseInterviewDialog]);

  const handleDialogClose = () => {
    dispatch(clearError());
    handleCloseInterviewDialog();
  };

  // Success Message Component
  const SuccessMessage = () => {
    if (!submissionSuccess || !interviewResponse) return null;

    return (
      <Paper elevation={0} sx={{ mb: 3, backgroundColor: '#f0fdf4', p: 2 }}>
        <Alert 
          icon={<Check className="h-5 w-5" />}
          severity="success"
          sx={{ mb: 2 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Interview scheduled successfully and email notifications sent.
          </Typography>
        </Alert>
        
        <Box sx={{ px: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Notifications sent to:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Candidate ID:</strong> {interviewResponse.candidateId}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>User Email:</strong> {interviewResponse.userEmail}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Candidate Email:</strong> {interviewResponse.emailId}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Client Email:</strong> {interviewResponse.clientEmail}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    );
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: "100%",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <SuccessMessage />
      
      {(error || formError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || formError}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Read-only Fields */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Job ID"
            name="jobId"
            value={formData.jobId || ""}
            onChange={handleChange}
            fullWidth
            disabled
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Candidate ID"
            name="candidateId"
            value={formData.candidateId || ""}
            onChange={handleChange}
            fullWidth
            disabled
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Candidate Name"
            name="candidateFullName"
            value={formData.candidateFullName || ""}
            onChange={handleChange}
            fullWidth
            disabled
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Contact Number"
            name="candidateContactNo"
            value={formData.candidateContactNo || ""}
            onChange={handleChange}
            fullWidth
            disabled
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Candidate Email"
            name="candidateEmailId"
            value={formData.candidateEmailId || ""}
            onChange={handleChange}
            fullWidth
            disabled
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="User Email"
            name="userEmail"
            value={formData.userEmail || ""}
            onChange={handleChange}
            fullWidth
            disabled
            variant="filled"
          />
        </Grid>

        {/* Editable Fields */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Client Name"
            name="clientName"
            value={formData.clientName || ""}
            onChange={handleChange}
            fullWidth
            required
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Client Email"
            name="clientEmail"
            type="email"
            value={formData.clientEmail || ""}
            onChange={handleChange}
            fullWidth
            required
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Interview Date & Time"
            name="interviewDateTime"
            type="datetime-local"
            value={formData.interviewDateTime || ""}
            onChange={(e) => handleDateTimeChange("interviewDateTime", e.target.value)}
            fullWidth
            required
            variant="filled"
            InputLabelProps={{ shrink: true }}
            error={!!dateError}
            helperText={dateError}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Duration (Minutes)"
            name="duration"
            type="number"
            value={formData.duration || ""}
            onChange={handleChange}
            fullWidth
            required
            variant="filled"
            inputProps={{ min: 15, step: 15 }}
            helperText="Minimum 15 minutes"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Zoom Link"
            name="zoomLink"
            value={formData.zoomLink || ""}
            onChange={handleChange}
            fullWidth
            required
            variant="filled"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset" required>
            <FormLabel component="legend">Interview Level</FormLabel>
            <RadioGroup
              row
              name="interviewLevel"
              value={formData.interviewLevel || ""}
              onChange={handleChange}
            >
              <FormControlLabel
                value="Internal"
                control={<Radio />}
                label="Internal"
              />
              <FormControlLabel
                value="External"
                control={<Radio />}
                label="External"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {formData.interviewLevel === "External" && (
          <Grid item xs={12}>
            <TextField
              label="External Interview Details"
              name="externalInterviewDetails"
              value={formData.externalInterviewDetails || ""}
              onChange={handleChange}
              fullWidth
              required
              variant="filled"
              multiline
              rows={3}
            />
          </Grid>
        )}
      </Grid>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? "Scheduling..." : "Schedule Interview"}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleDialogClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default InterviewForm;