import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { INTERVIEW_LEVELS } from "./constants";

import dayjs from "dayjs"; // ✅ Use dayjs for easy date manipulation
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const EditInterviewDialog = ({ open, onClose, interview, onUpdate }) => {
  const [formData, setFormData] = useState({
    jobId: "",
    candidateId: "",
    candidateFullName: "",
    candidateContactNo: "",
    candidateEmailId: "",
    userEmail: "",
    userId: "",
    interviewDateTime: "",
    duration: "",
    zoomLink: "",
    interviewScheduledTimestamp: "",
    clientEmail: "",
    clientName: "",
    interviewLevel: "",
    interviewStatus: "",
    externalInterviewDetails: "", // Added field for External interviews
  });

  // Prepopulate fields when the interview changes
  useEffect(() => {
    if (interview) {
      setFormData(interview);
    }
  }, [interview]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "interviewDateTime") {
      const selectedDate = dayjs(value)
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      setFormData((prev) => ({
        ...prev,
        [name]: selectedDate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: "rgba(232, 245, 233)",
          padding: "5px",
          borderBottom: "1px solid #D0D5DD",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#0F1C46",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Edit Interview
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{
            color: "#0F1C46", // ✅ Matches Title Color
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" }, // ✅ Subtle Hover Effect
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          {/* Job ID (Disabled) */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Job ID"
              name="jobId"
              value={formData.jobId}
              fullWidth
              disabled
            />
          </Grid>
          {/* Candidate ID (Disabled) */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Candidate ID"
              name="candidateId"
              value={formData.candidateId}
              fullWidth
              disabled
            />
          </Grid>
          {/* Candidate Full Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Candidate Name"
              name="candidateFullName"
              value={formData.candidateFullName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Contact Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact Number"
              name="candidateContactNo"
              value={formData.candidateContactNo}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Candidate Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Candidate Email"
              name="candidateEmailId"
              value={formData.candidateEmailId}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Recruiter Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Recruiter Email"
              name="userEmail"
              value={formData.userEmail}
              fullWidth
              disabled
            />
          </Grid>
          {/* Interview Date & Time */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Interview Date & Time"
              type="datetime-local"
              name="interviewDateTime"
              value={
                formData.interviewDateTime
                  ? dayjs(formData.interviewDateTime)
                      .tz("Asia/Kolkata")
                      .format("YYYY-MM-DDTHH:mm") // ✅ Ensures correct format in input
                  : ""
              }
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Zoom Meeting Link */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Meeting Link"
              name="zoomLink"
              value={formData.zoomLink}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Interview Scheduled Timestamp (Disabled) */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Scheduled On"
              name="interviewScheduledTimestamp"
              value={formData.interviewScheduledTimestamp}
              fullWidth
              disabled
            />
          </Grid>
          {/* Client Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Client Email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Client Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Interview Level */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Interview Level"
              name="interviewLevel"
              value={formData.interviewLevel}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value={INTERVIEW_LEVELS.INTERNAL}>Internal</MenuItem>
              <MenuItem value={INTERVIEW_LEVELS.EXTERNAL}>External</MenuItem>
            </TextField>
          </Grid>
          {/* Interview Status */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Interview Status"
              name="interviewStatus"
              value={formData.interviewStatus}
              fullWidth
              disabled
            />
          </Grid>
          {/* External Interview Details - Show Only if External */}
          {formData.interviewLevel === INTERVIEW_LEVELS.EXTERNAL && (
            <Grid item xs={12}>
              <TextField
                label="External Interview Details"
                name="externalInterviewDetails"
                multiline
                rows={3}
                value={formData.externalInterviewDetails || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onUpdate(formData)}
        >
          Reschedule Interview
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditInterviewDialog;
