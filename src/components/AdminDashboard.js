import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Tabs, Tab, Avatar, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, useTheme, alpha, Chip, CircularProgress } from "@mui/material";
import { FileText, Users, Calendar, Clock, Building } from "lucide-react";
import BASE_URL from "../redux/apiConfig";

const AdminDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();

  // State for different data types
  const [requirements, setRequirements] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base API URL
  //const BASE_URL = 'http://192.168.0.246:8085';

  // Function to handle API calls
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
      0: '/requirements/all',
      1: '/candidate/submissions/allsubmittedcandidates',
      2: '/interviews/all',
      3: '/leaves/all',
      4: '/attendance/all',
      5: '/employees/all'
    };

    const updateState = (data) => {
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
          setLeaves(data);
          break;
        case 4:
          setAttendance(data);
          break;
        case 5:
          setEmployees(data);
          break;
        default:
          break;
      }
    };

    if (endpoints[tabIndex]) {
      fetchData(endpoints[tabIndex]).then(updateState);
    }
  }, [tabIndex]);

  const tabData = [
    {
      label: "Requirements",
      data: requirements,
      columns: [
        { id: 'position', label: 'Position' },
        { id: 'department', label: 'Department' },
        { id: 'status', label: 'Status' },
        { id: 'applicants', label: 'Applicants' }
      ]
    },
    {
      label: "Candidates",
      data: candidates,
      columns: [
    { "id": "name", "label": "Name" },
    { "id": "position", "label": "Position" },
    { "id": "status", "label": "Status" },
    { "id": "candidateId", "label": "Candidate ID" },
    { "id": "jobId", "label": "Job ID" },
    { "id": "userId", "label": "User  ID" },
    { "id": "fullName", "label": "Full Name" },
    { "id": "emailId", "label": "Email ID" },
    { "id": "contactNumber", "label": "Contact Number" },
    { "id": "currentOrganization", "label": "Current Organization" },
    { "id": "qualification", "label": "Qualification" },
    { "id": "totalExperience", "label": "Total Experience (Years)" },
    { "id": "relevantExperience", "label": "Relevant Experience (Years)" },
    { "id": "currentCTC", "label": "Current CTC" },
    { "id": "expectedCTC", "label": "Expected CTC" },
    { "id": "noticePeriod", "label": "Notice Period" },
    { "id": "currentLocation", "label": "Current Location" },
    { "id": "preferredLocation", "label": "Preferred Location" },
    { "id": "skills", "label": "Skills" },
    { "id": "communicationSkills", "label": "Communication Skills" },
    { "id": "requiredTechnologiesRating", "label": "Required Technologies Rating" },
    { "id": "overallFeedback", "label": "Overall Feedback" },
    { "id": "userEmail", "label": "User  Email" },
    { "id": "interviewStatus", "label": "Interview Status" }
]
    },
    {
      label: "Interviews",
      data: interviews,
      columns: [
        { id: 'candidate', label: 'Candidate' },
        { id: 'position', label: 'Position' },
        { id: 'date', label: 'Date' },
        { id: 'time', label: 'Time' },
        { id: 'level', label: 'Level' }
      ]
    },
    {
      label: "Leaves",
      data: leaves,
      columns: [
        { id: 'employee', label: 'Employee' },
        { id: 'type', label: 'Type' },
        { id: 'from', label: 'From' },
        { id: 'to', label: 'To' },
        { id: 'status', label: 'Status' }
      ]
    },
    {
      label: "Attendance",
      data: attendance,
      columns: [
        { id: 'employee', label: 'Employee' },
        { id: 'status', label: 'Status' },
        { id: 'checkIn', label: 'Check In' },
        { id: 'checkOut', label: 'Check Out' }
      ]
    },
    {
      label: "Employees",
      data: employees,
      columns: [
        { id: 'employeeID', label: 'Employee ID' },
        { id: 'empName', label: 'Name' },
        { id: 'designation', label: 'Designation' },
        { id: 'email', label: 'Email' },
        { id: 'phone', label: 'Phone' }
      ]
    }
  ];

  const summaryData = [
    {
      label: "Requirements",
      count: requirements.length,
      icon: <FileText size={24} />,
      color: "#1976d2",
      bgColor: "#e3f2fd"
    },
    {
      label: "Employees",
      count: employees.length,
      icon: <Users size={24} />,
      color: "#388e3c",
      bgColor: "#e8f5e9"
    },
    {
      label: "Leaves",
      count: leaves.length,
      icon: <Calendar size={24} />,
      color: "#d32f2f",
      bgColor: "#ffebee"
    },
    {
      label: "Attendance",
      count: attendance.length,
      icon: <Clock size={24} />,
      color: "#fbc02d",
      bgColor: "#fff9c4"
    },
    {
      label: "Departments",
      count: 5,
      icon: <Building size={24} />,
      color: "#7b1fa2",
      bgColor: "#f3e5f5"
    },
    {
      label: "Submissions",
      count: candidates.length,
      icon: <Building size={24} />,
      color: "rgba(72, 30, 20, 0.9)",
      bgColor: "rgba(255, 190, 152, 0.6)"
    }
  ];

  const getStatusChipColor = (status) => {
    const statusColors = {
      Open: "success",
      Closed: "error",
      Pending: "warning",
      Approved: "success",
      Present: "success",
      Late: "warning",
      Absent: "error",
      Shortlisted: "info",
      Selected: "success",
      Interview: "warning",
      "In Process": "primary"
    };
    return statusColors[status] || "default";
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderCellContent = (column, value) => {
    if (column.id === "status") {
      return <Chip label={value} color={getStatusChipColor(value)} size="small" />;
    }
    return value;
  };

  return (
    <Box sx={{ height: "calc(100vh - 18vh)", display: "flex", flexDirection: "column", gap: 3, p: 2, bgcolor: "#fff" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: theme.palette.primary.main, mb: 0.5 }}>
        Dashboard Overview
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(5, 1fr)" }, gap: 3 }}>
        {summaryData.map((data, index) => (
          <Card key={index} elevation={0} sx={{ bgcolor: data.bgColor, transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)" } }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
              <Avatar sx={{ bgcolor: data.color, width: 38, height: 38 }}>
                {data.icon}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                  {data.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: data.color }}>
                  {data.count}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Paper elevation={0} sx={{ flex: 1, overflow: "hidden", bgcolor: "white", borderRadius: 2 }}>
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
              minHeight: 48
            }
          }}
        >
          {tabData.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>

        <TableContainer sx={{ height: "calc(100% - 104px)" }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
              Error: {error}
            </Box>
          ) : (
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {tabData[tabIndex].columns.map((column) => (
                    <TableCell key={column.id} sx={{ bgcolor: theme.palette.grey[50], fontWeight: 600, color: theme.palette.text.primary }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tabData[tabIndex].data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row.id} sx={{ "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
                      {tabData[tabIndex].columns.map((column) => (
                        <TableCell key={column.id} sx={{ color: theme.palette.text.secondary }}>
                          {renderCellContent(column, row[column.id])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <TablePagination
          component="div"
          count={tabData[tabIndex].data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ borderTop: 1, borderColor: "divider", px: 2 }}
        />
      </Paper>
    </Box>
  );
};

export default AdminDashboard;