import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import BASE_URL from "../redux/apiConfig";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import useEmployees from './customHooks/useEmployees'; // Adjust the import path as needed

const LeaveApplication = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    days: "",
    leaveType: "",
    userId: "",
    managerEmail: "",
    description: "",
  });

  const { user } = useSelector((state) => state.auth);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Using the custom hook with SUPERADMIN filter
  const { 
    employees: managersList, 
    status: fetchStatus, 
    error: fetchError 
  } = useEmployees('SUPERADMIN');

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      userId: user || '',
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (updatedData.startDate && updatedData.endDate) {
        const start = dayjs(updatedData.startDate);
        const end = dayjs(updatedData.endDate);

        if (end.isBefore(start)) {
          updatedData.days = "";
        } else {
          const daysDifference = end.diff(start, "day") + 1;
          updatedData.days = daysDifference > 0 ? daysDifference : "";
        }
      }
      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.startDate ||
      !formData.endDate ||
      !formData.leaveType ||
      !formData.managerEmail ||
      !formData.description
    ) {
      setFormError("Please fill out all required fields.");
      return;
    }
    setFormError("");

    const leaveApplicationData = {
      ...formData,
      noOfDays: formData.days,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/users/save`,
        leaveApplicationData
      );
      if (response.status === 201) {
        const successData = response.data;

        setSuccessMessage(
          `Leave application submitted successfully from ${dayjs(formData.startDate).format(
            "DD MMM YYYY"
          )} to ${dayjs(formData.endDate).format("DD MMM YYYY")} (${formData.days} days).`
        );
        setFormData({
          startDate: "",
          endDate: "",
          days: "",
          leaveType: "",
          userId: "",
          managerEmail: "",
          description: "",
        });
        toast.success(successData.message);
      } 
    } catch (error) {
      setFormError(error.message || "An error occurred.");
      toast.error("An error occurred while submitting your leave.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" color="primary" gutterBottom>
        Apply Leave
      </Typography>
      {formError && <Alert severity="error">{formError}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {fetchStatus === "failed" && fetchError && (
        <Alert severity="error">Error fetching employees: {fetchError}</Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Employee ID"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            fullWidth
            variant="filled"
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Reporting Manager"
            name="managerEmail"
            value={formData.managerEmail}
            onChange={handleChange}
            fullWidth
            variant="filled"
            required
            select
          >
            {fetchStatus === "loading" ? (
              <MenuItem disabled>Loading managers...</MenuItem>
            ) : managersList.length > 0 ? (
              managersList.map((manager) => (
                <MenuItem key={manager.employeeId} value={manager.email}>
                  {manager.employeeName}
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
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
            variant="filled"
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            fullWidth
            variant="filled"
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Number of Days"
            name="days"
            value={formData.days}
            fullWidth
            variant="filled"
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Type of Leave"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            fullWidth
            variant="filled"
            required
            select
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
            value={formData.description}
            onChange={handleChange}
            fullWidth
            variant="filled"
            required
            multiline
            rows={3}
          />
        </Grid>
      </Grid>

      <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setFormData({
            startDate: "",
            endDate: "",
            days: "",
            leaveType: "",
            userId: user || "",
            managerEmail: "",
            description: "",
          })}
        >
          Clear
        </Button>

        <Button type="submit" variant="contained" color="primary">
          Apply Leave
        </Button>
      </Box>
    </Box>
  );
};

export default LeaveApplication;