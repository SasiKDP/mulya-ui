import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid,
  Card,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Person,
  ContactMail,
  LockOutlined,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  submitFormData,
  updateFormData,
  clearFormData,
} from "../../redux/features/formSlice";
import { useNavigate } from "react-router-dom";

import PersonalInfoFields from "./PersonalInfoFields";
import ContactFields from "./ContactFields";
import PasswordFields from "./PasswordFields";
import EmailVerificationDialog from "../common/EmailVerificationDialog";
import { formValidation } from "./formValidation";

const steps = [
  {
    label: "Personal Information",
    description: "Provide your basic personal details",
    icon: <Person color="primary" />,
  },
  {
    label: "Contact Details",
    description: "Add your email and phone information",
    icon: <ContactMail color="primary" />,
  },
  {
    label: "Create Password",
    description: "Set up a secure password for your account",
    icon: <LockOutlined color="primary" />,
  },
];

const SignUpFormMain = ({ showSignIn }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, response } = useSelector((state) => state.form || {});

  const [activeStep, setActiveStep] = useState(0);
  // State to determine if the official email is verified
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    email: "",
    personalemail: "",
    phoneNumber: "",
    designation: "",
    gender: "",
    dob: "",
    joiningDate: "",
    password: "",
    confirmPassword: "",
    roles: ["EMPLOYEE"],
  });

  const [formError, setFormError] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    dispatch(updateFormData({ name, value }));
  };

  // Handle validation on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const validatorFunction =
      formValidation[`validate${name.charAt(0).toUpperCase() + name.slice(1)}`];
    if (validatorFunction) {
      setFormError((prev) => ({
        ...prev,
        [name]: validatorFunction(value, formData),
      }));
    }
  };

  // Validate fields in the current step
  const validateStep = () => {
    const errors = {};
    const stepFields = {
      0: ["userId", "userName", "designation", "gender", "dob", "joiningDate"],
      1: ["email", "personalemail", "phoneNumber"],
      2: ["password", "confirmPassword"],
    };

    stepFields[activeStep].forEach((field) => {
      const validatorFunction =
        formValidation[
          `validate${field.charAt(0).toUpperCase() + field.slice(1)}`
        ];
      if (validatorFunction) {
        errors[field] = validatorFunction(formData[field], formData);
      }
    });

    setFormError(errors);
    return Object.values(errors).every((error) => error === "");
  };

  // Next Step handler – if in Contact Details step, ensure email is verified
  const handleNext = () => {
    if (activeStep === 1 && !isEmailVerified) {
      setIsEmailVerificationOpen(true);
      toast.error("Please verify your email before proceeding.");
      return;
    }
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      toast.error("Please fix the errors before proceeding.");
    }
  };

  // Previous Step handler
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Submit the form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure email is verified before proceeding
    if (!isEmailVerified) {
      setIsEmailVerificationOpen(true);
      return;
    }
    // Validate password step before submitting
    if (!validateStep()) {
      toast.error("Please fix the errors in the password fields before submitting.");
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
      dispatch(submitFormData(formData));
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        showSignIn();
      }, 3000);
    }, 1500);
  };
  

  const goToSignIn = () => {
    showSignIn(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        maxHeight: "100vh",
        bgcolor: "#f5f7fa",
        p: 2,
        width: "100%",
      }}
    >
      <Card
        elevation={6}
        sx={{
          width: "100%",
          borderRadius: 2,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          overflow: "visible",
        }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid #eaedf3" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <IconButton onClick={goToSignIn} size="small" sx={{ mr: 1 }}>
              <ArrowBack fontSize="small" />
            </IconButton>
            <Typography variant="h5" fontWeight={700} color="#2A4DBD">
              Create Your Account
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Complete the steps below to set up your account
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          {error && error.message && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
              {error.message}
            </Alert>
          )}

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        bgcolor: activeStep >= index ? "#e3ecff" : "#f0f2f5",
                        color: activeStep >= index ? "#2A4DBD" : "#9e9e9e",
                      }}
                    >
                      {step.icon}
                    </Box>
                  )}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {formSubmitted ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "#f0f5ff",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Registration Successful!
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                Your account has been created successfully. You will be
                redirected to the login page shortly.
              </Typography>
              <Button
                variant="contained"
                onClick={goToSignIn}
                sx={{
                  py: 1.5,
                  px: 4,
                  backgroundColor: "#2A4DBD",
                  fontWeight: 600,
                  borderRadius: 1.5,
                  textTransform: "none",
                }}
              >
                Go to Login
              </Button>
            </Paper>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: activeStep === 0 ? "block" : "none" }}>
                <PersonalInfoFields
                  formData={formData}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  formError={formError}
                />
              </Box>

              <Box sx={{ display: activeStep === 1 ? "block" : "none" }}>
                <Box sx={{ display: activeStep === 1 ? "block" : "none" }}>
                  <ContactFields
                    formData={formData}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    formError={formError}
                    isEmailVerified={isEmailVerified} // Pass parent's state
                    onEmailVerificationClick={() =>
                      setIsEmailVerificationOpen(true)
                    } // Pass parent's handler
                  />
                </Box>
              </Box>

              <Box sx={{ display: activeStep === 2 ? "block" : "none" }}>
                <PasswordFields
                  formData={formData}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  formError={formError}
                />
              </Box>

              {/* Navigation Buttons */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    borderRadius: 1.5,
                    textTransform: "none",
                    borderColor: "#2A4DBD",
                    color: "#2A4DBD",
                    "&:hover": {
                      borderColor: "#1a3a8a",
                      backgroundColor: "#e3ecff",
                    },
                  }}
                >
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      px: 4,
                      backgroundColor: "#2A4DBD",
                      fontWeight: 600,
                      borderRadius: 1.5,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#1a3a8a",
                      },
                      "&:disabled": {
                        backgroundColor: "#a0a4b8",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={activeStep === 1 && !isEmailVerified}
                    sx={{
                      py: 1.5,
                      px: 4,
                      backgroundColor:
                        activeStep === 1 && !isEmailVerified
                          ? "#a0a4b8"
                          : "#2A4DBD",
                      fontWeight: 600,
                      borderRadius: 1.5,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor:
                          activeStep === 1 && !isEmailVerified
                            ? "#a0a4b8"
                            : "#1a3a8a",
                      },
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </form>
          )}
        </Box>
      </Card>

      {/* Email Verification Dialog */}
      <EmailVerificationDialog
        open={isEmailVerificationOpen}
        onClose={() => setIsEmailVerificationOpen(false)}
        email={formData.email}
        onVerificationSuccess={() => {
          setIsEmailVerified(true);
          setIsEmailVerificationOpen(false);
          toast.success("Email verified successfully!");
        }}
      />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
};

export default SignUpFormMain;
