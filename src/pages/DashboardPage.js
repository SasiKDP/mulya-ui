import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
  Badge,
  Tooltip,
  Paper,
  Fade,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAsync } from "../redux/features/authSlice";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import GroupIcon from "@mui/icons-material/Group";
import AddIcon from "@mui/icons-material/Add";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Components
import Requirements from "../components/Requirements/Requirements";
import Submissions from "../components/Tabs/Submissions";
import Planned from "../components/Tabs/Planned";
import Bench from "../components/Tabs/Bench";
import Assigned from "../components/Tabs/Assigned";
import AddUser from "../components/Tabs/AddUser";
import JobForm from "../components/Requirements/JobForm";
import Interview from "../components/Tabs/Interview";
import AdminDashboard from "../components/AdminDashboard";
import AttendanceTracker from "../components/AttendanceTracker";
import EmployeeTimesheet from "../components/EmployeeTimesheet";
import UsersList from "../components/Tabs/UsersList";
import AllSubmissions from "../components/Tabs/AllSubmissions";
import AllInterviews from "../components/Tabs/AllInterviews";
import Profile from "../components/Profile";
import LeaveApplication from "../components/LeaveApplication";
import logoOrg from "../assets/Mulyafinalwithoutcaption.svg";
import SubmissionsMain from "../components/Submissions/SubmissionsMain";
import InterviewMain from "../components/Interviews/InterviewMain";
import UserAvatar from "../utils/UserAvatar";
import JobFormMain from "../components/JobForm/JobFormMain";

const DRAWER_WIDTH = 240;

const TABS_BY_ROLE = {
  EMPLOYEE: [
    {
      label: "Assigned",
      value: "ASSIGNED",
      component: <Assigned />,
      icon: <WorkIcon />,
    },
    {
      label: "Submissions",
      value: "SUBMISSIONS",
      component: <Submissions />,
      icon: <AssignmentIcon />,
    },
    {
      label: "Interview",
      value: "INTERVIEW",
      component: <Interview />,
      icon: <GroupIcon />,
    },
    {
      label: "Timesheet",
      value: "TIMESHEET",
      component: <AttendanceTracker />,
      icon: <AccessTimeIcon />,
    },
  ],
  ADMIN: [
    {
      label: "Timesheet",
      value: "TIMESHEET",
      component: <AttendanceTracker />,
      icon: <AccessTimeIcon />,
    },
    {
      label: "Planned",
      value: "PLANNED",
      component: <Planned />,
      icon: <HomeIcon />,
    },
    {
      label: "Bench",
      value: "BENCH",
      component: <Bench />,
      icon: <PeopleIcon />,
    },
    {
      label: "Add User",
      value: "ADDUSER",
      component: <AddUser />,
      icon: <AddIcon />,
    },
  ],
  SUPERADMIN: [
    {
      label: "Dashboard",
      value: "DASHBOARD",
      component: <AdminDashboard />,
      icon: <DashboardIcon />,
    },
    {
      label: "Requirements",
      value: "REQUIREMENTS",
      component: <Requirements />,
      icon: <AssignmentIcon />,
    },
    {
      label: "Job Form",
      value: "JOB_FORM",
      component: <JobForm />,
      icon: <WorkIcon />,
    },
    {
      label: "Users",
      value: "USERS",
      component: <UsersList />,
      icon: <PeopleIcon />,
    },
    {
      label: "Add User",
      value: "ADDUSER",
      component: <AddUser />,
      icon: <AddIcon />,
    },
    {
      label: "Submissions",
      value: "SUBMISSIONS",
      component: <AllSubmissions />,
      icon: <PersonSearchIcon />,
    },
    {
      label: "Interviews",
      value: "ALLINTERVIEWS",
      component: <AllInterviews />,
      icon: <InterpreterModeIcon />,
    },
    {
      label: "Bench",
      value: "BENCH",
      component: <Bench />,
      icon: <HourglassEmptyIcon />,
    },
    {
      label: "Timesheet",
      value: "TIMESHEET",
      component: <EmployeeTimesheet />,
      icon: <AccessTimeIcon />,
    },
  ],
};

// import logoOrg from "../assets/logo-01.png";

const DashboardPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [selectedTab, setSelectedTab] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const { roles, logInTimeStamp, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const userId = user || null;
  const userRole = roles?.[0] || "SUPERADMIN";
  const activeTabs = useMemo(() => TABS_BY_ROLE[userRole] || [], [userRole]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (activeTabs.length > 0) {
      setSelectedTab((prevTab) => prevTab || activeTabs[0].value);
    }
  }, [activeTabs]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync(userId)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Function to extract user initials
  const getInitials = () => {
    if (userId) {
      const nameParts = userId.split(" "); // Split the name into parts
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase(); // First letter of First & Last name
      }
      return userId[0].toUpperCase(); // Only first letter if single name
    }
    return "U"; // Default Initial
  };

  // Function to generate avatar color dynamically
  const getAvatarColor = () => {
    const colors = ["#3f51b5", "#f44336", "#009688", "#673ab7", "#ff9800"];
    const index = userId ? userId.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const CustomDialog = ({ open, onClose, title, children }) => (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#00796b",
          py: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="primary.dark" fontWeight="600">
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "#FFF" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>{children}</DialogContent>
    </Dialog>
  );

  const drawer = (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fixed Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexShrink: 0, // Prevents header from shrinking
        }}
      >
        <Typography variant="h6" color="primary" fontWeight="600" sx={{ p: 1 }}>
          Dashboard
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* Scrollable Menu */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: 2,
          py: 1,
          "&::-webkit-scrollbar": {
            width: "8px", // Scrollbar width
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#aaa",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#888",
          },
        }}
      >
        <List>
          {activeTabs.map((tab) => (
            <ListItem
              button
              key={tab.value}
              selected={selectedTab === tab.value}
              onClick={() => {
                setSelectedTab(tab.value);
                if (isMobile) setDrawerOpen(false);
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                transition: "all 0.2s",
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "#FFF",
                  },
                  "& .MuiListItemText-primary": {
                    color: "#FFF",
                  },
                },
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "#FFF",
                  "& .MuiListItemIcon-root": {
                    color: "#FFF",
                  },
                  "& .MuiListItemText-primary": {
                    color: "#FFF",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: selectedTab === tab.value ? "inherit" : "primary.main",
                }}
              >
                {tab.icon}
              </ListItemIcon>
              <ListItemText
                primary={tab.label}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: selectedTab === tab.value ? 600 : 400,
                  sx: { transition: "color 0.2s" }, // Smooth transition for text color change
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "background.paper",
          borderBottom: `1px solid ${theme.palette.divider}`,
          borderRadius: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              color="black"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { lg: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <img src={logoOrg} alt="Logo" style={{ height: 40 }} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {/* <Tooltip title="Notifications">
              <IconButton color="primary">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip> */}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="subtitle2"
                  color="primary.main"
                  fontWeight="600"
                >
                  {userId}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.65rem", md: "0.95rem" },
                    color: "primary.main",
                    fontWeight: "200",
                  }}
                >
                  Logged in at:{" "}
                  {logInTimeStamp ? (
                    <>
                      {(() => {
                        try {
                          // Convert timestamp string to Date
                          const formattedTimestamp =
                            logInTimeStamp.split(".")[0]; // Remove fractional seconds
                          const utcDate = new Date(formattedTimestamp + "Z"); // Ensure UTC format

                          if (isNaN(utcDate.getTime())) {
                            return "Invalid Date"; // Check if date conversion is valid
                          }

                          // Convert to IST
                          return (
                            <>
                              {utcDate.toLocaleString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                                timeZone: "Asia/Kolkata",
                              })}{" "}
                              -{" "}
                              {utcDate.toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                timeZone: "Asia/Kolkata",
                              })}
                            </>
                          );
                        } catch (error) {
                          return "Error Parsing Date";
                        }
                      })()}
                    </>
                  ) : (
                    "12:45 AM - 30/01/2025"
                  )}
                </Typography>
              </Box>

              <Button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{ ml: 1 }}
              >
                <UserAvatar size={32} border={true} />
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0.5,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: "64px",
          height: "calc(100vh - 64px)",
          overflowY: "auto", // Enables vertical scrolling
          backgroundColor: "grey.50",

          /* Custom Scrollbar */
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#aaa",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#888",
          },
        }}
      >
        <Fade in timeout={500}>
          <Paper
            elevation={0}
            sx={{
              minHeight: "100%", // Allows content to grow
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            {activeTabs.find((tab) => tab.value === selectedTab)?.component || (
              <Box sx={{ p: 1 }}>
                <Typography color="text.secondary">
                  No content available for the selected tab.
                </Typography>
              </Box>
            )}
          </Paper>
        </Fade>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 3, // Slightly increased elevation for depth
          sx: {
            mt: 1.5,
            borderRadius: "12px", // Smooth border radius
            minWidth: 130, // Adjusted for better spacing
            overflow: "hidden",
            boxShadow: "0px 5px 15px rgba(0,0,0,0.1)", // Subtle shadow
            bgcolor: "background.paper",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 18,
              width: 12,
              height: 12,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              boxShadow: "-1px -1px 2px rgba(0,0,0,0.1)", // Soft shadow for effect
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Profile */}
        <MenuItem
          onClick={() => {
            setOpenProfileDialog(true);
            setAnchorEl(null);
          }}
          sx={{
            fontSize: "0.9rem",
            fontWeight: 500,
            px: 2,
            "&:hover": {
              backgroundColor: "primary.light",
              color: "#FFF",
              borderRadius: 1,
            },
          }}
        >
          Profile
        </MenuItem>

        {/* Apply Leave */}
        <MenuItem
          onClick={() => {
            setOpenLeaveDialog(true);
            setAnchorEl(null);
          }}
          sx={{
            fontSize: "0.9rem",
            fontWeight: 500,
            px: 2,
            "&:hover": {
              backgroundColor: "primary.light",
              color: "#FFF",
              borderRadius: 1,
            },
          }}
        >
          Apply Leave
        </MenuItem>

        {/* Divider for better separation */}
        <Divider sx={{ my: 1 }} />

        {/* Logout with Red Color & Hover Effect */}
        <MenuItem
          onClick={() => {
            handleLogout();
            setAnchorEl(null);
          }}
          sx={{
            fontSize: "0.9rem",
            fontWeight: 500,
            px: 2,
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.light",
              color: "#000000",
              borderRadius: 1,
            },
          }}
        >
          Logout
        </MenuItem>
      </Menu>

      <CustomDialog
        open={openProfileDialog}
        onClose={() => setOpenProfileDialog(false)}
        title="Profile"
      >
        <Profile />
      </CustomDialog>

      <CustomDialog
        open={openLeaveDialog}
        onClose={() => setOpenLeaveDialog(false)}
        title="Leave Application"
      >
        <LeaveApplication />
      </CustomDialog>
    </Box>
  );
};

export default DashboardPage;
