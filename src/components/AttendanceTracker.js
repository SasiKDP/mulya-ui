import React, { useState, useEffect } from 'react';
import { LoginOutlined, LogoutOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
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
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Container
} from '@mui/material';
import {
  fetchAttendanceRecords,
  postAttendanceRecord,
  updateAttendanceRecord,
  setCheckIn,
  setCheckOut,
  clearError
} from '../redux/features/attendanceSlice';

const AttendanceTracker = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const {
    records,
    loading,
    error,
    currentSession: { isCheckedIn, checkInTime, checkOutTime }
  } = useSelector((state) => state.attendance);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());

  const tableHeaders = [
    { id: 'id', label: 'ID', align: 'left' },
    { id: 'employeeId', label: 'Employee ID', align: 'left' },
    { id: 'date', label: 'Date', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
    { id: 'clockIn', label: 'Clock In', align: 'left' },
    { id: 'clockOut', label: 'Clock Out', align: 'left' },
    { id: 'late', label: 'Late', align: 'left', color: 'error.main' },
    { id: 'earlyLeaving', label: 'Early Leaving', align: 'left', color: 'warning.main' },
    { id: 'overtime', label: 'Overtime', align: 'left', color: 'success.main' }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  };

  const getWeekDates = (date) => {
    const startOfWeek = getStartOfWeek(date);
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + index);
      return day;
    });
  };

  const weekDates = getWeekDates(currentDate);

  useEffect(() => {
    dispatch(fetchAttendanceRecords());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const handleCheckIn = async () => {
    try {
      await dispatch(postAttendanceRecord()).unwrap();
      dispatch(setCheckIn(new Date().toISOString()));
      dispatch(fetchAttendanceRecords());
    } catch (err) {
      console.error('Failed to check in:', err);
    }
  };

  const handleCheckOut = async () => {
    try {
      await dispatch(updateAttendanceRecord()).unwrap();
      dispatch(setCheckOut(new Date().toISOString()));
      dispatch(fetchAttendanceRecords());
    } catch (err) {
      console.error('Failed to check out:', err);
    }
  };

  const currentRecords = records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box 
      sx={{ 
        height: 'calc(100vh - 17vh)',
        overflow: 'auto',
        px: 2,
        py: 1
      }}
    >
      <Container 
        maxWidth="xl" 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {error && (
          <Alert 
            severity="error" 
            onClose={() => dispatch(clearError())} 
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        )}

        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            width: '100%',
            flex: 'none'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            gap: 2
          }}>
            <Typography variant="h5" color="text.primary" fontWeight="bold">
              {currentTime.toLocaleTimeString()}
            </Typography>
            <Typography variant="h6" color="text.primary" fontWeight="bold">
              Office Hours: 9:00 AM - 6:00 PM
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              width: { xs: '100%', md: 'auto' }
            }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<LoginOutlined />}
                onClick={handleCheckIn}
                disabled={isCheckedIn || loading}
                fullWidth={true}
                sx={{ minWidth: { xs: '45%', md: 150 } }}
              >
                Check In
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutOutlined />}
                onClick={handleCheckOut}
                disabled={!isCheckedIn || loading}
                fullWidth={true}
                sx={{ minWidth: { xs: '45%', md: 150 } }}
              >
                Check Out
              </Button>
            </Box>
          </Box>

          {checkInTime && (
            <Typography variant="body2" color="text.secondary">
              Checked in at: {new Date(checkInTime).toLocaleTimeString()}
            </Typography>
          )}
          {checkOutTime && (
            <Typography variant="body2" color="text.secondary">
              Checked out at: {new Date(checkOutTime).toLocaleTimeString()}
            </Typography>
          )}
        </Paper>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            width: '100%',
            flex: 'none',
            overflow: 'auto'
          }}
        >
          <Grid container spacing={2} justifyContent="center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <Grid item xs={12/7} key={day} >
                <Typography align="center" sx={{ fontWeight: 500, py: 1 }}>
                  {day}
                </Typography>
              </Grid>
            ))}

            {weekDates.map((date, index) => {
              const isToday = new Date().toLocaleDateString() === date.toLocaleDateString();
              return (
                <Grid item xs={12/7} key={index} >
                  <Paper
                    elevation={0}
                    sx={{
                      height: 60,
                      width: '80%',
                      bgcolor: isToday ? 'primary.light' : 'grey.50',
                      p: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Typography align="center">{date.getDate()}</Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Paper>

        <Paper 
          elevation={3} 
          sx={{ 
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '400px'
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer 
                sx={{ 
                  flex: 1,
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    },
                  },
                }}
              >
                <Table stickyHeader sx={{ minWidth: 1200 }}>
                  <TableHead>
                    <TableRow>
                      {tableHeaders.map((header) => (
                        <TableCell
                          key={header.id}
                          align={header.align}
                          sx={{ 
                            fontWeight: 'bold',
                            backgroundColor: 'background.paper',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {header.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentRecords.map((record) => (
                      <TableRow key={record.id} hover>
                        {tableHeaders.map((header) => (
                          <TableCell
                            key={`${record.id}-${header.id}`}
                            align={header.align}
                            sx={{ 
                              color: header.color,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {record[header.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={records.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{ 
                  borderTop: 1, 
                  borderColor: 'divider',
                  flex: 'none'
                }}
              />
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AttendanceTracker;