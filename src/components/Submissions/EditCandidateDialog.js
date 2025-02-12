import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  updateCandidate,
  fetchCurrentResume,
} from "../Submissions/candidateService";
import { validationSchema } from "./validation";

const EditCandidateDialog = ({
  open,
  handleClose,
  candidate,
  onUpdateSuccess,
}) => {
  const formik = useFormik({
    initialValues: {
      candidateId: "",
      jobId: "",
      userId: "",
      fullName: "",
      emailId: "",
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
      userEmail: "",
      interviewStatus: "",
      resumeFile: null,
      resumeFileName: "",
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true, // ✅ This ensures values update when `candidate` changes
    onSubmit: async (values) => {
      try {
        await updateCandidate(values);
        onUpdateSuccess();
        handleClose();
      } catch (error) {
        console.error("Failed to update candidate:", error);
      }
    },
  });

  useEffect(() => {
    if (candidate?.candidateId) {
      fetchCurrentResume(candidate.candidateId).then((resumeFile) => {
        if (resumeFile) {
          formik.setFieldValue("resumeFile", resumeFile);
          formik.setFieldValue("resumeFileName", resumeFile.name);
        }
      });
    }
  }, [candidate]);

  // **Automatically append "LPA" to CTC fields**
  const handleCTCChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value.replace(/\s*LPA\s*/gi, ""); // Remove existing "LPA" if present
    updatedValue = updatedValue ? `${updatedValue} LPA` : "";
    formik.setFieldValue(name, updatedValue);
  };

  // **Define Placeholders for Fields**
  const fieldPlaceholders = {
    fullName: "Enter Full Name",
    emailId: "Enter Email Address",
    contactNumber: "Enter 10-digit Contact Number",
    currentOrganization: "Enter Current Organization",
    qualification: "Enter Qualification (e.g., B.E, M.Tech)",
    totalExperience: "Enter Total Experience in Years",
    relevantExperience: "Enter Relevant Experience in Years",
    currentCTC: "Enter Current CTC (e.g., 12 LPA)",
    expectedCTC: "Enter Expected CTC (e.g., 15 LPA)",
    noticePeriod: "Enter Notice Period in Days",
    currentLocation: "Enter Current Location",
    preferredLocation: "Enter Preferred Location",
    skills: "Enter Skills (e.g., Java, React, SpringBoot)",
    communicationSkills: "Rate from 1-5",
    requiredTechnologiesRating: "Rate from 1-5",
    overallFeedback: "Enter Overall Feedback",
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: "#66ba6b", // Dark Green Background
          color: "white",
          padding: "16px 24px", // More Padding for Better Look
          fontWeight: "bold",
          fontSize: "1.2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 2,
        }}
      >
        Edit Candidate
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: "white",
            transition: "0.2s",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" sx={{ mt: 2 }} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {Object.keys(formik.initialValues).map(
              (field) =>
                !["resumeFile", "resumeFileName"].includes(field) && (
                  <Grid item xs={12} sm={6} key={field}>
                    {field === "interviewStatus" ? (
                      <FormControl fullWidth>
                        <InputLabel>Interview Status</InputLabel>
                        <Select
                          name={field}
                          value={formik.values[field] || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched[field] &&
                            Boolean(formik.errors[field])
                          }
                        >
                          <MenuItem value="Not Scheduled">
                            Not Scheduled
                          </MenuItem>
                          <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                          <MenuItem value="COMPLETED">Completed</MenuItem>
                          <MenuItem value="PENDING">Pending</MenuItem>
                          <MenuItem value="CANCELLED">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        fullWidth
                        label={field.replace(/([A-Z])/g, " $1").trim()}
                        name={field}
                        value={formik.values[field] || ""}
                        onChange={
                          field.includes("CTC")
                            ? handleCTCChange
                            : formik.handleChange
                        }
                        onBlur={formik.handleBlur}
                        placeholder={fieldPlaceholders[field] || ""}
                        error={
                          formik.touched[field] && Boolean(formik.errors[field])
                        }
                        helperText={
                          formik.touched[field] && formik.errors[field]
                        }
                        disabled={[
                          "candidateId",
                          "jobId",
                          "userId",
                          "userEmail",
                        ].includes(field)}
                      />
                    )}
                  </Grid>
                )
            )}

            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px dashed",
                  borderColor: "primary.main",
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Resume
                </Typography>

                {/* Show the Existing Resume if Available */}
                {formik.values.resumeFileName && (
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <AttachFileIcon color="primary" />
                    <Typography variant="body2">
                      <a
                        href={`${process.env.REACT_APP_BASE_URL}/candidate/download-resume/${formik.values.candidateId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: "none",
                          color: "#00796b",
                          fontWeight: "bold",
                        }}
                      >
                        {formik.values.resumeFileName}
                      </a>
                    </Typography>
                  </Box>
                )}

                {/* Upload New Resume */}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFileIcon />}
                >
                  Upload New Resume
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx"
                    onChange={(event) => {
                      const file = event.target.files[0];
                      if (file) {
                        formik.setFieldValue("resumeFile", file);
                        formik.setFieldValue("resumeFileName", file.name);
                      }
                    }}
                  />
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
        >
          {formik.isSubmitting ? (
            <CircularProgress size={24} />
          ) : (
            "Update Candidate"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCandidateDialog;
