// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Alert,
//   CircularProgress,
//   Grid,
//   Typography, // Added Typography component for displaying title
// } from "@mui/material";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   sendOtpAsync,
//   resetPasswordAsync,
//   setEmail,
//   setOtp,
//   setStep,
//   clearError,
//   verifyOtpAsync,
// } from "../redux/features/forgotPasswordSlice";
// import { useNavigate } from "react-router-dom";

// const ForgotPassword = ({ goBack }) => {
//   const { email, enteredOtp, step, loading, error } = useSelector(
//     (state) => state.forgotPassword
//   );

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [updatePassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [validationError, setValidationError] = useState("");

//   // Function to get the title based on the current step
//   const getTitle = () => {
//     switch (step) {
//       case 1:
//         return ""; // Step 1 title
//       case 2:
//         return "Verify OTP"; // Step 2 title
//       case 3:
//         return "Update Password"; // Step 3 title
//       default:
//         return "Forgot Password";
//     }
//   };

//   // Submit Email (Step 1)
//   const handleEmailSubmit = () => {
//     if (!email) {
//       setValidationError("Please enter your official email ");
//       return;
//     }
//     setValidationError("");
//     dispatch(sendOtpAsync(email));
//   };

//   // Verify OTP (Step 2)
//   // const handleOtpVerify = () => {
//   //   if (!enteredOtp) {
//   //     setValidationError("Please enter OTP");
//   //     return;
//   //   }
//   //   setValidationError("");
//   //   dispatch(setStep(3)); // Move to password reset step
//   // };

//   const handleOtpVerify = () => {
//     if (!enteredOtp) {
//       setValidationError("Please enter OTP");
//       return;
//     }
//     setValidationError("");

//     // Dispatch the async action to verify OTP
//     dispatch(verifyOtpAsync({ email, otp: enteredOtp }))
//       .unwrap() // Unwraps the action to access the result directly
//       .then(() => {
//         // OTP is verified successfully, move to step 3 (Password reset)
//         dispatch(setStep(3));
//       })
//       .catch((error) => {
//         // Handle error, show error message
//         setValidationError(error || "Something went wrong");
//       });
//   };

//   // Submit New Password (Step 3)
//   const handleNewPasswordSubmit = () => {
//     if (!updatePassword || !confirmPassword) {
//       setValidationError("Please fill in both password fields");
//       return;
//     }
//     if (updatePassword !== confirmPassword) {
//       setValidationError("Passwords do not match");
//       return;
//     }
//     setValidationError("");

//     // Check if the email is correctly set before making the API call
//     if (!email) {
//       setValidationError("Email is missing");
//       return;
//     }

//     // Dispatch the reset password action
//     dispatch(resetPasswordAsync({ email, updatePassword, confirmPassword }))
//       .then((result) => {
//         if (!result.error) {
//           // Clear OTP and reset to Step 1 after successful password reset
//           dispatch(setOtp(""));
//           dispatch(setStep(1));
//           // navigate("/");
//           goBack();
//         }
//       })
//       .catch((err) => {
//         console.log("Error resetting password:", err);
//       });
//   };

//   // Clear validation error after successful actions
//   const handleClearError = () => {
//     setValidationError("");
//     dispatch(clearError());
//   };

//   return (
//     <>
//       {/* Display Error Messages */}
//       {validationError && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {validationError}
//         </Alert>
//       )}
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}
//       {loading && (
//         <CircularProgress sx={{ display: "block", margin: "10px auto" }} />
//       )}

//       {/* Step Title */}
//       <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 3 }}>
//         {getTitle()}
//       </Typography>

//       {/* Step 1: Email */}
//       {step === 1 && (
//         <>
//           <TextField
//             label="Email"
//             type="email"
//             fullWidth
//             margin="normal"
//             value={email}
//             onChange={(e) => dispatch(setEmail(e.target.value))}
//             sx={{ mb: 3 }}
//             onFocus={handleClearError}
//           />
//           <Grid
//             container
//             spacing={2}
//             justifyContent="flex-end"
//             alignItems="center"
//           >
//             <Grid item xs={12} sm={5} md={4}>
//               <Button
//                 variant="outlined"
//                 fullWidth
//                 onClick={goBack}
//                 sx={{
//                   fontSize: "16px",
//                   height: "45px",
//                   textTransform: "none",
//                   borderColor: "#5272F2",
//                   color: "#5272F2",
//                   "&:hover": {
//                     borderColor: "#4a6cdb",
//                     backgroundColor: "#f2f2f2",
//                   },
//                 }}
//               >
//                 Back
//               </Button>
//             </Grid>
//             <Grid item xs={12} sm={5} md={4}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 onClick={handleEmailSubmit}
//                 disabled={loading}
//                 sx={{
//                   backgroundColor: "#5272F2",
//                   "&:hover": { backgroundColor: "#4a6cdb" },
//                   fontSize: "16px",
//                   height: "45px",
//                   textTransform: "none",
//                 }}
//               >
//                 {loading ? (
//                   <CircularProgress size={24} sx={{ color: "#fff" }} />
//                 ) : (
//                   "Send OTP"
//                 )}
//               </Button>
//             </Grid>
//           </Grid>
//         </>
//       )}

//       {/* Step 2: OTP */}
//       {step === 2 && (
//         <>
//           <TextField
//             label="Enter OTP"
//             type="text"
//             fullWidth
//             margin="normal"
//             value={enteredOtp}
//             onChange={(e) => dispatch(setOtp(e.target.value))}
//             sx={{ mb: 3 }}
//             onFocus={handleClearError}
//           />
//           <Grid
//             container
//             spacing={2}
//             justifyContent="flex-end"
//             alignItems="center"
//           >
//             <Grid item xs={12} sm={5} md={4}>
//               <Button
//                 variant="outlined"
//                 fullWidth
//                 onClick={goBack}
//                 sx={{
//                   fontSize: "16px",
//                   height: "45px",
//                   textTransform: "none",
//                   borderColor: "#5272F2",
//                   color: "#5272F2",
//                   "&:hover": {
//                     borderColor: "#4a6cdb",
//                     backgroundColor: "#f2f2f2",
//                   },
//                 }}
//               >
//                 Back
//               </Button>
//             </Grid>
//             <Grid item xs={12} sm={5} md={4}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 onClick={handleOtpVerify}
//                 disabled={loading}
//                 sx={{
//                   backgroundColor: "#5272F2",
//                   "&:hover": { backgroundColor: "#4a6cdb" },
//                   fontSize: "16px",
//                   height: "45px",
//                   textTransform: "none",
//                 }}
//               >
//                 {loading ? (
//                   <CircularProgress size={24} sx={{ color: "#fff" }} />
//                 ) : (
//                   "Verify OTP"
//                 )}
//               </Button>
//             </Grid>
//           </Grid>
//         </>
//       )}

//       {/* Step 3: New Password */}
//       {step === 3 && (
//         <>
//           <TextField
//             label="New Password"
//             type="password"
//             fullWidth
//             margin="normal"
//             value={updatePassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             sx={{ mb: 3 }}
//           />
//           <TextField
//             label="Confirm Password"
//             type="password"
//             fullWidth
//             margin="normal"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             sx={{ mb: 3 }}
//           />
//           <Grid
//             container
//             spacing={2}
//             justifyContent="flex-end"
//             alignItems="center"
//           >
//             <Grid item xs={12} sm={5} md={4}>
//               <Button
//                 variant="outlined"
//                 fullWidth
//                 onClick={goBack}
//                 sx={{
//                   fontSize: "16px",
//                   height: "45px",
//                   textTransform: "none",
//                   borderColor: "#5272F2",
//                   color: "#5272F2",
//                   "&:hover": {
//                     borderColor: "#4a6cdb",
//                     backgroundColor: "#f2f2f2",
//                   },
//                 }}
//               >
//                 Back
//               </Button>
//             </Grid>
//             <Grid item xs={12} sm={5} md={4}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 onClick={handleNewPasswordSubmit}
//                 disabled={loading}
//                 sx={{
//                   backgroundColor: "#5272F2",
//                   "&:hover": { backgroundColor: "#4a6cdb" },
//                   fontSize: "16px",
//                   height: "45px",
//                   textTransform: "none",
//                 }}
//               >
//                 {loading ? (
//                   <CircularProgress size={24} sx={{ color: "#fff" }} />
//                 ) : (
//                   "Reset Password"
//                 )}
//               </Button>
//             </Grid>
//           </Grid>
//         </>
//       )}
//     </>
//   );
// };

// export default ForgotPassword;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import {
  sendOtpAsync,
  verifyOtpAsync,
  resetPasswordAsync,
  setEmail,
  setOtp,
  clearError,
  clearSuccess,
  resetState,
} from "../redux/features/forgotPasswordSlice";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, enteredOtp, loading, step, error, success, isSubmitting } =
    useSelector((state) => state.forgotPassword);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  useEffect(() => {
    // Clear messages after 5 seconds
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
        dispatch(clearSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    if (!/\d/.test(password)) {
      errors.password = "Password must contain at least one number";
    }
    if (!/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      errors.password = "Password must contain at least one lowercase letter";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.password = "Password must contain at least one special character";
    }
    return errors;
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setValidationErrors({ email: "Please enter a valid email address" });
      return;
    }
    setValidationErrors({});
    await dispatch(sendOtpAsync(email));
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.length !== 6) {
      setValidationErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }
    setValidationErrors({});
    await dispatch(verifyOtpAsync({ email, otp: enteredOtp }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const errors = validatePassword(password);

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    await dispatch(
      resetPasswordAsync({
        email,
        updatePassword: password,
        confirmPassword,
      })
    );
  };

  const handleBack = () => {
    if (step === 1) {
      navigate("/"); // Navigate to the root URL when step is 1
    } else if (step > 1) {
      dispatch({ type: "forgotPassword/setStep", payload: step - 1 });
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
              onChange={(e) => dispatch(setEmail(e.target.value))}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              disabled={isSubmitting}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ flex: 1 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Send OTP"}
              </Button>

              <Button
                variant="outlined"
                sx={{ flex: 1 }}
                onClick={handleBack}
                disabled={isSubmitting || step === 1}
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
              onChange={(e) => dispatch(setOtp(e.target.value))}
              error={!!validationErrors.otp}
              helperText={validationErrors.otp}
              disabled={isSubmitting}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ flex: 1 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Verify OTP"}
              </Button>

              <Button
                variant="outlined"
                sx={{ flex: 1 }}
                onClick={handleBack}
                disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Reset"}
              </Button>

              <Button
                variant="outlined"
                sx={{ width: "48%", height:'5%' }}
                onClick={handleBack}
                disabled={isSubmitting}
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
