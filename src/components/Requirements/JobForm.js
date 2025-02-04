// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   postJobRequirement,
//   updateField,
//   resetForm,
// } from "../../redux/features/jobFormSlice";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Grid,
//   useTheme,
//   CircularProgress,
// } from "@mui/material";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import useEmployees from "../customHooks/useEmployees";

// const JobForm = () => {
//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const { formData, status, error, jobPostingSuccessResponse } = useSelector(
//     (state) => state.jobForm
//   );

//   // Using the custom hook for employee data
//   const {
//     employees: filterEmployees,
//     status: fetchStatus,
//     error: fetchError
//   } = useEmployees('EMPLOYEE');

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     dispatch(updateField({ name, value }));
//   };

//   React.useEffect(() => {
//     if (status === "succeeded" && jobPostingSuccessResponse) {
//       toast.success(`Job Created Successfully! Job Title: ${jobPostingSuccessResponse.jobTitle} Job ID: ${jobPostingSuccessResponse.jobId}`)
//     }

//     if (status === "failed" && error) {
//       toast.error(error || "An error occurred");
//     }
//   }, [status, jobPostingSuccessResponse, error]);

//   const handleSubmit = async () => {
//     try {
//       const response = await dispatch(postJobRequirement(formData));
//       if (!response.payload?.successMessage) {
//         toast.error("Failed to create job posting");
//       }
//     } catch (error) {
//       toast.error("Unexpected error occurred");
//     }
//   };

//   const handleClear = () => {
//     dispatch(resetForm());
//     toast.info("Form cleared successfully");
//   };

//   const commonBorderStyles = {
//     "& .MuiOutlinedInput-root": {
//       backgroundColor: "transparent",
//     },
//     "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
//       borderColor: "black",
//       borderWidth: "0.3px",
//       backgroundColor: "transparent",
//     },
//     "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
//       borderColor: "black",
//     },
//     "&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
//       borderColor: "black",
//     },
//   };

//   const isFormValid = () => {
//     return Object.values(formData).every((value) => value !== "");
//   };

//   return (
//     <Box
//       sx={{
//         padding: { xs: 2, sm: 3, md: 4 },
//         borderRadius: 2,
//         backgroundColor: "#FBFBFB",
//         margin: { xs: 2, sm: 3, md: "auto" },
//         boxShadow: 2,
//       }}
//     >
//       <Typography
//         variant="h5"
//         align="start"
//         marginBottom="5vh"
//         color="primary"
//         gutterBottom
//         sx={{
//           backgroundColor: "rgba(232, 245, 233)",
//           padding: 1,
//           borderRadius: 1,
//         }}
//       >
//         Post Requirement
//       </Typography>

//       <Grid container spacing={3}>
//         {/* Text fields */}
//         {[
//           { name: "jobTitle", label: "Job Title", type: "text" },
//           { name: "clientName", label: "Client Name", type: "text" },
//           { name: "location", label: "Location", type: "text" },
//           {
//             name: "experienceRequired",
//             label: "Experience Required",
//             type: "number",
//           },
//           {
//             name: "relevantExperience",
//             label: "Relevant Experience",
//             type: "number",
//           },
//           { name: "qualification", label: "Qualification", type: "text" },
//         ].map((field) => (
//           <Grid item xs={12} sm={6} md={3} key={field.name}>
//             <TextField
//               fullWidth
//               variant="filled"
//               type={field.type}
//               label={field.label}
//               name={field.name}
//               value={formData[field.name]}
//               onChange={handleChange}
//               sx={commonBorderStyles}
//             />
//           </Grid>
//         ))}

//         {/* Dropdown fields */}
//         {[
//           {
//             name: "jobType",
//             label: "Job Type",
//             options: ["Full-time", "Part-time", "Contract"],
//           },
//           {
//             name: "jobMode",
//             label: "Job Mode",
//             options: ["Remote", "On-site", "Hybrid"],
//           },
//           {
//             name: "noticePeriod",
//             label: "Notice Period",
//             options: [
//               "Immediate",
//               "15 days",
//               "30 days",
//               "45 days",
//               "60 days",
//               "75 days",
//               "90 days",
//             ],
//           },
//         ].map((field) => (
//           <Grid item xs={12} sm={6} md={3} key={field.name}>
//             <FormControl fullWidth variant="outlined">
//               <InputLabel sx={{ color: "black" }}>{field.label}</InputLabel>
//               <Select
//                 name={field.name}
//                 value={formData[field.name]}
//                 onChange={handleChange}
//                 label={field.label}
//                 variant="filled"
//                 sx={{
//                   ...commonBorderStyles,
//                   "&:hover": { borderColor: theme.palette.primary.main },
//                 }}
//               >
//                 {field.options.map((option) => (
//                   <MenuItem key={option} value={option}>
//                     {option}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//         ))}

//         {/* Recruiter Select */}
//         <Grid item xs={12} sm={6} md={3}>
//           <FormControl fullWidth variant="outlined">
//             <InputLabel sx={{ color: "black" }}>Select Recruiter</InputLabel>
//             <Select
//               name="recruiterIds"
//               value={Array.isArray(formData.recruiterIds) ? formData.recruiterIds : []}
//               onChange={handleChange}
//               label="Recruiter IDs"
//               variant="filled"
//               sx={{
//                 ...commonBorderStyles,
//                 "&:hover": { borderColor: theme.palette.primary.main },
//                 "& .MuiSelect-icon": { color: theme.palette.primary.main },
//               }}
//               MenuProps={{
//                 PaperProps: {
//                   sx: {
//                     maxHeight: 200,
//                     overflowY: "auto",
//                     backgroundColor: "#f7f7f7",
//                     borderRadius: 1,
//                     boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//                     "& .MuiMenuItem-root": {
//                       padding: "10px 16px",
//                       fontSize: "0.9rem",
//                       borderRadius: "10px",
//                       "&:hover": {
//                         backgroundColor: theme.palette.action.hover,
//                       },
//                       "&.Mui-selected": {
//                         backgroundColor: theme.palette.primary.light,
//                         color: theme.palette.primary.contrastText,
//                         "&:hover": {
//                           backgroundColor: theme.palette.primary.main,
//                         },
//                       },
//                     },
//                   },
//                 },
//               }}
//             >
//               {fetchStatus === "loading" ? (
//                 <MenuItem disabled>Loading employees...</MenuItem>
//               ) : filterEmployees.length > 0 ? (
//                 filterEmployees.map((employee) => (
//                   <MenuItem
//                     key={employee.employeeId}
//                     value={employee.employeeId}
//                   >
//                     {employee.employeeName}
//                   </MenuItem>
//                 ))
//               ) : (
//                 <MenuItem disabled>No employees available</MenuItem>
//               )}
//             </Select>
//           </FormControl>
//         </Grid>

//         {/* Job Description Field */}
//         <Grid item xs={12} md={6}>
//           <TextField
//             fullWidth
//             variant="filled"
//             label="Job Description"
//             name="jobDescription"
//             value={formData.jobDescription}
//             onChange={handleChange}
//             sx={commonBorderStyles}
//             multiline
//             rows={3}
//           />
//         </Grid>
//       </Grid>

//       {/* Action buttons */}
//       <Box
//         sx={{
//           marginTop: "3vh",
//           display: "flex",
//           justifyContent: "flex-end",
//           gap: 3,
//         }}
//       >
//         <Button
//           variant="outlined"
//           color="primary"
//           onClick={handleClear}
//           disabled={status === "loading"}
//           sx={{ width: "15%" }}
//         >
//           Clear
//         </Button>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSubmit}
//           disabled={status === "loading" || !isFormValid()}
//           sx={{ width: "20%" }}
//         >
//           {status === "loading" ? <CircularProgress size={24} /> : "Post Requirement"}
//         </Button>
//       </Box>
//       <ToastContainer />
//     </Box>
//   );
// };

// export default JobForm;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  postJobRequirement,
  updateField,
  resetForm,
  clearMessages,
} from "../../redux/features/jobFormSlice";
import { fetchEmployees } from "../../redux/features/employeesSlice";
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
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RefreshIcon from "@mui/icons-material/Refresh";
import SendIcon from "@mui/icons-material/Send";

const JobForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { formData, status, error, jobPostingSuccessResponse } = useSelector(
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateField({ name, value }));
  };

  const handleRecruitersChange = (event) => {
    const selectedNames = event.target.value;
    const selectedIds = selectedNames
      .map((name) => {
        const employee = recruiters.find((emp) => emp.userName === name);
        return employee ? employee.employeeId : null;
      })
      .filter((id) => id !== null);

    dispatch(
      updateField({ name: "recruiterName", value: selectedNames.join(", ") })
    );
    dispatch(
      updateField({ name: "recruiterIds", value: selectedIds.join(", ") })
    );
  };

  useEffect(() => {
    if (status === "succeeded" && jobPostingSuccessResponse) {
      toast.success(
        `Job Created Successfully! Job Title: ${jobPostingSuccessResponse.jobTitle} Job ID: ${jobPostingSuccessResponse.jobId}`
      );
      dispatch(clearMessages());
    }

    if (status === "failed" && error) {
      toast.error(error || "An error occurred");
    }
  }, [status, jobPostingSuccessResponse, error, dispatch]);

  const handleSubmit = async () => {
    try {
      // Convert recruiterName into an array
      const recruiterNamesArray = formData.recruiterName
        .split(", ")
        .map((name) => name.trim());

      const finalData = {
        ...formData,
        recruiterName: recruiterNamesArray, // Replace recruiterName with array
        experienceRequired: `${formData.experienceRequired} years`,
        relevantExperience: `${formData.relevantExperience} years`,
      };

      const response = await dispatch(postJobRequirement(finalData));
      if (!response.payload?.successMessage) {
        toast.error("Failed to create job posting");
      }
    } catch (error) {
      toast.error("Unexpected error occurred");
    }
  };

  const handleClear = () => {
    dispatch(resetForm());
    dispatch(clearMessages());
    toast.info("Form cleared successfully");
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
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.grey[300],
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
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
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Card sx={{ mb: 3, backgroundColor: "rgba(232, 245, 233)" }}>
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="h5"
                component="h1"
                color="primary"
                fontWeight="500"
              >
                Post Job Requirement
              </Typography>
              <Tooltip title="Clear Form">
                <IconButton onClick={handleClear} size="small">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Basic Information Section */}
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
                <TextField
                  fullWidth
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  variant="outlined"
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Client Name"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  variant="outlined"
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  variant="outlined"
                  sx={textFieldStyle}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Experience and Qualification Section */}
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
                <TextField
                  fullWidth
                  type="number"
                  label="Experience Required (years)"
                  name="experienceRequired"
                  value={formData.experienceRequired}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Enter experience (e.g., 3.5)" 
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Relevant Experience (years)"
                  name="relevantExperience"
                  value={formData.relevantExperience}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Enter experience (e.g., 3.5)"
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  variant="outlined"
                  sx={textFieldStyle}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Job Details Section */}
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
              {/* Priority */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined" sx={textFieldStyle}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    label="Priority"
                  >
                    {["High", "Medium", "Low"].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Job Type */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined" sx={textFieldStyle}>
                  <InputLabel>Job Type</InputLabel>
                  <Select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    label="Job Type"
                  >
                    {["Full-time", "Part-time", "Contract"].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Job Mode */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined" sx={textFieldStyle}>
                  <InputLabel>Job Mode</InputLabel>
                  <Select
                    name="jobMode"
                    value={formData.jobMode}
                    onChange={handleChange}
                    label="Job Mode"
                  >
                    {["Remote", "On-site", "Hybrid"].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Notice Period */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined" sx={textFieldStyle}>
                  <InputLabel>Notice Period</InputLabel>
                  <Select
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
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
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Recruiters Section */}
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
              <Grid item xs={12} md={5}>
                <FormControl fullWidth variant="outlined" sx={textFieldStyle}>
                  <InputLabel>Select Recruiters</InputLabel>
                  <Select
                    multiple
                    value={
                      formData.recruiterName
                        ? formData.recruiterName.split(", ")
                        : []
                    }
                    onChange={handleRecruitersChange}
                    label="Select Recruiters"
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 200,
                          backgroundColor: "#ffffff",
                        },
                      },
                    }}
                  >
                    {fetchStatus === "loading" ? (
                      <Box
                        sx={{ display: "flex", justifyContent: "center", p: 2 }}
                      >
                        <CircularProgress size={20} />
                      </Box>
                    ) : (
                      recruiters.map((emp) => (
                        <MenuItem key={emp.employeeId} value={emp.userName}>
                          <Checkbox
                            checked={formData.recruiterName?.includes(
                              emp.userName
                            )}
                          />
                          <ListItemText
                            primary={`${emp.userName} - ${emp.employeeId}`}
                          />
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={7}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Job Description"
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  variant="outlined"
                  sx={textFieldStyle}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box
          sx={{
            marginTop: "3vh",
            display: "flex",
            justifyContent: "flex-end",
            gap: 3,
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClear}
            disabled={status === "loading"}
            sx={{ width: "15%" }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={status === "loading"}
            startIcon={
              status === "loading" ? (
                <CircularProgress size={20} />
              ) : (
                <SendIcon />
              )
            }
            sx={{
              minWidth: 200,
              height: 48,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            {status === "loading" ? "Posting..." : "Post Requirement"}
          </Button>
        </Box>
      </Box>
      <ToastContainer />
    </Paper>
  );
};

export default JobForm;
