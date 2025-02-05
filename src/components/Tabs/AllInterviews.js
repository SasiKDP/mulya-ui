import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, CircularProgress, Box, Paper, Container, Alert, AlertTitle } from "@mui/material";
//import appconfig.PROD_appconfig.PROD_BASE_URL from "../../redux/apiConfig";
import DataTable from "../MuiComponents/DataTable"; // Importing the DataTable component
import BASE_URL from "../../redux/config";




const AllInterviews = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
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
      }
    };

    fetchSubmissions();
  }, []);

  const generateColumns = (data) => {
    if (!data.length) return [];
    return Object.keys(data[0]).map((key) => ({
      key,
      label: key
        .split(/(?=[A-Z])/)
        .join(" ")
        .replace(/^./, (str) => str.toUpperCase()),
    }));
  };

  const columns = generateColumns(submissions);

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
      <Paper
        elevation={2}
        sx={{
          overflow: "auto",
          borderRadius: 2,
          height: 600,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              backgroundColor: "rgba(232, 245, 233)",
              color: "#000",
              px: 2,
              py: 1,
              borderRadius: 1,
              mb: 3,
            }}
          >
            Scheduled Interviews
          </Typography>

          {/* Reusing DataTable component */}
          <DataTable
            data={submissions}
            columns={columns}
            pageLimit={10} // You can adjust the page limit here
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default AllInterviews;
