// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Card,
//   CardHeader,
//   CardContent,
//   Typography,
//   Button,
//   TextField,
//   IconButton,
//   Grid,
//   Stack,
//   useTheme,
//   useMediaQuery,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from '@mui/material';
// import {
//   AccessTime as ClockIcon,
//   Add as AddIcon,
//   Save as SaveIcon,
//   Delete as DeleteIcon,
//   Send as SendIcon,
//   DateRange as DateRangeIcon
// } from '@mui/icons-material';

// const API_BASE_URL = '/api/timesheet'; // Replace with your API base URL

// const EmployeeTimesheet = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   // State
//   const [entries, setEntries] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [confirmDialog, setConfirmDialog] = useState({ open: false, entryId: null });
//   const [submitDialog, setSubmitDialog] = useState(false);
//   const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

//   // Fetch timesheet entries
//   const fetchEntries = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/entries`);
//       if (!response.ok) throw new Error('Failed to fetch entries');
//       const data = await response.json();
//       setEntries(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create new entry
//   const createEntry = async (entryData) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/entries`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(entryData),
//       });
//       if (!response.ok) throw new Error('Failed to create entry');
//       const data = await response.json();
//       setEntries([...entries, data]);
//       setSuccess('Entry created successfully');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Update entry
//   const updateEntry = async (id, entryData) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(entryData),
//       });
//       if (!response.ok) throw new Error('Failed to update entry');
//       const data = await response.json();
//       setEntries(entries.map(entry => entry.id === id ? data : entry));
//       setSuccess('Entry updated successfully');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Delete entry
//   const deleteEntry = async (id) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
//         method: 'DELETE',
//       });
//       if (!response.ok) throw new Error('Failed to delete entry');
//       setEntries(entries.filter(entry => entry.id !== id));
//       setSuccess('Entry deleted successfully');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Submit timesheet
//   const submitTimesheet = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/submit`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(entries),
//       });
//       if (!response.ok) throw new Error('Failed to submit timesheet');
//       setSuccess('Timesheet submitted successfully');
//       setSubmitDialog(false);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Fetch entries by date range
//   const fetchEntriesByDateRange = async (startDate, endDate) => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/entries?startDate=${startDate}&endDate=${endDate}`
//       );
//       if (!response.ok) throw new Error('Failed to fetch entries');
//       const data = await response.json();
//       setEntries(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchEntries();
//   }, []);

//   // Calculate total hours
//   const calculateHours = (startTime, endTime, breakHours) => {
//     if (!startTime || !endTime) return 0;
//     const start = new Date(`2025-01-01 ${startTime}`);
//     const end = new Date(`2025-01-01 ${endTime}`);
//     const diff = (end - start) / (1000 * 60 * 60) - parseFloat(breakHours || 0);
//     return Math.max(0, diff).toFixed(2);
//   };

//   const calculateTotalHours = () => {
//     return entries.reduce((total, entry) => {
//       return total + parseFloat(calculateHours(entry.startTime, entry.endTime, entry.break));
//     }, 0).toFixed(2);
//   };

//   const handleInputChange = (id, field, value) => {
//     const entry = entries.find(e => e.id === id);
//     const updatedEntry = { ...entry, [field]: value };
//     updateEntry(id, updatedEntry);
//   };

//   const handleAddEntry = () => {
//     const newEntry = {
//       date: new Date().toISOString().split('T')[0],
//       project: '',
//       startTime: '',
//       endTime: '',
//       break: '1',
//       description: ''
//     };
//     createEntry(newEntry);
//   };

//   const handleDeleteEntry = (id) => {
//     deleteEntry(id);
//     setConfirmDialog({ open: false, entryId: null });
//   };

//   const handleDateRangeChange = (newRange) => {
//     setDateRange(newRange);
//     fetchEntriesByDateRange(newRange.startDate, newRange.endDate);
//   };

//   const TimeEntryRow = ({ entry }) => (
//     <Card sx={{ mb: 2, p: 2 }}>
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6} md={2}>
//           <TextField
//             fullWidth
//             type="date"
//             value={entry.date}
//             onChange={(e) => handleInputChange(entry.id, 'date', e.target.value)}
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <TextField
//             fullWidth
//             placeholder="Project"
//             value={entry.project}
//             onChange={(e) => handleInputChange(entry.id, 'project', e.target.value)}
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={6} sm={6} md={1}>
//           <TextField
//             fullWidth
//             type="time"
//             value={entry.startTime}
//             onChange={(e) => handleInputChange(entry.id, 'startTime', e.target.value)}
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={6} sm={6} md={1}>
//           <TextField
//             fullWidth
//             type="time"
//             value={entry.endTime}
//             onChange={(e) => handleInputChange(entry.id, 'endTime', e.target.value)}
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={6} sm={6} md={1}>
//           <TextField
//             fullWidth
//             type="number"
//             placeholder="Break"
//             value={entry.break}
//             onChange={(e) => handleInputChange(entry.id, 'break', e.target.value)}
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <TextField
//             fullWidth
//             placeholder="Description"
//             value={entry.description}
//             onChange={(e) => handleInputChange(entry.id, 'description', e.target.value)}
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
//             <Typography>
//               {calculateHours(entry.startTime, entry.endTime, entry.break)} hrs
//             </Typography>
//             <IconButton
//               color="error"
//               onClick={() => setConfirmDialog({ open: true, entryId: entry.id })}
//               size="small"
//             >
//               <DeleteIcon />
//             </IconButton>
//           </Stack>
//         </Grid>
//       </Grid>
//     </Card>
//   );

//   return (
//     <Box sx={{ p: 2 }}>
//       <Card sx={{ maxWidth: 1200, mx: 'auto' }}>
//         <CardHeader
//           title={
//             <Stack
//               direction={isMobile ? 'column' : 'row'}
//               spacing={2}
//               alignItems={isMobile ? 'stretch' : 'center'}
//               justifyContent="space-between"
//             >
//               <Stack direction="row" spacing={1} alignItems="center">
//                 <ClockIcon />
//                 <Typography variant="h6">Employee Timesheet</Typography>
//               </Stack>
//               <Stack
//                 direction={isMobile ? 'column' : 'row'}
//                 spacing={2}
//                 alignItems={isMobile ? 'stretch' : 'center'}
//               >
//                 <Button
//                   startIcon={<DateRangeIcon />}
//                   onClick={() => handleDateRangeChange({
//                     startDate: new Date().toISOString().split('T')[0],
//                     endDate: new Date().toISOString().split('T')[0]
//                   })}
//                   variant="outlined"
//                 >
//                   Filter by Date
//                 </Button>
//                 <Typography>
//                   Total Hours: <strong>{calculateTotalHours()}</strong>
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   startIcon={<AddIcon />}
//                   onClick={handleAddEntry}
//                   fullWidth={isMobile}
//                 >
//                   Add Entry
//                 </Button>
//               </Stack>
//             </Stack>
//           }
//         />
//         <CardContent>
//           {loading ? (
//             <Box display="flex" justifyContent="center" p={3}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <Box sx={{ mb: 2 }}>
//               {entries.map((entry) => (
//                 <TimeEntryRow key={entry.id} entry={entry} />
//               ))}
//             </Box>
//           )}
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
//             <Button
//               variant="outlined"
//               startIcon={<SaveIcon />}
//               onClick={() => setSubmitDialog(true)}
//             >
//               Submit Timesheet
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Confirm Delete Dialog */}
//       <Dialog
//         open={confirmDialog.open}
//         onClose={() => setConfirmDialog({ open: false, entryId: null })}
//       >
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <Typography>Are you sure you want to delete this timesheet entry?</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setConfirmDialog({ open: false, entryId: null })}>
//             Cancel
//           </Button>
//           <Button
//             onClick={() => handleDeleteEntry(confirmDialog.entryId)}
//             color="error"
//             variant="contained"
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Submit Timesheet Dialog */}
//       <Dialog
//         open={submitDialog}
//         onClose={() => setSubmitDialog(false)}
//       >
//         <DialogTitle>Submit Timesheet</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to submit this timesheet? Total hours: {calculateTotalHours()}
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setSubmitDialog(false)}>
//             Cancel
//           </Button>
//           <Button
//             onClick={submitTimesheet}
//             color="primary"
//             variant="contained"
//             startIcon={<SendIcon />}
//           >
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Success/Error Notifications */}
//       <Snackbar
//         open={!!success}
//         autoHideDuration={6000}
//         onClose={() => setSuccess(null)}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
//           {success}
//         </Alert>
//       </Snackbar>

//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={() => setError(null)}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
//           {error}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default EmployeeTimesheet;

import React from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Grid,
  Stack,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TextField,
} from "@mui/material";
import {
  AccessTime as ClockIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EmployeeTimesheet = () => {
  const [entries, setEntries] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [confirmDialog, setConfirmDialog] = React.useState({
    open: false,
    entryId: null,
  });
  const [submitDialog, setSubmitDialog] = React.useState(false);

  const validationSchema = Yup.object({
    date: Yup.string().required("Date is required"),
    project: Yup.string().required("Project is required"),
    startTime: Yup.string().required("Start Time is required"),
    endTime: Yup.string().required("End Time is required"),
    break: Yup.number()
      .required("Break is required")
      .min(0, "Break must be 0 or more")
      .max(24, "Break cannot exceed 24 hours"),
    description: Yup.string().required("Description is required"),
  });

  const calculateHours = (startTime, endTime, breakHours) => {
    try {
      const start = new Date(`2025-01-01T${startTime}:00`);
      const end = new Date(`2025-01-01T${endTime}:00`);
      const diff =
        (end - start) / (1000 * 60 * 60) - (parseFloat(breakHours) || 0);
      return Math.max(0, diff).toFixed(2);
    } catch {
      return "0.00";
    }
  };

  const calculateTotalHours = () => {
    return entries
      .reduce((total, entry) => {
        return (
          total +
          parseFloat(
            calculateHours(entry.startTime, entry.endTime, entry.break)
          )
        );
      }, 0)
      .toFixed(2);
  };

  const handleAddEntry = () => {
    const newEntry = {
      id: entries.length + 1,
      date: "",
      project: "",
      startTime: "",
      endTime: "",
      break: "",
      description: "",
    };
    setEntries((prev) => [...prev, newEntry]);
  };

  const handleDeleteEntry = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    setConfirmDialog({ open: false, entryId: null });
    setSuccess("Entry deleted successfully");
  };

  const handleSubmitTimesheet = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitDialog(false);
      setEntries([]);
      setSuccess("Timesheet submitted successfully");
    }, 1000);
  };

  return (
    <Box sx={{ p: 3, overflow: "auto", maxHeight: "600px" }}>
      <Card sx={{ maxWidth: 1200, mx: "auto" }}>
        <CardHeader
          title={
            <Stack direction="row" spacing={2} alignItems="center">
              <ClockIcon />
              <Typography
                variant="h5"
                align="start"
                color="primary"
                gutterBottom
                sx={{
                  backgroundColor: "rgba(232, 245, 233)",
                  padding: 1,
                  borderRadius: 1,

                  textAlign: "start", // Optional: Center-align the text
                }}
              >
                Employee Timesheet
              </Typography>
            </Stack>
          }
        />
        <CardContent
          sx={{ overflowX: "auto", overflowY: "auto", maxHeight: "600px" }}
        >
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              variant="outlined"
              startIcon={<DateRangeIcon />}
              onClick={() => setEntries([])}
            >
              Clear Entries
            </Button>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Total Hours: {calculateTotalHours()} hrs
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddEntry}
            >
              Add Entry
            </Button>
          </Stack>

          <Box sx={{ mt: 2 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              entries.map((entry) => (
                <Card sx={{ mb: 2, p: 2 }} key={entry.id}>
                  <Formik
                    initialValues={entry}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                      setEntries((prev) =>
                        prev.map((e) =>
                          e.id === entry.id ? { ...e, ...values } : e
                        )
                      );
                      setSuccess("Entry updated successfully");
                    }}
                  >
                    {({ handleSubmit, errors, touched }) => (
                      <Form>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={2}>
                            <Field
                              name="date"
                              type="date"
                              as={TextField}
                              fullWidth
                              variant="outlined"
                              error={touched.date && !!errors.date}
                              helperText={touched.date && errors.date}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={2}>
                            <Field
                              name="project"
                              placeholder="Project"
                              as={TextField}
                              fullWidth
                              variant="outlined"
                              error={touched.project && !!errors.project}
                              helperText={touched.project && errors.project}
                            />
                          </Grid>
                          <Grid item xs={6} sm={6} md={1.5}>
                            <Field
                              name="startTime"
                              type="time"
                              as={TextField}
                              fullWidth
                              variant="outlined"
                              error={touched.startTime && !!errors.startTime}
                              helperText={touched.startTime && errors.startTime}
                            />
                          </Grid>
                          <Grid item xs={6} sm={6} md={1.5}>
                            <Field
                              name="endTime"
                              type="time"
                              as={TextField}
                              fullWidth
                              variant="outlined"
                              error={touched.endTime && !!errors.endTime}
                              helperText={touched.endTime && errors.endTime}
                            />
                          </Grid>
                          <Grid item xs={6} sm={6} md={1.5}>
                            <Field
                              name="break"
                              type="number"
                              placeholder="Break"
                              as={TextField}
                              fullWidth
                              variant="outlined"
                              error={touched.break && !!errors.break}
                              helperText={touched.break && errors.break}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Field
                              name="description"
                              placeholder="Description"
                              as={TextField}
                              fullWidth
                              variant="outlined"
                              error={
                                touched.description && !!errors.description
                              }
                              helperText={
                                touched.description && errors.description
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={2}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              justifyContent="flex-end"
                            >
                              <Typography>
                                {calculateHours(
                                  entry.startTime,
                                  entry.endTime,
                                  entry.break
                                )}{" "}
                                hrs
                              </Typography>
                              <Button
                                color="error"
                                onClick={() =>
                                  setConfirmDialog({
                                    open: true,
                                    entryId: entry.id,
                                  })
                                }
                                size="small"
                              >
                                <DeleteIcon />
                              </Button>
                            </Stack>
                          </Grid>
                        </Grid>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 2,
                          }}
                        >
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSubmit}
                          >
                            Save
                          </Button>
                        </Box>
                      </Form>
                    )}
                  </Formik>
                </Card>
              ))
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={() => setSubmitDialog(true)}
            >
              Submit Timesheet
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, entryId: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this timesheet entry?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, entryId: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteEntry(confirmDialog.entryId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submit Timesheet Dialog */}
      <Dialog open={submitDialog} onClose={() => setSubmitDialog(false)}>
        <DialogTitle>Submit Timesheet</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit this timesheet? Total hours:{" "}
            {calculateTotalHours()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitTimesheet}
            color="primary"
            variant="contained"
            startIcon={<SendIcon />}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Notifications */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccess(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeTimesheet;
