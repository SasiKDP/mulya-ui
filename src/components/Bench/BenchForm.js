import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { candidateAPI } from "./candidateAPI";
import SkillsSelector from "../../utils/SkillsSelector";

const BenchForm = ({
  isEditMode = false,
  candidateId = null,
  initialValues = null,
  onSuccess = () => {},
  onClose = () => {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [toast, setToast] = React.useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const showToast = (message, severity = 'info') => {
    setToast({
      open: true,
      message,
      severity
    });
  };

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({ ...toast, open: false });
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    relevantExperience: Yup.number()
      .positive("Must be positive")
      .required("Relevant experience is required"),
    totalExperience: Yup.number()
      .positive("Must be positive")
      .required("Total experience is required")
      .test(
        "is-greater",
        "Total experience must be >= relevant experience",
        function (totalExp) {
          return totalExp >= this.parent.relevantExperience;
        }
      ),
    contactNumber: Yup.string()
      .matches(/^\+?\d{10}$/, "Invalid phone number format")
      .required("Contact number is required"),
    skills: Yup.array()
      .min(1, "At least one skill is required")
      .required("Skills are required"),
    linkedin: Yup.string(),
    referredBy: Yup.string(),
    resumeFile: Yup.mixed()
      .nullable()
      .test(
        "fileType",
        "Only PDF, DOC, and DOCX files allowed",
        (value) =>
          !value ||
          [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(value.type)
      )
      .test(
        "fileSize",
        "File size must be less than 5MB",
        (value) => !value || value.size <= 5 * 1024 * 1024
      ),
  });

  const handleReset = () => {
    formik.resetForm();
    formik.setValues(
      isEditMode
        ? initialValues
        : {
            fullName: "",
            email: "",
            relevantExperience: "",
            totalExperience: "",
            contactNumber: "",
            skills: [],
            linkedin: "",
            referredBy: "",
            resumeFile: null,
          }
    );

    const fileInput = document.getElementById("resume-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = candidateAPI.prepareFormData(values);
  
      const response = isEditMode
        ? await candidateAPI.update(formData, candidateId)
        : await candidateAPI.create(formData);
  
      console.log("API Response:", response.data); // Debugging line
  
      if (response.data?.status === "Success") {
        const benchId = response.data.payload?.[0]?.id || "Unknown ID";
        const actionType = isEditMode ? "updated" : "created";
        const successMessage = response.data.message || `Bench details ${actionType} successfully!`;
  
        showToast(`${successMessage} Bench ID: ${benchId}`, "success");
  
        setTimeout(() => {
          onSuccess();
        }, 500); // Delay before navigation
      } else {
        throw new Error(response.data?.message || "Unexpected response");
      }
    } catch (error) {
      let errorMessage = "Operation failed. Please try again.";
  
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = "This email already exists in the system";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = "No response received from the server";
      } else {
        errorMessage = error.message || "Request failed to send";
      }
  
      showToast(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };
  
  
  

  const handleDelete = async () => {
    try {
      const response = await candidateAPI.delete(candidateId);

      if (response.data?.status === "Success") {
        showToast(`Deleted Successfully! Bench ID: ${candidateId}`, "success");
        onSuccess();
        onClose();
      } else {
        throw new Error(
          response.data?.message || "Failed to delete candidate."
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast(
        error.response?.data?.message || "Failed to delete candidate.",
        "error"
      );
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const formik = useFormik({
    initialValues: initialValues || {
      fullName: "",
      email: "",
      relevantExperience: "",
      totalExperience: "",
      contactNumber: "",
      skills: [],
      linkedin: "",
      referredBy: "",
      resumeFile: null,
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      required: true,
      gridCols: 1,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      gridCols: 1,
    },
    {
      name: "totalExperience",
      label: "Total Experience (years)",
      type: "number",
      required: true,
      gridCols: 1,
    },
    {
      name: "relevantExperience",
      label: "Relevant Experience (years)",
      type: "number",
      required: true,
      gridCols: 1,
    },
    {
      name: "contactNumber",
      label: "Contact Number",
      type: "tel",
      required: true,
      gridCols: 1,
    },
    {
      name: "linkedin",
      label: "LinkedIn Profile",
      type: "text",
      required: false,
      gridCols: 2,
    },
    {
      name: "referredBy",
      label: "Referred By",
      type: "text",
      required: false,
      gridCols: 1,
    },
  ];

  const getGridTemplateColumns = () => {
    if (isMobile) return "1fr";
    if (isTablet) return "1fr 1fr";
    return "1fr 1fr 1fr";
  };

  return (
    <>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this bench candidate?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          p: { xs: 2, sm: 3, md: 4 },
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              fontWeight: 400,
              color: "white",
              backgroundColor: "#00796B",
              padding: "8px 16px",
              borderRadius: "8px",
              opacity: 0.9,
            }}
          >
            {isEditMode
              ? `Edit Bench Candidate (ID: ${candidateId})`
              : "Add Bench Candidate"}
          </Typography>

          <Box>
            <IconButton
              onClick={isEditMode ? () => setOpenDeleteDialog(true) : onClose}
              color={isEditMode ? "error" : "inherit"}
              sx={{
                backgroundColor: isEditMode
                  ? "rgba(244, 67, 54, 0.2)"
                  : "rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor: isEditMode
                    ? "rgba(244, 67, 54, 0.4)"
                    : "rgba(0, 0, 0, 0.3)",
                },
                p: 1.5,
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 40,
                height: 40,
              }}
            >
              {isEditMode ? (
                <DeleteIcon fontSize="medium" sx={{ color: "#F44336" }} />
              ) : (
                <CloseIcon fontSize="medium" sx={{ color: "#333" }} />
              )}
            </IconButton>
          </Box>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: getGridTemplateColumns(),
              gap: { xs: 2, sm: 3 },
              mb: 4,
            }}
          >
            {fields.map((field) => (
              <Box
                key={field.name}
                sx={{
                  gridColumn: `span ${isMobile ? 1 : field.gridCols}`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <TextField
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched[field.name] &&
                    Boolean(formik.errors[field.name])
                  }
                  helperText={
                    formik.touched[field.name] && formik.errors[field.name]
                  }
                  required={field.required}
                  fullWidth
                  margin="normal"
                  size={isMobile ? "small" : "medium"}
                  InputProps={{
                    startAdornment: field.name === "linkedin" && (
                      <InputAdornment position="start">
                        linkedin.com/in/
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: isMobile ? "40px" : "56px",
                    },
                  }}
                />
              </Box>
            ))}
            <Box
              sx={{
                gridColumn: `span ${isMobile ? 1 : 2}`,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <SkillsSelector
                selectedSkills={formik.values.skills}
                onChange={(skills) => formik.setFieldValue("skills", skills)}
                label="Skills"
                placeholder="Select Skills"
              />
              {formik.touched.skills && formik.errors.skills && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  {formik.errors.skills}
                </Typography>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              mt: 3,
              mb: 4,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            {/* Upload Button */}
            <Box sx={{ flexShrink: 0 }}>
              <input
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                id="resume-upload"
                type="file"
                onChange={(event) => {
                  formik.setFieldValue(
                    "resumeFile",
                    event.currentTarget.files[0]
                  );
                }}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="resume-upload">
                <Typography
                  component="a"
                  sx={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: "#007BFF",
                    "&:hover": { color: "#0056b3" },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "0.875rem",
                  }}
                >
                  <CloudUploadIcon fontSize="small" />
                  {isEditMode ? "Update Resume" : "Upload Resume"}
                </Typography>
              </label>
            </Box>

            {/* File Info & Validation Messages */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              {formik.values.resumeFile && (
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-word",
                    color: "text.primary",
                    fontSize: "0.875rem",
                  }}
                >
                  Selected: {formik.values.resumeFile.name}
                </Typography>
              )}
              {isEditMode && !formik.values.resumeFile && (
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: "italic",
                    color: "text.secondary",
                    fontSize: "0.875rem",
                  }}
                >
                  Current resume will be retained if no new file is selected.
                </Typography>
              )}
              {formik.touched.resumeFile && formik.errors.resumeFile && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  {formik.errors.resumeFile}
                </Typography>
              )}
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "text.secondary",
                  mt: 0.5,
                  fontSize: "0.75rem",
                }}
              >
                Accepted formats: PDF, DOC, DOCX (Max 5MB)
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 4,
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              size={isMobile ? "medium" : "large"}
              disabled={formik.isSubmitting}
              onClick={!isEditMode ? handleReset : onClose}
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                display: "flex",
                alignItems: "center",
              }}
            >
              {!isEditMode ? "Reset" : "Close"}
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size={isMobile ? "medium" : "large"}
              disabled={formik.isSubmitting}
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                minWidth: { xs: "100%", sm: "auto" },
              }}
            >
              {formik.isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : isEditMode ? ("Update Candidate"
              ) : (
                "Submit Candidate"
              )}
            </Button>
          </Box>
        </form>
      </Box>
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleToastClose} 
          severity={toast.severity} 
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

    </>
  );
};

export default BenchForm;