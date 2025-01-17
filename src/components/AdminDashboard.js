import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from "@mui/material";
import { FileText, Users, Calendar, Clock } from "lucide-react";

const AdminDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Your existing data arrays remain the same
  const requirements = [
    { id: 1, position: "Senior React Developer", department: "Engineering", status: "Open", applicants: 12 },
    { id: 2, position: "Senior React Developer", department: "Engineering", status: "Open", applicants: 12 },
    { id: 3, position: "Senior React Developer", department: "Engineering", status: "Open", applicants: 12 },
    { id: 4, position: "Senior React Developer", department: "Engineering", status: "Open", applicants: 12 },
    { id: 5, position: "Senior React Developer", department: "Engineering", status: "Open", applicants: 12 },
    { id: 6, position: "Senior React Developer", department: "Engineering", status: "Open", applicants: 12 },
    { id: 7, position: "Senior React Developer", department: "Engineering", status: "Open", applicants: 12 },
    { id: 8, position: "Senior React Developer", department: "Engineering", status: "Open", applicants: 12 },
    { id: 9, position: "Senior React Developer", department: "Engineering", status: "Open", applicants: 12 },
    { id: 10, position: "Senior React Developer", department: "Engineering", status: "Open", applicants: 12 },
    { id: 12, position: "Senior React Developer", department: "Engineering", status: "Open", applicants: 12 },
    { id: 13, position: "Senior React Developer", department: "Engineering", status: "Open", applicants: 12 },
    { id: 14, position: "Senior React Developer", department: "Engineering", status: "Open", applicants: 12 },
    
    // ... rest of your requirements data
  ];
  
  const candidates = [
    { id: 1, name: "John Doe", position: "Senior React Developer", status: "Shortlisted" },
    // ... rest of your candidates data
  ];
  
  const interviews = [
    { id: 1, candidate: "John Doe", position: "Senior React Developer", date: "2025-01-18", time: "10:00 AM", level: "External" },
    // ... rest of your interviews data
  ];
  
  const leaves = [
    { id: 1, employee: "Mike Johnson", type: "Sick Leave", from: "2025-01-20", to: "2025-01-21", status: "Pending" },
    // ... rest of your leaves data
  ];
  
  const attendance = [
    { id: 1, employee: "Mike Johnson", status: "Present", checkIn: "9:00 AM", checkOut: "6:00 PM" },
    // ... rest of your attendance data
  ];
  
  const employees = [
    { id: 1, employeeID: "E001", empName: "Mike Johnson", designation: "Software Engineer", email: "mike.johnson@example.com", phone: "123-456-7890" },
    // ... rest of your employees data
  ];

  const summaryData = [
    { icon: <FileText />, label: "Open Requirements", count: requirements.length, color: "#1976D2" },
    { icon: <Users />, label: "Active Candidates", count: candidates.length, color: "#2E7D32" },
    { icon: <Calendar />, label: "Today's Interviews", count: interviews.length, color: "#7B1FA2" },
    { icon: <Clock />, label: "Pending Leaves", count: leaves.filter((leave) => leave.status === "Pending").length, color: "#ED6C02" },
    { icon: <Users />, label: "Total Employees", count: employees.length, color: "#D91656" },
  ];

  const tabData = [
    {
      label: "Requirements",
      data: requirements,
      columns: [
        { id: 'position', label: 'Position' },
        { id: 'department', label: 'Department' },
        { id: 'status', label: 'Status' },
        { id: 'applicants', label: 'Applicants' },
      ]
    },
    {
      label: "Candidates",
      data: candidates,
      columns: [
        { id: 'name', label: 'Name' },
        { id: 'position', label: 'Position' },
        { id: 'status', label: 'Status' },
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
        { id: 'level', label: 'Level' },
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
        { id: 'status', label: 'Status' },
      ]
    },
    {
      label: "Attendance",
      data: attendance,
      columns: [
        { id: 'employee', label: 'Employee' },
        { id: 'status', label: 'Status' },
        { id: 'checkIn', label: 'Check In' },
        { id: 'checkOut', label: 'Check Out' },
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
      ]
    }
  ];

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

  return (
    <Box 
      sx={{ 
        height: 'calc(100vh - 100px)', 
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Dashboard Header */}
      <Typography
        component="h1"
        variant="h5"
        sx={{
          p: 1,
          backgroundColor: "rgba(232, 245, 233, 0.5)",
          borderRadius: 2,
        }}
      >
        Dashboard Overview
      </Typography>

      {/* Summary Cards */}
      <Box 
        sx={{ 
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)"
          },
          gap: 2,
          px: 2,
          py: 1, // Reduced vertical padding
        }}
      >
        {summaryData.map((data, index) => (
          <Card key={index}>
            <CardContent sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 2,
              py: 1, // Reduced vertical padding
              '&:last-child': { pb: 1 } // Override MUI's default padding
            }}>
              <Avatar sx={{ bgcolor: data.color }}>{data.icon}</Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {data.label}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {data.count}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Tabs and Table Container */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: 2
      }}>
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              backgroundColor: "rgba(232, 245, 233, 0.5)",
              "& .MuiTab-root": {
                minHeight: "48px",
                textTransform: "none",
                fontWeight: "medium",
                mx: 0.5,
                my: 1,
                px: 2,
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "rgba(232, 245, 233, 0.8)",
                },
                "&.Mui-selected": {
                  backgroundColor: "#4B70F5",
                  color: "white",
                },
              },
            }}
          >
            {tabData.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Paper>

        {/* Table Content */}
        <Paper 
          sx={{ 
            flex: 1,
            mt: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {tabData[tabIndex].columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        backgroundColor: "rgba(232, 245, 233, 0.8)",
                        fontWeight: "bold"
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tabData[tabIndex].data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row.id}>
                      {tabData[tabIndex].columns.map((column) => (
                        <TableCell key={column.id}>
                          {row[column.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={tabData[tabIndex].data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard;