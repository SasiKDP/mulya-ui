import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  IconButton,
  Divider,
  Card,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Grid,
  Button,
  MenuItem,
  Checkbox,
  Select,
  TextField,
  FormControl,
  FormControlLabel,
  InputLabel
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as Yup from "yup";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useSelector } from "react-redux";
import { Check } from "lucide-react";
import httpService from "../../Services/httpService";
import { formatDateTime } from "../../utils/dateformate";
import { useFormik } from "formik";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);

const ScheduleJoiningInterviewForm = ({ data, onClose, onSuccess, showCoordinatorView }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { userId, email, userName, role } = useSelector((state) => state.auth);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [interviewResponse, setInterviewResponse] = useState(null);
  const [coordinators, setCoordinators] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);
  const [dateAvailability, setDateAvailability] = useState({});

  // Fetch coordinators on mount
  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const res = await httpService.get(
          "/users/employee?excludeRoleName=EMPLOYEE"
        );
        setCoordinators(
          res.data.map((emp) => ({
            value: emp.employeeId,
            label: emp.userName,
          }))
        );
      } catch (err) {
        console.error("Error fetching coordinators:", err);
      }
    };

    fetchCoordinators();
  }, []);

  const fetchBookedSlots = async (coordinatorId) => {
    if (!coordinatorId) return;
    
    setLoadingSlots(true);
    try {
      const res = await httpService.get(`/candidate/interviewSlots/${coordinatorId}`);
      const slots = res.data?.bookedSlots || [];
      setBookedSlots(slots);
      
      const availabilityMap = {};
      slots.forEach(slot => {
        if (slot.interviewDateTime) {
          const date = dayjs(slot.interviewDateTime).format('YYYY-MM-DD');
          if (!availabilityMap[date]) {
            availabilityMap[date] = [];
          }
          availabilityMap[date].push({
            start: dayjs(slot.interviewDateTime),
            end: dayjs(slot.interviewDateTime).add(slot.duration || 30, 'minutes'),
          });
        }
      });
      
      setDateAvailability(availabilityMap);
    } catch (err) {
      console.error("Failed to fetch booked slots", err);
      setBookedSlots([]);
      setDateAvailability({});
    } finally {
      setLoadingSlots(false);
    }
  };

  // Set initial coordinator if editing existing interview
  useEffect(() => {
    if (data?.assignedTo || data?.coordinator) {
      const initialCoordinator = data?.assignedTo || data?.coordinator || "";
      setSelectedCoordinator(initialCoordinator);
      fetchBookedSlots(initialCoordinator);
    }
  }, [data, coordinators]);

  // Fetch booked slots when coordinator changes
  useEffect(() => {
    if (selectedCoordinator) {
      fetchBookedSlots(selectedCoordinator);
    } else {
      setBookedSlots([]);
      setDateAvailability({});
    }
  }, [selectedCoordinator]);

  const safeDayjs = (date) => {
    if (date === null || date === undefined) return null;
    if (dayjs.isDayjs(date)) return date;
    const d = dayjs(date);
    return d.isValid() ? d : null;
  };

  // Check if a time slot is available for the selected date and duration
  const isSlotAvailable = useCallback((time, duration) => {
    const timeObj = safeDayjs(time);
    if (!timeObj || !selectedCoordinator) return true;

    const dateKey = timeObj.format('YYYY-MM-DD');
    const slotsForDate = dateAvailability[dateKey] || [];
    const selectedStart = timeObj;
    const selectedEnd = selectedStart.add(duration, 'minutes');

    // Allow maintaining the original time if editing
    if (data?.interviewDateTime) {
      const originalStart = safeDayjs(data.interviewDateTime);
      if (originalStart && selectedStart.isSame(originalStart)) {
        return true;
      }
    }

    // Check for conflicts with existing bookings
    return !slotsForDate.some(slot => {
      const slotStart = safeDayjs(slot.start);
      const slotEnd = safeDayjs(slot.end);
      
      if (!slotStart || !slotEnd) return false;
      
      return (
        (selectedStart.isAfter(slotStart) && selectedStart.isBefore(slotEnd)) ||
        (selectedEnd.isAfter(slotStart) && selectedEnd.isBefore(slotEnd)) ||
        (selectedStart.isSame(slotStart)) ||
        (selectedStart.isBefore(slotStart) && selectedEnd.isAfter(slotEnd))
      );
    });
  }, [selectedCoordinator, dateAvailability, data?.interviewDateTime]);


  const updateLocalBookedSlots = useCallback((newDateTime, duration) => {
  if (!selectedCoordinator) return;

  const newSlot = {
    interviewDateTime: newDateTime,
    duration: duration,
    interviewId: data.interviewId // Use the existing interview ID
  };
  
  // Remove the old slot (if it exists)
  const updatedSlots = bookedSlots.filter(
    slot => slot.interviewId !== data.interviewId
  );
  
  // Add the new slot
  setBookedSlots([...updatedSlots, newSlot]);
  
  // Update date availability
  const dateKey = dayjs(newDateTime).format('YYYY-MM-DD');
  const newStart = dayjs(newDateTime);
  const newEnd = newStart.add(duration, 'minutes');
  
  setDateAvailability(prev => {
    // Remove old availability for this interview
    const updatedAvailability = {...prev};
    Object.keys(updatedAvailability).forEach(date => {
      updatedAvailability[date] = updatedAvailability[date].filter(
        slot => slot.interviewId !== data.interviewId
      );
    });
    
    // Add new availability
    return {
      ...updatedAvailability,
      [dateKey]: [
        ...(updatedAvailability[dateKey] || []),
        {
          start: newStart,
          end: newEnd,
          interviewId: data.interviewId
        }
      ]
    };
  });
}, [selectedCoordinator, bookedSlots, data?.interviewId]);

  const initialValues = useMemo(() => {
    if (!data) return {};

    let dateTimeValue = null;
    if (data.interviewDateTime) {
      dateTimeValue = dayjs(data.interviewDateTime).isValid() 
        ? dayjs(data.interviewDateTime) 
        : null;
    }

    return {
      candidateId: data.candidateId || "",
      clientEmail: data.clientEmail || [],
      clientName: data.clientName || "",
      duration: data.duration || 30,
      externalInterviewDetails: data.externalInterviewDetails || "",
      fullName: data.fullName || data.candidateFullName || "",
      interviewDateTime: dateTimeValue,
      interviewLevel: data.interviewLevel,
      interviewId: data.interviewId,
      interviewStatus: "RESCHEDULED",
      internalFeedBack: data.internalFeedBack,
      jobId: data.jobId || "",
      skipNotification: data.skipNotification || false,
      userId: data.userId || userId || "",
      userEmail: data.email || email || "",
      zoomLink: data.zoomLink || "",
      candidateEmailId: data.emailId || data.candidateEmailId || "",
      contactNumber: data.contactNumber || data.candidateContactNo || "",
      coordinator: data.coordinator || userName,
      assignedTo: data.assignedTo || userId || "",
      coordinatorFeedback: data.coordinatorFeedback || "",
      comments: data.comments || "",
    };
  }, [data, userId, email, userName]);

  const validationSchema = Yup.object().shape({
    interviewDateTime: Yup.date()
      .required("Interview date and time is required")
      .test('time-available', 'This time slot conflicts with an existing booking', function(value) {
        if (!value || !selectedCoordinator) return true;
        
        const duration = this.parent.duration || 30;
        
        if (data?.interviewDateTime) {
          const originalTime = dayjs(data.interviewDateTime);
          if (dayjs(value).isSame(originalTime)) {
            return true;
          }
        }
        
        return isSlotAvailable(value, duration);
      }),
    duration: Yup.number()
      .required("Duration is required")
      .min(15, "Duration must be at least 15 minutes")
      .max(60, "Duration cannot exceed 60 minutes"),
    zoomLink: Yup.string().nullable(),
    assignedTo: Yup.string().nullable(),
    externalInterviewDetails: Yup.string().nullable(),
    skipNotification: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);

        const payload = {
          interviewId: data.interviewId,
          candidateId: values.candidateId,
          jobId: values.jobId,
          userId: values.userId,
          userEmail: values.userEmail,
          interviewLevel: values.interviewLevel,
          interviewStatus: "SCHEDULED",
          internalFeedBack: values.internalFeedBack,
          externalInterviewDetails: values.externalInterviewDetails,
          skipNotification: values.skipNotification,
          assignedTo: values.assignedTo,
          comments: values.comments,
          clientName: values.clientName,
          interviewDateTime: dayjs(values.interviewDateTime).format(),
          interviewScheduledTimestamp: dayjs(values.interviewDateTime).valueOf(),
          duration: values.duration,
          zoomLink: values.zoomLink,
          clientEmail: values.clientEmail,
        };

        const baseUrl = role === "COORDINATOR" || showCoordinatorView
          ? `/candidate/updateInterviewByCoordinator/${userId}/${data.interviewId}`
          : `/candidate/interview-update/${data.userId || userId}/${data.candidateId}/${data.jobId}`;

        const responseData = await httpService.put(baseUrl, payload);
        setInterviewResponse(responseData);
        setSubmissionSuccess(true);
        setNotification({
          open: true,
          message: "Interview rescheduled successfully",
          severity: "success",
        });
          updateLocalBookedSlots(
         dayjs(values.interviewDateTime).format(),
         values.duration
         );

        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose(true);
        }, 2000);
      } catch (error) {
        console.error("Error rescheduling interview:", error);
        setNotification({
          open: true,
          message: `Error rescheduling interview: ${error.message || "Unknown error"}`,
          severity: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleCoordinatorChange = (event) => {
    const newCoordinator = event.target.value;
    setSelectedCoordinator(newCoordinator);
    formik.setFieldValue('assignedTo', newCoordinator);
  };

  const SuccessMessage = () => {
    if (!submissionSuccess || !interviewResponse) return null;

    return (
      <Alert icon={<Check />} severity="success" sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          Interview rescheduled for{" "}
          <strong>Candidate ID:</strong> {interviewResponse.candidateId}{" "}
          successfully.
        </Typography>
      </Alert>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%", p: { xs: 2, sm: 3 }, bgcolor: "#f9fafc" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight={600} color="primary">
            Schedule
          </Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        <Card elevation={2} sx={{ borderRadius: 3, mb: 3, p: 3 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="text.primary"
            gutterBottom
          >
            Candidate Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Table>
            <TableBody>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                  Name
                </TableCell>
                <TableCell>{data.candidateFullName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                  Email
                </TableCell>
                <TableCell>{data.candidateEmailId}</TableCell>
              </TableRow>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                  Job ID
                </TableCell>
                <TableCell>{data.jobId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                  Client
                </TableCell>
                <TableCell>{data.clientName}</TableCell>
              </TableRow>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                  Interview Level
                </TableCell>
                <TableCell>{data.interviewLevel}</TableCell>
              </TableRow>
              {data.interviewDateTime && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                    Current Schedule
                  </TableCell>
                  <TableCell>{formatDateTime(data.interviewDateTime)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <SuccessMessage />

        {loadingSlots && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Loading availability data...
            </Typography>
          </Box>
        )}

        <Card elevation={2} sx={{ borderRadius: 3, p: 3 }}>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Interview Date & Time"
                  value={safeDayjs(formik.values.interviewDateTime)}
                  onChange={(newValue) => {
                    formik.setFieldValue('interviewDateTime', newValue);
                  }}
                  shouldDisableTime={(timeValue, clockType) => {
                    if (!timeValue || !selectedCoordinator) return false;
                    
                    const timeObj = safeDayjs(timeValue);
                    if (!timeObj || !timeObj.isValid()) return false;

                    const dateKey = timeObj.format('YYYY-MM-DD');
                    const slotsForDate = dateAvailability[dateKey] || [];
                    
                    if (slotsForDate.length === 0) return false;

                    if (clockType === 'hours') {
                      const hour = timeObj.hour();
                      let hasAvailableSlot = false;
                      
                      for (let minute = 0; minute < 60; minute += 30) {
                        const testTime = timeObj.clone().hour(hour).minute(minute);
                        
                        const isBlocked = slotsForDate.some(existingSlot => {
                          const existingStart = safeDayjs(existingSlot.start);
                          const existingEnd = safeDayjs(existingSlot.end);
                          
                          if (!existingStart || !existingEnd) return false;
                          
                          return (testTime.isAfter(existingStart) || testTime.isSame(existingStart)) && 
                                 testTime.isBefore(existingEnd);
                        });
                        
                        if (!isBlocked) {
                          hasAvailableSlot = true;
                          break;
                        }
                      }
                      
                      return !hasAvailableSlot;
                    }
                    
                    const selectedTime = timeObj;
                    const duration = formik.values.duration || 30;
                    
                    const isTimeBlocked = slotsForDate.some(existingSlot => {
                      const existingStart = safeDayjs(existingSlot.start);
                      const existingEnd = safeDayjs(existingSlot.end);
                      
                      if (!existingStart || !existingEnd) return false;
                      
                      return (selectedTime.isAfter(existingStart) || selectedTime.isSame(existingStart)) && 
                             selectedTime.isBefore(existingEnd);
                    });
                    
                    return isTimeBlocked;
                  }}
                  views={['year', 'month', 'day', 'hours', 'minutes']}
                  openTo="day"
                  ampm={false}
                  format="DD/MM/YYYY HH:mm"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.interviewDateTime && Boolean(formik.errors.interviewDateTime),
                      helperText: formik.touched.interviewDateTime && formik.errors.interviewDateTime,
                      required: true,
                      InputLabelProps: { shrink: true },
                    },
                    actionBar: {
                      actions: ['clear', 'today', 'accept'],
                    },
                  }}
                  loading={loadingSlots}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Coordinator</InputLabel>
                  <Select
                    name="assignedTo"
                    value={formik.values.assignedTo}
                    onChange={handleCoordinatorChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.assignedTo && Boolean(formik.errors.assignedTo)}
                    label="Coordinator"
                    disabled={formik.values.interviewLevel!=="INTERNAL"}
                  >
                    <MenuItem value="">None</MenuItem>
                    {coordinators.map((coordinator) => (
                      <MenuItem key={coordinator.value} value={coordinator.value}>
                        {coordinator.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="duration"
                  label="Duration (minutes)"
                  select
                  value={formik.values.duration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.duration && Boolean(formik.errors.duration)}
                  helperText={formik.touched.duration && formik.errors.duration}
                >
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={45}>45 minutes</MenuItem>
                  <MenuItem value={60}>60 minutes</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="interviewLevel"
                  label="Interview Level"
                  select
                  value={formik.values.interviewLevel}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.interviewLevel && Boolean(formik.errors.interviewLevel)}
                  helperText={formik.touched.interviewLevel && formik.errors.interviewLevel}
                >
                  <MenuItem value="INTERNAL">Internal</MenuItem>
                  <MenuItem value="EXTERNAL">External</MenuItem>
                  <MenuItem value="EXTERNAL-L1">External L1</MenuItem>
                  <MenuItem value="EXTERNAL-L2">External L2</MenuItem>
                  <MenuItem value="FINAL">Final</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="zoomLink"
                  label="Meeting Link"
                  value={formik.values.zoomLink}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{shrink:true}}
                  error={formik.touched.zoomLink && Boolean(formik.errors.zoomLink)}
                  helperText={formik.touched.zoomLink && formik.errors.zoomLink}
                  placeholder="https://zoom.us/j/example"
                />
              </Grid>

              {formik.values.interviewLevel !== "INTERNAL" ? (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="externalInterviewDetails"
                    label="Interview Details / Notes"
                    value={formik.values.externalInterviewDetails}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{shrink:true}}
                    error={formik.touched.externalInterviewDetails && Boolean(formik.errors.externalInterviewDetails)}
                    helperText={formik.touched.externalInterviewDetails && formik.errors.externalInterviewDetails}
                    multiline
                    rows={4}
                    placeholder="Add any additional interview details, requirements, or notes here"
                  />
                </Grid>
              ):(
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="comments"
                    label="Comments"
                    value={formik.values.comments}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{shrink:true}}
                    error={formik.touched.comments && Boolean(formik.errors.comments)}
                    helperText={formik.touched.comments && formik.errors.comments}
                    multiline
                    rows={4}
                    placeholder="Add Comments Here"
                  />
                </Grid>
              )
              }

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="skipNotification"
                      checked={formik.values.skipNotification}
                      onChange={formik.handleChange}
                      color="primary"
                    />
                  }
                  label="Skip email notification"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  <Button variant="outlined" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={formik.isSubmitting}
                    startIcon={formik.isSubmitting ? <CircularProgress size={20} /> : null}
                  >
                    {formik.isSubmitting ? "Rescheduling..." : "Reschedule Interview"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>

        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default ScheduleJoiningInterviewForm;