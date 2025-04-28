import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Typography,
  Paper,
  Box,
  Alert,
  Collapse,
  IconButton,
  TextField,
  Grid,
  Button,
  MenuItem,
  InputAdornment,
  FormControl,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import {
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { encryptField } from "../../utils/encrypt";

const SuccessAlert = styled(Alert)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.success.main}`,
  backgroundColor: `${theme.palette.success.light}20`,
  "& .MuiAlert-icon": {
    color: theme.palette.success.main,
  },
}));

const ErrorAlert = styled(Alert)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.error.main}`,
  backgroundColor: `${theme.palette.error.light}20`,
  "& .MuiAlert-icon": {
    color: theme.palette.error.main,
  },
}));

// Validation schema using Yup
const validationSchema = Yup.object({
  candidateFullName: Yup.string().required("Consultant name is required"),
  candidateEmailId: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  candidateContactNo: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  technology: Yup.string().required("Technology is required"),
  clientName: Yup.string().required("Client name is required"),
  vendorName: Yup.string().required("Vendor name is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date().nullable(),
  currency: Yup.string().required("Currency is required"),
  billRate: Yup.number()
    .required("Bill rate is required")
    .positive("Must be positive"),
  payRate: Yup.number()
    .required("Pay rate is required")
    .positive("Must be positive"),
  employmentType: Yup.string().required("Employment type is required"),
  status: Yup.string().required("Status is required"),
});

const PlacementForm = ({ initialValues = {}, onSubmit, onCancel }) => {
  const theme = useTheme();
  const [submitStatus, setSubmitStatus] = useState({
    isSubmitting: false,
    success: null,
    error: null,
    response: null,
  });
  const [expandedResponse, setExpandedResponse] = useState(false);

  // Currency options
  const currencyOptions = [
    { value: "USD", label: "USD", symbol: "$" },
    { value: "INR", label: "INR", symbol: "₹" },
    { value: "EUR", label: "EURO", symbol: "€" },
  ];

  // Format date for the form
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return dayjs(dateStr);
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  };

  const formatNumberWithCommas = (value) => {
    if (!value) return "";
    // Remove all non-digit characters
    const numStr = value.toString().replace(/\D/g, "");
    // Add commas as thousands separators
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseNumberFromFormatted = (formattedValue) => {
    if (!formattedValue) return "";
    // Remove all commas and parse to number
    return formattedValue.replace(/,/g, "");
  };

  // Prepare initial values
  const getInitialFormValues = () => {
    return {
      candidateFullName: initialValues.candidateFullName || "",
      candidateEmailId: initialValues.candidateEmailId || "",
      candidateContactNo: initialValues.candidateContactNo || "",
      technology: initialValues.technology || "",
      clientName: initialValues.clientName || "",
      vendorName: initialValues.vendorName || "",
      startDate: formatDate(initialValues.startDate) || null,
      endDate: formatDate(initialValues.endDate) || null,
      currency: initialValues.currency || "USD",
      billRate: initialValues.billRate || "",
      payRate: initialValues.payRate || "",
      employmentType: initialValues.employmentType || "",
      recruiter: initialValues.recruiter || "",
      sales: initialValues.sales || "",
      status: initialValues.status || "",
      statusMessage: initialValues.statusMessage || "",
      remarks: initialValues.remarks || "",
    };
  };

  // Setup formik
  const formik = useFormik({
    initialValues: getInitialFormValues(),
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitStatus({
        isSubmitting: true,
        success: null,
        error: null,
        response: null,
      });

      try {
        const formattedValues = {
          ...values,
          startDate: values.startDate
            ? values.startDate.format("YYYY-MM-DD")
            : null,
          endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
        };

        // Encrypt sensitive fields before submitting
        formattedValues.payRate = encryptField(values.payRate.toString());
        formattedValues.billRate = encryptField(values.billRate.toString());

        // Add additional rate fields based on currency if needed
        if (values.currency === "USD") {
          formattedValues.billRateUSD = formattedValues.billRate;
        } else if (values.currency === "INR") {
          formattedValues.billRateINR = formattedValues.billRate;
        }

        // Calculate gross profit if needed
        formattedValues.grossProfit = encryptField(
          (parseFloat(values.billRate) - parseFloat(values.payRate)).toString()
        );

        if (onSubmit) {
          await onSubmit(formattedValues);
        }

        setSubmitStatus({
          isSubmitting: false,
          success: true,
          error: null,
          response: {
            message: "Placement saved successfully!",
            payload: formattedValues,
          },
        });
        setExpandedResponse(false);
      } catch (error) {
        setSubmitStatus({
          isSubmitting: false,
          success: false,
          error: error.message || "Failed to save placement. Please try again.",
          response: null,
        });
        setExpandedResponse(false);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Get current currency symbol
  const getCurrentCurrencySymbol = () => {
    const currency = currencyOptions.find(
      (c) => c.value === formik.values.currency
    );
    return currency ? currency.symbol : "$";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Placement Details
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Consultant Information */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "medium" }}
              >
                Consultant Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="candidateFullName"
                name="candidateFullName"
                label="Consultant Name"
                value={formik.values.candidateFullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.candidateFullName &&
                  Boolean(formik.errors.candidateFullName)
                }
                helperText={
                  formik.touched.candidateFullName &&
                  formik.errors.candidateFullName
                    ? formik.errors.candidateFullName
                    : "Enter consultant's full name"
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="candidateEmailId"
                name="candidateEmailId"
                label="Email"
                type="email"
                value={formik.values.candidateEmailId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.candidateEmailId &&
                  Boolean(formik.errors.candidateEmailId)
                }
                helperText={
                  formik.touched.candidateEmailId &&
                  formik.errors.candidateEmailId
                    ? formik.errors.candidateEmailId
                    : "Example: name@example.com"
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="candidateContactNo"
                name="candidateContactNo"
                label="Phone"
                inputProps={{ maxLength: 10 }}
                value={formik.values.candidateContactNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.candidateContactNo &&
                  Boolean(formik.errors.candidateContactNo)
                }
                helperText={
                  formik.touched.candidateContactNo &&
                  formik.errors.candidateContactNo
                    ? formik.errors.candidateContactNo
                    : "10 digits only"
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="technology"
                name="technology"
                label="Technology"
                value={formik.values.technology}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.technology && Boolean(formik.errors.technology)
                }
                helperText={
                  formik.touched.technology && formik.errors.technology
                }
                required
              />
            </Grid>
            {/* Client Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "medium" }}
              >
                Client Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="clientName"
                name="clientName"
                label="Client"
                value={formik.values.clientName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.clientName && Boolean(formik.errors.clientName)
                }
                helperText={
                  formik.touched.clientName && formik.errors.clientName
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="vendorName"
                name="vendorName"
                label="Vendor Name"
                value={formik.values.vendorName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.vendorName && Boolean(formik.errors.vendorName)
                }
                helperText={
                  formik.touched.vendorName && formik.errors.vendorName
                }
                required
              />
            </Grid>
            {/* Date Information */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date *"
                value={formik.values.startDate}
                onChange={(newValue) => {
                  formik.setFieldValue("startDate", newValue);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error:
                      formik.touched.startDate &&
                      Boolean(formik.errors.startDate),
                    helperText:
                      formik.touched.startDate && formik.errors.startDate,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={formik.values.endDate}
                onChange={(newValue) => {
                  formik.setFieldValue("endDate", newValue);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error:
                      formik.touched.endDate && Boolean(formik.errors.endDate),
                    helperText: formik.touched.endDate && formik.errors.endDate,
                  },
                }}
              />
            </Grid>
            {/* Financial Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "medium" }}
              >
                Financial Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="currency"
                name="currency"
                select
                label="Currency"
                value={formik.values.currency}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.currency && Boolean(formik.errors.currency)
                }
                helperText={formik.touched.currency && formik.errors.currency}
                required
              >
                {currencyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label} ({option.symbol})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="billRate"
                name="billRate"
                label="Bill Rate"
                value={formatNumberWithCommas(formik.values.billRate)}
                onChange={(e) => {
                  const rawValue = parseNumberFromFormatted(e.target.value);
                  formik.setFieldValue("billRate", rawValue);
                }}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.billRate && Boolean(formik.errors.billRate)
                }
                helperText={formik.touched.billRate && formik.errors.billRate}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {getCurrentCurrencySymbol()}
                    </InputAdornment>
                  ),
                  inputProps: { min: "0" },
                }}
              />
            </Grid>
           
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="payRate"
                name="payRate"
                label="Pay Rate"
                value={formatNumberWithCommas(formik.values.payRate)}
                onChange={(e) => {
                  const rawValue = parseNumberFromFormatted(e.target.value);
                  formik.setFieldValue("payRate", rawValue);
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.payRate && Boolean(formik.errors.payRate)}
                helperText={formik.touched.payRate && formik.errors.payRate}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {getCurrentCurrencySymbol()}
                    </InputAdornment>
                  ),
                  inputProps: { min: "0" },
                }}
              />
            </Grid>
            {/* Employment Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "medium" }}
              >
                Employment Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="employmentType"
                name="employmentType"
                select
                label="Employment Type"
                value={formik.values.employmentType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.employmentType &&
                  Boolean(formik.errors.employmentType)
                }
                helperText={
                  formik.touched.employmentType && formik.errors.employmentType
                }
                required
              >
                {[
                  { value: "W2", label: "W2" },
                  { value: "C2C", label: "C2C" },
                  { value: "Full-time", label: "Full-time" },
                  { value: "Part-time", label: "Part-time" },
                  { value: "Contract", label: "Contract" },
                  { value: "Contract-to-hire", label: "Contract-to-hire" },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="status"
                name="status"
                select
                label="Status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
                required
              >
                {[
                  { value: "Active", label: "Active" },
                  { value: "On Hold", label: "On Hold" },
                  { value: "Completed", label: "Completed" },
                  { value: "Terminated", label: "Terminated" },
                  { value: "Cancelled", label: "Cancelled" },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Internal Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "medium" }}
              >
                Internal Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="recruiter"
                name="recruiter"
                label="Recruiter"
                value={formik.values.recruiter}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.recruiter && Boolean(formik.errors.recruiter)
                }
                helperText={formik.touched.recruiter && formik.errors.recruiter}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="sales"
                name="sales"
                label="Sales"
                value={formik.values.sales}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.sales && Boolean(formik.errors.sales)}
                helperText={formik.touched.sales && formik.errors.sales}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="statusMessage"
                name="statusMessage"
                label="Status Message"
                value={formik.values.statusMessage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.statusMessage &&
                  Boolean(formik.errors.statusMessage)
                }
                helperText={
                  formik.touched.statusMessage && formik.errors.statusMessage
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="remarks"
                name="remarks"
                label="Remarks"
                multiline
                rows={3}
                value={formik.values.remarks}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                helperText={formik.touched.remarks && formik.errors.remarks}
              />
            </Grid>
            {/* Form Actions */}
            <Grid
              item
              xs={12}
              sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={onCancel}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={formik.isSubmitting || submitStatus.isSubmitting}
              >
                Save Placement
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Status Alerts */}
      <Collapse in={submitStatus.success !== null} sx={{ mt: 2 }}>
        {submitStatus.success ? (
          <SuccessAlert
            icon={<SuccessIcon fontSize="inherit" />}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setExpandedResponse(!expandedResponse)}
              >
                {expandedResponse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            }
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {submitStatus.response?.message}
            </Typography>
            <Collapse in={expandedResponse} sx={{ mt: 1 }}>
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  p: 2,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="caption" display="block" gutterBottom>
                  Response details:
                </Typography>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    margin: 0,
                    overflow: "auto",
                    maxHeight: "200px",
                  }}
                >
                  {JSON.stringify(submitStatus.response?.payload, null, 2)}
                </pre>
              </Box>
            </Collapse>
          </SuccessAlert>
        ) : (
          <ErrorAlert
            severity="error"
            icon={<ErrorIcon fontSize="inherit" />}
            onClose={() =>
              setSubmitStatus((prev) => ({ ...prev, error: null }))
            }
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Submission Failed
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {submitStatus.error}
            </Typography>
          </ErrorAlert>
        )}
      </Collapse>
    </LocalizationProvider>
  );
};

export default PlacementForm;
