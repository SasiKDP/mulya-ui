// src/utils/ValidationSchema.js
import * as Yup from "yup";

// Validation Schema
export const JobFormSchema = Yup.object().shape({
  jobTitle: Yup.string()
    .required("Job title is required")
    .min(3, "Job title must be at least 3 characters"),
  clientName: Yup.string()
    .required("Client name is required")
    .min(2, "Client name must be at least 2 characters"),
  location: Yup.string().required("Location is required"),
  experienceRequired: Yup.number()
    .required("Experience is required")
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years"),
  relevantExperience: Yup.number()
    .required("Relevant experience is required")
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years"),
  qualification: Yup.string().required("Qualification is required"),
  noOfPositions: Yup.number()
    .required("Number of positions is required")
    .min(1, "At least one position is required")
    .integer("Number of positions must be a whole number"),
  salaryPackage: Yup.number()
    .required("Salary package is required")
    .min(1, "Salary must be greater than 0"),
  jobType: Yup.string().required("Job type is required"),
  jobMode: Yup.string().required("Job mode is required"),
  noticePeriod: Yup.string().required("Notice period is required"),
  recruiterName: Yup.array()
    .min(1, "At least one recruiter must be selected")
    .required("At least one recruiter must be selected"),
  jobDescription: Yup.string().when("jobDescriptionFile", {
    is: (file) => !file, 
    then: (schema) => schema.required("Job description is required").min(20),
    otherwise: (schema) => schema.notRequired(),
  }),
  jobDescriptionFile: Yup.mixed()
    .nullable()
    .test(
      "job-description-check",
      "Provide either text or a file for Job Description",
      function (value) {
        const jobDescription = this.resolve(Yup.ref("jobDescription"));
        if (!jobDescription && !value) {
          return this.createError({
            message: "Either text or file is required for Job Description",
          });
        }
        return true;
      }
    )
    .test(
      "fileSize",
      "File too large (Max: 5MB)",
      (value) => !value || (value && value.size <= 5 * 1024 * 1024)
    )
    .test(
      "fileType",
      "Unsupported format (Allowed: PDF, DOCX, Images)",
      (value) =>
        !value ||
        (value &&
          [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/png",
            "image/jpeg",
          ].includes(value.type))
    ),
});