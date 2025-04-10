import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  Paper,
  Button,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack, Email, VpnKey, LockReset } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import httpService from '../../Services/httpService';
import { showToast } from '../../utils/ToastNotification';



const steps = [
  {
    label: 'Verify Email',
    description: 'Enter your email address to receive an OTP',
    icon: <Email color="primary" />
  },
  {
    label: 'Enter OTP',
    description: 'Enter the 6-digit code sent to your email',
    icon: <VpnKey color="primary" />
  },
  {
    label: 'Reset Password',
    description: 'Create a new secure password',
    icon: <LockReset color="primary" />
  },
];

const ForgotPassword = ({ onSwitchView }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    otp: Yup.string()
      .when('step', (step, schema) => {
        return step === 1 
          ? schema.length(6, 'Must be exactly 6 digits').required('Required')
          : schema;
      }),
    password: Yup.string()
      .when('step', (step, schema) => {
        return step === 2
          ? schema
              .min(8, 'Password must be at least 8 characters')
              .matches(/\d/, 'Password must contain at least one number')
              .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
              .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
              .required('Required')
          : schema;
      }),
    confirmPassword: Yup.string()
      .when('step', (step, schema) => {
        return step === 2
          ? schema
              .oneOf([Yup.ref('password'), null], 'Passwords must match')
              .required('Required')
          : schema;
      })
  });

  const initialValues = {
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
    step: 0
  };

  const handleSubmit = async (values, { setSubmitting, setFieldValue }) => {
    try {
      setLoading(true);

      if (activeStep === 0) {
        // Step 1: Send OTP
        const response = await httpService.post("/users/send-otp", { email: values.email });
        if (!response.data.success) {
          throw new Error(response.data.message || "User not found.");
        }
        showToast("OTP sent successfully! Please check your email.", "success");
        setActiveStep(1);
        setFieldValue('step', 1);
      } else if (activeStep === 1) {
        // Step 2: Verify OTP
        const response = await httpService.post("/users/verify-otp", { 
          email: values.email, 
          otp: values.otp 
        });
        if (!response.data.success) {
          throw new Error("Invalid OTP. Please try again.");
        }
        showToast("OTP verified successfully!", "success");
        setActiveStep(2);
        setFieldValue('step', 2);
      } else {
        // Step 3: Reset Password
        const response = await httpService.post("/users/update-password", { 
          email: values.email, 
          updatePassword: values.password, 
          confirmPassword: values.confirmPassword 
        });
        if (!response.data.success) {
          throw new Error("Error resetting password. Please try again.");
        }
        showToast("Password reset successfully! Redirecting to login...", "success");
        setTimeout(() => onSwitchView('login'), 3000);
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || "An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Paper elevation={3} sx={{ width: "100%", p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => onSwitchView('login')} size="small" sx={{ mr: 1 }}>
          <ArrowBack fontSize="small" />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>Reset Password</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Follow the steps below to reset your password
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel StepIconComponent={() => step.icon}>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {step.label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {step.description}
                    </Typography>
                    
                    {index === 0 && (
                      <TextField
                        fullWidth
                        name="email"
                        label="Email Address"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        disabled={loading}
                        sx={{ mb: 3 }}
                      />
                    )}

                    {index === 1 && (
                      <TextField
                        fullWidth
                        name="otp"
                        label="OTP Code"
                        value={values.otp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.otp && Boolean(errors.otp)}
                        helperText={touched.otp && errors.otp}
                        disabled={loading}
                        inputProps={{ maxLength: 6 }}
                        sx={{ mb: 3 }}
                      />
                    )}

                    {index === 2 && (
                      <>
                        <TextField
                          fullWidth
                          name="password"
                          label="New Password"
                          type={showPassword ? "text" : "password"}
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.password && Boolean(errors.password)}
                          helperText={touched.password && errors.password}
                          disabled={loading}
                          sx={{ mb: 3 }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton 
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          name="confirmPassword"
                          label="Confirm Password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                          helperText={touched.confirmPassword && errors.confirmPassword}
                          disabled={loading}
                          sx={{ mb: 3 }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton 
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </>
                    )}

                    <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || isSubmitting}
                        sx={{
                          py: 1,
                          fontWeight: 600,
                          textTransform: "none"
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : index === steps.length - 1 ? (
                          "Reset Password"
                        ) : (
                          "Continue"
                        )}
                      </Button>

                      {index > 0 && (
                        <Button
                          onClick={handleBack}
                          variant="outlined"
                          disabled={loading}
                          sx={{
                            py: 1,
                            textTransform: "none",
                            fontWeight: 600
                          }}
                        >
                          Back
                        </Button>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default ForgotPassword;