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
  DialogActions,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
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
import logoOrg from "../assets/logo-01.png";
import SubmissionsMain from "../components/Submissions/SubmissionsMain";
import InterviewMain from "../components/Interviews/InterviewMain";



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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync(userId)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const CustomDialog = ({ open, onClose, title, children }) => {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{ height: 600 }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "rgb(191, 240, 195)", // Light Green Background
            padding: "10px",
            borderRadius: "8px 8px 0 0", // Rounded top corners
          }}
        >
          <Typography variant="h5" color="primary" fontWeight="medium">
            {title}
          </Typography>

          <IconButton onClick={onClose} sx={{ color: "black" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Dynamic Content */}
        <DialogContent>{children}</DialogContent>
      </Dialog>
    );
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedTabComponent = activeTabs.find(
    (tab) => tab.value === selectedTab
  )?.component || (
    <Box sx={{ p: 3 }}>No content available for the selected tab.</Box>
  );

  const drawer = (
    <Box sx={{ height: "100%", bgcolor: "#e8f5e9" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" noWrap component="div">
          Menu
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
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
              my: 0.5,
              mx: 1,
              borderRadius: "8px", // Rounded corners
              transition: "background-color 0.3s ease, color 0.3s ease",
              "&:hover": {
                bgcolor: selectedTab === tab.value ? "#233B80" : "#1B3A8C", // Darker blue on hover
                color: "#FFFFFF",
                "& .MuiListItemIcon-root": {
                  color: "#FFFFFF",
                },
              },
              "&.Mui-selected": {
                bgcolor: "#2A4DBD", // Lighter blue for active tab
                color: "black", // Differentiate from hover
                fontWeight: "bold",
                "& .MuiListItemIcon-root": {
                  color: "#233B80", // Change icon color to #233B80 when active
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: selectedTab === tab.value ? "#233B80" : "inherit",
                transition: "color 0.3s ease",
              }}
            >
              {tab.icon}
            </ListItemIcon>
            <ListItemText primary={tab.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: "#e8f5e9",
          color: "text.primary",
          boxShadow: 1,
          borderRadius: 0,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <img
              src={logoOrg}
              alt="Logo"
              style={{ height: 40, marginRight: theme.spacing(2) }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Typography variant="subtitle2">{userId}</Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.65rem", md: "0.75rem" },
                  color: "#000000",
                }}
              >
                Logged in at:{" "}
                {logInTimeStamp ? (
                  <>
                    {(() => {
                      try {
                        // Convert timestamp string to Date
                        const formattedTimestamp = logInTimeStamp.split(".")[0]; // Remove fractional seconds
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

            <Avatar
              onClick={handleMenuClick}
              sx={{
                cursor: "pointer",
                bgcolor: "primary.main",
                "&:hover": { opacity: 0.8 },
              }}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <AccountCircleIcon />
              )}
            </Avatar>
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
          },
          borderRadius: 0,
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: "80px",
          height: "calc(100vh - 64px)",
          overflow: "auto",
        }}
      >
        {selectedTabComponent}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setOpenProfileDialog(true);
            handleMenuClose();
          }}
          sx={{
            transition: "background-color 0.3s ease, color 0.3s ease",
            "&:hover": {
              bgcolor: "#0D6EFD", // Blue on hover
              color: "#FFFFFF",
              borderRadius: 1,
            },
          }}
        >
          Profile
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenLeaveDialog(true);
            handleMenuClose();
          }}
          sx={{
            transition: "background-color 0.3s ease, color 0.3s ease",
            "&:hover": {
              bgcolor: "#0D6EFD", // Blue on hover
              color: "#FFFFFF",
              borderRadius: 1,
            },
          }}
        >
          Apply Leave
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          sx={{
            transition: "background-color 0.3s ease, color 0.3s ease",
            "&:hover": {
              bgcolor: "#0D6EFD", // Blue on hover
              color: "#fff",
              borderRadius: 1,
            },
            color: "red",
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
        title="Leave Application Form"
      >
        <LeaveApplication />
      </CustomDialog>
    </Box>
  );
};

export default DashboardPage;
