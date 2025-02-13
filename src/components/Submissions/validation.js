import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),

  emailId: Yup.string()
    .email("Invalid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address in lowercase"
    )
    .required("Email is required"),

  contactNumber: Yup.string()
    .matches(/^\d{10}$/, "Contact number must be exactly 10 digits")
    .required("Contact number is required"),

  currentOrganization: Yup.string().max(
    30,
    "Organization name cannot be more than 30 characters"
  ),

  currentCTC: Yup.string().test(
    "valid-ctc",
    "Please enter a valid CTC value",
    (value) => {
      if (!value) return true;
      const numValue = parseFloat(value.replace(/\s*LPA\s*/g, ""));
      return !isNaN(numValue) && numValue >= 0;
    }
  ),

  expectedCTC: Yup.string().test(
    "valid-ctc",
    "Please enter a valid CTC value",
    (value) => {
      if (!value) return true;
      const numValue = parseFloat(value.replace(/\s*LPA\s*/g, ""));
      return !isNaN(numValue) && numValue >= 0;
    }
  ),

  totalExperience: Yup.number()
    .min(0, "Total experience cannot be negative")
    .max(50, "Total experience cannot be more than 50 years")
    .required("Total experience is required"),

  relevantExperience: Yup.number()
    .min(0, "Relevant experience cannot be negative")
    .max(50, "Relevant experience cannot be more than 50 years")
    .required("Relevant experience is required")
    .test(
      "is-relevant-not-more-than-total",
      "Relevant experience cannot be more than total experience",
      function (value) {
        const { totalExperience } = this.parent;
        return value <= totalExperience;
      }
    ),

  communicationSkills: Yup.number()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),

  requiredTechnologiesRating: Yup.number()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),

  preferredLocation: Yup.string()
    .max(18, "Location cannot be more than 18 characters")
    .matches(/^[A-Za-z\s]+$/, "Location can only contain letters and spaces"),

  currentLocation: Yup.string()
    .max(18, "Location cannot be more than 18 characters")
    .matches(/^[A-Za-z\s]+$/, "Location can only contain letters and spaces"),

  overallFeedback: Yup.string().max(
    100,
    "Feedback cannot be more than 100 characters"
  ),
});
