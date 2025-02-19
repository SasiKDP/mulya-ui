import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Avatar,
  Skeleton,
  Chip,
  Grid,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../redux/features/employeesSlice";
import {
  Person,
  Email,
  Phone,
  Cake,
  Work,
  AccessTime,
  Badge,
} from "@mui/icons-material";

const Profile = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchEmployees())
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch]);

  // Fetch user details from Redux state
  const { employeesList, fetchStatus, fetchError } = useSelector(
    (state) => state.employees
  );
  const { user, roles, logInTimeStamp, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const userId = user;

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Card
          sx={{
            mt: 5,
            p: 3,
            textAlign: "center",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="error">
            You are not logged in.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} href="/login">
            Go to Login
          </Button>
        </Card>
      </Container>
    );
  }

  if (loading || fetchStatus === "loading") {
    return <ProfileSkeleton />;
  }

  if (fetchStatus === "failed") {
    return (
      <Container maxWidth="sm">
        <Card
          sx={{
            mt: 5,
            p: 3,
            textAlign: "center",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="error">
            Error fetching user details
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {fetchError}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => dispatch(fetchEmployees())}
          >
            Try Again
          </Button>
        </Card>
      </Container>
    );
  }

  // Find the logged-in user from the employees list, fallback to `user` if not found
  const currentUser =
    employeesList.find((emp) => emp.employeeId === userId) || user || {};

  // Get user initials for avatar
  const getInitials = () => {
    if (currentUser.userName) {
      const nameParts = currentUser.userName.split(" ");
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return currentUser.userName[0].toUpperCase();
    }
    return "U";
  };

  // Generate a consistent color based on user ID
  const getAvatarColor = () => {
    const colors = [
      "#3f51b5",
      "#f44336",
      "#009688",
      "#673ab7",
      "#ff9800",
      "#795548",
      "#607d8b",
      "#e91e63",
    ];
    const colorIndex = (userId?.toString().charCodeAt(0) || 0) % colors.length;
    return colors[colorIndex];
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 600,
            borderRadius: 3,
            overflow: "visible",
            position: "relative",
            pt: 7,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -30,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: getAvatarColor(),
                fontSize: 36,
                boxShadow: 3,
              }}
            >
              {getInitials()}
            </Avatar>
          </Box>

          <CardContent sx={{ pt: 6 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {currentUser.userName || "N/A"}
              </Typography>

              <Chip
                label={currentUser.designation || "Employee"}
                sx={{
                  mt: 1,
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                }}
              />

              <Chip
                label={roles || "User"}
                sx={{
                  mt: 1,
                  ml: 1,
                  bgcolor: theme.palette.secondary.light,
                  color: theme.palette.secondary.contrastText,
                }}
                icon={<Badge fontSize="small" />}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <ProfileItem
                icon={<Email color="primary" />}
                label="Email"
                value={currentUser.email || "N/A"}
              />

              <ProfileItem
                icon={<Email />}
                label="Personal Email"
                value={currentUser.personalemail || "N/A"}
              />

              <ProfileItem
                icon={<Phone color="primary" />}
                label="Phone Number"
                value={currentUser.phoneNumber || "N/A"}
              />

              <ProfileItem
                icon={<Person />}
                label="Gender"
                value={currentUser.gender || "N/A"}
              />

              <ProfileItem
                icon={<Cake color="primary" />}
                label="Date of Birth"
                value={
                  currentUser.dob
                    ? new Date(currentUser.dob).toLocaleDateString()
                    : "N/A"
                }
              />

              <ProfileItem
                icon={<Work />}
                label="Joining Date"
                value={
                  currentUser.joiningDate
                    ? new Date(currentUser.joiningDate).toLocaleDateString()
                    : "N/A"
                }
              />

              <ProfileItem
                icon={<AccessTime color="primary" />}
                label="Last Login"
                value={
                  logInTimeStamp
                    ? (() => {
                        try {
                          // Ensure logInTimeStamp is a valid string and remove fractional seconds
                          const formattedTimestamp =
                            logInTimeStamp.split(".")[0];
                          const utcDate = new Date(formattedTimestamp + "Z"); // Convert to UTC format

                          if (isNaN(utcDate.getTime())) {
                            return "Invalid Date"; // Handle invalid timestamps
                          }

                          // Convert UTC to IST and format separately
                          const timeIST = utcDate.toLocaleString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                            timeZone: "Asia/Kolkata",
                          });

                          const dateIST = utcDate.toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            timeZone: "Asia/Kolkata",
                          });

                          return `${timeIST} - ${dateIST}`;
                        } catch (error) {
                          return "Error Parsing Date";
                        }
                      })()
                    : "N/A"
                }
                fullWidth
              />
            </Grid>

            <Button
              variant="contained"
              sx={{
                mt: 4,
                background:
                  "linear-gradient(45deg, #6a1b9a, rgb(245, 106, 64))",
                color: "white",
                borderRadius: 3,
                fontWeight: "bold",
                padding: "12px 25px",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, rgb(225, 85, 42), #6a1b9a)",
                },
                transition: "transform 0.2s",
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
              fullWidth
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

// Profile item component for each detail row
const ProfileItem = ({ icon, label, value, fullWidth = false }) => (
  <Grid item xs={12} md={fullWidth ? 12 : 6}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 2,
        p: 1.5,
        borderRadius: 2,
        "&:hover": {
          bgcolor: "rgba(0, 0, 0, 0.03)",
        },
        transition: "background-color 0.2s",
      }}
    >
      <Box sx={{ mr: 2 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "medium" }}>
          {value}
        </Typography>
      </Box>
    </Box>
  </Grid>
);

// Loading skeleton component
const ProfileSkeleton = () => (
  <Container maxWidth="md">
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Card
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 600,
          borderRadius: 3,
          overflow: "visible",
          position: "relative",
          pt: 7,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -50,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        >
          <Skeleton variant="circular" width={100} height={100} />
        </Box>

        <CardContent sx={{ pt: 6 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Skeleton
              variant="text"
              width={200}
              height={40}
              sx={{ mx: "auto" }}
            />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Skeleton
                variant="rounded"
                width={100}
                height={32}
                sx={{ mr: 1 }}
              />
              <Skeleton variant="rounded" width={100} height={32} />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            {[...Array(7)].map((_, index) => (
              <Grid item xs={12} md={index === 6 ? 12 : 6} key={index}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Skeleton
                    variant="circular"
                    width={24}
                    height={24}
                    sx={{ mr: 2 }}
                  />
                  <Box sx={{ width: "100%" }}>
                    <Skeleton variant="text" width={80} height={20} />
                    <Skeleton variant="text" width="80%" height={28} />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Skeleton variant="rounded" width="100%" height={45} sx={{ mt: 4 }} />
        </CardContent>
      </Card>
    </Box>
  </Container>
);

export default Profile;
