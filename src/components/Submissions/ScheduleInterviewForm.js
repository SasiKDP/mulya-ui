import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import httpService from "../../Services/httpService";
import DynamicForm from "../FormContainer/DynamicForm";
import * as Yup from "yup";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSelector } from "react-redux";
import { Check } from "lucide-react";

dayjs.extend(utc); // extend dayjs with utc plugin

const ScheduleInterviewForm = ({ data, onClose, onSuccess }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { userId, email } = useSelector((state) => state.auth);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [interviewResponse, setInterviewResponse] = useState(null);
  const [coordinators, setCoordinators] = useState([]);

  // Define one month ago for validation
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const res = await httpService.get("/users/employee?roleName=COORDINATOR");
        const formatted = res.data.map((emp) => ({
          value: emp.employeeId,
          label: emp.userName,
        }));
        setCoordinators(formatted);
      } catch (err) {
        console.error("Failed to fetch coordinators", err);
      }
    };

    fetchCoordinators();
  }, []);

  const getInitialValues = () => {
    if (data) {
      let dateTimeValue = "";
      if (data.interviewDateTime) {
        const date = new Date(data.interviewDateTime);
        const utcYear = date.getUTCFullYear();
        const utcMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
        const utcDay = String(date.getUTCDate()).padStart(2, "0");
        const utcHour = String(date.getUTCHours()).padStart(2, "0");
        const utcMinute = String(date.getUTCMinutes()).padStart(2, "0");
        dateTimeValue = `${utcYear}-${utcMonth}-${utcDay}T${utcHour}:${utcMinute}:00+00:00`;
      }

      return {
        contactNumber: data.contactNumber || data.candidateContactNo || "",
        candidateEmailId: data.emailId || data.candidateEmailId || "",
        fullName: data.fullName || data.candidateFullName || "",
        candidateId: data.candidateId || "",
        clientEmail: data.clientEmail || [],
        clientName: data.clientName || "",
        duration: data.duration || 30,
        externalInterviewDetails: data.externalInterviewDetails || "",
        interviewDateTime: dateTimeValue,
        interviewLevel: data.interviewLevel || "INTERNAL",
        jobId: data.jobId || "",
        userEmail: email || "",
        userId: data.userId || userId || "",
        zoomLink: data.zoomLink || "",
        interviewStatus: "SCHEDULED",
        skipNotification: data?.skipNotification || false,
        coordinator: data?.coordinator || "",
      };
    }

    return {
      contactNumber: "",
      candidateEmailId: "",
      fullName: "",
      candidateId: "",
      clientEmail: [],
      clientName: "",
      duration: 30,
      externalInterviewDetails: "",
      interviewDateTime: "",
      interviewLevel: "INTERNAL",
      jobId: "",
      userEmail: email || "",
      userId: userId || "",
      zoomLink: "",
      interviewStatus: "SCHEDULED",
      skipNotification: false,
      coordinator: "",
    };
  };

  const getFormFields = (values) => {
    const fields = [
      {
        name: "sectionCandidate",
        type: "divider",
        label: "Candidate Information",
        gridProps: { xs: 12 },
      },
      {
        name: "candidateId",
        label: "Candidate ID",
        type: "text",
        required: true,
        disabled: true,
        gridProps: { xs: 12, sm: 6 },
      },
      {
        name: "fullName",
        label: "Candidate Name",
        type: "text",
        required: true,
        disabled: true,
        gridProps: { xs: 12, sm: 6 },
      },
      {
        name: "candidateEmailId",
        label: "Candidate Email",
        type: "email",
        required: true,
        disabled: true,
        gridProps: { xs: 12, sm: 6 },
      },
      {
        name: "contactNumber",
        label: "Candidate Contact",
        type: "text",
        required: true,
        disabled: true,
        gridProps: { xs: 12, sm: 6 },
      },
      {
        name: "userEmail",
        label: "User Email",
        type: "email",
        required: true,
        disabled: true,
        gridProps: { xs: 12, sm: 6 },
      },
      {
        name: "jobId",
        label: "Job ID",
        type: "text",
        required: true,
        disabled: true,
        gridProps: { xs: 12, sm: 6 },
      },
      {
        name: "sectionClient",
        type: "divider",
        label: "Client Information",
        gridProps: { xs: 12 },
      },
      {
        name: "clientName",
        label: "Client Name",
        type: "text",
        required: true,
        disabled: true,
        gridProps: { xs: 12, sm: 6 },
      },
      {
        name: "clientEmail",
        label: "Client Email",
        type: "chipInput",
        description: "Enter client email addresses and press Enter after each",
        gridProps: { xs: 12, sm: 6 },
      },
      {
        name: "sectionInterview",
        type: "divider",
        label: "Interview Details",
        gridProps: { xs: 12 },
      },
      {
        name: "interviewDateTime",
        label: "Interview Date & Time",
        type: "datetime",
        required: true,
        gridProps: { xs: 12, sm: 6 },
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
        gridProps: { xs: 12, sm: 6 },
      },
      {
        name: "zoomLink",
        label: "Meeting Link",
        type: "text",
        placeholder: "https://zoom.us/j/example",
        gridProps: { xs: 12 },
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
        gridProps: { xs: 12, sm: values?.interviewLevel === "INTERNAL" ? 6 : 12 },
      },
      ...(values?.interviewLevel === "INTERNAL"
        ? [
            {
              name: "coordinator",
              label: "Coordinator",
              type: "select",
              required: false,
              options: coordinators,
              gridProps: { xs: 12, sm: 6 },
            },
          ]
        : []),
      {
        name: "externalInterviewDetails",
        label: "Interview Details / Notes",
        type: "textarea",
        rows: 4,
        placeholder: "Add further interview details, requirements, or any other important notes",
        gridProps: { xs: 12 },
      },
      {
        name: "skipNotification",
        label: "Skip Email Notification",
        type: "checkbox",
        description: "Check this box to skip sending email notifications",
        gridProps: { xs: 12 },
      },
    ];

    return fields;
  };

  const validationSchema = Yup.object().shape({
    candidateId: Yup.string().required("Candidate ID is required"),
    fullName: Yup.string().required("Candidate name is required"),
    contactNumber: Yup.string().required("Contact number is required"),
    candidateEmailId: Yup.string()
      .email("Invalid email format")
      .required("Candidate email is required"),
    userEmail: Yup.string()
      .email("Invalid email format")
      .required("User email is required"),
    clientName: Yup.string().required("Client name is required"),
    clientEmail: Yup.array().of(Yup.string().email("Invalid email format")),
    interviewDateTime: Yup.date()
      .required("Interview date and time is required")
      .min(
        oneMonthAgo,
        "Interview date and time must be within the last month or in the future"
      ),
    duration: Yup.number()
      .required("Duration is required")
      .min(15, "Duration must be at least 15 minutes")
      .max(60, "Duration cannot exceed 60 minutes"),
    zoomLink: Yup.string().nullable(),
    interviewLevel: Yup.string()
      .required("Interview level is required")
      .oneOf(
        ["INTERNAL", "EXTERNAL", "EXTERNAL-L1", "EXTERNAL-L2", "FINAL"],
        "Invalid interview level"
      ),
    externalInterviewDetails: Yup.string().nullable(),
    skipNotification: Yup.boolean(),
    coordinator: Yup.string().nullable(),
  });

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);

      const payload = {
        candidateId: values.candidateId,
        candidateEmailId: values.candidateEmailId,
        fullName: values.fullName,
        contactNumber: values.contactNumber,
        interviewDateTime: dayjs(values.interviewDateTime).utc().format("YYYY-MM-DDTHH:mm:ssZ"),
        interviewScheduledTimestamp: dayjs(values.interviewDateTime).valueOf(),
        duration: values.duration,
        zoomLink: values.zoomLink,
        interviewLevel: values.interviewLevel,
        interviewStatus: "SCHEDULED",
        clientEmail: values.clientEmail,
        clientName: values.clientName,
        jobId: values.jobId,
        userEmail: values.userEmail,
        userId: values.userId,
        externalInterviewDetails: values.externalInterviewDetails,
        skipNotification: values.skipNotification,
        coordinator: values.coordinator || null,
      };

      const responseData = await httpService.post(
        `/candidate/interview-schedule/${values.userId}`,
        payload
      );

      setInterviewResponse(responseData);
      setSubmissionSuccess(true);
      setNotification({
        open: true,
        message: "Interview scheduled successfully",
        severity: "success",
      });

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose(true);
      }, 2000);
    } catch (error) {
      console.error("Error scheduling interview:", error);
      setNotification({
        open: true,
        message: `Error scheduling interview: ${
          error?.response?.data?.message || error.message || "Unknown error"
        }`,
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
          Interview scheduled for <strong>Candidate ID:</strong>{" "}
          {interviewResponse.candidateId} successfully.
        </Typography>
      </Alert>
    );
  };

  const initialValues = getInitialValues();

  return (
    <Box sx={{ width: "100%", p: { xs: 1, sm: 2 }, overflow: "auto" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" color="primary" fontWeight="medium">
          Schedule Interview
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <SuccessMessage />

      <DynamicForm
        fields={getFormFields}  
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        submitButtonText="Schedule"
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

export default ScheduleInterviewForm;
