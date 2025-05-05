import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Paper,
  Box,
  Alert,
  TextField,
  Grid,
  Button,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
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
import { createPlacement, updatePlacement } from "../../redux/placementSlice";

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
    .matches(/^(\+?\d{10}|\+?\d{12}|\+?\d{15})$/, "Contact number must be 10, 12, or 15 digits")
    .required("Phone number is required"),
  technology: Yup.string().required("Technology is required"),
  clientName: Yup.string().required("Client name is required"),
  vendorName: Yup.string().required("Vendor name is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date().nullable(),
  billRate: Yup.number()
    .required("Bill rate is required")
    .positive("Must be positive"),
  payRate: Yup.number()
    .required("Pay rate is required")
    .positive("Must be positive"),
  employmentType: Yup.string().required("Employment type is required"),
  status: Yup.string().required("Status is required"),
});

const PlacementForm = ({
  initialValues = {},
  onCancel,
  isEdit = false,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.placement);
  const [submitStatus, setSubmitStatus] = useState({
    isSubmitting: false,
    success: null,
    error: null,
    response: null,
  });

  // Form field configurations organized in arrays for better maintainability
  const consultantFields = [
    {
      id: "candidateFullName",
      label: "Consultant Name",
      required: true,
      grid: { xs: 12, sm: 6 },
      helperText: "Enter consultant's full name",
    },
    {
      id: "candidateEmailId",
      label: "Email",
      type: "email",
      required: true,
      grid: { xs: 12, sm: 6 },
      helperText: "Example: name@example.com",
    },
    {
      id: "candidateContactNo",
      label: "Phone",
      required: true,
      grid: { xs: 12, sm: 6 },
      inputProps: { maxLength: 10 },
      helperText: "10 digits only",
    },
    {
      id: "technology",
      label: "Technology",
      required: true,
      grid: { xs: 12, sm: 6 },
    },
  ];

  const clientFields = [
    {
      id: "clientName",
      label: "Client",
      required: true,
      grid: { xs: 12, sm: 6 },
    },
    {
      id: "vendorName",
      label: "Vendor Name",
      required: true,
      grid: { xs: 12, sm: 6 },
    },
  ];

  const dateFields = [
    {
      id: "startDate",
      label: "Start Date",
      required: true,
      isDate: true,
      grid: { xs: 12, sm: 6 },
    },
    {
      id: "endDate",
      label: "End Date",
      isDate: true,
      grid: { xs: 12, sm: 6 },
    },
  ];

  const financialFields = [
    {
      id: "billRate",
      label: "Bill Rate",
      required: true,
      grid: { xs: 12, sm: 6 },
      helperText: "Enter total bill rate",
      inputProps: {
        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
      },
    },
    {
      id: "payRate",
      label: "Pay Rate",
      required: true,
      grid: { xs: 12, sm: 6 },
      helperText: "Enter total pay rate",
      inputProps: {
        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
      },
    },
    {
      id: "grossProfit",
      label: "Gross Profit",
      grid: { xs: 6 },
      helperText: "Bill Rate - Pay Rate",
      readOnly: true,
      inputProps: {
        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
      },
    },
  ];

  const employmentFields = [
    {
      id: "employmentType",
      label: "Employment Type",
      required: true,
      grid: { xs: 12, sm: 6 },
      select: true,
      options: [
        { value: "W2", label: "W2" },
        { value: "C2C", label: "C2C" },
        { value: "Full-time", label: "Full-time" },
        { value: "Part-time", label: "Part-time" },
        { value: "Contract", label: "Contract" },
        { value: "Contract-to-hire", label: "Contract-to-hire" },
      ],
    },
    {
      id: "status",
      label: "Status",
      required: true,
      grid: { xs: 12, sm: 6 },
      select: true,
      options: [
        { value: "Active", label: "Active" },
        { value: "On Hold", label: "On Hold" },
        { value: "Completed", label: "Completed" },
        { value: "Terminated", label: "Terminated" },
        { value: "Cancelled", label: "Cancelled" },
      ],
    },
  ];

  const internalFields = [
    {
      id: "recruiter",
      label: "Recruiter",
      grid: { xs: 12, sm: 6 },
    },
    {
      id: "sales",
      label: "Sales",
      grid: { xs: 12, sm: 6 },
    },
    {
      id: "statusMessage",
      label: "Status Message",
      grid: { xs: 12 },
    },
    {
      id: "remarks",
      label: "Remarks",
      grid: { xs: 12 },
      multiline: true,
      rows: 3,
    },
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
      billRate: initialValues.billRate || "",
      payRate: initialValues.payRate || "",
      grossProfit: initialValues.grossProfit || "",
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
    enableReinitialize: isEdit, // Allow reinitialization when in edit mode
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitStatus({
        isSubmitting: true,
        success: null,
        error: null,
        response: null,
      });
    
      try {
        // Parse and convert values
        const billRate = parseFloat(values.billRate) || 0;
        const payRate = parseFloat(values.payRate) || 0;
        const grossProfit = Math.round(billRate - payRate);

        // Prepare the payload
        const payload = {
          ...values,
          billRate: Math.round(billRate),
          payRate: Math.round(payRate),
          grossProfit,
          currency: "INR", // Always set to INR
        };
    
        if (isEdit) {
          await dispatch(updatePlacement({
            id: initialValues.id,
            placementData: payload,
          }));
        } else {
          await dispatch(createPlacement(payload));
        }
    
        setSubmitStatus({
          isSubmitting: false,
          success: true,
          error: null,
          response: {
            message: `Placement ${isEdit ? "updated" : "created"} successfully!`,
            payload,
          },
        });
      } catch (error) {
        setSubmitStatus({
          isSubmitting: false,
          success: false,
          error: error.message || `Failed to ${isEdit ? "update" : "create"} placement. Please try again.`,
          response: null,
        });
      } finally {
        setSubmitting(false);
      }
    }
  });

  // Update gross profit when bill rate or pay rate changes
  useEffect(() => {
    const billRate = parseFloat(formik.values.billRate) || 0;
    const payRate = parseFloat(formik.values.payRate) || 0;
    
    if (billRate > 0 && payRate > 0) {
      const grossProfit = Math.round(billRate - payRate);
      formik.setFieldValue('grossProfit', grossProfit.toString());
    }
  }, [formik.values.billRate, formik.values.payRate]);

  // Update submit status based on Redux state
  useEffect(() => {
    if (success) {
      setSubmitStatus({
        isSubmitting: false,
        success: true,
        error: null,
        response: {
          message: `Placement ${isEdit ? 'updated' : 'created'} successfully!`,
        },
      });
    }
    if (error) {
      setSubmitStatus({
        isSubmitting: false,
        success: false,
        error: error,
        response: null,
      });
    }
  }, [success, error, isEdit]);

  // Function to render text fields
  const renderTextField = (field) => {
    const {
      id,
      label,
      type = "text",
      required = false,
      grid,
      helperText = "",
      select = false,
      options = [],
      multiline = false,
      rows = 1,
      inputProps = {},
      readOnly = false,
    } = field;

    return (
      <Grid item {...grid} key={id}>
        <TextField
          fullWidth
          id={id}
          name={id}
          label={`${label}${required ? ' *' : ''}`}
          type={type}
          value={
            id === "billRate" || id === "payRate" || id === "grossProfit"
              ? formatNumberWithCommas(formik.values[id])
              : formik.values[id]
          }
          onChange={(e) => {
            if (id === "billRate" || id === "payRate") {
              const rawValue = parseNumberFromFormatted(e.target.value);
              formik.setFieldValue(id, rawValue);
            } else {
              formik.handleChange(e);
            }
          }}
          onBlur={formik.handleBlur}
          error={formik.touched[id] && Boolean(formik.errors[id])}
          helperText={
            formik.touched[id] && formik.errors[id]
              ? formik.errors[id]
              : helperText
          }
          required={required}
          select={select}
          multiline={multiline}
          rows={rows}
          InputProps={{
            ...inputProps,
            readOnly: readOnly,
          }}
        >
          {select &&
            options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
        </TextField>
      </Grid>
    );
  };

  // Function to render date pickers
  const renderDatePicker = (field) => {
    const { id, label, required = false, grid } = field;

    return (
      <Grid item {...grid} key={id}>
        <DatePicker
          label={`${label}${required ? ' *' : ''}`}
          value={formik.values[id]}
          onChange={(newValue) => {
            formik.setFieldValue(id, newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: formik.touched[id] && Boolean(formik.errors[id]),
              helperText: formik.touched[id] && formik.errors[id],
            },
          }}
        />
      </Grid>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {isEdit ? 'Edit Placement' : 'Create New Placement'}
        </Typography>

        {/* Status messages */}
        {submitStatus.error && (
          <ErrorAlert severity="error" sx={{ mb: 2 }}>
            {submitStatus.error}
          </ErrorAlert>
        )}
        {submitStatus.success && (
          <SuccessAlert severity="success" sx={{ mb: 2 }}>
            {submitStatus.response?.message}
          </SuccessAlert>
        )}

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
            {consultantFields.map((field) =>
              renderTextField(field)
            )}

            {/* Client Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "medium" }}
              >
                Client Information
              </Typography>
            </Grid>
            {clientFields.map((field) =>
              renderTextField(field)
            )}

            {/* Date Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "medium" }}
              >
                Date Information
              </Typography>
            </Grid>
            {dateFields.map((field) =>
              field.isDate ? renderDatePicker(field) : renderTextField(field)
            )}

            {/* Financial Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "medium" }}
              >
                Financial Information (INR)
              </Typography>
            </Grid>
            {financialFields.map((field) =>
              renderTextField(field)
            )}

            {/* Employment Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "medium" }}
              >
                Employment Information
              </Typography>
            </Grid>
            {employmentFields.map((field) =>
              renderTextField(field)
            )}

            {/* Internal Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "medium" }}
              >
                Internal Information
              </Typography>
            </Grid>
            {internalFields.map((field) =>
              renderTextField(field)
            )}

            {/* Form Actions */}
            <Grid
              item
              xs={12}
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2
              }}
            >
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={onCancel}
                disabled={loading || formik.isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={loading || formik.isSubmitting}
              >
                {loading || formik.isSubmitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEdit ? 'Update Placement' : 'Create Placement'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};

export default PlacementForm;