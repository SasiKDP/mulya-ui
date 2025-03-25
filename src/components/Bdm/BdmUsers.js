import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Grid,
  Link,
  Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material"; // Import back icon
import DataTable from "../MuiComponents/DataTable";
import BDMDetailsView from "./DetailsBdm/BDMDetailsView";
import BASE_URL from "../../redux/config";

const BdmUsers = () => {
  const [bdmUsers, setBdmUsers] = useState([]);
  const [selectedBDM, setSelectedBDM] = useState(null);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [fetchError, setFetchError] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false); // New state for detail loading

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

  const handleEmployeeIdClick = async (employeeId) => {
    setDetailLoading(true); // Show loading indicator
    try {
      const response = await axios.get(
        `${BASE_URL}/requirements/bdm/details/${employeeId}`
      );
      setSelectedBDM(response.data);
    } catch (error) {
      console.error("Error fetching BDM details:", error);
    } finally {
      setDetailLoading(false); // Hide loading indicator
    }
  };

  const columns = [
    {
      key: "employeeId",
      label: "Employee ID",
      type: "text",
      render: (row) => (
        <Link
          component="button"
          variant="body2"
          onClick={() => handleEmployeeIdClick(row.employeeId)}
          sx={{
            textDecoration: "underline",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {row.employeeId}
        </Link>
      ),
      columnLevelProps: {
        align: "left",
        style: { fontWeight: "bold" },
      },
    },
    {
      key: "employeeName",
      label: "Employee Name",
      type: "text",
      columnLevelProps: { align: "left" },
    },
    {
      key: "clientCount",
      label: "No.Of Client",
      type: "number",
      columnLevelProps: { align: "right" },
    },
    {
      key: "requirementsCount",
      label: "No.Of Requirements",
      type: "number",
      columnLevelProps: { align: "right" },
    },
    {
      key: "submissionCount",
      label: "No.Of Submissions",
      type: "number",
      columnLevelProps: { align: "right" },
    },
    {
      key: "interviewCount",
      label: "No.Of Interview",
      type: "number",
      columnLevelProps: { align: "right" },
    },
    {
      key: "placementCount",
      label: "No.Of Placement",
      type: "number",
      columnLevelProps: { align: "right" },
    },
  ];

  return (
    <Box>
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
        <Grid container spacing={3}>
          {!selectedBDM && !detailLoading && (
            <Grid item xs={12}>
              <DataTable
                data={bdmUsers}
                columns={columns}
                title="BDM USERS LIST"
                onRefresh={fetchBdmUsers}
                isRefreshing={fetchStatus === "loading"}
              />
            </Grid>
          )}

          {detailLoading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="50vh"
              width="100%"
            >
              <CircularProgress color="primary" />
            </Box>
          )}

          {selectedBDM && !detailLoading && (
            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
                Paper
                sx={{ gap: 2 }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ArrowBack />}
                  onClick={() => setSelectedBDM(null)}
                  sx={{ minWidth: 140 }}
                >
                  Back to BDM Users
                </Button>

                {/* <Box flexGrow={1} textAlign="center">
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 400, color: "#0F1C46" }}
                  >
                    BDM : {" "}
                    <em>{selectedBDM?.bdmDetails?.[0]?.userName || "N/A"}</em>
                  </Typography>
                </Box> */}
              </Box>

              <BDMDetailsView bdmData={selectedBDM} />
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default BdmUsers;
