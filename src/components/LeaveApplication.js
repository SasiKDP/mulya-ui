import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
  Snackbar,
} from "@mui/material";
import axios from "axios";
//import appconfig.PROD_appconfig.PROD_BASE_URL from "../redux/apiConfig";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // Import plugin for isSameOrAfter
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../redux/features/employeesSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

const appconfig = require("../redux/apiConfig");

const BASE_URL = appconfig.PROD_appconfig.PROD_BASE_URL;

// Extend dayjs to use the isSameOrAfter plugin
dayjs.extend(isSameOrAfter);

const LeaveApplication = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { employeesList, fetchStatus, fetchError } = useSelector(
    (state) => state.employees
  );

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // success, error, info, warning

  // Filter managers (SUPERADMIN users)
  const managersList = employeesList.filter(
    (emp) => emp.roles === "SUPERADMIN" && emp.status === "ACTIVE"
  );

  // Fetch employees on component mount
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
      days: "",
      leaveType: "",
      userId: user || "",
      managerEmail: "",
      description: "",
    },
    validationSchema: Yup.object({
      startDate: Yup.date()
        .required("Start date is required")
        .test(
          "is-after-joining",
          "Leave start date cannot be before your joining date",
          function (value) {
            const joiningDate = dayjs(user?.joiningDate); // Use dayjs to convert date
            return dayjs(value).isSameOrAfter(joiningDate, "day"); // Check if start date is after or same as joining date
          }
        ),
      endDate: Yup.date()
        .required("End date is required")
        .min(Yup.ref("startDate"), "End date must be after start date"),
      leaveType: Yup.string().required("Leave type is required"),
      managerEmail: Yup.string().required("Reporting manager is required"),
      description: Yup.string().required("Leave description is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await axios.post(`${BASE_URL}/users/save`, {
          ...values,
          noOfDays: values.days,
        });
        if (response.status === 200) {
          const successData = response.data;

          setSnackbarSeverity("success");
          setSnackbarMessage(successData.message);
          setOpenSnackbar(true);

          resetForm();
          setSnackbarMessage(
            `Leave application submitted successfully from ${dayjs(
              values.startDate
            ).format("DD MMM YYYY")} to ${dayjs(values.endDate).format(
              "DD MMM YYYY"
            )} (${values.days} days).`
          );
        }
      } catch (error) {
        setSnackbarSeverity("error");
        setSnackbarMessage(
          error.message || "An error occurred while submitting your leave."
        );
        setOpenSnackbar(true);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Update days when startDate or endDate changes
  useEffect(() => {
    if (formik.values.startDate && formik.values.endDate) {
      const start = dayjs(formik.values.startDate);
      const end = dayjs(formik.values.endDate);

      if (end.isBefore(start)) {
        formik.setFieldValue("days", "");
      } else {
        const daysDifference = end.diff(start, "day") + 1;
        formik.setFieldValue("days", daysDifference > 0 ? daysDifference : "");
      }
    }
  }, [formik.values.startDate, formik.values.endDate]);

  // Close snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      {fetchStatus === "failed" && fetchError && (
        <Alert severity="error">Error fetching employees: {fetchError}</Alert>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Employee ID"
            name="userId"
            value={formik.values.userId}
            onChange={formik.handleChange}
            fullWidth
            variant="filled"
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Reporting Manager"
            name="managerEmail"
            value={formik.values.managerEmail}
            onChange={formik.handleChange}
            fullWidth
            variant="filled"
            required
            select
            error={
              formik.touched.managerEmail && Boolean(formik.errors.managerEmail)
            }
            helperText={
              formik.touched.managerEmail && formik.errors.managerEmail
            }
          >
            {fetchStatus === "loading" ? (
              <MenuItem disabled>Loading managers...</MenuItem>
            ) : managersList.length > 0 ? (
              managersList.map((manager) => (
                <MenuItem key={manager.employeeId} value={manager.email}>
                  {manager.userName} - {manager.email}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No managers available</MenuItem>
            )}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            fullWidth
            variant="filled"
            required
            InputLabelProps={{ shrink: true }}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && formik.errors.startDate}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={formik.values.endDate}
            onChange={formik.handleChange}
            fullWidth
            variant="filled"
            required
            InputLabelProps={{ shrink: true }}
            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
            helperText={formik.touched.endDate && formik.errors.endDate}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Number of Days"
            name="days"
            value={formik.values.days}
            fullWidth
            variant="filled"
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Type of Leave"
            name="leaveType"
            value={formik.values.leaveType}
            onChange={formik.handleChange}
            fullWidth
            variant="filled"
            required
            select
            error={formik.touched.leaveType && Boolean(formik.errors.leaveType)}
            helperText={formik.touched.leaveType && formik.errors.leaveType}
          >
            <MenuItem value="Sick Leave">Sick Leave</MenuItem>
            <MenuItem value="Paid Leave">Paid Leave</MenuItem>
            <MenuItem value="Casual Leave">Casual Leave</MenuItem>
            <MenuItem value="Annual">Annual</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Leave Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            fullWidth
            variant="filled"
            required
            multiline
            rows={3}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
        </Grid>
      </Grid>

      <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => formik.resetForm()}
        >
          Clear
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={formik.isSubmitting}
        >
          Apply Leave
        </Button>
      </Box>

      {/* Snackbar for displaying success/error message */}
    </Box>
  );
};

export default LeaveApplication;
