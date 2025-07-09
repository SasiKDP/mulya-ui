import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  IconButton,
  Divider,
  Card,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import DynamicForm from "../FormContainer/DynamicForm";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { Check } from "lucide-react";
import httpService from "../../Services/httpService";
import { formatDateTime } from "../../utils/dateformate";

const EditInterviewForm = ({ data, onClose, onSuccess }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { userId, email,userName,role } = useSelector((state) => state.auth);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [interviewResponse, setInterviewResponse] = useState(null);
  const [coordinators, setCoordinators] = useState([]);
  const isReschedule = data?.isReschedule || false;

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const res = await httpService.get("/users/employee?excludeRoleName=EMPLOYEE");
        setCoordinators(
          res.data.map((emp) => ({
            value: emp.employeeId,
            label: emp.userName,
          }))
        );
      } catch (err) {
        console.error("Error fetching coordinators:", err);
      }
    };

    fetchCoordinators();
  }, []);

  const getInitialValues = () => {
    if (!data) return {};

    let dateTimeValue = "";
    if (data.interviewDateTime) {
      const date = new Date(data.interviewDateTime);
      dateTimeValue = date.toISOString().slice(0, 16);
    }

    const status = isReschedule
      ? "SCHEDULED"
      : data.latestInterviewStatus || "SCHEDULED";

    return {
      candidateId: data.candidateId || "",
      clientEmail: data.clientEmail || [],
      clientName: data.clientName || "",
      duration: data.duration || 30,
      externalInterviewDetails: data.externalInterviewDetails || "",
      fullName: data.fullName || data.candidateFullName || "",
      interviewDateTime: isReschedule ? "" : dateTimeValue,
      interviewLevel: data.interviewLevel ,
      interviewId:data.interviewId,
      interviewStatus: status,
      internalFeedBack:data.internalFeedBack,
      jobId: data.jobId || "",
      skipNotification: data.skipNotification || false,
      userId: data.userId || userId || "",
      userEmail: data.email || email || "",
      zoomLink: data.zoomLink || "",
      candidateEmailId: data.emailId || data.candidateEmailId || "",
      contactNumber: data.contactNumber || data.candidateContactNo || "",
      coordinator: data.coordinator || userName,
      assignedTo: data.assignedTo || userId || "",
      coordinatorFeedback: data.coordinatorFeedback || "",
      comments:data.comments || ""
    };
  };

  // Pass form values so we can conditionally show coordinator field if interviewLevel === "INTERNAL"
const getFormFields = (values) => {
  const commonGridProps = { xs: 12, md: 6, lg: 6, xl: 4 };
  const isCoordinatorRole = role === "COORDINATOR";
  const showCoordinator = values?.interviewLevel === "INTERNAL" && isCoordinatorRole;

  const coordinatorField = {
    name: "assignedTo",
    label: "Coordinator",
    type: "select",
    disabled:values?.interviewLevel !== "INTERNAL",
    options: coordinators,
    required: false,
    gridProps: commonGridProps,
  };

  const coordinatorFeedbackField = {
    name: "internalFeedBack",
    label: "Coordinator Feedback",
    type: "textarea",
    placeholder: "Feedback/comments from the coordinator...",
    gridProps: { xs: 12 },
    rows: 3,
  };

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
          { value: "FEEDBACK_PENDING", label: "Feedback-Pending" },
        ],
        gridProps: commonGridProps,
      },
     
      {
        name: "interviewLevel",
        label: "Interview Level",
        type: "select",
        required: true,
        disabled: true,
        options: [
          { value: "INTERNAL", label: "INTERNAL" },
          { value: "EXTERNAL", label: "EXTERNAL" },
          { value: "EXTERNAL-L1", label: "EXTERNAL-L1" },
          { value: "EXTERNAL-L2", label: "EXTERNAL-L2" },
          { value: "FINAL", label: "FINAL" },
        ],
        gridProps: commonGridProps,
      },
       {
        name:"comments",
        label:"Comments",
        type:"textarea",
         gridProps: { xs: 12 },
         rows: 3,
 
      },
      ...(showCoordinator ? [coordinatorField, coordinatorFeedbackField] : []),
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
        name: "clientEmail",
        label: "Client Email",
        type: "chipInput",
        description: "Enter client email addresses and press Enter after each",
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
        gridProps: commonGridProps,
      },
      ...( [coordinatorField]),
      {
        name: "zoomLink",
        label: "Meeting Link",
        type: "text",
        placeholder: "https://zoom.us/j/example",
        gridProps: commonGridProps,
      },
      {
        name: "externalInterviewDetails",
        label: "Interview Details / Notes",
        type: "textarea",
        placeholder:
          "Add any additional interview details, requirements, or notes here",
        gridProps: { xs: 12 },
        rows: 4,
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


  const validationSchema = () => {
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
      externalInterviewDetails: Yup.string().nullable(),
      skipNotification: Yup.boolean(),
    };

    if (isReschedule) {
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
        assignedTo: Yup.string().nullable(),
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

       console.log('Payload being sent:', {
      comments: values.comments,
    })

      const payload = {
        ...data,
        interviewLevel: values.interviewLevel,
        interviewStatus: values.interviewStatus,
        internalFeedBack:values.internalFeedBack,
        externalInterviewDetails: values.externalInterviewDetails,
        skipNotification: values.skipNotification,
        assignedTo: values.assignedTo,
        userId: data.userId,
        userEmail: data.userEmail,
        comments:values.comments,
        ...(isReschedule && {
          interviewDateTime: dayjs(values.interviewDateTime).format(),
          interviewScheduledTimestamp: dayjs(
            values.interviewDateTime
          ).valueOf(),
          duration: values.duration,
          zoomLink: values.zoomLink,
         
        }),
      };

     const isCoordinator = role === "COORDINATOR"; // assuming `role` is available
     const baseUrl = isCoordinator
       ? `/candidate/updateInterviewByCoordinator/${userId}/${data.interviewId}`
        : `/candidate/interview-update/${data.userId || userId}/${data.candidateId}/${data.jobId}`;

      const responseData = await httpService.put(baseUrl, payload);


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
    <Box sx={{ width: "100%", p: { xs: 2, sm: 3 }, bgcolor: "#f9fafc" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600} color="primary">
          {isReschedule ? "Reschedule Interview" : "Update Interview Status"}
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>

      <Card elevation={2} sx={{ borderRadius: 3, mb: 3, p: 3 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          color="text.primary"
          gutterBottom
        >
          Candidate Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Table>
          <TableBody>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                Name
              </TableCell>
              <TableCell>{data.candidateFullName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                Email
              </TableCell>
              <TableCell>{data.candidateEmailId}</TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                Job ID
              </TableCell>
              <TableCell>{data.jobId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                Client
              </TableCell>
              <TableCell>{data.clientName}</TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                Interview Level
              </TableCell>
              <TableCell>{data.interviewLevel}</TableCell>
            </TableRow>
            {!isReschedule && data.interviewDateTime && (
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                  Scheduled
                </TableCell>
                <TableCell>{formatDateTime(data.interviewDateTime)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <SuccessMessage />

      <Card elevation={2} sx={{ borderRadius: 3, p: 3 }}>
        <DynamicForm
          fields={getFormFields((initialValues))}
          initialValues={initialValues}
          validationSchema={validationSchema()}
          onSubmit={handleSubmit}
          submitButtonText={isReschedule ? "Reschedule" : "Update"}
          cancelButtonText="Cancel"
          onCancel={onClose}
        />
      </Card>

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
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditInterviewForm;