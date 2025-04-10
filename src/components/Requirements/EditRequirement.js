import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  Box,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Grid,
  Paper,
  FormLabel,
  InputAdornment,
  Button,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import httpService from "../../Services/httpService";
import { fetchAllClients } from "../../redux/clientsSlice";
import { fetchEmployees } from "../../redux/employeesSlice";
import DynamicForm from "../FormContainer/DynamicForm";
import ComponentTitle from "../../utils/ComponentTitle";
import WorkIcon from "@mui/icons-material/Work";
import EditIcon from "@mui/icons-material/Edit";

const BASE_URL = "http://182.18.177.16";

const EditRequirement = ({ requirementData, onClose }) => {
  const dispatch = useDispatch();
  const [descriptionType, setDescriptionType] = useState("text");
  const [submitting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  // Get client and employee data from Redux store
  const { list: clients, loading: clientsLoading } = useSelector(
    (state) => state.clients
  );
  const { employeesList, fetchStatus: employeesLoading } = useSelector(
    (state) => state.employee
  );

  // Fetch clients and employees data when component mounts
  useEffect(() => {
    dispatch(fetchAllClients());
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Process requirement data to create initial values
  useEffect(() => {
    if (requirementData) {
      // Determine if there's a job description file
      const hasJobDescriptionFile =
        requirementData.jobDescriptionFile ||
        requirementData.jobDescriptionBlob;

      // Set description type based on what's available
      setDescriptionType(
        requirementData.jobDescription
          ? "text"
          : hasJobDescriptionFile
          ? "file"
          : "text"
      );

      // Process recruiter IDs from the requirement data
      let recruiterIds = [];
      if (
        requirementData.recruiterIds &&
        Array.isArray(requirementData.recruiterIds)
      ) {
        recruiterIds = requirementData.recruiterIds;
      } else if (typeof requirementData.recruiterIds === "string") {
        try {
          recruiterIds = JSON.parse(requirementData.recruiterIds);
        } catch (e) {
          console.error("Failed to parse recruiter IDs", e);
        }
      }

      // Extract numeric values from strings
      const extractNumber = (str) => {
        if (!str) return "";
        const match = str.match(/(\d+(\.\d+)?)/);
        return match ? match[1] : "";
      };

      // Set initial values for the form
      setInitialValues({
        jobId: requirementData.jobId || "",
        jobTitle: requirementData.jobTitle || "",
        clientName: requirementData.clientName || "",
        jobType: requirementData.jobType || "Full-Time",
        location: requirementData.location || "",
        jobMode: requirementData.jobMode || "Onsite",
        experienceRequired:
          extractNumber(requirementData.experienceRequired) || 0,
        relevantExperience:
          extractNumber(requirementData.relevantExperience) || 0,
        qualification: requirementData.qualification || "",
        recruiters: recruiterIds || [],
        salaryPackage: extractNumber(requirementData.salaryPackage) || "",
        noOfPositions: requirementData.noOfPositions || 1,
        status: requirementData.status || "In Progress",
        assignedBy: requirementData.assignedBy || "",
        jobDescription: requirementData.jobDescription || "",
        noticePeriod: requirementData.noticePeriod || "",
        // We don't set jobDescriptionFile as it needs to be a new file upload
      });
    }
  }, [requirementData]);

  const handleDescriptionChange = (event) => {
    setDescriptionType(event.target.value);
  };

  // Format client options for the dropdown
  const clientOptions =
    clients?.flatMap((client) => {
      const parent = {
        label: client.clientName,
        value: client.clientName,
      };

      const children =
        client.supportingCustomers?.map((customer) => ({
          label: `${client.clientName} - ${customer}`,
          value: `${client.clientName}__${customer}`, // Combine both for uniqueness
        })) || [];

      return [parent, ...children];
    }) || [];

  // Format employee/recruiter options for the dropdown - only showing active recruiters
  const recruiterOptions =
    employeesList
      ?.filter(
        (emp) =>
          (emp.roles === "TEAMLEAD" || emp.roles === "EMPLOYEE") &&
          emp.status === "ACTIVE"
      )
      ?.map((emp) => ({
        label: `${emp.userName} (${emp.employeeId})`,
        value: emp.employeeId,
      })) || [];

  const fieldGridProps = { xs: 12, sm: 6, md: 6, lg: 4, xl: 4, xxl: 3 };

  // Validation schemas
  const experienceValidation = Yup.number()
    .min(0, "Must be positive")
    .max(50, "Maximum 50 years")
    .required("Required");

  const baseFields = [
    {
      name: "jobId",
      label: "Job ID",
      type: "text",
      disabled: true,
      gridProps: fieldGridProps,
    },
    {
      name: "clientName",
      label: "Client Name",
      type: "select",
      required: true,
      options: clientsLoading
        ? [{ label: "Loading...", value: "" }]
        : clientOptions,
      validation: Yup.string().required("Client Name is required"),
      gridProps: fieldGridProps,
    },
    {
      name: "jobTitle",
      label: "Job Title",
      type: "text",
      required: true,
      validation: Yup.string().required("Job Title is required"),
      gridProps: fieldGridProps,
    },
    {
      name: "jobType",
      label: "Job Type",
      type: "select",
      required: true,
      options: [
        { label: "Full-Time", value: "Full-Time" },
        { label: "Part-Time", value: "Part-Time" },
        { label: "Contract", value: "Contract" },
      ],
      gridProps: fieldGridProps,
    },
    {
      name: "location",
      label: "Job Location",
      type: "text",
      required: true,
      gridProps: fieldGridProps,
    },
    {
      name: "jobMode",
      label: "Job Mode",
      type: "select",
      required: true,
      options: [
        { label: "Onsite", value: "Onsite" },
        { label: "Remote", value: "Remote" },
        { label: "Hybrid", value: "Hybrid" },
      ],
      gridProps: fieldGridProps,
    },
    {
      name: "experienceRequired",
      label: "Experience Required (in years)",
      type: "number",
      required: true,
      validation: experienceValidation,
      gridProps: fieldGridProps,
    },
    {
      name: "relevantExperience",
      label: "Relevant Experience (in years)",
      type: "number",
      validation: Yup.number().min(0).max(50),
      gridProps: fieldGridProps,
    },
    {
      name: "noticePeriod",
      label: "Notice Period",
      type: "select",
      options: [
        { label: "Immediate", value: "Immediate" },
        { label: "15 Days", value: "15 Days" },
        { label: "30 Days", value: "30 Days" },
        { label: "60 Days", value: "60 Days" },
        { label: "90 Days", value: "90 Days" },
      ],
      validation: Yup.string().required("Notice Period is required"),
      gridProps: fieldGridProps,
    },
    {
      name: "qualification",
      label: "Qualification",
      type: "text",
      gridProps: fieldGridProps,
    },
    {
      name: "recruiters",
      label: "Assigned Recruiters",
      type: "multiselect",
      options: recruiterOptions,
      validation: Yup.array().min(1, "At least one recruiter is required"),
      gridProps: fieldGridProps,
    },
    {
      name: "salaryPackage",
      label: "Salary Package (LPA)",
      type: "number",
      InputProps: {
        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
      },
      validation: Yup.number().min(0, "Must be positive"),
      gridProps: fieldGridProps,
    },
    {
      name: "noOfPositions",
      label: "Number of Positions",
      type: "number",
      required: true,
      validation: Yup.number()
        .min(1, "At least 1 position required")
        .required("Required"),
      gridProps: fieldGridProps,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "In Progress", value: "In Progress" },
        { label: "Submitted", value: "Submitted" },
        { label: "On Hold", value: "On Hold" },
        { label: "Closed", value: "Closed" },
      ],
      gridProps: fieldGridProps,
    },
  ];

  // Generate additional fields based on description type
  const getAdditionalFields = () => {
    if (descriptionType === "text") {
      return [
        {
          name: "jobDescription",
          label: "Job Description",
          type: "textarea",
          rows: 6,
          placeholder: "Enter detailed job description...",
          gridProps: { xs: 12 },
          validation: Yup.string().required("Job Description is required"),
        },
      ];
    } else {
      return [
        {
          name: "jobDescriptionFile",
          label: "Job Description File",
          type: "file",
          accept: ".pdf,.doc,.docx",
          gridProps: { xs: 12 },
          helperText: "Upload PDF, DOC, or DOCX file (Max size: 5MB)",
          validation: Yup.mixed()
            .test(
              "fileSize",
              "File too large (max 5MB)",
              (value) => !value || value.size <= 5 * 1024 * 1024
            )
            .test(
              "fileType",
              "Unsupported file format",
              (value) =>
                !value ||
                [
                  "application/pdf",
                  "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ].includes(value.type)
            ),
        },
      ];
    }
  };

  // Combine base fields with additional fields
  const formFields = [...baseFields, ...getAdditionalFields()];

  // Validation schema
  const validationSchema = Yup.object().shape(
    formFields.reduce((schema, field) => {
      if (field.validation) {
        schema[field.name] = field.validation;
      }
      return schema;
    }, {})
  );

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    setSubmitting(submitting);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add all form fields to FormData
      Object.keys(values).forEach((key) => {
        if (key === "recruiters") {
          // Handle array of recruiters
          formData.append(key, JSON.stringify(values[key]));
        } else if (key === "jobDescriptionFile" && values[key]) {
          // Only append file if it exists
          formData.append(key, values[key]);
        } else {
          // Add other fields
          formData.append(key, values[key]);
        }
      });

      // Append description type
      formData.append("descriptionType", descriptionType);

      // Make PUT request to update the requirement
      formData.delete("jobId");

      const response = await axios.put(
        `${BASE_URL}/requirements/updateRequirement/${values.jobId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Requirement updated successfully!");
        onClose(); // Close the drawer
      } else {
        toast.error(response.data.message || "Failed to update requirement");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update requirement"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3, height: "100%", overflowY: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <EditIcon sx={{ mr: 1, color: "#1976d2" }} />
          Edit Requirement
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Job Description Format</FormLabel>
          <RadioGroup
            row
            value={descriptionType}
            onChange={handleDescriptionChange}
            name="descriptionType"
          >
            <FormControlLabel
              value="text"
              control={<Radio />}
              label="Text Description"
            />
            <FormControlLabel
              value="file"
              control={<Radio />}
              label="Upload File"
            />
          </RadioGroup>
        </FormControl>
      </Paper>

      {Object.keys(initialValues).length > 0 && (
        <DynamicForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={formFields}
          submitButtonText="Update Requirement"
          resetButtonText="Reset"
          loading={submitting}
          gridSpacing={2}
          columnSpacing={3}
          gridContainerProps={{ alignItems: "stretch" }}
        />
      )}

      {Object.keys(initialValues).length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            Loading requirement data...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default EditRequirement;
