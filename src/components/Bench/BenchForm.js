import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  FormHelperText,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import httpService from "../../Services/httpService";
import ToastService from "../../Services/toastService";

const BenchCandidateForm = ({
  open,
  onClose,
  onSuccess,
  id = null,
  initialData = null,
}) => {
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode && !initialData);
  const [submitting, setSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [errors, setErrors] = useState({});
  


  const formInitialValues = {
    id: "",
    fullName: "",
    email: "",
    contactNumber: "",
    relevantExperience: "",
    totalExperience: "",
    skills: [],
    linkedin: "",
    referredBy: "",
    resumeFile: null,
    technology: "",
    resumeAvailable: false
  };

  const [formValues, setFormValues] = useState(formInitialValues);

  // File validation schema
  const fileValidation = Yup.mixed()
    .test("fileSize", "File size is too large (max 5MB)", (value) => {
      if (!value) return true; // Skip validation if no file
      return value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Only PDF and Word documents are allowed", (value) => {
      if (!value) return true; // Skip validation if no file
      return (
        value.type === "application/pdf" ||
        value.type === "application/msword" ||
        value.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
    });

  // Initialize form values when edit mode or initial data changes
  useEffect(() => {
    if (isEditMode && initialData) {
      // If we already have the data, use it directly
      setFormValues({
        id: initialData.id,
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        contactNumber: initialData.contactNumber || "",
        relevantExperience: initialData.relevantExperience || "",
        totalExperience: initialData.totalExperience || "",
        skills: initialData.skills || [],
        linkedin: initialData.linkedin || "",
        referredBy: initialData.referredBy || "",
        resumeFile: null,
        technology: initialData.technology || "",
        resumeAvailable: initialData.resumeAvailable || false
      });
      setLoading(false);
    } else if (!isEditMode) {
      // For new entry, reset to initial values
      setFormValues(formInitialValues);
    }
  }, [initialData, isEditMode]);

  // Load candidate data when editing and no initial data provided
  useEffect(() => {
    const fetchCandidateData = async () => {
      if (isEditMode && !initialData && open) {
        try {
          setLoading(true);
          ToastService.info(`Loading candidate details...`);
          const response = await httpService.get(`/candidate/bench/${id}`);
          const candidateData = response.data;
          
          setFormValues({
            id: candidateData.id,
            fullName: candidateData.fullName || "",
            email: candidateData.email || "",
            contactNumber: candidateData.contactNumber || "",
            relevantExperience: candidateData.relevantExperience || "",
            totalExperience: candidateData.totalExperience || "",
            skills: candidateData.skills || [],
            linkedin: candidateData.linkedin || "",
            referredBy: candidateData.referredBy || "",
            resumeFile: null,
            technology: candidateData.technology || "",
            resumeAvailable: candidateData.resumeAvailable || false
          });
          
          ToastService.success(`Ready to edit ${candidateData.fullName}`);
        } catch (error) {
          console.error('Failed to fetch candidate details:', error);
          ToastService.error('Failed to load candidate details for editing');
          handleClose();
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCandidateData();
  }, [id, initialData, isEditMode, open]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      // Don't reset immediately to avoid visual glitches when closing
      return;
    }
    
    // Form is already initialized in other useEffects based on initialData and isEditMode
    setInputValue("");
    setResumeFileName("");
    setErrors({});
  }, [open]);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    contactNumber: Yup.string()
      .matches(/^(\+?\d{10}|\+?\d{12})$/, "Contact number must be 10 or 12 digits")
      .required("Contact number is required"),
    relevantExperience: Yup.number()
      .typeError("Relevant experience must be a number")
      .positive("Must be positive")
      .required("Relevant experience is required"),
    totalExperience: Yup.number()
      .typeError("Total experience must be a number")
      .positive("Must be positive")
      .required("Total experience is required")
      .test(
        "is-greater",
        "Total experience must be greater than or equal to relevant experience",
        function (totalExp) {
          return totalExp >= this.parent.relevantExperience;
        }
      ),
    skills: Yup.array()
      .min(1, "At least one skill is required")
      .of(Yup.string().required("Skill cannot be empty")),
    technology: Yup.string().required("Technology is required"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, resumeFile: "File size is too large (max 5MB)" }));
        return;
      }
      
      const allowedTypes = [
        "application/pdf", 
        "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, resumeFile: "Only PDF and Word documents are allowed" }));
        return;
      }
      
      setFormValues((prev) => ({ ...prev, resumeFile: file }));
      setResumeFileName(file.name);
      setErrors((prev) => ({ ...prev, resumeFile: undefined }));
    }
  };

  const validateField = async (fieldName, value) => {
    try {
      // Create a schema just for this field
      let schema;
      
      switch (fieldName) {
        case "contactNumber":
          schema = Yup.object().shape({
            contactNumber: Yup.string()
              .matches(/^(\+?\d{10}|\+?\d{12})$/, "Contact number must be 10 or 12 digits")
              .required("Contact number is required")
          });
          break;
        case "email":
          schema = Yup.object().shape({
            email: Yup.string()
              .email("Invalid email format")
              .required("Email is required")
          });
          break;
        case "fullName":
          schema = Yup.object().shape({
            fullName: Yup.string().required("Full Name is required")
          });
          break;
        case "relevantExperience":
          schema = Yup.object().shape({
            relevantExperience: Yup.number()
              .typeError("Relevant experience must be a number")
              .positive("Must be positive")
              .required("Relevant experience is required")
          });
          break;
        case "totalExperience":
          schema = Yup.object().shape({
            totalExperience: Yup.number()
              .typeError("Total experience must be a number")
              .positive("Must be positive")
              .required("Total experience is required")
              .test(
                "is-greater",
                "Total experience must be greater than or equal to relevant experience",
                function (totalExp) {
                  return totalExp >= formValues.relevantExperience;
                }
              )
          });
          break;
        case "technology":
          schema = Yup.object().shape({
            technology: Yup.string().required("Technology is required")
          });
          break;
        default:
          return; // No validation for other fields
      }
      
      await schema.validate({ [fieldName]: value }, { abortEarly: false });
      
      // If validation passes, clear error for this field
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    } catch (validationErrors) {
      // Set error for this field
      setErrors(prev => ({ 
        ...prev, 
        [fieldName]: validationErrors.errors[0] 
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setSubmitting(true);
      const toastId = ToastService.loading(
        isEditMode ? "Updating candidate..." : "Adding candidate..."
      );

      const formData = new FormData();
      formData.append("fullName", formValues.fullName);
      formData.append("email", formValues.email);
      formData.append("contactNumber", formValues.contactNumber);
      formData.append("relevantExperience", formValues.relevantExperience);
      formData.append("totalExperience", formValues.totalExperience);
      formData.append("linkedin", formValues.linkedin || "");
      formData.append("referredBy", formValues.referredBy || "");
      formData.append("skills", JSON.stringify(formValues.skills));
      formData.append("technology", formValues.technology);

      if (formValues.resumeFile) {
        formData.append("resumeFiles", formValues.resumeFile);
      } else if (isEditMode) {
        // In edit mode, if no new file is provided, we'll keep the existing one
        formData.append("keepExistingResume", "true");
      }

      let response;
      if (isEditMode) {
        formData.append("id", formValues.id);
        response = await httpService.put(
          `/candidate/bench/updatebench/${formValues.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await httpService.post("/candidate/bench/save", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      ToastService.update(
        toastId,
        isEditMode
          ? "Candidate updated successfully!"
          : "Candidate added successfully!",
        "success"
      );

      if (onSuccess) {
        onSuccess(response.data);
      }
      
      handleClose();
    } catch (error) {
      console.error("Submission error:", error);
      ToastService.error(
        error.response?.data?.message || 
        (isEditMode ? "Failed to update candidate" : "Failed to add candidate")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkillAdd = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      const newSkill = inputValue.trim();
      if (!formValues.skills.includes(newSkill)) {
        setFormValues((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }));
      }
      setInputValue("");
    }
  };

  const handleSkillDelete = (skillToDelete) => {
    setFormValues((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToDelete),
    }));
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const renderFormContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="fullName"
              label="Full Name"
              value={formValues.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              fullWidth
              error={!!errors.fullName}
              helperText={errors.fullName}
              disabled={submitting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
              disabled={submitting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="contactNumber"
              label="Contact Number"
              type="tel"
              value={formValues.contactNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              fullWidth
              error={!!errors.contactNumber}
              helperText={errors.contactNumber || "Must be 10 or 12 digits"}
              disabled={submitting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="technology"
              label="Technology"
              value={formValues.technology}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              fullWidth
              error={!!errors.technology}
              helperText={errors.technology}
              disabled={submitting}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="relevantExperience"
              label="Relevant Experience (Years)"
              type="number"
              value={formValues.relevantExperience}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              fullWidth
              inputProps={{ step: "0.5", min: "0" }}
              error={!!errors.relevantExperience}
              helperText={errors.relevantExperience}
              disabled={submitting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="totalExperience"
              label="Total Experience (Years)"
              type="number"
              value={formValues.totalExperience}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              fullWidth
              inputProps={{ step: "0.5", min: "0" }}
              error={!!errors.totalExperience}
              helperText={errors.totalExperience}
              disabled={submitting}
            />
          </Grid>

          {/* SKILLS */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Skills (Press Enter to add)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleSkillAdd}
              error={!!errors.skills}
              helperText={errors.skills || "Press Enter after typing each skill"}
              disabled={submitting}
            />
            <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
              {formValues.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleSkillDelete(skill)}
                  disabled={submitting}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="linkedin"
              label="LinkedIn Profile URL"
              value={formValues.linkedin}
              onChange={handleChange}
              fullWidth
              disabled={submitting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="referredBy"
              label="Referred By"
              value={formValues.referredBy}
              onChange={handleChange}
              fullWidth
              disabled={submitting}
            />
          </Grid>

          {/* RESUME UPLOAD */}
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              disabled={submitting}
            >
              {resumeFileName || (isEditMode ? "Update Resume (Optional)" : "Upload Resume (Required)")}
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </Button>
            {errors.resumeFile && (
              <FormHelperText error>{errors.resumeFile}</FormHelperText>
            )}
            {isEditMode && !resumeFileName && (
              <FormHelperText>Leave empty to keep existing resume</FormHelperText>
            )}
          </Grid>

          {/* RESUME DOWNLOAD IF AVAILABLE */}
          {isEditMode && formValues.resumeAvailable && (
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                href={`/candidate/bench/download-resume/${formValues.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Existing Resume
              </Button>
            </Grid>
          )}
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            onClick={handleClose}
            color="inherit"
            disabled={submitting}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEditMode ? (
              "Update"
            ) : (
              "Add"
            )}
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {isEditMode ? "Edit Bench Candidate" : "Add Bench Candidate"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{renderFormContent()}</DialogContent>
    </Dialog>
  );
};

export default BenchCandidateForm;