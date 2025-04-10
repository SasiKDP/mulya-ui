import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  IconButton,
  Divider,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import httpService from "../../Services/httpService";

const ScheduleInterviewForm = ({ data, onClose, mode = "create" }) => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({
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
    interviewStatus: mode === "edit" ? (data?.interviewStatus || "SCHEDULED") : "SCHEDULED"
  });

  const interviewLevels = [
    "INTERNAL",
    "EXTERNAL",
    "TECHNICAL",
    "HR",
    "MANAGERIAL",
    "FINAL",
  ];

  const interviewStatuses = [
    "SCHEDULED",
    "COMPLETED",
    "CANCELLED",
    "RESCHEDULED"
  ];

  // Initialize form when data or mode changes
  useEffect(() => {
    if (data) {
      // Format datetime for the input field
      let dateTimeValue = "";
      if (data.interviewDateTime) {
        const date = new Date(data.interviewDateTime);
        dateTimeValue = date.toISOString().slice(0, 16);
      }

      setFormData({
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
      });
    }
  }, [data, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.interviewDateTime) {
      setNotification({
        open: true, 
        message: "Please select an interview date and time", 
        severity: "error"
      });
      return;
    }
  
    try {
      setLoading(true);
      
      // Prepare the payload according to your API requirements
      const payload = {
        interviewDateTime: new Date(formData.interviewDateTime).toISOString(),
        duration: formData.duration,
        zoomLink: formData.zoomLink,
        interviewLevel: formData.interviewLevel,
        interviewStatus: formData.interviewStatus,
        clientEmail: formData.clientEmail,
        clientName: formData.clientName,
        jobId: formData.jobId,
        userEmail: formData.userEmail
      };
  
      if (mode === "edit") {
        // Use PUT method with the correct endpoint structure
        const response = await httpService.put(
          `/candidate/interview-update/${formData.userId}/${formData.candidateId}`,
          payload
        );
        
        setNotification({
          open: true, 
          message: "Interview updated successfully", 
          severity: "success"
        });
        
       
      } else {
        // Original create logic
        const response = await httpService.post(
          `/candidate/interview-schedule/${formData.userId}`,
          payload
        );
        setNotification({
          open: true, 
          message: "Interview scheduled successfully", 
          severity: "success"
        });
      }
      
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error("Error with interview:", error);
      setNotification({
        open: true, 
        message: `Error ${mode === "edit" ? "updating" : "scheduling"} interview: ${error.response?.data?.message || error.message}`, 
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ width: "100%", p: { xs: 1, sm: 2 } }}>
      <Typography variant="h6" color="primary" gutterBottom>
        {mode === "edit" ? "Update Interview" : "Schedule Interview"}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        {/* Candidate Information Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="medium" color="text.secondary" gutterBottom>
            Candidate Information
          </Typography>
        </Grid>
        
        {[
          {
            label: "Candidate ID",
            value: formData.candidateId,
            name: "candidateId",
            disabled: true,
            xs: 12,
            sm: 6,
          },
          {
            label: "Candidate Name",
            value: formData.candidateFullName,
            name: "candidateFullName",
            disabled: true,
            xs: 12,
            sm: 6,
          },
          {
            label: "Candidate Email",
            value: formData.candidateEmailId,
            name: "candidateEmailId",
            disabled: true,
            xs: 12,
            sm: 6,
          },
          {
            label: "Candidate Contact",
            value: formData.candidateContactNo,
            name: "candidateContactNo",
            disabled: true,
            xs: 12,
            sm: 6,
          },
        ].map(({ label, value, name, disabled = false, xs, sm }, i) => (
          <Grid item xs={xs} sm={sm} key={i}>
            <TextField
              fullWidth
              label={label}
              name={name}
              value={value}
              onChange={handleChange}
              disabled={disabled}
              size="small"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        ))}

        <Grid item xs={12} sx={{ mt: 1 }}>
          <Divider />
        </Grid>

        {/* Job and Client Information */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="medium" color="text.secondary" gutterBottom>
            Job Information
          </Typography>
        </Grid>
        
        {[
          {
            label: "Job ID",
            value: formData.jobId,
            name: "jobId",
            disabled: true,
            xs: 12,
            sm: 6,
          },
          {
            label: "Client Name",
            value: formData.clientName,
            name: "clientName",
            xs: 12,
            sm: 6,
          },
          {
            label: "Client Email",
            value: formData.clientEmail,
            name: "clientEmail",
            xs: 12,
            sm: 6,
          },
        ].map(({ label, value, name, disabled = false, xs, sm }, i) => (
          <Grid item xs={xs} sm={sm} key={i}>
            <TextField
              fullWidth
              label={label}
              name={name}
              value={value}
              onChange={handleChange}
              disabled={disabled}
              size="small"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        ))}

        <Grid item xs={12} sx={{ mt: 1 }}>
          <Divider />
        </Grid>

        {/* Interview Details */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="medium" color="text.secondary" gutterBottom>
            Interview Details
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Interview Date & Time"
            name="interviewDateTime"
            type="datetime-local"
            value={formData.interviewDateTime}
            onChange={handleChange}
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            error={!formData.interviewDateTime}
            helperText={!formData.interviewDateTime ? "Required" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            size="small"
            variant="outlined"
            InputProps={{ inputProps: { min: 15, step: 15 } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Interview Level"
            name="interviewLevel"
            select
            value={formData.interviewLevel}
            onChange={handleChange}
            size="small"
            variant="outlined"
          >
            {interviewLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {mode === "edit" && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Interview Status"
              name="interviewStatus"
              select
              value={formData.interviewStatus}
              onChange={handleChange}
              size="small"
              variant="outlined"
            >
              {interviewStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}

        {formData.interviewLevel === "EXTERNAL" && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="External Interview Details"
              name="externalInterviewDetails"
              value={formData.externalInterviewDetails}
              onChange={handleChange}
              size="small"
              variant="outlined"
              multiline
              rows={2}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Meeting Link"
            name="zoomLink"
            value={formData.zoomLink}
            onChange={handleChange}
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
        >
          <Button 
            variant="outlined" 
            color="error" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading && <CircularProgress size={16} color="inherit" />}
          >
            {mode === "edit" ? "Update" : "Schedule"}
          </Button>
        </Grid>
      </Grid>

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