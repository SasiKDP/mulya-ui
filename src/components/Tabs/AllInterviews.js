import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CircularProgress,
  Box,
  Paper,
  Container,
  Alert,
  AlertTitle,
} from "@mui/material";
import BASE_URL from "../../redux/config";
import DataTable from "../MuiComponents/DataTable"; // Reusable DataTable component
import SectionHeader from "../MuiComponents/SectionHeader"; // Import the reusable SectionHeader

const AllInterviews = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Fetch interview submissions
  const fetchSubmissions = async () => {
    setIsRefreshing(true);
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/candidate/allscheduledinterviews`
      );
      setSubmissions(response.data);
    } catch (err) {
      setError(err.message || "Failed to load submissions");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Custom column order
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
    "interviewStatus",
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
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
      {/* Reusable SectionHeader */}
      <Box sx={{mb:1}}> 
        <SectionHeader
          title="Scheduled Interviews"
          totalCount={submissions.length}
          onRefresh={fetchSubmissions}
          isRefreshing={isRefreshing}
        />
      </Box>

      {/* Reusing DataTable component */}
      <DataTable data={submissions} columns={columns} pageLimit={10} />
    </Container>
  );
};

export default AllInterviews;
