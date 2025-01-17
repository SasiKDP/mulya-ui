import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAttendanceRecords,
  postAttendanceRecord,
  updateAttendanceRecord,
  setCheckIn,
  setCheckOut
} from '../redux/features/attendanceSlice';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarToday,
  CalendarViewDay,
  CalendarViewWeek,
  CalendarMonth,
  LoginOutlined,
  LogoutOutlined,
} from "@mui/icons-material";

const AttendanceTracker = () => {
  const dispatch = useDispatch();
  const {
    records,
    totalRecords,
    loading,
    error,
    currentSession: { isCheckedIn, checkInTime, checkOutTime }
  } = useSelector((state) => state.attendance);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [view, setView] = useState("month");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch attendance records
  useEffect(() => {
    dispatch(fetchAttendanceRecords({ page, rowsPerPage, searchQuery }));
  }, [dispatch, page, rowsPerPage, searchQuery]);

  const handleCheckIn = async () => {
    const now = new Date();
    const checkInData = {
      
      date: now.toLocaleDateString("en-GB"),
      status: "Present",
      clockIn: now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      clockOut: "-",
      late: calculateLateTime(now),
      earlyLeaving: "-",
      overtime: "-",
    };

    try {
      await dispatch(postAttendanceRecord(checkInData)).unwrap();
      dispatch(setCheckIn(now.toISOString()));
    } catch (err) {
      console.error('Failed to check in:', err);
    }
  };

  const handleCheckOut = async () => {
    const now = new Date();
    const checkOutData = {
      clockOut: now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      earlyLeaving: calculateEarlyLeaving(now),
      overtime: calculateOvertime(new Date(checkInTime), now),
    };

    try {
      await dispatch(updateAttendanceRecord({
        id: records[0].id,
        ...records[0],
        ...checkOutData
      })).unwrap();
      dispatch(setCheckOut(now.toISOString()));
    } catch (err) {
      console.error('Failed to check out:', err);
    }
  };

  const calculateLateTime = (checkInTime) => {
    const startTime = new Date(checkInTime);
    startTime.setHours(9, 0, 0);
    const diff = checkInTime - startTime;
    return diff > 0 ? formatTimeDifference(diff) : "00:00:00";
  };

  const calculateEarlyLeaving = (checkOutTime) => {
    const endTime = new Date(checkOutTime);
    endTime.setHours(18, 0, 0);
    const diff = checkOutTime - endTime;
    return formatTimeDifference(diff);
  };

  const calculateOvertime = (start, end) => {
    const endTime = new Date(start);
    endTime.setHours(18, 0, 0);
    const diff = end - endTime;
    return diff > 0 ? formatTimeDifference(diff) : "00:00:00";
  };

  const formatTimeDifference = (diff) => {
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleDateNavigation = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (direction === "next") {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <Box sx={{ 
      maxWidth: "90%", 
      margin: "auto", 
      p: 3, 
      minHeight: "80vh", 
      overflowY: "auto",
      overflowx: "auto",
        
      maxHeight: "calc(100vh - 100px)"  // Adjust this value as needed
    }}>
      

      <Typography
              component="h1"
              variant="h5"
              align="left" // Align text to start (left-aligned)
              sx={{
                mb: 2,
      
                backgroundColor: "rgba(232, 245, 233)", // Add background color
                padding: "0.5rem",
                borderRadius: 2,
                
              }}
            >
              Timesheet
            </Typography>

      {/* Check In/Out Section */}
      <Paper elevation={3} sx={{ mb: 4, p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" color="text.primary" fontWeight="bold">
            {currentTime.toLocaleTimeString()}
          </Typography>

          <Typography variant="body1" color="text.primary">
            {`My Office Timings : 9 AM - 6 PM`}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LoginOutlined />}
              onClick={handleCheckIn}
              disabled={isCheckedIn}
              sx={{
                borderRadius: 2,
                paddingX: 3,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Check In
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LogoutOutlined />}
              onClick={handleCheckOut}
              disabled={!isCheckedIn}
              sx={{
                borderRadius: 2,
                paddingX: 3,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Check Out
            </Button>
          </Box>
        </Box>

        {checkInTime && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Checked in at: {new Date(checkInTime).toLocaleTimeString()}
          </Typography>
        )}
        {checkOutTime && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Last check out: {new Date(checkOutTime).toLocaleTimeString()}
          </Typography>
        )}
      </Paper>

      {/* Calendar Section */}
      <Paper elevation={2} sx={{ mb: 4, p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleDateNavigation("prev")}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleDateNavigation("next")}
            >
              <ChevronRight />
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<CalendarToday />}
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </Box>

          <Typography variant="h6">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Typography>

          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view selector"
          >
            <ToggleButton value="month" aria-label="month view">
              <CalendarMonth />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={1}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Grid item xs={12 / 7} key={day}>
              <Typography align="center" sx={{ fontWeight: 500, py: 1 }}>
                {day}
              </Typography>
            </Grid>
          ))}

          {Array(getFirstDayOfMonth(currentDate))
            .fill(null)
            .map((_, index) => (
              <Grid item xs={12 / 7} key={`empty-${index}`}>
                <Paper
                  elevation={0}
                  sx={{ height: 45, width: 45, bgcolor: "grey.50" }}
                />
              </Grid>
            ))}

          {Array(getDaysInMonth(currentDate))
            .fill(null)
            .map((_, index) => {
              const day = index + 1;
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();

              return (
                <Grid item xs={12 / 7} key={day}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: 60,
                      width: 60,
                      bgcolor: isToday ? "primary.light" : "grey.50",
                      p: 1,
                    }}
                  >
                    <Typography>{day}</Typography>
                  </Paper>
                </Grid>
              );
            })}
        </Grid>
      </Paper>

      {/* Attendance Table Section */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            size="small"
          >
            <MenuItem value={5}>5 entries</MenuItem>
            <MenuItem value={10}>10 entries</MenuItem>
            <MenuItem value={15}>15 entries</MenuItem>
            <MenuItem value={25}>25 entries</MenuItem>
            <MenuItem value={50}>50 entries</MenuItem>
          </Select>

          <TextField
            size="small"
            placeholder="Search by date ..."
            InputProps={{
              startAdornment: (
                <Search sx={{ color: "text.secondary", mr: 1 }} />
              ),
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ p: 3 }}>
              Error loading attendance records: {error}
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>DATE</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell>CLOCK IN</TableCell>
                  <TableCell>CLOCK OUT</TableCell>
                  <TableCell>LATE</TableCell>
                  <TableCell>EARLY LEAVING</TableCell>
                  <TableCell>OVERTIME</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((row, index) => (
                  <TableRow key={row.id || index} hover>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.clockIn}</TableCell>
                    <TableCell>{row.clockOut}</TableCell>
                    <TableCell sx={{ color: "error.main" }}>
                      {row.late}
                    </TableCell>
                    <TableCell sx={{ color: "warning.main" }}>
                      {row.earlyLeaving}
                    </TableCell>
                    <TableCell sx={{ color: "success.main" }}>
                      {row.overtime}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <TablePagination
          component="div"
          count={totalRecords}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default AttendanceTracker;