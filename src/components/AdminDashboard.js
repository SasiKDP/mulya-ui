import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Paper,
  CircularProgress,
} from "@mui/material";
import { FileText, Users, Calendar, Clock, Building } from "lucide-react";
import BASE_URL from "../redux/apiConfig";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../redux/features/employeesSlice";

const AdminDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [requirements, setRequirements] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]); // Interviews state
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { employeesList, fetchStatus, fetchError } = useSelector(
    (state) => state.employees
  );
  const dispatch = useDispatch();

  // Fetch employees data when the component mounts
  useEffect(() => {
    if (tabIndex === 5) {
      dispatch(fetchEmployees()); // Fetch employees when tabIndex is 5
    }
  }, [tabIndex, dispatch]);

  // Function to handle API calls for other tabs
  const fetchData = async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch data based on active tab
  useEffect(() => {
    const endpoints = {
      0: "/requirements/getAssignments",
      1: "/candidate/submissions/allsubmittedcandidates",
      2: "/candidate/allscheduledinterviews", // Interview data API endpoint
      3: "/attendance/all",
    };

    const updateState = (data) => {
      switch (tabIndex) {
        case 0:
          setRequirements(data);
          break;
        case 1:
          setCandidates(data); // Set candidates for "All Submissions"
          break;
        case 2:
          setInterviews(data); // Set interviews for "All Interviews"
          break;
        case 3:
          setAttendance(data);
          break;
        default:
          break;
      }
    };

    if (endpoints[tabIndex]) {
      fetchData(endpoints[tabIndex]).then(updateState);
    }
  }, [tabIndex]);

  const summaryData = [
    {
      label: "Requirements",
      count: requirements.length,
      icon: <FileText size={24} />,
      color: "#1976d2",
      bgColor: "#e3f2fd",
    },
    {
      label: "Employees",
      count: employeesList.length,
      icon: <Users size={24} />,
      color: "#388e3c",
      bgColor: "#e8f5e9",
    },
    {
      label: "Interviews", // Replacing the Leaves card with Interviews
      count: interviews.length,
      icon: <Calendar size={24} />, // Changing the icon to represent Interviews
      color: "#d32f2f",
      bgColor: "#ffebee",
    },
    {
      label: "Attendance",
      count: attendance.length,
      icon: <Clock size={24} />,
      color: "#fbc02d",
      bgColor: "#fff9c4",
    },
    {
      label: "Departments",
      count: 5,
      icon: <Building size={24} />,
      color: "#7b1fa2",
      bgColor: "#f3e5f5",
    },
    {
      label: "Submissions",
      count: candidates.length,
      icon: <Building size={24} />,
      color: "rgba(72, 30, 20, 0.9)",
      bgColor: "rgba(255, 190, 152, 0.6)",
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 18vh)",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 2,
        bgcolor: "#fff",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#1976d2", mb: 0.5 }}
      >
        Dashboard Overview
      </Typography>

      {/* Grid for summary cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(5, 1fr)",
          },
          gap: 3,
        }}
      >
        {summaryData.map((data, index) => (
          <Card
            key={index}
            elevation={0}
            sx={{
              bgcolor: data.bgColor,
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <CardContent
              sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}
            >
              <Avatar sx={{ bgcolor: data.color, width: 38, height: 38 }}>
                {data.icon}
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#616161", fontWeight: 500 }}
                >
                  {data.label}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: data.color }}
                >
                  {data.count}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Paper
        elevation={0}
        sx={{ flex: 1, overflow: "hidden", bgcolor: "white", borderRadius: 2 }}
      >
        {/* Tabs Section */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.95rem",
              minHeight: 48,
            },
          }}
        >
          {summaryData.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>

        {/* Loading or Error Handling */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2, textAlign: "center", color: "error.main" }}>
            Error: {error}
          </Box>
        ) : (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h5">No Data Available</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
