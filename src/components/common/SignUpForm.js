import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tooltip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SignIn from "./SignIn";
import SignUpFromLeftSide from "./SignUpFromLeftSide";
import { useSelector, useDispatch } from "react-redux";
import {
  submitFormData,
  updateFormData,
  clearFormData,
} from "../../redux/features/formSlice";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import "react-toastify/dist/ReactToastify.css";
import EmailVerificationDialog from "./EmailVerificationDialog";

import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import EmailIcon from "@mui/icons-material/Email";

const SignUpForm = () => {
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const { status, error, response } = useSelector((state) => state.form || {});
  const dispatch = useDispatch();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);

  const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    password: "",
    confirmPassword: "",
    email: "",
    personalemail: "",
    phoneNumber: "",
    designation: "",
    gender: "",
    joiningDate: "",
    dob: "",

    roles: ["EMPLOYEE"],
  });

  const [touchedFields, setTouchedFields] = useState({});
  const [formError, setFormError] = useState({});

  // Validation regex
  // const userIdRegex = /^DQIND\d{2,4}$/;
  const personalEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const emailRegex = /^[a-z0-9._%+-]+@dataqinc\.com$/;
  const phoneRegex = /^[0-9]{10}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Custom validation functions
  const validateUserId = (userId) => {
    const userIdRegex = /^DQIND\d{2,4}$/; // Ensures the ID starts with "DQIND" followed by 2 to 4 digits
    return userIdRegex.test(userId)
      ? ""
      : "User ID must start with 'DQIND' followed by 2 to 4 digits";
  };

  const validateUserName = (userName) => {
    // Check if username has only alphabetic characters and no spaces
    const regex = /^[a-zA-Z\s]+$/;

    if (!regex.test(userName)) {
      return "User Name must contain only alphabetic characters (a-z, A-Z) and no spaces.";
    }

    // Check if the username length exceeds 20 characters
    if (userName.length > 20) {
      return "User Name must not exceed 20 characters";
    }

    // If no issues, return an empty string (valid)
    return "";
  };

  const validateEmail = (email) => {
    // Check if email contains capital letters
    if (/[A-Z]/.test(email)) {
      return "please enter a valid email without capital letters";
    }

    // Validate the email format
    return emailRegex.test(email)
      ? ""
      : "please enter a valid email (example@dataqinc.com)";
  };

  const validatePhoneNumber = (phoneNumber) => {
    // Remove all non-digit characters
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

    // Check if the cleaned phone number has exactly 10 digits
    if (!cleanedPhoneNumber) {
      return "Phone number is required.";
    }
    if (cleanedPhoneNumber.length !== 10) {
      return "Phone number must be exactly 10 digits.";
    }
    if (!/^\d+$/.test(cleanedPhoneNumber)) {
      return "Phone number must only contain numbers.";
    }

    return "";
  };

  const validateDesignation = (designation) => {
    // Regex for only letters and spaces
    const designationRegex = /^[A-Za-z\s]+$/;

    // If the designation is empty or doesn't match the regex, return the error message
    if (!designation) {
      return "Designation is required";
    }
    if (!designationRegex.test(designation)) {
      return "Designation should only contain letters and spaces";
    }

    // If all validations pass, return an empty string (valid)
    return "";
  };

  const validatePersonalEmail = (personalemail) =>
    personalEmailRegex.test(personalemail)
      ? ""
      : "Please enter a valid personal email like example@gmail.com";

  const validateGender = (gender) => (gender ? "" : "Please select a gender");

  const validateDOB = (dob) => {
    if (!dob) return "Date of birth is required"; // Check if DOB is empty

    let today = new Date();
    let birthDate = new Date(dob);

    // Check if birthDate is in the future
    if (birthDate > today) return "Date of birth cannot be in the future";

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    let monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust age if birth month/day is later in the year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Check if age exceeds 20 years
    if (age < 20) return "Age must be at least 20 years";

    return ""; // Return an empty string if DOB is valid
  };

  const validateJoiningDate = (joiningDate, dob) => {
    if (!joiningDate) return "Joining date is required";

    const birthDate = new Date(dob);
    const joinDate = new Date(joiningDate);
    const currentDate = new Date();

    // Ensure joining date is after the date of birth
    if (joinDate <= birthDate) {
      return "Joining date must be after date of birth";
    }

    // Calculate the one-month range
    const oneMonthBefore = new Date();
    oneMonthBefore.setMonth(currentDate.getMonth() - 1);

    const oneMonthAfter = new Date();
    oneMonthAfter.setMonth(currentDate.getMonth() + 1);

    if (joinDate < oneMonthBefore || joinDate > oneMonthAfter) {
      return "Joining date must be within one month before or after today's date";
    }

    return "";
  };

  const validatePassword = (password) =>
    passwordRegex.test(password)
      ? ""
      : "Password must be at least 8 characters, include uppercase, lowercase, digit, and special character";

  const validateConfirmPassword = (confirmPassword) =>
    confirmPassword === formData.password ? "" : "Passwords do not match";

  const validateField = (name, value) => {
    switch (name) {
      case "userId":
        return validateUserId(value);
      case "userName":
        return validateUserName(value);
      case "email":
        return validateEmail(value);
      case "personalemail":
        return validatePersonalEmail(value);
      case "phoneNumber":
        return validatePhoneNumber(value);
      case "gender":
        return validateGender(value);
      case "designation":
        return validateDesignation(value);
      case "dob":
        return validateDOB(value);
      case "joinigDate":
        return validateJoiningDate(value);
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return validateConfirmPassword(value);
      case "joiningDate":
        return value ? "" : "Joining Date is required";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (status === "failed" && error) {
      const apiErrors = {};
      if (error.message === "userId already exists") {
        apiErrors.userId = "User ID already exists";
      }
      setFormError(apiErrors); // Set the error state from API response
    }
  }, [status, error]);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    setFormError((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For other fields, simply update the state as usual
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Dispatch the updated value
    dispatch(updateFormData({ name, value }));
  };

  // const handleRoleChange = (selectedRole) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     roles: [selectedRole],
  //   }));
  //   dispatch(updateFormData({ name: "roles", value: [selectedRole] }));
  // };

  // Handle form submission

  const handleJoiningDateChange = (event) => {
    const joiningDate = event.target.value;
    const dob = formData.dob; // Get the date of birth from the form data
    const error = validateJoiningDate(joiningDate, dob);

    setFormError((prev) => ({
      ...prev,
      joiningDate: error, // Update the error state for the joining date field
    }));

    // Update the formData as well
    setFormData((prevData) => ({
      ...prevData,
      joiningDate: joiningDate,
    }));
  };

  useEffect(() => {
    if (status === "loading") {
      toast.info("Registring... Please wait."); // Loading toast
    }

    if (status === "succeeded" && response) {
      const { userId, email } = response.data;

      toast.success(
        <Box>
          <Typography variant="h6">Created Successfully!</Typography>
          <Typography variant="body2">UserID: {userId}</Typography>
          <Typography variant="body2">Email: {email}</Typography>
        </Box>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
        }
      );
      dispatch(clearFormData());
    }

    if (status === "failed" && error.general) {
      // Extract errormessage if available
      const errorMessage =
        typeof error.general === "object"
          ? error.general.errormessage || "An unknown error occurred."
          : error.general;

      toast.error(errorMessage); // Show the error message in the toast
    }
  }, [status, response, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    const errors = {
      userId: validateUserId(formData.userId),
      userName: validateUserName(formData.userName),
      email: validateEmail(formData.email),
      personalemail: validatePersonalEmail(formData.personalemail),
      phoneNumber: validatePhoneNumber(formData.phoneNumber),
      gender: validateGender(formData.gender),
      dob: validateDOB(formData.dob),
      joiningDate: validateJoiningDate(formData.joiningDate, formData.dob),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
      designation: validateDesignation(formData.designation),
    };

    if (Object.values(errors).some((error) => error !== "")) {
      setFormError(errors);
      return;
    }

    if (!isEmailVerified) {
      setIsEmailVerificationOpen(true);
      return;
    }

    // Dispatch the form data
    dispatch(submitFormData(formData));
  };

  // Clear the form

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // timer for the registration success message
  useEffect(() => {
    if (status === "succeeded" || (status === "failed" && response)) {
      setShowAlert(true); // Show the alert

      // Reset form data
      setFormData({
        userId: "",
        userName: "",
        password: "",
        confirmPassword: "",
        email: "",
        personalemail: "",
        phoneNumber: "",
        designation: "",
        gender: "",
        joiningDate: "",
        dob: "",
        roles: ["EMPLOYEE"],
      });

      // Clear form data and navigate after showing the alert
      setShowAlert(false);
      dispatch(clearFormData());
      setIsSignIn(true);
      navigate("/");
    }
  }, [status, response, dispatch, navigate]); // Ensure all dependencies are included

  const isFormValid = Object.values(formError).every((error) => error === "");

  const handleClear = () => {
    dispatch(clearFormData());
    setFormData({
      userId: "",
      userName: "",
      password: "",
      confirmPassword: "",
      email: "",
      personalemail: "",
      phoneNumber: "",
      designation: "",
      gender: "",
      joiningDate: "",
      dob: "",
      roles: ["EMPLOYEE"],
    });

    setFormError({});
    window.location.reload();

  };

  return (
    <Grid container style={{ height: "100vh" }}>
      {/* Left Half (Animation Component) */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          position: "relative",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <SignUpFromLeftSide />
      </Grid>

      {/* Right Half (Form) */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",

          justifyContent: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: { xs: 320, sm: 400, md: 500 },
            p: { xs: 2, sm: 3 },
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "white",
            height: "auto",
          }}
        >
          {isSignIn ? (
            <SignIn />
          ) : (
            <>
              {showAlert && response && (
                <Alert
                  severity={status === "succeeded" ? "success" : "error"}
                  sx={{ mb: 2 }}
                >
                  {status === "succeeded" ? (
                    <>
                      Registration Successful! <br />
                      <strong>User ID:</strong> {response?.data?.userId},{" "}
                      <strong>Email:</strong> {response?.data?.email}
                    </>
                  ) : (
                    <>
                      Registration Failed:{" "}
                      {error.general || "An unknown error occurred."}
                      <br />
                      <strong>Error Code:</strong>{" "}
                      {error.general ? "300" : "No error code available"}
                    </>
                  )}
                </Alert>
              )}

              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="left"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" },
                  backgroundColor: "rgba(232, 245, 233)",
                  padding: "0.5rem",
                  borderRadius: 2,
                }}
              >
                Registration
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* User ID Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      placeholder="DQIND001"
                      label="Employee ID"
                      name="userId"
                      type="text"
                      value={formData.userId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.userId}
                      helperText={formError.userId}
                    />
                  </Grid>

                  {/* User Name Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      placeholder="Enter You Name "
                      label="Employee Name"
                      name="userName"
                      type="text"
                      value={formData.userName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.userName}
                      helperText={formError.userName}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="Official Email Id"
                      name="email"
                      type="email"
                      placeholder="@dataqinc.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.email}
                      helperText={formError.email}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {!isEmailVerified ? (
                              <Tooltip
                                title={
                                  isEmailVerified
                                    ? "Email Verified"
                                    : "Verify Email"
                                }
                              >
                                <IconButton
                                  onClick={() => {
                                    if (formData.email && !formError.email) {
                                      setIsEmailVerificationOpen(true);
                                    } else {
                                      toast.error(
                                        "Please enter a valid email first!"
                                      );
                                    }
                                  }}
                                  color={
                                    isEmailVerified ? "success" : "primary"
                                  }
                                  disabled={
                                    !formData.email || !!formError.email
                                  } // Disable if email is invalid
                                >
                                  {isEmailVerified ? (
                                    <VerifiedUserIcon />
                                  ) : (
                                    <EmailIcon />
                                  )}
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <VerifiedUserIcon color="success" />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Email Verification Dialog */}
                  <EmailVerificationDialog
                    open={isEmailVerificationOpen}
                    onClose={() => setIsEmailVerificationOpen(false)}
                    email={formData.email}
                    onVerificationSuccess={() => {
                      setIsEmailVerified(true);
                      toast.success("✅ Email Verified Successfully!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                      });
                    }}
                  />

                  {/* Personal Email Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Employee Personal Email"
                      name="personalemail"
                      placeholder="@gmail.com"
                      type="email"
                      value={formData.personalemail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.personalemail}
                      helperText={formError.personalemail}
                    />
                  </Grid>

                  {/* Phone Number Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      type="number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.phoneNumber}
                      helperText={formError.phoneNumber}
                    />
                  </Grid>

                  {/* Designation Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      placeholder="e.g.  Marketing Manager"
                      label="Employee Designation"
                      name="designation"
                      type="text"
                      value={formData.designation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.designation}
                      helperText={formError.designation}
                    />
                  </Grid>

                  {/* Gender Field */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={formData.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder=""
                        label="Gender"
                        name="gender"
                        error={!!formError.gender}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block" }}
                      >
                        {formError.gender}
                      </Typography>
                    </FormControl>
                  </Grid>

                  {/* Date of Birth Field */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.dob}
                      helperText={formError.dob}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  {/* Joining Date Field */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Joining Date"
                      name="joiningDate"
                      type="date"
                      value={formData.joiningDate}
                      onChange={handleJoiningDateChange}
                      onBlur={handleBlur} // Optional: Validate on blur
                      error={!!formError.joiningDate} // Show error if any
                      helperText={formError.joiningDate} // Display error message
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        inputProps: {
                          min: new Date(
                            new Date().setMonth(new Date().getMonth() - 1)
                          )
                            .toISOString()
                            .split("T")[0], // Minimum date: One month before
                          max: new Date(
                            new Date().setMonth(new Date().getMonth() + 1)
                          )
                            .toISOString()
                            .split("T")[0], // Maximum date: One month after
                        },
                      }}
                    />
                  </Grid>

                  {/* Password Field */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Password"
                      name="password"
                      placeholder="Example@123"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.password}
                      helperText={formError.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword}>
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Confirm Password Field */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.confirmPassword}
                      helperText={formError.confirmPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowConfirmPassword}
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Submit and Clear Buttons */}
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid && !isEmailVerified }
                  >
                    Register
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                </Box>
              </form>
            </>
          )}
        </Box>

        {/* Toggle Login/Register */}
        <Box sx={{ position: "absolute", top: "8px", right: "8px" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setIsSignIn(!isSignIn)}
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: { xs: "0.8rem", md: "1rem" },
              fontWeight: "200",
              padding: { xs: "4px 8px", md: "6px 12px" },
            }}
          >
            {isSignIn ? (
              <>
                <PersonAddIcon
                  fontSize="small"
                  sx={{ marginRight: "2px", padding: "2px" }}
                />{" "}
                Register
              </>
            ) : (
              <>
                <LoginIcon
                  fontSize="small"
                  sx={{ marginRight: "2px", padding: "2px" }}
                />{" "}
                LogIn
              </>
            )}
          </Button>
        </Box>
      </Grid>
      <ToastContainer />
    </Grid>
  );
};

export default SignUpForm;
