import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Material-UI imports
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  IconButton,
  InputAdornment,
  Stack,
  Divider,
  CircularProgress,
  ThemeProvider,
  createTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";

import {
  AddCircleOutline,
  RemoveCircleOutline,
  Business,
  LocationOn,
  WorkOutline,
  AttachMoney,
  Language,
  LinkedIn,
  Person,
  Email,
  AttachFile,
  People,
  Percent,
  Save,
  RestartAlt,
  Phone,
  Cancel,
  Assignment,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../../redux/employeesSlice"; // Adjust path as needed

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: { main: "#1a237e" },
    secondary: { main: "#0d47a1" },
    background: { default: "#f8f9fa" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": { borderRadius: 8 },
        },
      },
    },
  },
});

const ClientForm = ({
  initialData = null,
  onSubmit,
  isEdit = false,
  onCancel,
  showToast = toast,
}) => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currency, setCurrency] = useState(initialData?.currency || "INR");
  const { userName } = useSelector((state) => state.auth);
  const [onBoardedByName, setOnBoardedBy] = useState(
    initialData?.onBoardedBy || userName
  );

  const { employeesList: employees = [], fetchStatus } = useSelector(
    (state) => state.employee || {}
  );
  const employeesLoading = fetchStatus === "loading";

  const bdmEmployees = employees.filter(
    (emp) => emp.roles && emp.roles.toUpperCase() === "BDM"
  );

  useEffect(() => {
    // Fetch employees when component mounts
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (initialData) {
      setCurrency(initialData.currency || "INR");
      setOnBoardedBy(initialData.onBoardedBy || "");

      // Initialize files if editing and supportingDocuments are available
      if (
        isEdit &&
        initialData.supportingDocuments &&
        Array.isArray(initialData.supportingDocuments)
      ) {
        // For editing, we just store the names since we can't recover the actual file objects
        setFiles(
          initialData.supportingDocuments.map((docName) => ({
            name: docName,
            isExisting: true, // Flag to identify existing files
          }))
        );
      }
    }
  }, [initialData, isEdit]);

  const formFields = [
    {
      section: "Basic Information",
      fields: [
        {
          name: "clientName",
          label: "Client Name",
          required: true,
          type: "text",
          grid: { xs: 12, sm: 6, md: 4 },
          icon: <Business color="primary" />,
        },
        {
          name: "positionType",
          label: "Position Type",
          type: "select",
          grid: { xs: 12, sm: 6, md: 4 },
          icon: <WorkOutline color="primary" />,
          options: [
            { value: "Full-Time", label: "Full-Time" },
            { value: "Part-Time", label: "Part-Time" },
            { value: "Contract", label: "Contract" },
            { value: "Internship", label: "Internship" },
          ],
        },
        {
          name: "assignedTo",
          label: "Assigned To (BDM)",
          type: "select",
          grid: { xs: 12, sm: 6, md: 4 },
          icon: <Assignment color="primary" />,
          options: bdmEmployees.length
            ? bdmEmployees.map((emp) => ({
                value: emp.userName,
                label: `${emp.userName}`,
              }))
            : [{ value: "", label: "No BDMs Available" }],
        },

        {
          name: "clientWebsiteUrl",
          label: "Client Website URL",
          type: "url",
          placeholder: "https://",
          grid: { xs: 12, sm: 6, md: 4 },
          icon: <Language color="primary" />,
        },
        {
          name: "clientLinkedInUrl",
          label: "Client LinkedIn URL",
          type: "url",
          placeholder: "https://linkedin.com/company/",
          grid: { xs: 12, sm: 6, md: 4 },
          icon: <LinkedIn color="primary" />,
        },
        {
          name: "clientAddress",
          label: "Client Address",
          type: "text",
          placeholder: "Enter complete address",
          grid: { xs: 12, md: 8 },
          icon: <LocationOn color="primary" />,
        },
      ],
    },
    {
      section: "Payment Information",
      fields: [
        {
          name: "currency",
          label: "Currency",
          type: "select",
          grid: { xs: 12, sm: 6, md: 3 },
          icon: <AttachMoney color="primary" />,
          options: [
            { value: "INR", label: "Rupee (INR)" },
            { value: "USD", label: "Dollar (USD)" },
          ],
          customHandler: (e, setFieldValue) => {
            setCurrency(e.target.value);
            setFieldValue("currency", e.target.value);
          },
        },
        {
          name: "netPayment",
          label: "Net Payment",
          type: "number",
          placeholder: "0",
          grid: { xs: 12, sm: 6, md: 3 },
          endAdornment: <InputAdornment position="end">Days</InputAdornment>,
        },
        {
          name: "gst",
          label: "GST",
          type: "number",
          placeholder: "0",
          grid: { xs: 12, sm: 6, md: 3 },
          icon: <Percent color="primary" />,
          conditional: () => currency === "INR",
        },
      ],
    },
  ];

  const contactFields = [
    {
      name: "clientSpocName",
      label: "Contact Name",
      icon: <Person color="primary" />,
    },
    {
      name: "clientSpocEmailid",
      label: "Contact Email",
      icon: <Email color="primary" />,
    },
    {
      name: "clientSpocMobileNumber",
      label: "Contact Mobile",
      icon: <Phone color="primary" />,
    },
    {
      name: "clientSpocLinkedin",
      label: "Contact LinkedIn",
      placeholder: "https://linkedin.com/in/",
      icon: <LinkedIn color="primary" />,
    },
  ];

  const feedBack=[
    {
      name:"feedBack",
      label:"FeedBack",
      type:"textarea",
      grid: { xs: 12 }
    }
  ]

  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  const validationSchema = Yup.object().shape({
    clientName: Yup.string()
      .required("Client name is required")
      .max(50, "Client name must be at most 35 characters"),
    clientAddress: Yup.string()
      .nullable()
      .max(250, "Client address must be at most 100 characters"),
    positionType: Yup.string().nullable(),
    assignedTo: Yup.string().nullable(),
    paymentType: Yup.string().nullable(),
    netPayment: Yup.number()
      .positive("Must be a positive number")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ),
    gst: Yup.number()
      .min(0, "GST cannot be negative")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ),
    supportingCustomers: Yup.array().of(Yup.string().nullable()),
    clientWebsiteUrl: Yup.string()
      .url("Must be a valid URL")
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    clientLinkedInUrl: Yup.string()
      .url("Must be a valid URL")
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    clientSpocName: Yup.array().of(Yup.string().nullable()),
    clientSpocEmailid: Yup.array().of(
      Yup.string().email("Invalid email format").nullable()
    ),
    clientSpocMobileNumber: Yup.array().of(
      Yup.string()
        .matches(
          /^[0-9]{10}$|^[0-9]{15}$/,
          "Phone number must be either 10 or 15 digits"
        )
        .nullable()
    ),
    clientSpocLinkedin: Yup.array().of(
      Yup.string()
        .url("Must be a valid LinkedIn URL")
        .nullable()
        .transform((value) => (value === "" ? null : value))
    ),
    supportingDocuments: Yup.array().of(Yup.string().nullable()).nullable(),
    onBoardedBy: Yup.string().nullable(),
    feedBack: Yup.string()
  .nullable()
  .max(1000, "Feedback must be at most 1000 characters")
  .transform((value) => (value === "" ? null : value)),
  });

  // Set default initial values
  const defaultInitialValues = {
    clientName: "",
    clientAddress: "",
    positionType: "",
    assignedTo: "",
    netPayment: "",
    onBoardedBy: onBoardedByName,
    gst: "",
    supportingCustomers: [],
    clientWebsiteUrl: "",
    clientLinkedInUrl: "",
    clientSpocName: [""],
    clientSpocEmailid: [""],
    clientSpocMobileNumber: [""],
    clientSpocLinkedin: [""],
    supportingDocuments: [],
    currency: "INR",
    feedBack:""
  };

  // Merge with initialData if available
  const formInitialValues = initialData || defaultInitialValues;

  // Ensure arrays are properly initialized
  if (
    !Array.isArray(formInitialValues.clientSpocName) ||
    formInitialValues.clientSpocName.length === 0
  ) {
    formInitialValues.clientSpocName = [""];
  }
  if (
    !Array.isArray(formInitialValues.clientSpocEmailid) ||
    formInitialValues.clientSpocEmailid.length === 0
  ) {
    formInitialValues.clientSpocEmailid = [""];
  }
  if (
    !Array.isArray(formInitialValues.clientSpocMobileNumber) ||
    formInitialValues.clientSpocMobileNumber.length === 0
  ) {
    formInitialValues.clientSpocMobileNumber = [""];
  }
  if (
    !Array.isArray(formInitialValues.clientSpocLinkedin) ||
    formInitialValues.clientSpocLinkedin.length === 0
  ) {
    formInitialValues.clientSpocLinkedin = [""];
  }
  if (!Array.isArray(formInitialValues.supportingCustomers)) {
    formInitialValues.supportingCustomers = [];
  }

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) {
      showToast("No file selected", "warning");
      return;
    }

    // Check total file size (max 10MB)
    const currentSize = files.reduce(
      (sum, file) => sum + (file.isExisting ? 0 : file.size),
      0
    );
    const newFilesSize = selectedFiles.reduce(
      (sum, file) => sum + file.size,
      0
    );

    if (currentSize + newFilesSize > 10 * 1024 * 1024) {
      showToast("Total file size exceeds 10MB limit", "error");
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    showToast(
      `${selectedFiles.length} file(s) selected successfully!`,
      "success"
    );
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
    showToast("File removed", "info");
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);

    try {
      // Create a FormData object for file upload
      const formData = new FormData();

      // Prepare the client data
      const clientData = {
        ...values,
        currency,
        onBoardedBy: onBoardedByName,
      };

      // Add existing supporting document filenames if we're editing
      if (isEdit) {
        clientData.supportingDocuments = files
          .filter((file) => file.isExisting)
          .map((file) => file.name);
      }

      // Append the JSON object as a string
      formData.append("dto", JSON.stringify(clientData));

      // Append new files only (not the existing ones which we only have names for)
      files
        .filter((file) => !file.isExisting)
        .forEach((file) => {
          formData.append("supportingDocuments", file);
        });

      // Pass to parent component for submission
      await onSubmit(formData, isEdit);

      if (!isEdit) {
        resetForm();
        setFiles([]);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showToast(error.message || "Failed to submit form", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addContactPerson = (values, setFieldValue) => {
    contactFields.forEach((field) => {
      setFieldValue(field.name, [...values[field.name], ""]);
    });
    showToast("New contact person added", "info");
  };

  const removeContactPerson = (index, values, setFieldValue) => {
    if (values.clientSpocName.length > 1) {
      contactFields.forEach((field) => {
        const newArray = [...values[field.name]];
        newArray.splice(index, 1);
        setFieldValue(field.name, newArray);
      });
      showToast("Contact person removed", "info");
    }
  };

  const renderFormField = (field, values, errors, touched, setFieldValue) => {
    if (field.conditional && !field.conditional()) {
      return null;
    }

    if (field.type === "select") {
      return (
        <Grid item {...field.grid} key={field.name}>
          <FormControl
            fullWidth
            error={touched[field.name] && Boolean(errors[field.name])}
          >
            <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.name}-label`}
              id={field.name}
              name={field.name}
              value={values[field.name] || ""}
              onChange={(e) => {
                if (field.customHandler) {
                  field.customHandler(e, setFieldValue);
                } else {
                  setFieldValue(field.name, e.target.value);
                }
              }}
              disabled={field.loading}
              startAdornment={
                field.icon && (
                  <InputAdornment position="start">{field.icon}</InputAdornment>
                )
              }
            >
              <MenuItem value="" disabled>
                {field.loading ? "Loading..." : `Select ${field.label}`}
              </MenuItem>
              {field.options &&
                field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
            {touched[field.name] && errors[field.name] && (
              <Typography variant="caption" color="error">
                {errors[field.name]}
              </Typography>
            )}
          </FormControl>
        </Grid>
      );
    }

    return (
      <Grid item {...field.grid} key={field.name}>
        <Field name={field.name}>
          {({ field: formikField, meta }) => (
            <TextField
              {...formikField}
              fullWidth
              label={field.label}
              placeholder={field.placeholder || ""}
              required={field.required}
              type={field.type || "text"}
              error={meta.touched && Boolean(meta.error)}
              helperText={meta.touched && meta.error}
              InputProps={{
                startAdornment: field.icon && (
                  <InputAdornment position="start">{field.icon}</InputAdornment>
                ),
                endAdornment: field.endAdornment,
              }}
            />
          )}
        </Field>
      </Grid>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 2 }}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Formik
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, resetForm, setFieldValue }) => (
            <Form>
              <Grid container spacing={3}>
                {formFields.map((section, sectionIndex) => (
                  <React.Fragment key={`section-${sectionIndex}`}>
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ mb: 1, fontWeight: 500 }}
                      >
                        {section.section}
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                    </Grid>
                    {section.fields.map((field) =>
                      renderFormField(
                        field,
                        values,
                        errors,
                        touched,
                        setFieldValue
                      )
                    )}
                  </React.Fragment>
                ))}

                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                      mt: 1,
                      mb: 1,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <People sx={{ mr: 1 }} /> Supporting Customers
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>
                <Grid item xs={12}>
                  <FieldArray name="supportingCustomers">
                    {({ push, remove }) => (
                      <Box>
                        {values.supportingCustomers &&
                        values.supportingCustomers.length > 0 ? (
                          <Paper
                            variant="outlined"
                            sx={{ p: 2, mb: 2, borderRadius: 2 }}
                          >
                            <Grid container spacing={2}>
                              {values.supportingCustomers.map(
                                (customer, index) => (
                                  <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                      <Field
                                        name={`supportingCustomers.${index}`}
                                      >
                                        {({ field, meta }) => (
                                          <TextField
                                            {...field}
                                            fullWidth
                                            placeholder={`Customer ${
                                              index + 1
                                            }`}
                                            error={
                                              meta.touched &&
                                              Boolean(meta.error)
                                            }
                                            helperText={
                                              meta.touched && meta.error
                                            }
                                            variant="outlined"
                                            size="medium"
                                          />
                                        )}
                                      </Field>
                                      <IconButton
                                        color="error"
                                        onClick={() => {
                                          remove(index);
                                          showToast("Customer removed", "info");
                                        }}
                                        sx={{
                                          border: "1px solid",
                                          borderColor: "divider",
                                          borderRadius: 2,
                                        }}
                                      >
                                        <RemoveCircleOutline />
                                      </IconButton>
                                    </Box>
                                  </Grid>
                                )
                              )}
                            </Grid>
                          </Paper>
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, fontStyle: "italic" }}
                          >
                            No supporting customers added
                          </Typography>
                        )}
                        <Button
                          startIcon={<AddCircleOutline />}
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            push("");
                            showToast("New customer field added", "info");
                          }}
                          sx={{ mt: 1 }}
                        >
                          Add Customer
                        </Button>
                      </Box>
                    )}
                  </FieldArray>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                      mt: 1,
                      mb: 1,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Person sx={{ mr: 1 }} /> Contact Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      mt: 2,
                      mb: 3,
                    }}
                  >
                    <Button
                      startIcon={<AddCircleOutline />}
                      variant="outlined"
                      color="primary"
                      onClick={() => addContactPerson(values, setFieldValue)}
                    >
                      Add Contact Person
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  {values.clientSpocName.map((_, index) => (
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, borderRadius: 2, mb: 2 }}
                      key={index}
                    >
                      <Grid container spacing={2}>
                        {contactFields.map((field) => (
                          <Grid item xs={12} sm={6} md={3} key={field.name}>
                            <Field name={`${field.name}.${index}`}>
                              {({ field: formikField, meta }) => (
                                <TextField
                                  {...formikField}
                                  fullWidth
                                  label={field.label}
                                  placeholder={field.placeholder || ""}
                                  error={meta.touched && Boolean(meta.error)}
                                  helperText={meta.touched && meta.error}
                                  InputProps={{
                                    startAdornment: field.icon && (
                                      <InputAdornment position="start">
                                        {field.icon}
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              )}
                            </Field>
                          </Grid>
                        ))}
                        <Grid
                          item
                          xs={12}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <IconButton
                            color="error"
                            onClick={() =>
                              removeContactPerson(index, values, setFieldValue)
                            }
                            disabled={values.clientSpocName.length === 1}
                            sx={{
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 2,
                            }}
                          >
                            <RemoveCircleOutline />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                      mt: 1,
                      mb: 1,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <AttachFile sx={{ mr: 1 }} /> Supporting Documents
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>

    

                <Grid item xs={12}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "rgba(0, 0, 0, 0.01)",
                    }}
                  >
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<AttachFile />}
                      size="large"
                      sx={{ mb: 2 }}
                    >
                      Upload Files
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </Button>

                    <Box
                      sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}
                    >
                      {files.length > 0 ? (
                        files.map((file, index) => (
                          <Chip
                            key={index}
                            label={file.name}
                            onDelete={() => removeFile(index)}
                            color={file.isExisting ? "secondary" : "primary"}
                            variant="outlined"
                            sx={{ py: 0.5 }}
                          />
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: "italic" }}
                        >
                          {isEdit
                            ? "No documents available. Upload new documents."
                            : "No files selected. Please upload at least one supporting document."}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
                 

                 {isEdit && (
                <React.Fragment>
               <Grid item xs={12}>
              <Typography
               variant="h6"
               color="primary"
               sx={{
                  mt: 1,
                  mb: 1,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  }}
                  >
               <Assignment sx={{ mr: 1 }} /> Feedback
           </Typography>
        <Divider sx={{ mb: 3 }} />
       </Grid>
    
       <Grid item xs={12}>
         {feedBack.map((field) => (
         <Field name={field.name} key={field.name}>
          {({ field: formikField, meta }) => (
            <TextField
              {...formikField}
              fullWidth
              multiline
              rows={4}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              error={meta.touched && Boolean(meta.error)}
              helperText={meta.touched && meta.error}
              variant="outlined"
             InputLabelProps={{ shrink: true }}
            />
          )}
        </Field>
        ))}
       </Grid>
      </React.Fragment>
       )} 

                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }} />
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="flex-end"
                  >
                    {onCancel && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={onCancel}
                        startIcon={<Cancel />}
                        size="large"
                        sx={{ px: 4 }}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        resetForm();
                        if (!isEdit) setFiles([]);
                        showToast("Form has been reset", "info");
                      }}
                      startIcon={<RestartAlt />}
                      size="large"
                      sx={{ px: 4 }}
                    >
                      Reset Form
                    </Button>

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      startIcon={
                        isSubmitting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <Save />
                        )
                      }
                      size="large"
                      sx={{ px: 4 }}
                    >
                      {isSubmitting
                        ? "Submitting..."
                        : isEdit
                        ? "Update Client"
                        : "Add Client"}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </ThemeProvider>
  );
};

export default ClientForm;
