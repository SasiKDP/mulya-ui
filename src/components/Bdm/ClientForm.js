import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Material-UI imports
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  IconButton,
  Chip,
  InputAdornment,
  Stack,
  Divider,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  ThemeProvider,
  createTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../../redux/features/employeesSlice";
import BASE_URL from "../../redux/config";



// const BASE_URL = 'http://192.168.0.194:8111';

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
    MuiCardHeader: {
      styleOverrides: {
        root: { borderBottom: "1px solid #e0e0e0" },
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

const ClientForm = () => {
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [onBoardedByName, setOnBoardedBy] = useState("");
  const dispatch = useDispatch();

  const { employeesList, fetchStatus } = useSelector(
    (state) => state.employees
  );
  const { user } = useSelector((state) => state.auth);

  const formFields = [
    {
      section: "Basic Information",
      fields: [
        { name: "clientName", label: "Client Name", required: true, type: "text", grid: { xs: 12, sm: 6, md: 4 }, icon: <Business color="primary" /> },
        { name: "positionType", label: "Position Type", type: "select", grid: { xs: 12, sm: 6, md: 4 }, icon: <WorkOutline color="primary" />, options: [{ value: "Full-Time", label: "Full-Time" }, { value: "Part-Time", label: "Part-Time" }, { value: "Contract", label: "Contract" }, { value: "Internship", label: "Internship" }] },
        { name: "clientWebsiteUrl", label: "Client Website URL", type: "url", placeholder: "https://", grid: { xs: 12, sm: 6, md: 4 }, icon: <Language color="primary" /> },
        { name: "clientLinkedInUrl", label: "Client LinkedIn URL", type: "url", placeholder: "https://linkedin.com/company/", grid: { xs: 12, sm: 6, md: 4 }, icon: <LinkedIn color="primary" /> },
        { name: "clientAddress", label: "Client Address", type: "text", placeholder: "Enter complete address", grid: { xs: 12, md: 8 }, icon: <LocationOn color="primary" /> },
      ],
    },
    {
      section: "Payment Information",
      fields: [
        { name: "currency", label: "Currency", type: "select", grid: { xs: 12, sm: 6, md: 3 }, icon: <AttachMoney color="primary" />, options: [{ value: "INR", label: "Rupee (INR)" }, { value: "USD", label: "Dollar (USD)" }], customHandler: (e, setFieldValue) => { setCurrency(e.target.value); setFieldValue("currency", e.target.value); } },
        { name: "netPayment", label: "Net Payment", type: "number", placeholder: "0", grid: { xs: 12, sm: 6, md: 3 }, endAdornment: <InputAdornment position="end">Days</InputAdornment> },
        { name: "gst", label: "GST", type: "number", placeholder: "0", grid: { xs: 12, sm: 6, md: 3 }, icon: <Percent color="primary" />, conditional: () => currency === "INR" },
      ],
    },
  ];

  const contactFields = [
    { name: "clientSpocName", label: "Contact Name", icon: <Person color="primary" /> },
    { name: "clientSpocEmailid", label: "Contact Email", icon: <Email color="primary" /> },
    { name: "clientSpocMobileNumber", label: "Contact Mobile", placeholder: "10-digit number", icon: <Phone color="primary" /> },
    { name: "clientSpocLinkedin", label: "Contact LinkedIn", placeholder: "https://linkedin.com/in/", icon: <LinkedIn color="primary" /> },
  ];

  useEffect(() => {
    if (fetchStatus === "idle") {
      dispatch(fetchEmployees());
    }
  }, [dispatch, fetchStatus]);

  useEffect(() => {
    if (employeesList.length > 0 && user) {
      const assignedUser = employeesList.find((emp) => emp.employeeId === user);
      setOnBoardedBy(assignedUser ? assignedUser.userName : "Unknown");
    }
  }, [employeesList, user]);

  const toastConfig = { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true };

  const validationSchema = Yup.object().shape({
    clientName: Yup.string().required("Client name is required").max(35, "Client name must be at most 35 characters"),
    clientAddress: Yup.string().nullable().max(100, "Client address must be at most 100 characters"),
    positionType: Yup.string().nullable(),
    paymentType: Yup.string().nullable(),
    netPayment: Yup.number().positive("Must be a positive number").nullable().transform((value, originalValue) => originalValue === "" ? null : value),
    gst: Yup.number().min(0, "GST cannot be negative").nullable().transform((value, originalValue) => originalValue === "" ? null : value),
    supportingCustomers: Yup.array().of(Yup.string().nullable()),
    clientWebsiteUrl: Yup.string().url("Must be a valid URL").nullable().transform((value) => (value === "" ? null : value)),
    clientLinkedInUrl: Yup.string().url("Must be a valid URL").nullable().transform((value) => (value === "" ? null : value)),
    clientSpocName: Yup.array().of(Yup.string().nullable()),
    clientSpocEmailid: Yup.array().of(Yup.string().email("Invalid email format").nullable()),
    clientSpocMobileNumber: Yup.array().of(Yup.string().matches(/^[0-9]{10}$/, "Phone number must be 10 digits").nullable()),
    clientSpocLinkedin: Yup.array().of(Yup.string().url("Must be a valid LinkedIn URL").nullable().transform((value) => (value === "" ? null : value))),
    supportingDocuments: Yup.array().of(Yup.string().nullable()).nullable(),
    onBoardedBy: Yup.string().nullable(),
  });

  const initialValues = {
    clientName: "",
    clientAddress: "",
    positionType: "",
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
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) {
      toast.warning("No file selected", toastConfig);
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    toast.success(`${selectedFiles.length} file(s) selected successfully!`, toastConfig);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    toast.info("File removed", toastConfig);
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);

    try {
        const formData = new FormData();

        // Construct the JSON object that will be sent as 'dto'
        const submissionValues = {
            ...values,
            currency,
            supportingDocuments: files.map((file) => file.name), // Send file names in dto
            onBoardedBy: onBoardedByName,
        };

        // Append the JSON object as a string to 'dto'
        formData.append("dto", JSON.stringify(submissionValues));

        // Append each file to 'supportingDocuments' directly (binary data)
        files.forEach((file) => {
            formData.append("supportingDocuments", file);
        });

        // Log the FormData contents for debugging
        console.log("FormData Contents:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ', pair[1]);
        }

        const response = await axios.post(
            `${BASE_URL}/requirements/bdm/addClient`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data && response.data.success) {
            const clientInfo = response.data.data
                ? `Client ${response.data.data.clientName} (ID: ${response.data.data.id}) added successfully!`
                : response.data.message || "Client added successfully!";
            toast.success(clientInfo, toastConfig);
        } else {
            toast.success(response.data.message || "Client added successfully!", toastConfig);
        }

        resetForm();
        setFiles([]);
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || "Failed to submit form. Please try again.";
        toast.error(errorMessage, toastConfig);
    } finally {
        setIsSubmitting(false);
    }
};

  const addContactPerson = (values, setFieldValue) => {
    contactFields.forEach((field) => {
      setFieldValue(field.name, [...values[field.name], ""]);
    });
    toast.info("New contact person added", toastConfig);
  };

  const removeContactPerson = (index, values, setFieldValue) => {
    if (values.clientSpocName.length > 1) {
      contactFields.forEach((field) => {
        const newArray = [...values[field.name]];
        newArray.splice(index, 1);
        setFieldValue(field.name, newArray);
      });
      toast.info("Contact person removed", toastConfig);
    }
  };

  const renderFormField = (field, values, errors, touched, setFieldValue) => {
    if (field.conditional && !field.conditional()) {
      return null;
    }

    if (field.type === "select") {
      return (
        <Grid item {...field.grid} key={field.name}>
          <FormControl fullWidth error={touched[field.name] && Boolean(errors[field.name])}>
            <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
            <Select labelId={`${field.name}-label`} id={field.name} name={field.name} value={values[field.name] || ""} onChange={(e) => { if (field.customHandler) { field.customHandler(e, setFieldValue); } else { setFieldValue(field.name, e.target.value); } }} startAdornment={field.icon && (<InputAdornment position="start">{field.icon}</InputAdornment>)}>
              <MenuItem value="" disabled> Select {field.label} </MenuItem>
              {field.options.map((option) => (<MenuItem key={option.value} value={option.value}> {option.label} </MenuItem>))}
            </Select>
            {touched[field.name] && errors[field.name] && (<Typography variant="caption" color="error"> {errors[field.name]} </Typography>)}
          </FormControl>
        </Grid>
      );
    }

    return (
      <Grid item {...field.grid} key={field.name}>
        <Field name={field.name}>
          {({ field: formikField, meta }) => (
            <TextField {...formikField} fullWidth label={field.label} placeholder={field.placeholder || ""} required={field.required} type={field.type || "text"} error={meta.touched && Boolean(meta.error)} helperText={meta.touched && meta.error} InputProps={{ startAdornment: field.icon && (<InputAdornment position="start">{field.icon}</InputAdornment>), endAdornment: field.endAdornment, }} />
          )}
        </Field>
      </Grid>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

      <Container maxWidth="xxl" sx={{ mt: 4, mb: 6 }}>
        <Card elevation={0} sx={{ overflow: "visible", mb: 6 }}>
          <CardHeader title="Client Information Form" sx={{ bgcolor: "#00796b", color: "white", p: 3, borderTopLeftRadius: 12, borderTopRightRadius: 12, }} />
          <CardContent sx={{ p: 4 }}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ values, errors, touched, resetForm, setFieldValue }) => (
                <Form>
                  <Grid container spacing={3}>
                    {formFields.map((section, sectionIndex) => (
                      <React.Fragment key={`section-${sectionIndex}`}>
                        <Grid item xs={12}>
                          <Typography variant="h6" color="primary" sx={{ mb: 1, fontWeight: 500 }}> {section.section} </Typography>
                          <Divider sx={{ mb: 3 }} />
                        </Grid>
                        {section.fields.map((field) => renderFormField(field, values, errors, touched, setFieldValue))}
                      </React.Fragment>
                    ))}

                    <Grid item xs={12}>
                      <Typography variant="h6" color="primary" sx={{ mt: 1, mb: 1, fontWeight: 500, display: "flex", alignItems: "center", }}> <People sx={{ mr: 1 }} /> Supporting Customers </Typography>
                      <Divider sx={{ mb: 3 }} />
                    </Grid>
                    <Grid item xs={12}>
                      <FieldArray name="supportingCustomers">
                        {({ push, remove }) => (
                          <Box>
                            {values.supportingCustomers && values.supportingCustomers.length > 0 ? (
                              <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                                <Grid container spacing={2}>
                                  {values.supportingCustomers.map((customer, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                      <Box sx={{ display: "flex", gap: 1 }}>
                                        <Field name={`supportingCustomers.${index}`}>
                                          {({ field, meta }) => (
                                            <TextField {...field} fullWidth placeholder={`Customer ${index + 1}`} error={meta.touched && Boolean(meta.error)} helperText={meta.touched && meta.error} variant="outlined" size="medium" />
                                          )}
                                        </Field>
                                        <IconButton color="error" onClick={() => { remove(index); toast.info("Customer removed", toastConfig); }} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, }}> <RemoveCircleOutline /> </IconButton>
                                      </Box>
                                    </Grid>
                                  ))}
                                </Grid>
                              </Paper>
                            ) : (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: "italic" }}> No supporting customers added </Typography>
                            )}
                            <Button startIcon={<AddCircleOutline />} variant="outlined" color="primary" onClick={() => { push(""); toast.info("New customer field added", toastConfig); }} sx={{ mt: 1 }}> Add Customer </Button>
                          </Box>
                        )}
                      </FieldArray>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" color="primary" sx={{ mt: 1, mb: 1, fontWeight: 500, display: "flex", alignItems: "center", }}> <Person sx={{ mr: 1 }} /> Contact Information </Typography>
                      <Divider sx={{ mb: 3 }} />
                      <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2, mb: 3, }}>
                        <Button startIcon={<AddCircleOutline />} variant="outlined" color="primary" onClick={() => addContactPerson(values, setFieldValue)}> Add Contact Person </Button>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      {values.clientSpocName.map((_, index) => (
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }} key={index}>
                          <Grid container spacing={2}>
                            {contactFields.map((field) => (
                              <Grid item xs={12} sm={6} md={3} key={field.name}>
                                <Field name={`${field.name}.${index}`}>
                                  {({ field: formikField, meta }) => (
                                    <TextField {...formikField} fullWidth label={field.label} placeholder={field.placeholder || ""} error={meta.touched && Boolean(meta.error)} helperText={meta.touched && meta.error} InputProps={{ startAdornment: field.icon && (<InputAdornment position="start">{field.icon}</InputAdornment>), }} />
                                  )}
                                </Field>
                              </Grid>
                            ))}
                            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", }}>
                              <IconButton color="error" onClick={() => removeContactPerson(index, values, setFieldValue)} disabled={values.clientSpocName.length === 1} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, }}> <RemoveCircleOutline /> </IconButton>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" color="primary" sx={{ mt: 1, mb: 1, fontWeight: 500, display: "flex", alignItems: "center", }}> <AttachFile sx={{ mr: 1 }} /> Supporting Documents </Typography>
                      <Divider sx={{ mb: 3 }} />
                    </Grid>

                    <Grid item xs={12}>
                      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: "rgba(0, 0, 0, 0.01)", }}>
                        <Button variant="outlined" component="label" startIcon={<AttachFile />} size="large" sx={{ mb: 2 }}> Upload Files <input type="file" hidden multiple onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" /> </Button>

                        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1, }}>
                          {files.length > 0 ? (
                            files.map((file, index) => (
                              <Chip key={index} label={file.name} onDelete={() => removeFile(index)} color="primary" variant="outlined" sx={{ py: 0.5 }} />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}> No files selected. Please upload at least one supporting document. </Typography>
                          )}
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 3 }} />
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end">
                        <Button variant="outlined" color="secondary" onClick={() => { resetForm(); setFiles([]); toast.info("Form has been reset", toastConfig); }} startIcon={<RestartAlt />} size="large" sx={{ px: 4 }}> Reset Form </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} startIcon={isSubmitting ? (<CircularProgress size={20} color="inherit" />) : (<Save />)} size="large" sx={{ px: 4 }}> {isSubmitting ? "Submitting..." : "Add Client"} </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default ClientForm;