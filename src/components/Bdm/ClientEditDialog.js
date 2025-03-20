import React, { useState, useEffect } from "react";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import BASE_URL from "../../redux/config";





const ClientEditDialog = ({
  open,
  onClose,
  currentClient,
  onClientUpdated,
}) => {
  const [files, setFiles] = useState([]);
  const [prepopulatedFileName, setPrepopulatedFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert array to array of objects for SPOC fields
  const prepareSpocData = (client) => {
    if (!client) return [{ name: "", email: "", phone: "", linkedin: "" }];

    // If data exists in old format (arrays), convert to new format
    if (
      Array.isArray(client.clientSpocName) ||
      typeof client.clientSpocName === "string"
    ) {
      const names = Array.isArray(client.clientSpocName)
        ? client.clientSpocName
        : client.clientSpocName?.split(",").map(item => item.trim()) || [];
      const emails = Array.isArray(client.clientSpocEmailid)
        ? client.clientSpocEmailid
        : client.clientSpocEmailid?.split(",").map(item => item.trim()) || [];
      const phones = Array.isArray(client.clientSpocMobileNumber)
        ? client.clientSpocMobileNumber
        : client.clientSpocMobileNumber?.split(",").map(item => item.trim()) || [];
      const linkedins = Array.isArray(client.clientSpocLinkedin)
        ? client.clientSpocLinkedin
        : client.clientSpocLinkedin?.split(",").map(item => item.trim()) || [];

      // Create array of objects from separate arrays
      const maxLength = Math.max(
        names.length,
        emails.length,
        phones.length,
        linkedins.length
      );

      const spocContacts = [];
      for (let i = 0; i < maxLength; i++) {
        spocContacts.push({
          name: names[i] || "",
          email: emails[i] || "",
          phone: phones[i] || "",
          linkedin: linkedins[i] || "",
        });
      }

      return spocContacts.length ? spocContacts : [{ name: "", email: "", phone: "", linkedin: "" }];
    }

    // If data already exists in new format
    if (client.spocContacts && client.spocContacts.length) {
      return client.spocContacts;
    }

    return [{ name: "", email: "", phone: "", linkedin: "" }];
  };

  // Prepare initial values
  const getInitialValues = () => {
    if (!currentClient) return {};

    return {
      clientName: currentClient.clientName || "",
      clientAddress: currentClient.clientAddress || "",
      positionType: currentClient.positionType || "",
      netPayment: currentClient.netPayment || 0,
      gst: currentClient.gst || 0,
      supportingCustomers: Array.isArray(currentClient.supportingCustomers)
        ? currentClient.supportingCustomers.join(", ")
        : currentClient.supportingCustomers || "",
      clientWebsiteUrl: currentClient.clientWebsiteUrl || "",
      clientLinkedInUrl: currentClient.clientLinkedInUrl || "",
      spocContacts: prepareSpocData(currentClient),
      paymentType: currentClient.paymentType || "",
    };
  };

  useEffect(() => {
    if (currentClient && currentClient.supportingDocuments) {
      setPrepopulatedFileName(currentClient.supportingDocuments);
    } else {
      setPrepopulatedFileName("");
    }
  }, [currentClient]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleClose = () => {
    setFiles([]);
    onClose();
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    clientName: Yup.string().required("Client name is required"),
    clientAddress: Yup.string().nullable().max(100, "Max 100 characters"),
    positionType: Yup.string().nullable().required("Position type is required"),
    netPayment: Yup.number()
      .nullable()
      .required("Net payment is required")
      .positive("Must be positive"),
    gst: Yup.number()
      .nullable()
      .required("GST is required")
      .min(0, "Cannot be negative")
      .max(100, "Cannot exceed 100%"),
    clientWebsiteUrl: Yup.string().nullable().url("Enter a valid URL"),
    clientLinkedInUrl: Yup.string().nullable().url("Enter a valid LinkedIn URL"),
    spocContacts: Yup.array().of(
      Yup.object().shape({
        name: Yup.string()
          .required("Name is required")
          .matches(/^[A-Za-z\s]+$/, "Only letters allowed"),
        email: Yup.string()
          .required("Email is required")
          .email("Invalid email"),
        phone: Yup.string()
          .required("Phone is required")
          .matches(/^[0-9]{10}$/, "Must be 10 digits"),
        linkedin: Yup.string().nullable().url("Enter a valid LinkedIn URL"),
      })
    ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!currentClient) return;

    setIsSubmitting(true);

    try {
      // Convert spocContacts array of objects to separate arrays for the API
      const formattedValues = {
        ...values,
        supportingCustomers: values.supportingCustomers
          .split(",")
          .map(item => item.trim())
          .filter(item => item !== ""),
        clientSpocName: values.spocContacts.map(contact => contact.name),
        clientSpocEmailid: values.spocContacts.map(contact => contact.email),
        clientSpocMobileNumber: values.spocContacts.map(contact => contact.phone),
        clientSpocLinkedin: values.spocContacts.map(contact => contact.linkedin),
      };

      // Remove spocContacts to avoid sending extra data
      delete formattedValues.spocContacts;

      if (currentClient.id) {
        formattedValues.id = currentClient.id;
      }

      const formData = new FormData();
      formData.append("dto", JSON.stringify(formattedValues));

      // Append multiple files
      files.forEach((file) => {
        formData.append("supportingDocuments", file);
      });

      const response = await axios.put(
        `${BASE_URL}/requirements/bdm/${currentClient.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Client updated successfully!");
      setTimeout(() => {
        handleClose();
        onClientUpdated();
      }, 1000);
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update client. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  if (!currentClient) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="edit-dialog-title"
    >
      <DialogTitle
        id="edit-dialog-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#004d40",
          color: "white",
          fontWeight: "bold",
          borderRadius: "4px 4px 0 0",
        }}
      >
        Edit Client: {currentClient.clientName}
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Formik
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, values, handleChange, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                {/* Client Basic Info Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="clientName"
                    name="clientName"
                    label="Client Name *"
                    value={values.clientName}
                    onChange={handleChange}
                    error={touched.clientName && Boolean(errors.clientName)}
                    helperText={touched.clientName && errors.clientName}
                    margin="normal"
                    variant="outlined"
                    autoFocus
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="clientAddress"
                    name="clientAddress"
                    label="Client Address *"
                    value={values.clientAddress}
                    onChange={handleChange}
                    error={touched.clientAddress && Boolean(errors.clientAddress)}
                    helperText={touched.clientAddress && errors.clientAddress}
                    margin="normal"
                    variant="outlined"
                    multiline
                    maxRows={3}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel id="positionType-label">Position Type *</InputLabel>
                    <Select
                      labelId="positionType-label"
                      id="positionType"
                      name="positionType"
                      value={values.positionType}
                      onChange={handleChange}
                      label="Position Type *"
                      error={touched.positionType && Boolean(errors.positionType)}
                    >
                      <MenuItem value="Permanent">Permanent</MenuItem>
                      <MenuItem value="Contract">Contract</MenuItem>
                      <MenuItem value="Freelance">Freelance</MenuItem>
                      <MenuItem value="Full-Time">Full-Time</MenuItem>
                      <MenuItem value="Part-Time">Part-Time</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="netPayment"
                    name="netPayment"
                    label="Net Payment *"
                    type="number"
                    value={values.netPayment}
                    onChange={handleChange}
                    error={touched.netPayment && Boolean(errors.netPayment)}
                    helperText={touched.netPayment && errors.netPayment}
                    margin="normal"
                    variant="outlined"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="gst"
                    name="gst"
                    label="GST (%) *"
                    type="number"
                    value={values.gst}
                    onChange={handleChange}
                    error={touched.gst && Boolean(errors.gst)}
                    helperText={touched.gst && errors.gst}
                    margin="normal"
                    variant="outlined"
                    InputProps={{ inputProps: { min: 0, max: 100, step: 0.01 } }}
                  />
                </Grid>

                {/* Web Presence Section */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Web Presence
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="clientWebsiteUrl"
                    name="clientWebsiteUrl"
                    label="Website URL *"
                    value={values.clientWebsiteUrl}
                    onChange={handleChange}
                    error={touched.clientWebsiteUrl && Boolean(errors.clientWebsiteUrl)}
                    helperText={touched.clientWebsiteUrl && errors.clientWebsiteUrl}
                    margin="normal"
                    variant="outlined"
                    placeholder="https://example.com"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="clientLinkedInUrl"
                    name="clientLinkedInUrl"
                    label="LinkedIn URL"
                    value={values.clientLinkedInUrl}
                    onChange={handleChange}
                    error={touched.clientLinkedInUrl && Boolean(errors.clientLinkedInUrl)}
                    helperText={touched.clientLinkedInUrl && errors.clientLinkedInUrl}
                    margin="normal"
                    variant="outlined"
                    placeholder="https://linkedin.com/company/example"
                  />
                </Grid>

                {/* Supporting Customers Section */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Supporting Customers
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="supportingCustomers"
                    name="supportingCustomers"
                    label="Supporting Customers (comma separated)"
                    value={values.supportingCustomers}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    placeholder="Customer A, Customer B, Customer C"
                  />
                </Grid>

                {/* Contact Information Section - Now using FieldArray */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Single Point of Contact (SPOC) Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FieldArray name="spocContacts">
                    {({ remove, push }) => (
                      <>
                        {values.spocContacts.map((contact, index) => (
                          <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={3}>
                              <TextField
                                fullWidth
                                name={`spocContacts.${index}.name`}
                                label="Name *"
                                value={contact.name}
                                onChange={handleChange}
                                error={
                                  touched.spocContacts?.[index]?.name &&
                                  Boolean(errors.spocContacts?.[index]?.name)
                                }
                                helperText={
                                  touched.spocContacts?.[index]?.name &&
                                  errors.spocContacts?.[index]?.name
                                }
                                margin="normal"
                                variant="outlined"
                              />
                            </Grid>
                            
                            <Grid item xs={12} md={3}>
                              <TextField
                                fullWidth
                                name={`spocContacts.${index}.email`}
                                label="Email *"
                                value={contact.email}
                                onChange={handleChange}
                                error={
                                  touched.spocContacts?.[index]?.email &&
                                  Boolean(errors.spocContacts?.[index]?.email)
                                }
                                helperText={
                                  touched.spocContacts?.[index]?.email &&
                                  errors.spocContacts?.[index]?.email
                                }
                                margin="normal"
                                variant="outlined"
                              />
                            </Grid>
                            
                            <Grid item xs={12} md={3}>
                              <TextField
                                fullWidth
                                name={`spocContacts.${index}.phone`}
                                label="Phone *"
                                value={contact.phone}
                                onChange={handleChange}
                                error={
                                  touched.spocContacts?.[index]?.phone &&
                                  Boolean(errors.spocContacts?.[index]?.phone)
                                }
                                helperText={
                                  touched.spocContacts?.[index]?.phone &&
                                  errors.spocContacts?.[index]?.phone
                                }
                                margin="normal"
                                variant="outlined"
                              />
                            </Grid>
                            
                            <Grid item xs={12} md={3}>
                              <TextField
                                fullWidth
                                name={`spocContacts.${index}.linkedin`}
                                label="LinkedIn"
                                value={contact.linkedin}
                                onChange={handleChange}
                                error={
                                  touched.spocContacts?.[index]?.linkedin &&
                                  Boolean(errors.spocContacts?.[index]?.linkedin)
                                }
                                helperText={
                                  touched.spocContacts?.[index]?.linkedin &&
                                  errors.spocContacts?.[index]?.linkedin
                                }
                                margin="normal"
                                variant="outlined"
                              />
                            </Grid>
                            
                            {index > 0 && (
                              <Grid item xs={12} sx={{ mt: -1 }}>
                                <Button
                                  type="button"
                                  color="error"
                                  size="small"
                                  onClick={() => remove(index)}
                                >
                                  Remove Contact
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outlined"
                          onClick={() => push({ name: "", email: "", phone: "", linkedin: "" })}
                          sx={{ mt: 1 }}
                        >
                          Add Contact
                        </Button>
                      </>
                    )}
                  </FieldArray>
                </Grid>

                {/* Document Upload Section */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Supporting Documents
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: "1px dashed #aaa",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      my: 2,
                      borderRadius: 1,
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {files.length > 0
                        ? `Selected ${files.length} files`
                        : prepopulatedFileName
                        ? `Current Document: ${prepopulatedFileName}`
                        : "Upload supporting documents"}
                    </Typography>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mt: 1 }}
                      color="primary"
                    >
                      {prepopulatedFileName ? "Change Files" : "Upload Files"}
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </Button>
                    {prepopulatedFileName && (
                      <Typography variant="caption" color="text.secondary" mt={1}>
                        Leave empty to keep current document
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>

              <DialogActions sx={{ mt: 3, pt: 2, borderTop: "1px solid #eee" }}>
                <Button onClick={handleClose} color="primary" variant="outlined">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : "Update Client"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ClientEditDialog;