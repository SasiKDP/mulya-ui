// src/config/candidateFormConfig.js
import axios from "axios";

import ToastService from "../../Services/toastService";
import DynamicForm from "../FormContainer/DynamicForm";


export const candidateFormFields = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    required: true,
    gridProps: { xs: 12, sm: 6 },
    sx: { mb: 2 },
    helperText: "Enter candidate's full name"
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    gridProps: { xs: 12, sm: 6 },
    sx: { mb: 2 },
    helperText: "Example: name@example.com"
  },
  {
    name: "contactNumber",
    label: "Contact Number",
    type: "tel",
    required: true,
    inputProps: { maxLength: 10 },
    gridProps: { xs: 12, sm: 6 },
    sx: { mb: 2 },
    helperText: "10 digits only"
  },
  {
    name: "relevantExperience",
    label: "Relevant Experience (Years)",
    type: "number",
    required: true,
    inputProps: { step: "0.5", min: "0" },
    gridProps: { xs: 12, sm: 6 },
    sx: { mb: 2 }
  },
  {
    name: "totalExperience",
    label: "Total Experience (Years)",
    type: "number",
    required: true,
    inputProps: { step: "0.5", min: "0" },
    gridProps: { xs: 12, sm: 6 },
    sx: { mb: 2 }
  },
  {
    name: "skills",
    label: "Skills",
    type: "multiSelect",
    required: true,
    options: [
      { value: "java", label: "Java" },
      { value: "python", label: "Python" },
      { value: "js", label: "JavaScript" },
      { value: "react", label: "React" },
      { value: "angular", label: "Angular" },
      { value: "vue", label: "Vue.js" },
      { value: "node", label: "Node.js" },
      { value: "sql", label: "SQL" },
      { value: "mongodb", label: "MongoDB" },
      { value: "aws", label: "AWS" },
      { value: "azure", label: "Azure" },
      { value: "docker", label: "Docker" },
      { value: "kubernetes", label: "Kubernetes" },
      { value: ".net", label: ".NET" },
      { value: "php", label: "PHP" },
      { value: "ruby", label: "Ruby" }
    ],
    gridProps: { xs: 12 },
    sx: { mb: 2 },
    helperText: "Select multiple skills"
  },
  {
    name: "linkedin",
    label: "LinkedIn Username",
    type: "text",
    required: false,
    gridProps: { xs: 12, sm: 6 },
    sx: { mb: 2 },
    helperText: "Enter just the username part of your LinkedIn profile"
  },
  {
    name: "referredBy",
    label: "Referred By",
    type: "text",
    required: false,
    gridProps: { xs: 12, sm: 6 },
    sx: { mb: 2 },
    helperText: "Email of the person who referred the candidate"
  },
  {
    name: "resumeFile",
    label: "Resume",
    type: "file",
    required: true,
    gridProps: { xs: 12 },
    sx: { mb: 2 },
    helperText: "Upload resume (PDF or DOC format)",
    inputProps: {
      accept: ".pdf,.doc,.docx"
    }
  }
];
const BASE_URL = "http://182.18.177.16";

export const candidateAPI = {
  prepareFormData(values) {
    const formData = new FormData();

    // Required fields
    formData.append("fullName", values.fullName.trim());
    formData.append("email", values.email.trim());
    formData.append("contactNumber", values.contactNumber.trim());
    formData.append(
      "relevantExperience",
      parseFloat(values.relevantExperience) || 0
    );
    formData.append("totalExperience", parseFloat(values.totalExperience) || 0);

    // Skills as JSON array string
    if (values.skills?.length > 0) {
      formData.append("skills", JSON.stringify(values.skills));
    }

    // Optional fields
    if (values.linkedin) {
      formData.append(
        "linkedin",
        `https://www.linkedin.com/in/${values.linkedin.trim()}`
      );
    }
    if (values.referredBy) {
      formData.append("referredBy", values.referredBy.trim());
    }

    // Resume file
    if (values.resumeFile) {
      formData.append("resumeFiles", values.resumeFile);
    }

    return formData;
  },

  async fetchCandidateList() {
    try {
      const response = await axios.get(`${BASE_URL}/candidate/bench/getBenchList`);
      return response.data;
    } catch (error) {
      ToastService.error("Failed to fetch candidate list");
      console.error("Error fetching candidate list:", error);
      throw error;
    }
  },

  async create(values) {
    try {
      const formData = this.prepareFormData(values);
      const toastId = ToastService.loading("Creating candidate record...");
      
      const response = await axios({
        method: "post",
        url: `${BASE_URL}/candidate/bench/save`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      ToastService.update(toastId, "Candidate added successfully!", "success");
      return response.data;
    } catch (error) {
      ToastService.error("Failed to add candidate: " + (error.response?.data?.message || error.message));
      console.error("Error creating candidate:", error);
      throw error;
    }
  },

  async update(values, candidateId) {
    try {
      const formData = this.prepareFormData(values);
      const toastId = ToastService.loading("Updating candidate record...");
      
      const response = await axios({
        method: "put",
        url: `${BASE_URL}/candidate/bench/updatebench/${candidateId}`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      ToastService.update(toastId, "Candidate updated successfully!", "success");
      return response.data;
    } catch (error) {
      ToastService.error("Failed to update candidate: " + (error.response?.data?.message || error.message));
      console.error("Error updating candidate:", error);
      throw error;
    }
  },

  async delete(candidateId) {
    try {
      const toastId = ToastService.loading("Deleting candidate record...");
      
      await axios.delete(`${BASE_URL}/candidate/bench/deletebench/${candidateId}`);
      
      ToastService.update(toastId, "Candidate deleted successfully!", "success");
    } catch (error) {
      ToastService.error("Failed to delete candidate: " + (error.response?.data?.message || error.message));
      console.error("Error deleting candidate:", error);
      throw error;
    }
  },

  async downloadResume(candidateId, candidateName) {
    try {
      const toastId = ToastService.loading("Downloading resume...");
      
      const response = await axios.get(
        `${BASE_URL}/candidate/bench/download/${candidateId}`,
        { responseType: "blob" }
      );
      
      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${candidateName.replace(/\s+/g, "_")}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      ToastService.update(toastId, "Resume downloaded successfully!", "success");
    } catch (error) {
      ToastService.error("Failed to download resume");
      console.error("Error downloading resume:", error);
      throw error;
    }
  },
};

// Component to use the candidate form
export const CandidateForm = ({ onSubmit, initialValues = {}, onCancel }) => {
  const handleSubmit = async (values) => {
    try {
      if (values.id) {
        // Update existing candidate
        await candidateAPI.update(values, values.id);
      } else {
        // Create new candidate
        await candidateAPI.create(values);
      }
      
      if (onSubmit) onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
    }
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
    ...initialValues
  };

  const formattedFields = candidateFormFields.map(field => {
    // Special handling for preselected skills if needed
    if (field.name === "skills" && initialValues.skills) {
      return {
        ...field,
        value: Array.isArray(initialValues.skills) 
          ? initialValues.skills 
          : typeof initialValues.skills === 'string'
            ? JSON.parse(initialValues.skills)
            : []
      };
    }
    return field;
  });

  return (
    <DynamicForm
      fields={formattedFields}
      onSubmit={handleSubmit}
      initialValues={formInitialValues}
      submitButtonText={initialValues.id ? "Update Candidate" : "Add Candidate"}
      cancelButtonText="Cancel"
      onCancel={onCancel}
    />
  );
};

// Utility function to convert candidate data from API to form values
export const mapCandidateDataToFormValues = (candidateData) => {
  return {
    id: candidateData.id || candidateData._id,
    fullName: candidateData.fullName || "",
    email: candidateData.email || "",
    contactNumber: candidateData.contactNumber || "",
    relevantExperience: candidateData.relevantExperience || 0,
    totalExperience: candidateData.totalExperience || 0,
    skills: candidateData.skills 
      ? (typeof candidateData.skills === 'string' 
          ? JSON.parse(candidateData.skills) 
          : candidateData.skills)
      : [],
    linkedin: candidateData.linkedin 
      ? candidateData.linkedin.replace("https://www.linkedin.com/in/", "") 
      : "",
    referredBy: candidateData.referredBy || "",
    // Note: resumeFile will be null as we can't pre-fill file inputs
  };
};