import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
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
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { submitFormData, clearFormData } from "../../redux/features/formSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUser = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { status, error, response } = useSelector((state) => state.form || {});

  const availableRoles = ["ADMIN", "EMPLOYEE", "SUPERADMIN"];

  const SignUpSchema = Yup.object().shape({
    userId: Yup.string()
      .matches(
        /^DQIND\d{2,4}$/,
        "User ID must start with 'DQIND' followed by 2 to 4 digits"
      )
      .required("User ID is required"),
      userName: Yup.string()
      .matches(/^[a-zA-Z]+$/, "User Name must only contain letters")
      .min(1, "User Name must be at least 1 character")
      .max(20, "User Name must not exceed 20 characters")
      .required("User Name is required"),
    email: Yup.string()
      .matches(
        /^[a-z0-9._%+-]+@dataqinc\.com$/,
        "Please enter a valid company email (lowercase only)"
      )
      .required("Company email is required"),
    personalemail: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid personal email"
      )
      .required("Personal email is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
      designation: Yup.string()
      .required("Designation is required")
      .matches(/^[A-Za-z\s]+$/, "Designation can only contain letters and spaces"),
    gender: Yup.string().required("Gender is required"),
    roles: Yup.array()
      .min(1, "At least one role must be selected")
      .required("Roles are required"),
    dob: Yup.date()
      .max(new Date(), "Date of birth cannot be in the future")
      .test("age", "Must be at least 20 years old", function (value) {
        const cutoff = new Date();
        cutoff.setFullYear(cutoff.getFullYear() - 20);
        return value <= cutoff;
      })
      .required("Date of birth is required"),
    joiningDate: Yup.date()
      .min(
        new Date(new Date().setMonth(new Date().getMonth() - 2)),
        "Joining date must be within the last 2 months"
      )
      .max(
        new Date(new Date().setMonth(new Date().getMonth() + 2)),
        "Joining date must be within the next 2 months"
      )
      .required("Joining date is required")
      .max(
        new Date(new Date().setMonth(new Date().getMonth() + 1)),
        "Joining date cannot be more than a month in the future"
      )
      .required("Joining date is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be 8+ characters with uppercase, lowercase, number, special character"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(submitFormData(values)).unwrap();
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to Registering user");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (status === "loading") {
      toast.info("Processing...");
    }

    if (status === "failed" && error?.general) {
      const errorMessage =
        typeof error.general === "object"
          ? error.general.errormessage || "An unknown error occurred."
          : error.general;
      toast.error(errorMessage);
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
  }, [status, error, response, dispatch]);

  return (
    <>
      <ToastContainer />
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography
          variant="h5"
          align="start"
          color="primary"
          gutterBottom
          sx={{
            backgroundColor: "rgba(232, 245, 233)",
            padding: 1,
            borderRadius: 1,
            textAlign: "start",
          }}
        >
          ADD USER
        </Typography>

        <Formik
          initialValues={{
            userId: "",
            userName: "",
            email: "",
            personalemail: "",
            phoneNumber: "",
            designation: "",
            gender: "",
            roles: ["EMPLOYEE"],
            dob: "",
            joiningDate: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({
            errors,
            touched,
            isSubmitting,
            isValid,
            values,
            setFieldValue,
          }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="userId"
                    label="Employee ID"
                    fullWidth
                    error={touched.userId && Boolean(errors.userId)}
                    helperText={touched.userId && errors.userId}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="userName"
                    label="Employee Name"
                    fullWidth
                    error={touched.userName && Boolean(errors.userName)}
                    helperText={touched.userName && errors.userName}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="email"
                    label="Official Email"
                    fullWidth
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="personalemail"
                    label="Personal Email"
                    fullWidth
                    error={
                      touched.personalemail && Boolean(errors.personalemail)
                    }
                    helperText={touched.personalemail && errors.personalemail}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="phoneNumber"
                    label="Phone Number"
                    fullWidth
                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="designation"
                    label="Employee Designation"
                    fullWidth
                    error={touched.designation && Boolean(errors.designation)}
                    helperText={touched.designation && errors.designation}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormControl
                    fullWidth
                    error={touched.gender && Boolean(errors.gender)}
                    variant="outlined"
                  >
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Field
                      as={Select}
                      name="gender"
                      labelId="gender-label"
                      value={values.gender || ""}
                      onChange={(event) =>
                        setFieldValue("gender", event.target.value)
                      }
                      label="Gender"
                      fullWidth
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Field>
                    {touched.gender && errors.gender && (
                      <Typography variant="caption" color="error">
                        {errors.gender}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormControl
                    fullWidth
                    error={touched.roles && Boolean(errors.roles)}
                    variant="outlined"
                  >
                    <InputLabel id="roles-label">Roles</InputLabel>
                    <Field
                      as={Select}
                      name="roles"
                      value={values.roles}
                      onChange={(event) =>
                        setFieldValue("roles", [event.target.value])
                      }
                      labelId="roles-label"
                      renderValue={(selected) => selected}
                      label="Roles"
                      fullWidth
                    >
                      {availableRoles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Field>
                    {touched.roles && errors.roles && (
                      <Typography variant="caption" color="error">
                        {errors.roles}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="dob"
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={touched.dob && Boolean(errors.dob)}
                    helperText={touched.dob && errors.dob}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="joiningDate"
                    label="Joining Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      inputProps: {
                        min: new Date(
                          new Date().setMonth(new Date().getMonth() - 2)
                        )
                          .toISOString()
                          .split("T")[0],
                        max: new Date(
                          new Date().setMonth(new Date().getMonth() + 2)
                        )
                          .toISOString()
                          .split("T")[0],
                      },
                    }}
                    error={touched.joiningDate && Boolean(errors.joiningDate)}
                    helperText={touched.joiningDate && errors.joiningDate}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
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
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    error={
                      touched.confirmPassword && Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
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

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting || !isValid}
                    >
                      {isSubmitting ? "Registering..." : "Register"}
                    </Button>
                    <Button type="reset" variant="outlined">
                      Clear
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </>
  );
};

export default AddUser;
