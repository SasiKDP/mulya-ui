import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import DataTable from "../MuiComponents/DataTable";
import BASE_URL from "../../redux/config";

const BdmUsers = () => {
  const [bdmUsers, setBdmUsers] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [fetchError, setFetchError] = useState(null);

  const fetchBdmUsers = async () => {
    setFetchStatus("loading");
    try {
      const response = await axios.get(`${BASE_URL}/users/bdmlist`);
      setBdmUsers(response.data);
      setFetchStatus("success");
    } catch (error) {
      setFetchError(error.message);
      setFetchStatus("error");
    }
  };

  useEffect(() => {
    fetchBdmUsers();
  }, []);

  const columns = [
    { key: "employeeId", label: "Employee ID", type: "text" },
    { key: "employeeName", label: "Employee Name", type: "text" },
    { key: "roles", label: "Roles", type: "text" },
    { key: "email", label: "Email", type: "text" },
    // { key: "status", label: "Status", type: "text" },
    { key: "clientCount", label: "Client Count", type: "number" },
    { key: "submissionCount", label: "Submission Count", type: "number" },
    { key: "interviewCount", label: "Interview Count", type: "number" },
    { key: "placementCount", label: "Placement Count", type: "number" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {fetchStatus === "loading" && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress color="primary" />
        </Box>
      )}

      {fetchStatus === "error" && (
        <Paper sx={{ p: 2, backgroundColor: "#ffebee", textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Error: {fetchError}
          </Typography>
        </Paper>
      )}

      {fetchStatus === "success" && (
        <DataTable
          data={bdmUsers}
          columns={columns}
          title="BDM USERS LIST"
          onRefresh={fetchBdmUsers}
          isRefreshing={fetchStatus === "loading"}
        />
      )}
    </Box>
  );
};

export default BdmUsers;
