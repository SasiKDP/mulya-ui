import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import {
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
import { Check } from "lucide-react";
import dayjs from "dayjs";
import ClientSelect from "../utils/ClientSelect"; 

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
    .oneOf(["INTERNAL", "EXTERNAL"], "Invalid interview level"),
  externalInterviewDetails: Yup.string().nullable(), // Make it optional
});

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
  const { isSubmitting, submissionSuccess, error, interviewResponse } =
    useSelector((state) => state.interviewForm);

  // Initial form values
  const initialValues = {
    jobId,
    candidateId,
    candidateFullName,
    candidateContactNo,
    clientName,
    userId,
    candidateEmailId,
    userEmail,
    clientEmail: "",
    interviewDateTime: "",
    duration: "",
    zoomLink: "",
    interviewLevel: "INTERNAL",
    externalInterviewDetails: "",
    interviewScheduledTimestamp: null,
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

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    const formattedValues = {
      ...values,
      interviewDateTime: dayjs(values.interviewDateTime).format(),
      interviewScheduledTimestamp: dayjs(values.interviewDateTime).valueOf(),
    };

    dispatch(submitInterviewForm(formattedValues));
    setSubmitting(false);
  };

  const handleDialogClose = () => {
    dispatch(clearError());
    handleCloseInterviewDialog();
  };

  // Success Message Component
  const SuccessMessage = () => {
    if (!submissionSuccess || !interviewResponse) return null;

    return (
      <Paper elevation={0} sx={{ mb: 3, backgroundColor: "#f0fdf4", p: 2 }}>
        <Alert
          icon={<Check className="h-5 w-5" />}
          severity="success"
          sx={{ mb: 2 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Interview scheduled for <strong>Candidate ID:</strong>{" "}
            {interviewResponse.candidateId} successfully and email notifications
            sent.
          </Typography>
        </Alert>
      </Paper>
    );
  };

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: "100%",
        maxHeight: "80vh",
      }}
    >
      <SuccessMessage />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            {/* Candidate Details Section (Read-Only Fields) */}
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Candidate Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="jobId"
                    as={TextField}
                    label="Job ID"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="candidateId"
                    as={TextField}
                    label="Candidate ID"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="candidateFullName"
                    as={TextField}
                    label="Candidate Name"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="candidateContactNo"
                    as={TextField}
                    label="Contact Number"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="candidateEmailId"
                    as={TextField}
                    label="Candidate Email"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="userEmail"
                    as={TextField}
                    label="User Email"
                    fullWidth
                    disabled
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Interview Details Section (Editable Fields) */}
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Interview Details
              </Typography>
              <Grid container spacing={2}>
                {/* Client Name Dropdown */}
                <Grid item xs={12} sm={6} md={4}>
                  <ClientSelect
                    name="clientName"
                    value={values.clientName}
                    onChange={(value) => setFieldValue("clientName", value)}
                  />
                  {touched.clientName && errors.clientName && (
                    <Typography variant="caption" color="error">
                      {errors.clientName}
                    </Typography>
                  )}
                </Grid>

                {/* Other Fields */}
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="clientEmail"
                    as={TextField}
                    label="Client Email"
                    fullWidth
                    error={touched.clientEmail && Boolean(errors.clientEmail)}
                    helperText={touched.clientEmail && errors.clientEmail}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="interviewDateTime"
                    as={TextField}
                    label="Interview Date & Time"
                    type="datetime-local"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={touched.interviewDateTime && Boolean(errors.interviewDateTime)}
                    helperText={touched.interviewDateTime && errors.interviewDateTime}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="duration"
                    as={TextField}
                    label="Duration (Minutes)"
                    type="number"
                    fullWidth
                    inputProps={{ min: 15, max: 60 }}
                    error={touched.duration && Boolean(errors.duration)}
                    helperText={touched.duration && errors.duration}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    name="zoomLink"
                    as={TextField}
                    label="Interview Link"
                    fullWidth
                    error={touched.zoomLink && Boolean(errors.zoomLink)}
                    helperText={touched.zoomLink && errors.zoomLink}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset" required>
                    <FormLabel component="legend">Interview Level</FormLabel>
                    <Field name="interviewLevel">
                      {({ field }) => (
                        <RadioGroup {...field} row>
                          <FormControlLabel
                            value="INTERNAL"
                            control={<Radio />}
                            label="Internal"
                          />
                          <FormControlLabel
                            value="EXTERNAL"
                            control={<Radio />}
                            label="External"
                          />
                        </RadioGroup>
                      )}
                    </Field>
                  </FormControl>
                </Grid>
                {values.interviewLevel === "EXTERNAL" && (
                  <Grid item xs={12}>
                    <Field
                      name="externalInterviewDetails"
                      as={TextField}
                      label="External Interview Details"
                      multiline
                      rows={3}
                      fullWidth
                      error={touched.externalInterviewDetails && Boolean(errors.externalInterviewDetails)}
                      helperText={touched.externalInterviewDetails && errors.externalInterviewDetails}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Form Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleDialogClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Interview"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default InterviewForm;