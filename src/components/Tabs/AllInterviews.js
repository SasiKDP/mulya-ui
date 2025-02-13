import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Box,
  Paper,
  Container,
  Alert,
  AlertTitle,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import BASE_URL from "../../redux/config";
import DataTable from "../MuiComponents/DataTable"; // Importing the reusable DataTable component

const AllInterviews = () => {
  const [submissions, setSubmissions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/candidate/allscheduledinterviews`);
        setSubmissions(response.data);
       
      } catch (err) {
        setError(err.message || "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);



  // 👇 Define a custom column order
  const columnOrder = [
    "candidateFullName",
    "candidateContactNo",
    "candidateEmailId",
    "userEmail",
    "userId",
    "interviewDateTime",
    "duration",
    "zoomLink",
    "jobId",
    "candidateId",
    "interviewScheduledTimestamp",
    "clientEmail",
    "clientName",
    "interviewLevel",
    "interviewStatus"
  ];

  // Generate columns dynamically with manual order
  const generateColumns = (data, order) => {
    if (!data.length) return [];
    return order.map((key) => ({
      key,
      label: key
        .split(/(?=[A-Z])/)
        .join(" ")
        .replace(/^./, (str) => str.toUpperCase()),
    }));
  };

  const columns = generateColumns(submissions, columnOrder);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            backgroundColor: "rgba(232, 245, 233)",
            color: "#000",
            px: 2,
            py: 1,
            borderRadius: 1,
            mb: 3
          }}
        >
          Scheduled Interviews
        </Typography>

        {/* Global Search */}
        

        {/* Reusing DataTable component with searchQuery prop */}
        <DataTable data={submissions} columns={columns} pageLimit={10}  />
      </Paper>
    </Container>
  );
};

export default AllInterviews;
