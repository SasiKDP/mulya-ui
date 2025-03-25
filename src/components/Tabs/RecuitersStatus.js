import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress } from "@mui/material";
import DataTable from "../MuiComponents/DataTable"; // Assuming you have a reusable DataTable component
import BASE_URL from "../../redux/config";



const RecuitersStatus = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch data
  const fetchUserSpecificData = async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.get(`${BASE_URL}/requirements/stats`); // Replace with actual API
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchUserSpecificData();
  }, []);

  // Define columns
  const columns = [
    { key: "employeeId", label: "Employee ID" },
    { key: "employeeName", label: "Name" },
    {
      key: "employeeEmail",
      label: "Email",
      type: "text",
    },
    { key: "role", label: "Role" },
    { key: "numberOfSubmissions", label: "Submissions" },
    { key: "numberOfInterviews", label: "Interviews" },
    { key: "numberOfPlacements", label: "Placements" },
  ];

  return (
    <Box>
      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Loading data...
          </Typography>
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: "center", py: 4 }}>
          {error}
        </Typography>
      ) : (
        <DataTable
          data={data}
          columns={columns}
          pageLimit={20}
          title="Recuiters Status"
          onRefresh={fetchUserSpecificData}
          isRefreshing={isRefreshing}
          noDataMessage={
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Records Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No requirements have been assigned yet.
              </Typography>
            </Box>
          }
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: 2,
              overflow: "hidden",
            },
          }}
        />
      )}
    </Box>
  );
};

export default RecuitersStatus;
