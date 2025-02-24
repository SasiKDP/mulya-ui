// src/components/JobForm/index.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import {
  Box, Grid, Paper, Card, CardContent, Typography
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Redux actions
import { fetchEmployees } from "../../redux/features/employeesSlice";
import {
  postJobRequirement,
  reduxResetForm,
  clearMessages,
} from "../../redux/features/jobFormSlice";

// Components
import JobFormBasicInfo from "./JobFormBasicInfo";
import JobFormExperience from "./JobFormExperience";
import JobFormDetails from "./JobFormDetails";
import JobFormRecruiters from "./JobFormRecruiters";
import JobFormActions from "./JobFormActions";

// Validation Schema
import { JobFormSchema } from "./ValidationSchema";

const JobFormMain = () => {
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

  const [jobDescriptionType, setJobDescriptionType] = useState("text");

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
      const formData = new FormData();
      formData.append("jobTitle", values.jobTitle);
      formData.append("clientName", values.clientName);
      formData.append("location", values.location);
      formData.append(
        "experienceRequired",
        `${values.experienceRequired} years`
      );
      formData.append(
        "relevantExperience",
        `${values.relevantExperience} years`
      );
      formData.append("qualification", values.qualification);
      formData.append("salaryPackage", `${Number(values.salaryPackage)} LPA`);
      formData.append("noOfPositions", Number(values.noOfPositions));
      formData.append("jobType", values.jobType);
      formData.append("jobMode", values.jobMode);
      formData.append("noticePeriod", values.noticePeriod);
      formData.append("status", values.status);

      formData.append("recruiterIds", JSON.stringify(values.recruiterIds));
      formData.append("recruiterName", JSON.stringify(values.recruiterName));

      if (jobDescriptionType === "text" && values.jobDescription) {
        formData.append("jobDescription", values.jobDescription);
      } else if (jobDescriptionType === "file" && values.jobDescriptionFile) {
        formData.append("jobDescriptionFile", values.jobDescriptionFile);
      }

      const response = await dispatch(postJobRequirement(formData));

      if (response.payload?.successMessage) {
        resetForm();
        toast.success("Job Requirement Posted Successfully!");
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
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={JobFormSchema}
        onSubmit={handleSubmit}
      >
        {({ values, resetForm, setFieldValue, errors, touched }) => (
          <Form>
            <Box sx={{ p: 3 }}>
              {/* Header Section */}
              
                  <Typography
                    variant="h5"
                    component="h1"
                    color="#FFFFFF"
                    fontWeight="500"
                    bgcolor='#00796b'
                    sx={{p:2,borderRadius:2 ,mb:2}}
                  >
                    Post Job Requirement
                  </Typography>
                
              

              <Grid container spacing={3}>
                {/* Basic Information Section */}
                <JobFormBasicInfo />

                {/* Experience & Qualification Section */}
                <JobFormExperience />

                {/* Job Details Section */}
                <JobFormDetails />

                {/* Recruiters & Description Section */}
                <JobFormRecruiters
                  recruiters={recruiters}
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  fetchStatus={fetchStatus}
                  jobDescriptionType={jobDescriptionType}
                  setJobDescriptionType={setJobDescriptionType}
                />
              </Grid>

              {/* Submit and Reset Buttons */}
              <JobFormActions 
                status={status} 
                handleClear={handleClear} 
                resetForm={resetForm}
              />
            </Box>
          </Form>
        )}
      </Formik>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default JobFormMain;