import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Grid,
  Paper,
  CircularProgress,
  Stack,
  Divider,
  Card,
  CardContent,
  FormHelperText,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RefreshIcon from "@mui/icons-material/Refresh";
import SendIcon from "@mui/icons-material/Send";
import { fetchEmployees } from "../../redux/features/employeesSlice";
import {
  postJobRequirement,
  reduxResetForm,
  clearMessages,
} from "../../redux/features/jobFormSlice";
import RecruiterMultiSelect from "../MuiComponents/RecruiterMultiSelect";

// Validation Schema
const JobFormSchema = Yup.object().shape({
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
  jobDescription: Yup.string()
    .required("Job description is required")
    .min(20, "Job description must be at least 20 characters"),
  recruiterName: Yup.array()
    .min(1, "At least one recruiter must be selected")
    .required("At least one recruiter must be selected"),
});

// Custom Field Components
const CustomTextField = ({ field, form: { touched, errors }, ...props }) => (
  <TextField
    {...field}
    {...props}
    error={touched[field.name] && Boolean(errors[field.name])}
    helperText={touched[field.name] && errors[field.name]}
  />
);

const CustomSelect = ({
  field,
  form: { touched, errors },
  children,
  ...props
}) => (
  <FormControl
    fullWidth
    error={touched[field.name] && Boolean(errors[field.name])}
  >
    <InputLabel>{props.label}</InputLabel>
    <Select {...field} {...props}>
      {children}
    </Select>
    {touched[field.name] && errors[field.name] && (
      <FormHelperText>{errors[field.name]}</FormHelperText>
    )}
  </FormControl>
);

const JobForm = () => {
  const dispatch = useDispatch();
  const { status, error, jobPostingSuccessResponse } = useSelector(
    (state) => state.jobForm
  );
  const { employeesList, fetchStatus } = useSelector(
    (state) => state.employees
  );

  const recruiters = employeesList.filter(
    (emp) => emp.roles === "EMPLOYEE" && emp.status === "ACTIVE"
  );

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const initialValues = {
    jobTitle: "",
    clientName: "",
    jobDescription: "",
    jobType: "",
    location: "",
    jobMode: "",
    experienceRequired: "",
    noticePeriod: "",
    relevantExperience: "",
    qualification: "",
    recruiterIds: [],
    recruiterName: [],
    salaryPackage: "",
    noOfPositions: "",
    status: "In Progress",
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        backgroundColor: "#f8f9fa",
      },
      "&.Mui-focused": {
        backgroundColor: "#ffffff",
        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
      },
    },
  };

  useEffect(() => {
    if (status === "succeeded" && jobPostingSuccessResponse) {
      toast.success(
        `Job Created Successfully! Job Title: ${jobPostingSuccessResponse.jobTitle} Job ID: ${jobPostingSuccessResponse.jobId}`
      );
      dispatch(clearMessages());
      dispatch(reduxResetForm());
    }
    if (status === "failed" && error) {
      toast.error(error || "An error occurred");
    }
  }, [status, jobPostingSuccessResponse, error, dispatch]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const finalData = {
        ...values,
        experienceRequired: `${values.experienceRequired} years`,
        relevantExperience: `${values.relevantExperience} years`,
        salaryPackage: `${Number(values.salaryPackage)} LPA`,
        noOfPositions: Number(values.noOfPositions),
      };

      const response = await dispatch(postJobRequirement(finalData));
      if (response.payload?.successMessage) {
        resetForm();
      } else {
        toast.error("Failed to create job posting");
      }
    } catch (error) {
      toast.error("Unexpected error occurred");
    }
  };

  const handleClear = (resetForm) => {
    resetForm();
    dispatch(reduxResetForm());
    dispatch(clearMessages());
    toast.info("Form cleared successfully");
  };

  return (
    <Paper
      elevation={2}
      sx={{
        maxWidth: 1200,
        margin: "auto",
        mt: 3,
        mb: 3,
        backgroundColor: "#f8f9fa",
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={JobFormSchema}
        onSubmit={handleSubmit}
      >
        {({ values, resetForm, setFieldValue, errors, touched }) => (
          <Form>
            <Box sx={{ p: 3 }}>
              {/* Header Section */}
              <Card sx={{ mb: 2, backgroundColor: "#00796b" }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h1"
                    color="#FFFFFF"
                    fontWeight="500"
                  >
                    Post Job Requirement
                  </Typography>
                </CardContent>
              </Card>

              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    gutterBottom
                    fontWeight="500"
                  >
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Field
                        name="jobTitle"
                        component={CustomTextField}
                        fullWidth
                        label="Job Title"
                        variant="outlined"
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Field
                        name="clientName"
                        component={CustomTextField}
                        fullWidth
                        label="Client Name"
                        variant="outlined"
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Field
                        name="location"
                        component={CustomTextField}
                        fullWidth
                        label="Location"
                        variant="outlined"
                        sx={textFieldStyle}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Experience & Qualification */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    gutterBottom
                    fontWeight="500"
                  >
                    Experience & Qualification
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Field
                        name="experienceRequired"
                        component={CustomTextField}
                        fullWidth
                        type="number"
                        label="Experience Required (years)"
                        variant="outlined"
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Field
                        name="relevantExperience"
                        component={CustomTextField}
                        fullWidth
                        type="number"
                        label="Relevant Experience (years)"
                        variant="outlined"
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Field
                        name="qualification"
                        component={CustomTextField}
                        fullWidth
                        label="Qualification"
                        variant="outlined"
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Field
                        name="noOfPositions"
                        component={CustomTextField}
                        fullWidth
                        type="text"
                        label="Number of Positions"
                        variant="outlined"
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Field
                        name="salaryPackage"
                        component={CustomTextField}
                        fullWidth
                        type="text"
                        label="Salary Package (LPA)"
                        variant="outlined"
                        sx={textFieldStyle}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Job Details */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    gutterBottom
                    fontWeight="500"
                  >
                    Job Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Field
                        name="jobType"
                        component={CustomSelect}
                        label="Job Type"
                      >
                        {["Full-time", "Part-time", "Contract"].map(
                          (option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          )
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Field
                        name="jobMode"
                        component={CustomSelect}
                        label="Job Mode"
                      >
                        {["Remote", "On-site", "Hybrid"].map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Field
                        name="noticePeriod"
                        component={CustomSelect}
                        label="Notice Period"
                      >
                        {[
                          "Immediate",
                          "15 days",
                          "30 days",
                          "45 days",
                          "60 days",
                        ].map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Recruiters & Description */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    gutterBottom
                    fontWeight="500"
                  >
                    Recruiters & Description
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <RecruiterMultiSelect
                      recruiters={recruiters}
                      values={values}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      fetchStatus={fetchStatus}
                    />

                    <Grid item xs={12} md={7}>
                      <Field
                        name="jobDescription"
                        component={CustomTextField}
                        fullWidth
                        multiline
                        rows={4}
                        label="Job Description"
                        variant="outlined"
                        sx={textFieldStyle}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Submit and Reset Buttons */}
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                sx={{ mt: 3 }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleClear(resetForm)}
                  startIcon={<RefreshIcon />}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SendIcon />}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <CircularProgress
                        size={24}
                        sx={{ color: "white", mr: 1 }}
                      />
                      Posting...
                    </>
                  ) : (
                    "Post Requirement"
                  )}
                </Button>
              </Stack>
            </Box>
          </Form>
        )}
      </Formik>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Paper>
  );
};

export default JobForm;
