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
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../redux/features/employeesSlice";
import BASE_URL from "../redux/config";
import DataTable from "../components/MuiComponents/DataTable"; // Importing the reusable DataTable component

const AdminDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [requirements, setRequirements] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { employeesList } = useSelector((state) => state.employees);
  const dispatch = useDispatch();

  useEffect(() => {
    if (tabIndex === 1) {
      dispatch(fetchEmployees());
    }
  }, [tabIndex, dispatch]);

  const fetchData = async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const endpoints = {
      0: "/requirements/getAssignments",
      1: "/candidate/submissions/allsubmittedcandidates",
      2: "/candidate/allscheduledinterviews",
      3: "/attendance/all",
    };

    if (endpoints[tabIndex]) {
      fetchData(endpoints[tabIndex]).then((data) => {
        switch (tabIndex) {
          case 0:
            setRequirements(data);
            break;
          case 1:
            setCandidates(data);
            break;
          case 2:
            setInterviews(data);
            break;
          case 3:
            setAttendance(data);
            break;
          default:
            break;
        }
      });
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
      label: "Interviews",
      count: interviews.length,
      icon: <Calendar size={24} />,
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

  // Function to dynamically generate columns from data
  const generateColumns = (data) => {
    if (!data || data.length === 0) return [];

    const firstRow = data[0]; // Get the first object to extract keys
    return Object.keys(firstRow)
      .filter((key) => typeof firstRow[key] !== "object") // Ignore nested objects/arrays
      .map((key) => ({
        key: key,
        label: key
          .replace(/([A-Z])/g, " $1") // Convert camelCase to readable format
          .replace(/^./, (str) => str.toUpperCase()), // Capitalize first letter
      }));
  };

  // Select the data and generate columns dynamically
  const selectedData =
    tabIndex === 0
      ? requirements
      : tabIndex === 1
      ? employeesList
      : tabIndex === 2
      ? interviews
      : tabIndex === 3
      ? attendance
      : candidates;

  const columns = generateColumns(selectedData);

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

      
    </Box>
  );
};

export default AdminDashboard;
