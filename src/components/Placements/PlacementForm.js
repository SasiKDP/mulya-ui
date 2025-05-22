// import React, { useState, useEffect } from "react";
// import { useTheme } from "@mui/material/styles";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Typography,
//   Paper,
//   Box,
//   Alert,
//   TextField,
//   Grid,
//   Button,
//   MenuItem,
//   InputAdornment,
//   CircularProgress,
// } from "@mui/material";
// import {
//   CheckCircleOutline as SuccessIcon,
//   ErrorOutline as ErrorIcon,
//   Save as SaveIcon,
//   Cancel as CancelIcon,
// } from "@mui/icons-material";
// import { styled } from "@mui/material/styles";
// import dayjs from "dayjs";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { createPlacement, updatePlacement } from "../../redux/placementSlice";

// const SuccessAlert = styled(Alert)(({ theme }) => ({
//   borderLeft: `4px solid ${theme.palette.success.main}`,
//   backgroundColor: `${theme.palette.success.light}20`,
//   "& .MuiAlert-icon": {
//     color: theme.palette.success.main,
//   },
// }));

// const ErrorAlert = styled(Alert)(({ theme }) => ({
//   borderLeft: `4px solid ${theme.palette.error.main}`,
//   backgroundColor: `${theme.palette.error.light}20`,
//   "& .MuiAlert-icon": {
//     color: theme.palette.error.main,
//   },
// }));

// // Validation schema using Yup
// const validationSchema = Yup.object({
//   candidateFullName: Yup.string().required("Consultant name is required"),
//   candidateEmailId: Yup.string()
//     .email("Invalid email format")
//     .required("Email is required"),
//   candidateContactNo: Yup.string()
//     .matches(/^(\+?\d{10}|\+?\d{12}|\+?\d{15})$/, "Contact number must be 10, 12, or 15 digits")
//     .required("Phone number is required"),
//   technology: Yup.string().required("Technology is required"),
//   clientName: Yup.string().required("Client name is required"),
//   vendorName: Yup.string().required("Vendor name is required"),
//   startDate: Yup.date().required("Start date is required"),
//   endDate: Yup.date().nullable(),
//   billRate: Yup.number()
//     .required("Bill rate is required")
//     .positive("Must be positive"),
//   payRate: Yup.number()
//     .required("Pay rate is required")
//     .positive("Must be positive"),
//   employmentType: Yup.string().required("Employment type is required"),
//   status: Yup.string().required("Status is required"),
// });

// const PlacementForm = ({
//   initialValues = {},
//   onCancel,
//   isEdit = false,
// }) => {
//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const { loading, error, success } = useSelector((state) => state.placement);
//   const [submitStatus, setSubmitStatus] = useState({
//     isSubmitting: false,
//     success: null,
//     error: null,
//     response: null,
//   });

//   // Form field configurations organized in arrays for better maintainability
//   const consultantFields = [
//     {
//       id: "candidateFullName",
//       label: "Consultant Name",
//       required: true,
//       grid: { xs: 12, sm: 6 },
//       helperText: "Enter consultant's full name",
//     },
//     {
//       id: "candidateEmailId",
//       label: "Email",
//       type: "email",
//       required: true,
//       grid: { xs: 12, sm: 6 },
//       helperText: "Example: name@example.com",
//     },
//     {
//       id: "candidateContactNo",
//       label: "Phone",
//       required: true,
//       grid: { xs: 12, sm: 6 },
//       inputProps: { maxLength: 10 },
//       helperText: "10 digits only",
//     },
//     {
//       id: "technology",
//       label: "Technology",
//       required: true,
//       grid: { xs: 12, sm: 6 },
//     },
//   ];

//   const clientFields = [
//     {
//       id: "clientName",
//       label: "Client",
//       required: true,
//       grid: { xs: 12, sm: 6 },
//     },
//     {
//       id: "vendorName",
//       label: "Vendor Name",
//       required: true,
//       grid: { xs: 12, sm: 6 },
//     },
//   ];

//   const dateFields = [
//     {
//       id: "startDate",
//       label: "Start Date",
//       required: true,
//       type: "date",
//       grid: { xs: 12, sm: 6 },
//     },
//     {
//       id: "endDate",
//       label: "End Date",
//       type: "date",
//       grid: { xs: 12, sm: 6 },
//     },
//   ];

//   const financialFields = [
//     {
//       id: "billRate",
//       label: "Bill Rate",
//       required: true,
//       grid: { xs: 12, sm: 6 },
//       helperText: "Enter total bill rate",
//       inputProps: {
//         startAdornment: <InputAdornment position="start">₹</InputAdornment>,
//       },
//     },
//     {
//       id: "payRate",
//       label: "Pay Rate",
//       required: true,
//       grid: { xs: 12, sm: 6 },
//       helperText: "Enter total pay rate",
//       inputProps: {
//         startAdornment: <InputAdornment position="start">₹</InputAdornment>,
//       },
//     },
//     {
//       id: "grossProfit",
//       label: "Gross Profit",
//       grid: { xs: 6 },
//       helperText: "Bill Rate - Pay Rate",
//       readOnly: true,
//       inputProps: {
//         startAdornment: <InputAdornment position="start">₹</InputAdornment>,
//       },
//     },
//   ];

//   const employmentFields = [
//     {
//       id: "employmentType",
//       label: "Employment Type",
//       required: true,
//       grid: { xs: 12, sm: 6 },
//       select: true,
//       options: [
//         { value: "W2", label: "W2" },
//         { value: "C2C", label: "C2C" },
//         { value: "Full-time", label: "Full-time" },
//         { value: "Part-time", label: "Part-time" },
//         { value: "Contract", label: "Contract" },
//         { value: "Contract-to-hire", label: "Contract-to-hire" },
//       ],
//     },
//     {
//       id: "status",
//       label: "Status",
//       required: true,
//       grid: { xs: 12, sm: 6 },
//       select: true,
//       options: [
//         { value: "Active", label: "Active" },
//         { value: "On Hold", label: "On Hold" },
//         { value: "Completed", label: "Completed" },
//         { value: "Terminated", label: "Terminated" },
//         { value: "Cancelled", label: "Cancelled" },
//       ],
//     },
//   ];

//   const internalFields = [
//     {
//       id: "recruiterName",
//       label: "Recruiter",
//       grid: { xs: 12, sm: 6 },
//     },
//     {
//       id: "sales",
//       label: "Sales",
//       grid: { xs: 12, sm: 6 },
//     },
//     {
//       id: "statusMessage",
//       label: "Status Message",
//       grid: { xs: 12 },
//     },
//     {
//       id: "remarks",
//       label: "Remarks",
//       grid: { xs: 12 },
//       multiline: true,
//       rows: 3,
//     },
//   ];

//   // Format date for the form
//   const formatDateForInput = (dateStr) => {
//     if (!dateStr) return "";
//     try {
//       return dayjs(dateStr).format("YYYY-MM-DD");
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return "";
//     }
//   };

//   const formatNumberWithCommas = (value) => {
//     if (!value) return "";
//     // Remove all non-digit characters
//     const numStr = value.toString().replace(/\D/g, "");
//     // Add commas as thousands separators
//     return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };

//   const parseNumberFromFormatted = (formattedValue) => {
//     if (!formattedValue) return "";
//     // Remove all commas and parse to number
//     return formattedValue.replace(/,/g, "");
//   };

//   // Prepare initial values
//   const getInitialFormValues = () => {
//     return {
//       candidateFullName: initialValues.candidateFullName || "",
//       candidateEmailId: initialValues.candidateEmailId || "",
//       candidateContactNo: initialValues.candidateContactNo || "",
//       technology: initialValues.technology || "",
//       clientName: initialValues.clientName || "",
//       vendorName: initialValues.vendorName || "",
//       startDate: formatDateForInput(initialValues.startDate) || "",
//       endDate: formatDateForInput(initialValues.endDate) || "",
//       billRate: initialValues.billRate || "",
//       payRate: initialValues.payRate || "",
//       grossProfit: initialValues.grossProfit || "",
//       employmentType: initialValues.employmentType || "",
//       recruiterName: initialValues.recruiterName || "",
//       sales: initialValues.sales || "",
//       status: initialValues.status || "",
//       statusMessage: initialValues.statusMessage || "",
//       remarks: initialValues.remarks || "",
//     };
//   };

//   // Setup formik
//   const formik = useFormik({
//     initialValues: getInitialFormValues(),
//     validationSchema: validationSchema,
//     enableReinitialize: isEdit, // Allow reinitialization when in edit mode
//     onSubmit: async (values, { setSubmitting }) => {
//       setSubmitStatus({
//         isSubmitting: true,
//         success: null,
//         error: null,
//         response: null,
//       });
    
//       try {
//         // Parse and convert values
//         const billRate = parseFloat(values.billRate) || 0;
//         const payRate = parseFloat(values.payRate) || 0;
//         const grossProfit = Math.round(billRate - payRate);

//         // Prepare the payload
//         const payload = {
//           ...values,
//           billRate: Math.round(billRate),
//           payRate: Math.round(payRate),
//           grossProfit,
//           currency: "INR", // Always set to INR
//         };
    
//         if (isEdit) {
//           await dispatch(updatePlacement({
//             id: initialValues.id,
//             placementData: payload,
//           }));
//         } else {
//           await dispatch(createPlacement(payload));
//         }
    
//         setSubmitStatus({
//           isSubmitting: false,
//           success: true,
//           error: null,
//           response: {
//             message: `Placement ${isEdit ? "updated" : "created"} successfully!`,
//             payload,
//           },
//         });

//         // Close the drawer on successful submission after a short delay
//         setTimeout(() => {
//           onCancel();
//         }, 1000);
//       } catch (error) {
//         setSubmitStatus({
//           isSubmitting: false,
//           success: false,
//           error: error.message || `Failed to ${isEdit ? "update" : "create"} placement. Please try again.`,
//           response: null,
//         });
//       } finally {
//         setSubmitting(false);
//       }
//     }
//   });

//   // Update gross profit when bill rate or pay rate changes
//   useEffect(() => {
//     const billRate = parseFloat(formik.values.billRate) || 0;
//     const payRate = parseFloat(formik.values.payRate) || 0;
    
//     if (billRate > 0 && payRate > 0) {
//       const grossProfit = Math.round(billRate - payRate);
//       formik.setFieldValue('grossProfit', grossProfit.toString());
//     }
//   }, [formik.values.billRate, formik.values.payRate]);

//   // Update submit status based on Redux state
//   useEffect(() => {
//     if (success) {
//       setSubmitStatus({
//         isSubmitting: false,
//         success: true,
//         error: null,
//         response: {
//           message: `Placement ${isEdit ? 'updated' : 'created'} successfully!`,
//         },
//       });
      
//       // Close the drawer on successful submission from Redux state change
//       setTimeout(() => {
//         onCancel(); 
//       }, 1000);
//     }
    
//     if (error) {
//       setSubmitStatus({
//         isSubmitting: false,
//         success: false,
//         error: error,
//         response: null,
//       });
//     }
//   }, [success, error, isEdit, onCancel]);

//   // Function to render text fields
//   const renderTextField = (field) => {
//     const {
//       id,
//       label,
//       type = "text",
//       required = false,
//       grid,
//       helperText = "",
//       select = false,
//       options = [],
//       multiline = false,
//       rows = 1,
//       inputProps = {},
//       readOnly = false,
//     } = field;

//     return (
//       <Grid item {...grid} key={id}>
//         <TextField
//           fullWidth
//           id={id}
//           name={id}
//           label={`${label}${required ? ' *' : ''}`}
//           type={type}
//           value={
//             id === "billRate" || id === "payRate" || id === "grossProfit"
//               ? formatNumberWithCommas(formik.values[id])
//               : formik.values[id]
//           }
//           onChange={(e) => {
//             if (id === "billRate" || id === "payRate") {
//               const rawValue = parseNumberFromFormatted(e.target.value);
//               formik.setFieldValue(id, rawValue);
//             } else {
//               formik.handleChange(e);
//             }
//           }}
//           onBlur={formik.handleBlur}
//           error={formik.touched[id] && Boolean(formik.errors[id])}
//           helperText={
//             formik.touched[id] && formik.errors[id]
//               ? formik.errors[id]
//               : helperText
//           }
//           required={required}
//           select={select}
//           multiline={multiline}
//           rows={rows}
//           InputProps={{
//             ...inputProps,
//             readOnly: readOnly,
//           }}
//           InputLabelProps={{
//             shrink: type === "date" ? true : undefined,
//           }}
//         >
//           {select &&
//             options.map((option) => (
//               <MenuItem key={option.value} value={option.value}>
//                 {option.label}
//               </MenuItem>
//             ))}
//         </TextField>
//       </Grid>
//     );
//   };

//   return (
//     <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
//       <Typography variant="h5" sx={{ mb: 3 }}>
//         {isEdit ? 'Edit Placement' : 'Create New Placement'}
//       </Typography>

//       {/* Status messages */}
//       {submitStatus.error && (
//         <ErrorAlert severity="error" sx={{ mb: 2 }}>
//           {submitStatus.error}
//         </ErrorAlert>
//       )}
//       {submitStatus.success && (
//         <SuccessAlert severity="success" sx={{ mb: 2 }}>
//           {submitStatus.response?.message}
//         </SuccessAlert>
//       )}

//       <form onSubmit={formik.handleSubmit}>
//         <Grid container spacing={2}>
//           {/* Consultant Information */}
//           <Grid item xs={12}>
//             <Typography
//               variant="subtitle1"
//               sx={{ mb: 1, fontWeight: "medium" }}
//             >
//               Consultant Information
//             </Typography>
//           </Grid>
//           {consultantFields.map((field) =>
//             renderTextField(field)
//           )}

//           {/* Client Information */}
//           <Grid item xs={12} sx={{ mt: 2 }}>
//             <Typography
//               variant="subtitle1"
//               sx={{ mb: 1, fontWeight: "medium" }}
//             >
//               Client Information
//             </Typography>
//           </Grid>
//           {clientFields.map((field) =>
//             renderTextField(field)
//           )}

//           {/* Date Information */}
//           <Grid item xs={12} sx={{ mt: 2 }}>
//             <Typography
//               variant="subtitle1"
//               sx={{ mb: 1, fontWeight: "medium" }}
//             >
//               Date Information
//             </Typography>
//           </Grid>
//           {dateFields.map((field) =>
//             renderTextField(field)
//           )}

//           {/* Financial Information */}
//           <Grid item xs={12} sx={{ mt: 2 }}>
//             <Typography
//               variant="subtitle1"
//               sx={{ mb: 1, fontWeight: "medium" }}
//             >
//               Financial Information (INR)
//             </Typography>
//           </Grid>
//           {financialFields.map((field) =>
//             renderTextField(field)
//           )}

//           {/* Employment Information */}
//           <Grid item xs={12} sx={{ mt: 2 }}>
//             <Typography
//               variant="subtitle1"
//               sx={{ mb: 1, fontWeight: "medium" }}
//             >
//               Employment Information
//             </Typography>
//           </Grid>
//           {employmentFields.map((field) =>
//             renderTextField(field)
//           )}

//           {/* Internal Information */}
//           <Grid item xs={12} sx={{ mt: 2 }}>
//             <Typography
//               variant="subtitle1"
//               sx={{ mb: 1, fontWeight: "medium" }}
//             >
//               Internal Information
//             </Typography>
//           </Grid>
//           {internalFields.map((field) =>
//             renderTextField(field)
//           )}

//           {/* Form Actions */}
//           <Grid
//             item
//             xs={12}
//             sx={{
//               mt: 3,
//               display: "flex",
//               justifyContent: "flex-end",
//               gap: 2
//             }}
//           >
//             <Button
//               variant="outlined"
//               color="error"
//               startIcon={<CancelIcon />}
//               onClick={onCancel}
//               disabled={loading || formik.isSubmitting}
//             >
//               Close
//             </Button>

//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               startIcon={<SaveIcon />}
//               disabled={loading || formik.isSubmitting}
//             >
//               {loading || formik.isSubmitting ? (
//                 <>
//                   <CircularProgress size={20} sx={{ mr: 1 }} />
//                   {isEdit ? 'Updating...' : 'Creating...'}
//                 </>
//               ) : (
//                 isEdit ? 'Update Placement' : 'Create Placement'
//               )}
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//     </Paper>
//   );
// };

// export default PlacementForm;
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
      // Only required when financial info is verified
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
      // Only required when financial info is verified
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
    },
    {
      id: "endDate",
      label: "End Date",
      type: "date",
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

  // Format date for the form
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    try {
      return dayjs(dateStr).format("YYYY-MM-DD");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
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
    // If it's an edit mode and we have financial information already, automatically verify it
    const hasFinancialInfo = Boolean(initialValues.billRate || initialValues.payRate);
    
    if (isEdit && hasFinancialInfo) {
      setFinancialInfoVerified(true);
    }
    
    return {
      candidateFullName: initialValues.candidateFullName || "",
      candidateEmailId: initialValues.candidateEmailId || "",
      candidateContactNo: initialValues.candidateContactNo || "",
      technology: initialValues.technology || "",
      clientName: initialValues.clientName || "",
      vendorName: initialValues.vendorName || "",
      startDate: formatDateForInput(initialValues.startDate) || "",
      endDate: formatDateForInput(initialValues.endDate) || "",
      billRate: initialValues.billRate || "",
      payRate: initialValues.payRate || "",
      grossProfit: initialValues.grossProfit || "",
      employmentType: initialValues.employmentType || "",
      recruiterName: initialValues.recruiterName || "",
      sales: initialValues.sales || "",
      status: initialValues.status || "",
      statusMessage: initialValues.statusMessage || "",
      remarks: initialValues.remarks || "",
      financialInfoVerified: isEdit && hasFinancialInfo, // Add this field for conditional validation
    };
  };

  const initialFormValues = React.useMemo(() => getInitialFormValues(), [isEdit, initialValues]);
  // Setup formik
  const formik = useFormik({
    initialValues: initialFormValues,
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

        // Close the drawer on successful submission after a short delay
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
      
      // Close the drawer on successful submission from Redux state change
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
    // Clear any previous error when user starts typing
    if (otpError) {
      setOtpError(null);
    }
  };

  // Generate OTP - this would connect to your backend API
  const handleGenerateOtp = async () => {
    setIsGeneratingOtp(true);
    setOtpError(null);
    
    try {
      // Simulate API call to generate OTP
      // In a real implementation, you would call your backend API here
      // For testing purposes, we're using 12345 as the test OTP
      let testOtp = 12345;
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated success response
      setOtpSuccess("OTP sent successfully to your registered mobile number");
    } catch (error) {
      setOtpError("Failed to send OTP. Please try again.");
    } finally {
      setIsGeneratingOtp(false);
    }
  };

  // Verify OTP - this would connect to your backend API
  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Please enter OTP");
      return;
    }
    
    setIsVerifyingOtp(true);
    setOtpError(null);
    
    try {
      // Simulate API call to verify OTP
      // In a real implementation, you would call your backend API here
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demonstration, accept either "12345" or "123456" as the correct OTP
      // In a real implementation, the backend would verify this
      if (otp === "123456" || otp === "12345") {
        setFinancialInfoVerified(true);
        setOtpSuccess("OTP verified successfully");
        
        // Close the dialog after success
        setTimeout(() => {
          handleCloseOtpDialog();
        }, 1000);
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpError("Failed to verify OTP. Please try again.");
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
