import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../redux/features/employeesSlice";

const Profile = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Fetch user details from Redux state
  const { employeesList, fetchStatus, fetchError } = useSelector((state) => state.employees);
  const { user, roles, logInTimeStamp, isAuthenticated } = useSelector((state) => state.auth);


  const userId = user;

  if (!isAuthenticated) {
    return (
      <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 4 }}>
        You are not logged in.
      </Typography>
    );
  }

  if (fetchStatus === "loading") {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
        Loading user details...
      </Typography>
    );
  }

  if (fetchStatus === "failed") {
    return (
      <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 4 }}>
        Error fetching user details: {fetchError}
      </Typography>
    );
  }

  // Find the logged-in user from the employees list, fallback to `user` if not found
  const currentUser = employeesList.find(emp => emp.employeeId === userId) || user || {};

  return (
    <Box sx={{ maxWidth: 300, margin: "auto", p: 3, minHeight: "25vh" }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ textAlign: "left", p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            {currentUser.userName || "N/A"}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {currentUser.designation || "N/A"}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Email: </strong> {currentUser.email || "N/A"}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Personal Email: </strong> {currentUser.personalemail || "N/A"}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Phone Number: </strong> {currentUser.phoneNumber || "N/A"}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Gender: </strong> {currentUser.gender || "N/A"}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Date of Birth: </strong> {currentUser.dob ? new Date(currentUser.dob).toLocaleDateString() : "N/A"}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Joining Date: </strong> {currentUser.joiningDate ? new Date(currentUser.joiningDate).toLocaleDateString() : "N/A"}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Role: </strong> {roles || "N/A"}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Login Time: </strong> {logInTimeStamp ? new Date(logInTimeStamp).toLocaleString("en-IN") : "N/A"}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* <Button
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #6a1b9a, rgb(245, 106, 64))",
              color: "white",
              borderRadius: 3,
              fontWeight: "bold",
              padding: "12px 25px",
              "&:hover": {
                background: "linear-gradient(45deg, rgb(225, 85, 42), #6a1b9a)",
              },
            }}
            fullWidth
          >
            Save Changes
          </Button> */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
