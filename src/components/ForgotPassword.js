import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../redux/config";
//import appconfig.PROD_appconfig.PROD_BASE_URL from "../redux/apiConfig";



const API_ENDPOINTS = {
  SEND_OTP: `${BASE_URL}/users/send-otp`,
  VERIFY_OTP: `${BASE_URL}/users/verify-otp`,
  RESET_PASSWORD: `${BASE_URL}/users/update-password`,
};
const ForgotPassword = () => {
  const navigate = useNavigate();

  // State management
  const [email, setEmail] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step: 1: Email, 2: OTP, 3: Reset Password
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Clear success/error after 5 seconds
    if (success || error) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 8)
      errors.password = "Password must be at least 8 characters long";
    if (!/\d/.test(password))
      errors.password = "Password must contain at least one number";
    if (!/[A-Z]/.test(password))
      errors.password = "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      errors.password = "Password must contain at least one lowercase letter";
    if (!/[!@#$%^&*]/.test(password))
      errors.password = "Password must contain at least one special character";
    return errors;
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setValidationErrors({ email: "Please enter a valid email address" });
      return;
    }
    setValidationErrors({});
    try {
      setLoading(true);
      const response = await axios.post(API_ENDPOINTS.SEND_OTP, { email });
      if (response.data.status === "error") {
        setError(response.data.message);
      } else {
        setSuccess("OTP has been sent to your email");
        setStep(2);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.length !== 6) {
      setValidationErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }
    setValidationErrors({});
    try {
      setLoading(true);
      const response = await axios.post(API_ENDPOINTS.VERIFY_OTP, {
        email,
        otp: enteredOtp,
      });
      if (response.data.success) {
        setSuccess("OTP verified successfully");
        setStep(3); // Proceed to Reset Password step
      } else {
        setError(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    const errors = validatePassword(password);
  
    // Check if passwords match
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
  
    setValidationErrors({});
    try {
      setLoading(true);
      const response = await axios.post(API_ENDPOINTS.RESET_PASSWORD, {
        email,
        updatePassword: password,
        confirmPassword,
      });
  
      // Handle success or error response
      if (response.data.success) {
        setSuccess(response.data.message); // Show success message
        setStep(1); // Reset to email step
        clearFormFields(); // Clear all form fields
      } else {
        setError(response.data.message || "An error occurred while resetting password.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Function to clear form fields
  const clearFormFields = () => {
    setEmail("");
    setEnteredOtp("");
    setPassword("");
    setConfirmPassword("");
  };
  
  const handleBack = () => {
    if (step === 1) {
      //navigate("/"); // Navigate to the root URL when step is 1
      window.location.reload();
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Box component="form" onSubmit={handleSubmitEmail} noValidate>
            <Typography variant="h6" gutterBottom>
              Enter your email address
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              disabled={loading}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Send OTP"}
              </Button>

              <Button
                variant="outlined"
                sx={{ flex: 1 }}
                onClick={handleBack}
                //disabled={loading || step === 1}
              >
                Back
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box component="form" onSubmit={handleVerifyOtp} noValidate>
            <Typography variant="h6" gutterBottom>
              Enter OTP
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="OTP"
              type="text"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              error={!!validationErrors.otp}
              helperText={validationErrors.otp}
              disabled={loading}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Verify OTP"}
              </Button>

              <Button
                variant="outlined"
                sx={{ flex: 1 }}
                onClick={handleBack}
                disabled={loading}
              >
                Back
              </Button>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box component="form" onSubmit={handleResetPassword} noValidate>
            <Typography variant="h6" gutterBottom>
              Reset Password
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              disabled={loading}
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
              margin="normal"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ flex: 1, mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Reset"}
              </Button>

              <Button
                variant="outlined"
                sx={{ width: "48%", height: "5%" }}
                onClick={handleBack}
                disabled={loading}
              >
                Back
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 1, mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        {renderStep()}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
