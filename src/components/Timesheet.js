import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";

const Timesheet = () => {
  const { user } = useSelector((state) => state.auth);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    date: "",
    day: "",
    hoursWorked: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckedInToday, setIsCheckedInToday] = useState(false);
  const [isCheckedOutToday, setIsCheckedOutToday] = useState(false);

  // Check if already checked in/out today on component mount
  useEffect(() => {
    const checkTodayStatus = async () => {
      try {
        const today = new Date().toLocaleDateString("en-GB");
        const response = await axios.get(
          `http://35.188.150.92/api/timesheets/today/${user}`
        );

        if (response.data) {
          setIsCheckedInToday(response.data.checkIn !== null);
          setIsCheckedOutToday(response.data.checkOut !== null);
        }
      } catch (err) {
        console.error("Error checking today's status:", err);
      }
    };

    if (user) {
      checkTodayStatus();
    }
  }, [user]);

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const checkInData = {
        employeeId: user,
        date: now.toLocaleDateString("en-GB"),
        status: "Present",
      };

      const response = await axios.post(
        `http://35.188.150.92/api/timesheets/login`,
        checkInData
      );

      setIsCheckedInToday(true);
      setLoading(false);
    } catch (err) {
      console.error("Check-in error:", err);
      setError("Failed to check in. Please try again.");
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://35.188.150.92/api/timesheets/logout/${user}`
      );

      setIsCheckedOutToday(true);
      setLoading(false);
    } catch (err) {
      console.error("Check-out error:", err);
      setError("Failed to check out. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Timesheet
      </Typography>

      {/* Form Section */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckIn}
          disabled={loading || isCheckedInToday || isCheckedOutToday}
        >
          Check In
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCheckOut}
          disabled={loading || !isCheckedInToday || isCheckedOutToday}
        >
          Check Out
        </Button>
      </Box>

      {/* Error Message */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Timesheet Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Hours Worked</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.length > 0 ? (
              entries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.day}</TableCell>
                  <TableCell>{entry.hoursWorked}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No entries yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Total Hours Worked */}
      {entries.length > 0 && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total Hours Worked: {calculateTotalHours()}
        </Typography>
      )}
    </Box>
  );
};

export default Timesheet;
