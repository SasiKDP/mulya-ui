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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  submitFormData,
  updateFormData,
  clearFormData,
} from "../../redux/features/formSlice";
import "react-toastify/dist/ReactToastify.css";

const RegistrationForm = () => {
  const [showAlert, setShowAlert] = useState(false);
  const { status, error, response } = useSelector((state) => state.form || {});
  const dispatch = useDispatch();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Validation functions
  const validateUserId = (userId) => {
    if (!userId) return "User ID is required";
    return "";
  };
  const validateUserName = (userName) => {
    if (!userName) return "User Name is required";
    return "";
  };
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };
  const validatePersonalEmail = (personalemail) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!personalemail) return "Personal Email is required";
    if (!emailRegex.test(personalemail)) return "Invalid email format";
    return "";
  };
  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "Phone Number is required";
    if (!/^\d{10}$/.test(phoneNumber)) return "Phone Number must be 10 digits";
    return "";
  };
  const validateGender = (gender) => {
    if (!gender) return "Gender is required";
    return "";
  };
  const validateDOB = (dob) => {
    if (!dob) return "Date of Birth is required";
    return "";
  };
  const validateJoiningDate = (joiningDate, dob) => {
    if (!joiningDate) return "Joining Date is required";
    if (joiningDate < dob) return "Joining Date cannot be before Date of Birth";
    return "";
  };
  const validatePassword = (password) => {
    if (!password) return "Password is required";
    return "";
  };
  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword !== formData.password)
      return "Passwords do not match";
    return "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  
    // Call the corresponding validation function directly
    let errorMessage = "";
    switch (name) {
      case "userId":
        errorMessage = validateUserId(value);
        break;
      case "userName":
        errorMessage = validateUserName(value);
        break;
      case "email":
        errorMessage = validateEmail(value);
        break;
      case "personalemail":
        errorMessage = validatePersonalEmail(value);
        break;
      case "phoneNumber":
        errorMessage = validatePhoneNumber(value);
        break;
      case "gender":
        errorMessage = validateGender(value);
        break;
      case "dob":
        errorMessage = validateDOB(value);
        break;
      case "joiningDate":
        errorMessage = validateJoiningDate(value, formData.dob);
        break;
      case "password":
        errorMessage = validatePassword(value);
        break;
      case "confirmPassword":
        errorMessage = validateConfirmPassword(value);
        break;
      default:
        break;
    }
  
    setFormError((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    dispatch(updateFormData({ name, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
    };

    if (Object.values(errors).some((error) => error !== "")) {
      setFormError(errors);
      return;
    }

    dispatch(submitFormData(formData));
  };

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
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const isFormValid = Object.values(formError).every((error) => error === "");

  return (
    <Box
      sx={{
        width: "90%",
        maxWidth: { xs: 320, sm: 600, md: 900 , lg:1100 },
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "white",
        height: "auto",
        margin: "auto", // Center the form horizontally
      }}
    >
      {showAlert && response && (
        <Alert severity={status === "succeeded" ? "success" : "error"} sx={{ mb: 2 }}>
          {status === "succeeded" ? (
            <>
              Registration Successful! <br />
              <strong>User ID:</strong> {response?.data?.userId}, <strong>Email:</strong> {response?.data?.email}
            </>
          ) : (
            <>
              Registration Failed: {response?.error?.errormessage || "An unknown error occurred."}
              <br />
              <strong>Error Code:</strong> {response?.error?.errorcode}
            </>
          )}
        </Alert>
      )}

      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="start" // Center the title
        sx={{
          color: theme.palette.text.primary,
          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
          backgroundColor: "rgba(232, 245, 233)",
          padding: "0.6rem",
          borderRadius: 2,
        }}
      >
        Add New Employee
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}> {/* Increased spacing for better form layout */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Employee ID"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              variant="filled"
              error={!!formError.userId}
              helperText={formError.userId}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Employee Name"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              variant="filled"
              error={!!formError.userName}
              helperText={formError.userName}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Company Email"
              name="email"
              type="email"
              variant="filled"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              error={!!formError.email}
              helperText={formError.email}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Personal Email"
              name="personalemail"
              type="email"
              variant="filled"
              value={formData.personalemail}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              error={!!formError.personalemail}
              helperText={formError.personalemail}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              type="number"
              variant="filled"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              error={!!formError.phoneNumber}
              helperText={formError.phoneNumber}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              variant="filled"
              value={formData.dob}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              error={!!formError.dob}
              helperText={formError.dob}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth error={!!formError.gender}>
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                name="gender"
                variant="filled"
                value={formData.gender}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {formError.gender && <Typography color="error">{formError.gender}</Typography>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Joining Date"
              name="joiningDate"
              type="date"
              variant="filled"
              value={formData.joiningDate}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              error={!!formError.joiningDate}
              helperText={formError.joiningDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Password"
              name="password"
              variant="filled"
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
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              variant="filled"
              fullWidth
              error={!!formError.confirmPassword}
              helperText={formError.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "end", mt: 3 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ width: "200px", marginRight: "20px" }}
            disabled={!isFormValid}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            type="button"
            onClick={handleClear}
            sx={{ width: "200px" }}
          >
            Clear
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default RegistrationForm;
