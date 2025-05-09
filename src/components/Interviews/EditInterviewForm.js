import React, { useState } from "react";
import { Box, Typography, Alert, Snackbar, IconButton, Divider, Stack } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import DynamicForm from "../FormContainer/DynamicForm";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { Check } from "lucide-react";
import httpService from "../../Services/httpService";


const EditInterviewForm = ({ data, onClose, onSuccess }) => {
  console.log(data);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { userId, email } = useSelector((state) => state.auth);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [interviewResponse, setInterviewResponse] = useState(null);
  const isReschedule = data?.isReschedule || false;

  // Prepare initial values for form
  const getInitialValues = () => {
    if (!data) return {};

    let dateTimeValue = "";
    if (data.interviewDateTime) {
      const date = new Date(data.interviewDateTime);
      dateTimeValue = date.toISOString().slice(0, 16);
    }

    // If rescheduling, we set status to RESCHEDULED
    const status = isReschedule
      ? "SCHEDULED"
      : data.latestInterviewStatus || "SCHEDULED";

    const initialValues = {
      candidateId: data.candidateId || "",
      clientEmail: data.clientEmail || [],
      clientName: data.clientName || "",
      duration: data.duration || 30,
      externalInterviewDetails: data.externalInterviewDetails || "",
      fullName: data.fullName || data.candidateFullName || "",
      interviewDateTime: isReschedule ? "" : dateTimeValue,
      interviewLevel: data.interviewLevel || "INTERNAL",
      interviewStatus: status,
      jobId: data.jobId || "",
      skipNotification: data.skipNotification || false,
      userId: data.userId || userId || "",
      userEmail: data.email||email || "",
      zoomLink: data.zoomLink || "",
      candidateEmailId: data.emailId || data.candidateEmailId || "",
      contactNumber: data.contactNumber || data.candidateContactNo || "",
    };

    return initialValues;
  };

  // Define field configurations for the dynamic form
  const getFormFields = (values) => {
    const commonGridProps = { xs: 12, md: 6, lg: 6, xl: 4 };
  
    if (!isReschedule) {
      return [
        {
          name: "sectionStatus",
          type: "section",
          label: "Update Interview Status",
          gridProps: { xs: 12 },
        },
        {
          name: "interviewStatus",
          label: "Interview Status",
          type: "select",
          required: true,
          options: [
            { value: "SCHEDULED", label: "Scheduled" },
            { value: "RESCHEDULED", label: "Rescheduled" },
            { value: "REJECTED", label: "Rejected" },
            { value: "CANCELLED", label: "Cancelled" },
            { value: "NO_SHOW", label: "No Show / Not Attended" },
            { value: "SELECTED", label: "Selected" },
            { value: "PLACED", label: "Placed" },
          ],
          gridProps: commonGridProps,
        },
        {
          name: "interviewLevel",
          label: "Interview Level",
          type: "select",
          required: true,
          options: [
            { value: "INTERNAL", label: "INTERNAL" },
            { value: "EXTERNAL", label: "EXTERNAL" },
            { value: "EXTERNAL-L1", label: "EXTERNAL-L1" },
            { value: "EXTERNAL-L2", label: "EXTERNAL-L2" },
            { value: "FINAL", label: "FINAL" },
          ],
          disabled: true,
          gridProps: commonGridProps,
        },
        {
          name: "skipNotification",
          label: "Skip Email Notification",
          type: "checkbox",
          description: "Check this box to skip sending email notifications",
          gridProps: { xs: 12 },
        },
      ];
    } else {
      return [
        {
          name: "sectionReschedule",
          type: "section",
          label: "Reschedule Interview",
          gridProps: { xs: 12 },
        },
        {
          name: "interviewDateTime",
          label: "New Interview Date & Time",
          type: "datetime",
          required: true,
          gridProps: commonGridProps,
        },
        {
          name: "duration",
          label: "Duration (minutes)",
          type: "select",
          required: true,
          options: [
            { value: 15, label: "15 minutes" },
            { value: 30, label: "30 minutes" },
            { value: 45, label: "45 minutes" },
            { value: 60, label: "60 minutes" },
          ],
          gridProps: commonGridProps,
        },
        {
          name: "interviewLevel",
          label: "Interview Level",
          type: "select",
          required: true,
          options: [
            { value: "INTERNAL", label: "INTERNAL" },
            { value: "EXTERNAL", label: "EXTERNAL" },
            { value: "EXTERNAL-L1", label: "EXTERNAL-L1" },
            { value: "EXTERNAL-L2", label: "EXTERNAL-L2" },
            { value: "FINAL", label: "FINAL" },
          ],
          // disabled: true, // Disable interview level field
          gridProps: commonGridProps,
        },
        {
          name: "zoomLink",
          label: "Meeting Link",
          type: "text",
          placeholder: "https://zoom.us/j/example",
          gridProps: commonGridProps,
        },
        {
          name: "skipNotification",
          label: "Skip Email Notification",
          type: "checkbox",
          description: "Check this box to skip sending email notifications",
          gridProps: { xs: 12 },
        },
      ];
    }
  };
  

  // Validation schema - simplified for edit mode
  const validationSchema = () => {
    // Interview level is no longer part of validation since it's disabled
    const baseSchema = {
      interviewStatus: Yup.string()
        .required("Interview status is required")
        .oneOf(
          [
            "SCHEDULED",
            "RESCHEDULED",
            "REJECTED",
            "CANCELLED",
            "NO_SHOW",
            "SELECTED",
            "PLACED",
          ],
          "Invalid interview status"
        ),
      skipNotification: Yup.boolean(),
    };

    // For reschedule mode, add date/time validation
    if (isReschedule) {
      // Define one month ago for validation
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      return Yup.object().shape({
        ...baseSchema,
        interviewDateTime: Yup.date()
          .required("New interview date and time is required")
          .min(
            oneMonthAgo,
            "Interview date must be within the last month or in the future"
          ),
        duration: Yup.number()
          .required("Duration is required")
          .min(15, "Duration must be at least 15 minutes")
          .max(60, "Duration cannot exceed 60 minutes"),
        zoomLink: Yup.string().nullable(),
      });
    }

    return Yup.object().shape(baseSchema);
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
  
      const payload = {
        ...data,
        interviewLevel: values.interviewLevel, // Use original interview level value
        interviewStatus: values.interviewStatus,
        skipNotification: values.skipNotification,
        userId: data.userId,
        userEmail: data.userEmail,
        ...(isReschedule && {
          interviewDateTime: dayjs(values.interviewDateTime).utc().format(),
          interviewScheduledTimestamp: dayjs(values.interviewDateTime).valueOf(),
          duration: values.duration,
          zoomLink: values.zoomLink,
        }),
      };
  
      const url = `/candidate/interview-update/${data.userId || userId}/${data.candidateId}/${data.jobId}`;
      const responseData = await httpService.put(url, payload);
  
      setInterviewResponse(responseData);
      setSubmissionSuccess(true);
      setNotification({
        open: true,
        message: isReschedule
          ? "Interview rescheduled successfully"
          : "Interview updated successfully",
        severity: "success",
      });
  
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose(true);
      }, 2000);
    } catch (error) {
      console.error("Error updating interview:", error);
      setNotification({
        open: true,
        message: `Error ${
          isReschedule ? "rescheduling" : "updating"
        } interview: ${error.message || "Unknown error"}`,
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  

  const SuccessMessage = () => {
    if (!submissionSuccess || !interviewResponse) return null;

    return (
      <Alert icon={<Check />} severity="success" sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          Interview {isReschedule ? "rescheduled" : "updated"} for{" "}
          <strong>Candidate ID:</strong> {interviewResponse.candidateId}{" "}
          successfully.
        </Typography>
      </Alert>
    );
  };

  const initialValues = getInitialValues();

  return (
    <Box sx={{ width: "100%", p: { xs: 1, sm: 2 }, overflow: "auto" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" color="primary" fontWeight="medium">
          {isReschedule ? "Reschedule Interview" : "Update Interview Status"}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Display candidate info as read-only */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          bgcolor: "#ffffff",
          borderRadius: 3,
          boxShadow: "0px 2px 10px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
          },
        }}
      >
        <Typography
          variant="subtitle1"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Candidate Information
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1.2}>
          <Typography variant="body1">
            <strong>Name:</strong>{" "}
            <span style={{ fontWeight: 500 }}>
              {data.fullName || data.candidateFullName}
            </span>
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Email:</strong>{" "}
            <span style={{ fontWeight: 500 }}>
              {data.emailId || data.candidateEmailId}
            </span>
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Job ID:</strong>{" "}
            <span style={{ fontWeight: 500 }}>{data.jobId}</span>
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Client:</strong>{" "}
            <span style={{ fontWeight: 500 }}>{data.clientName}</span>
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Interview Level:</strong>{" "}
            <span style={{ fontWeight: 500 }}>{data.interviewLevel}</span>
          </Typography>

          {!isReschedule && data.interviewDateTime && (
            <Typography variant="body2" color="text.secondary">
              <strong>Scheduled:</strong>{" "}
              <span style={{ fontWeight: 500 }}>
                {new Date(data.interviewDateTime).toLocaleString()}
              </span>
            </Typography>
          )}
        </Stack>
      </Box>

      <SuccessMessage />

      <DynamicForm
        fields={getFormFields(initialValues)}
        initialValues={initialValues}
        validationSchema={validationSchema()}
        onSubmit={handleSubmit}
        submitButtonText={isReschedule ? "Reschedule" : "Update Status"}
        cancelButtonText="Cancel"
        onCancel={onClose}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "80%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditInterviewForm;