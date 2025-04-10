import React, { useState } from "react";
import * as Yup from "yup";
import DynamicForm from "../FormContainer/DynamicForm";
import { skills } from "./skills";
import ComponentTitle from "../../utils/ComponentTitle";
import httpService from "../../Services/httpService";
import ToastService from "../../Services/toastService";

const candidateFormFields = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    required: true,
    gridProps: { xs: 12, sm: 6 },
    sx: { mb: 2 },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    gridProps: { xs: 12, sm: 6 },
    sx: { mb: 2 },
  },
  {
    name: "contactNumber",
    label: "Contact Number",
    type: "tel",
    required: true,
    inputProps: { maxLength: 10 },
    gridProps: { xs: 12, sm: 6 },
    sx: { mb: 2 },
  },
  {
    name: "relevantExperience",
    label: "Relevant Experience (Years)",
    type: "number",
    required: true,
    inputProps: { step: "0.5", min: "0" },
    gridProps: { xs: 12, sm: 6 },
    sx: { mb: 2 },
  },
  {
    name: "totalExperience",
    label: "Total Experience (Years)",
    type: "number",
    required: true,
    inputProps: { step: "0.5", min: "0" },
    gridProps: { xs: 12, sm: 6 },
    sx: { mb: 2 },
  },
  {
    name: "skills",
    label: "Skills",
    type: "multiselect",
    required: true,
    options: [...skills],
    gridProps: { xs: 12,md:6},
    sx: { mb: 2 },
  },
  {
    name: "linkedin",
    label: "LinkedIn Username",
    type: "text",
    required: false,
    gridProps: { xs: 12, sm: 6 },
    sx: { mb: 2 },
  },
  {
    name: "referredBy",
    label: "Referred By",
    type: "text",
    required: false,
    gridProps: { xs: 12, sm: 6 },
    sx: { mb: 2 },
  },
  {
    name: "resumeFile",
    label: "Resume",
    type: "file",
    required: (values) => !values.id, // Only required for new candidates
    gridProps: { xs: 12 },
    sx: { mb: 2 },
    helperText: "Upload resume (PDF or DOC format)",
    inputProps: {
      accept: ".pdf,.doc,.docx",
    },
  },
];

const getValidationSchema = (isEditMode) => {
  const baseSchema = {
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    relevantExperience: Yup.number().positive("Must be positive").required("Relevant experience is required"),
    totalExperience: Yup.number()
      .positive("Must be positive")
      .required("Total experience is required")
      .test("is-greater", "Total experience must be >= relevant experience", function (totalExp) {
        return totalExp >= this.parent.relevantExperience;
      }),
    contactNumber: Yup.string()
      .matches(/^\+?\d{10}$/, "Invalid phone number format")
      .required("Contact number is required"),
    skills: Yup.array().min(1, "At least one skill is required"),
  };

  // For edit mode, resume is optional
  if (isEditMode) {
    baseSchema.resumeFile = Yup.mixed()
      .test("fileType", "Only PDF, DOC, and DOCX files allowed", (value) => {
        if (!value) return true;
        return ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(value.type);
      })
      .test("fileSize", "File size must be less than 5MB", (value) => {
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024;
      });
  } else {
    // For create mode, resume is required
    baseSchema.resumeFile = Yup.mixed()
      .required("Resume is required")
      .test("fileType", "Only PDF, DOC, and DOCX files allowed", (value) => {
        if (!value) return true;
        return ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(value.type);
      })
      .test("fileSize", "File size must be less than 5MB", (value) => {
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024;
      });
  }

  return Yup.object().shape(baseSchema);
};

const formInitialValues = {
  fullName: "",
  email: "",
  contactNumber: "",
  relevantExperience: "",
  totalExperience: "",
  skills: [],
  linkedin: "",
  referredBy: "",
  resumeFile: null,
};

const BenchForm = ({ initialValues = formInitialValues, onCancel, onSuccess, isEditMode = false }) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const toastId = ToastService.loading(isEditMode ? "Updating candidate..." : "Adding candidate...");
      
      const formData = new FormData();
  
      // Append form fields
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("contactNumber", values.contactNumber);
      formData.append("relevantExperience", values.relevantExperience);
      formData.append("totalExperience", values.totalExperience);
      formData.append("linkedin", values.linkedin || "");
      formData.append("referredBy", values.referredBy || "");
  
      // Append skills as JSON array string
      formData.append("skills", JSON.stringify(values.skills));
  
      // Append resume file if provided
      if (values.resumeFile) {
        formData.append("resumeFiles", values.resumeFile); // Key must be "resumeFiles"
      }
      
      // If in edit mode, append the ID
      let response;
      if (isEditMode) {
        formData.append("id", values.id);
        response = await httpService.put(`/candidate/bench/updatebench/${values.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await httpService.post("/candidate/bench/save", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
  
      ToastService.update(
        toastId, 
        isEditMode ? "Candidate updated successfully!" : "Candidate added successfully!",
        "success"
      );
      
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("Submission error:", error);
      ToastService.error(isEditMode ? "Failed to update candidate" : "Failed to add candidate");
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <>
      {!isEditMode && <ComponentTitle title="Add Candidate to bench" />}
      <DynamicForm
        fields={candidateFormFields}
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={getValidationSchema(isEditMode)}
        submitButtonText={isEditMode ? "Update Candidate" : "Add Candidate"}
        cancelButtonText="Cancel"
        onCancel={onCancel}
        isSubmitting={submitting}
      />
    </>
  );
};

export default BenchForm;