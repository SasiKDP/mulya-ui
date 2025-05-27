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
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  LockOpen as LockOpenIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createPlacement, updatePlacement } from "../../redux/placementSlice";
import CryptoJS from "crypto-js";
import httpService from "../../Services/httpService";

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

// Encryption/Decryption utilities
const FINANCIAL_SECRET_KEY = 'financial-data-encryption-key-2024'; // Use a strong key in production

const encryptFinancialValue = (value) => {
  if (!value) return value;
  try {
    const stringValue = value.toString();
    console.log(stringValue);
    return CryptoJS.AES.encrypt(stringValue, FINANCIAL_SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    return value; // Return original value if encryption fails
  }
};

const decryptFinancialValue = (encryptedValue) => {
  if (!encryptedValue) return encryptedValue;
  try {
    // Check if the value is already decrypted (for backward compatibility)
    if (!isNaN(parseFloat(encryptedValue))) {
      return encryptedValue; // Already a number, return as is
    }
    
    const bytes = CryptoJS.AES.decrypt(encryptedValue, FINANCIAL_SECRET_KEY);
    const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedValue || encryptedValue; // Return original if decryption fails
  } catch (error) {
    console.error("Decryption failed:", error);
    return encryptedValue; // Return original value if decryption fails
  }
};

// Validation schema using Yup
const validationSchema = Yup.object().shape({
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
  billRate: Yup.mixed().test(
    'conditionalRequired',
    'Bill rate is required',
    function(value, context) {
      if (context.parent.financialInfoVerified) {
        if (!value) return false;
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue > 0;
      }
      return true;
    }
  ),
  payRate: Yup.mixed().test(
    'conditionalRequired',
    'Pay rate is required',
    function(value, context) {
      if (context.parent.financialInfoVerified) {
        if (!value) return false;
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue > 0;
      }
      return true;
    }
  ),
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
  
  // OTP verification states
  const [financialInfoVerified, setFinancialInfoVerified] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isGeneratingOtp, setIsGeneratingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [otpSuccess, setOtpSuccess] = useState(null);
  const {userId} =useSelector((state)=>state.auth)

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
      type: "date",
      grid: { xs: 12, sm: 6 },
       render: (row) => formatDateForDisplay(row.startDate),
    },
    {
      id: "endDate",
      label: "End Date",
      type: "date",
      grid: { xs: 12, sm: 6 },
       render: (row) => formatDateForDisplay(row.endDate),
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
      id: "recruiterName",
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

 
const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return "";
  try {
    // Handle various date formats that might come from the backend
    let date;
    
    // If it's already a dayjs object
    if (dayjs.isDayjs(dateStr)) {
      date = dateStr;
    } else {
      // Parse the date string - dayjs is quite flexible with formats
      date = dayjs.utc(dateStr);
    }
    
    if (!date.isValid()) {
      console.warn("Invalid date for display:", dateStr);
      return "";
    }
    
    // Format consistently as MM/DD/YYYY for display
    return date.format("MM/DD/YYYY");
  } catch (error) {
    console.error("Error formatting date for display:", error, dateStr);
    return "";
  }
};

const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  try {
    let date;
    
    // If it's already a dayjs object
    if (dayjs.isDayjs(dateStr)) {
      date = dateStr;
    } else {
      // Parse the date string
      date = dayjs(dateStr);
    }
    
    // Ensure we have a valid date
    if (!date.isValid()) {
      console.warn("Invalid date for input:", dateStr);
      return "";
    }
    
    // HTML date inputs expect YYYY-MM-DD format
    // Use UTC to avoid timezone issues
    return date.format("YYYY-MM-DD");
  } catch (error) {
    console.error("Error formatting date for input:", error, dateStr);
    return "";
  }
};

const formatDateForSubmission = (dateStr) => {
  if (!dateStr) return null;
  try {
    // When submitting, the dateStr should be in YYYY-MM-DD format from the HTML input
    const date = dayjs(dateStr);
    if (!date.isValid()) {
      console.warn("Invalid date for submission:", dateStr);
      return null;
    }
    
    // Return ISO format for consistent backend storage
    return date.format("YYYY-MM-DD");
  } catch (error) {
    console.error("Error formatting date for submission:", error, dateStr);
    return null;
  }
};

  const formatNumberWithCommas = (value) => {
    if (!value) return "";
    const numStr = value.toString().replace(/\D/g, "");
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseNumberFromFormatted = (formattedValue) => {
    if (!formattedValue) return "";
    return formattedValue.replace(/,/g, "");
  };

  // Prepare initial values with decryption for financial fields
  const getInitialFormValues = () => {
    const hasFinancialInfo = Boolean(initialValues.billRate || initialValues.payRate);
    
    if (isEdit && hasFinancialInfo) {
      setFinancialInfoVerified(false);
    }
    
    // Decrypt financial values if they exist
     const decryptedBillRate = initialValues.billRate ? decryptFinancialValue(initialValues.billRate) : "";
    const decryptedPayRate = initialValues.payRate ? decryptFinancialValue(initialValues.payRate) : "";
   const decryptedGrossProfit = initialValues.grossProfit ? decryptFinancialValue(initialValues.grossProfit) : "";
    
    return {
      candidateFullName: initialValues.candidateFullName || "",
      candidateEmailId: initialValues.candidateEmailId || "",
      candidateContactNo: initialValues.candidateContactNo || "",
      technology: initialValues.technology || "",
      clientName: initialValues.clientName || "",
      vendorName: initialValues.vendorName || "",
      startDate: formatDateForInput(initialValues.startDate) || "",
      endDate: formatDateForInput(initialValues.endDate) || "",
      billRate: decryptedBillRate,
      payRate: decryptedPayRate,
      grossProfit: decryptedGrossProfit,
      employmentType: initialValues.employmentType || "",
      recruiterName: initialValues.recruiterName || "",
      sales: initialValues.sales || "",
      status: initialValues.status || "",
      statusMessage: initialValues.statusMessage || "",
      remarks: initialValues.remarks || "",
      financialInfoVerified: isEdit && hasFinancialInfo,
    };
  };

  const initialFormValues = React.useMemo(() => getInitialFormValues(), [isEdit, initialValues]);

  // Setup formik
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    enableReinitialize: isEdit,
   onSubmit: async (values, { setSubmitting }) => {
  setSubmitStatus({
    isSubmitting: true,
    success: null,
    error: null,
    response: null,
  });

  try {
    // Parse and convert values
    const billRate = parseFloat(parseNumberFromFormatted(values.billRate)) || 0;
    const payRate = parseFloat(parseNumberFromFormatted(values.payRate)) || 0;
    const grossProfit = Math.round(billRate - payRate) ;

    // Encrypt financial data before sending to backend
    const encryptedBillRate = encryptFinancialValue(Math.round(billRate));
    const encryptedPayRate = encryptFinancialValue(Math.round(payRate));
    const encryptedGrossProfit = encryptFinancialValue(grossProfit); // This was missing encryption

    console.log("encryptedGrossProfit",encryptedGrossProfit)



    // Prepare the payload with encrypted financial data
    const payload = {
      ...values,
       startDate: formatDateForSubmission(values.startDate),
       endDate: formatDateForSubmission(values.endDate),
      billRate: encryptedBillRate,
      payRate: encryptedPayRate,
      grossProfit: encryptedGrossProfit, // Now properly encrypted
      currency: "INR",
    };

    console.log("Sending encrypted payload:", {
      ...payload,
      billRate: `${Math.round(billRate)} -> ${encryptedBillRate}`,
      payRate: `${Math.round(payRate)} -> ${encryptedPayRate}`,
      grossProfit: `${grossProfit} -> ${encryptedGrossProfit}`, // Log the encryption
    });

    if (isEdit) {
      dispatch(updatePlacement({
        id: initialValues.id,
        placementData: payload,
      }));
    } else {
      dispatch(createPlacement(payload)); 
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

    setTimeout(() => {
      onCancel();
    }, 1000);
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

  // Update formik value when financial info is verified
  useEffect(() => {
    formik.setFieldValue('financialInfoVerified', financialInfoVerified);
  }, [financialInfoVerified]);

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
      
      setTimeout(() => {
        onCancel(); 
      }, 1000);
    }
    
    if (error) {
      setSubmitStatus({
        isSubmitting: false,
        success: false,
        error: error,
        response: null,
      });
    }
  }, [success, error, isEdit, onCancel]);

  // Handle OTP dialog open
  const handleOpenOtpDialog = () => {
    setOtpDialogOpen(true);
    setOtp("");
    setOtpError(null);
    setOtpSuccess(null);
  };

  // Handle OTP dialog close
  const handleCloseOtpDialog = () => {
    setOtpDialogOpen(false);
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    if (otpError) {
      setOtpError(null);
    }
  };

  // Generate OTP
  // Fixed handleGenerateOtp function
const handleGenerateOtp = async () => {
  setIsGeneratingOtp(true);
  setOtpError(null);
  
  try {
    const payload = {
      userId: userId,
      placementId: isEdit ? initialValues.id : null, // Use placement ID when editing
      newPlacement: !isEdit // false when editing, true when creating new
    };
    
    console.log('Generate OTP Payload:', payload); // Debug log
    
    const response = await httpService.post('/candidate/sendOtp', payload);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtpSuccess("OTP sent successfully to your registered mobile number");
  } catch (error) {
    console.error('Generate OTP Error:', error);
    setOtpError("Failed to send OTP. Please try again.");
  } finally {
    setIsGeneratingOtp(false);
  }
};

// Fixed handleVerifyOtp function
const handleVerifyOtp = async () => {
  if (!otp) {
    setOtpError("Please enter OTP");
    return;
  }

  setIsVerifyingOtp(true);
  setOtpError(null);

  try {
    const payload = {
      userId: userId,
      placementId: isEdit ? initialValues.id : null, // Use placement ID when editing
      newPlacement: !isEdit, // false when editing, true when creating new
      otp: otp
    };
    
    console.log('Verify OTP Payload:', payload); // Debug log
    
    const response = await httpService.post('/candidate/verifyOtp', payload);
    
    // Debug log to see the actual response structure
    console.log('OTP Verification Response:', response);
    
    // Check for various possible success response formats
    const isSuccess = 
      response.data === true ||
      response.data === 'success' ||
      response.data?.success === true ||
      response.data?.status === 'success' ||
      response.data?.message === 'success' ||
      response.success === true ||
      response.status === 200 ||
      (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0);

    if (isSuccess) {
      setFinancialInfoVerified(true);
      setOtpSuccess("OTP verified successfully");

      setTimeout(() => {
        handleCloseOtpDialog();
      }, 1000);
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  } catch (error) {
    console.error('OTP Verification Error:', error);
    // Check if it's a validation error or network error
    if (error.response?.status === 400 || error.response?.status === 401) {
      setOtpError("Invalid OTP. Please try again.");
    } else {
      setOtpError("Failed to verify OTP. Please try again.");
    }
  } finally {
    setIsVerifyingOtp(false);
  }
};
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
          InputLabelProps={{
            shrink: type === "date" ? true : undefined,
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

  return (
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
            renderTextField(field)
          )}

          {/* Financial Information Section Header with Verification Link */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "medium" }}
              >
                Financial Information (INR)
              </Typography>
              
              {!financialInfoVerified ? (
                <Link 
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={handleOpenOtpDialog}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  <LockIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  Validate Financial Information
                </Link>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: theme.palette.success.main
                }}>
                  <LockOpenIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2">Verified</Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Financial Information Fields - Only shown when verified */}
          {financialInfoVerified && (
            <>
              {financialFields.map((field) =>
                renderTextField(field)
              )}
            </>
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
              Close
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

      {/* OTP Verification Dialog */}
      <Dialog 
        open={otpDialogOpen} 
        onClose={handleCloseOtpDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Financial Information Verification
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            To access financial information, please verify your identity with OTP.
          </Typography>

          {otpSuccess && (
            <SuccessAlert severity="success" sx={{ mb: 2 }}>
              {otpSuccess}
            </SuccessAlert>
          )}

          {otpError && (
            <ErrorAlert severity="error" sx={{ mb: 2 }}>
              {otpError}
            </ErrorAlert>
          )}

          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateOtp}
              disabled={isGeneratingOtp}
              fullWidth
              sx={{ mb: 2 }}
            >
              {isGeneratingOtp ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                  Sending OTP...
                </>
              ) : (
                'Generate OTP'
              )}
            </Button>
          </Box>

          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={handleOtpChange}
            variant="outlined"
            placeholder="Enter 6-digit OTP"
            inputProps={{ maxLength: 6 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseOtpDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleVerifyOtp} 
            color="primary" 
            variant="contained"
            disabled={isVerifyingOtp || !otp}
          >
            {isVerifyingOtp ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PlacementForm;
