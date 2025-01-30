import React, { useState, useEffect ,useMemo} from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAsync } from "../redux/features/authSlice";

// Components
import Requirements from "../components/Requirements/Requirements";
import Submissions from "../components/Tabs/Submissions";
import Planned from "../components/Tabs/Planned";
import Bench from "../components/Tabs/Bench";
import Assigned from "../components/Tabs/Assigned";
import AddUser from "../components/Tabs/AddUser";
import Header from "../components/Header";
import JobForm from "../components/Requirements/JobForm";
import Interview from "../components/Tabs/Interview";




// Icons
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

// Assets
import logo from "../assets/logo-01.png";
import AdminDashboard from "../components/AdminDashboard";
import AttendanceTracker from "../components/AttendanceTracker";
import EmployeeTimesheet from "../components/EmployeeTimesheet";
import UsersList from "../components/Tabs/UsersList";
import AllSubmissions from "../components/Tabs/AllSubmissions";
import ViewListIcon from '@mui/icons-material/ViewList';
import AllInterviews from "../components/Tabs/AllInterviews";

// Tabs configuration based on roles
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
      label: "AddUser",
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
      label: "Planned",
      value: "PLANNED",
      component: <Planned />,
      icon: <HomeIcon />,
    },
    {
      label: "Bench",
      value: "BENCH",
      component: <Bench />,
      icon: <HourglassEmptyIcon />,
    },
    {
      label: "Job Form",
      value: "JOB_FORM",
      component: <JobForm />,
      icon: <WorkIcon />,
    },
    {
      label: "AddUser",
      value: "ADDUSER",
      component: <AddUser />,
      icon: <AddIcon />,
    },
    {
      label: "Timesheet",
      value: "TIMESHEET",
      component: <EmployeeTimesheet />,
      icon: <AccessTimeIcon />,
    },
    {
      label: "Users",
      value: "USERS",
      component: <UsersList />,
      icon: <PeopleAltIcon />,
    },
    {
      label: "Submissions",
      value: "ALLSUBMISSIONS",
      component: <AllSubmissions />,
      icon: <ViewListIcon />,
    },
    {
      label: "Interviews",
      value: "ALLINTERVIEWS",
      component: <AllInterviews />,
      icon: <ViewListIcon />,
    },
   
  ],
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { roles, logInTimeStamp, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  console.log('user id from the dashborad ',user);
  

  const [selectedTab, setSelectedTab] = useState(null);

  const userId = user || null; 
  const defaultRole = "SUPERADMIN"; // Default role if none exists
  const userRole = roles?.[0] || defaultRole; // Use the first role or fallback to default
  // const activeTabs = TABS_BY_ROLE[userRole] || []; // Tabs for the current role

  const activeTabs = useMemo(() => TABS_BY_ROLE[userRole] || [], [userRole, TABS_BY_ROLE]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Set default selected tab on role or tabs change
//   useEffect(() => {
//   if (activeTabs.length > 0) {
//     setSelectedTab((prevTab) => prevTab || activeTabs[0].value);
//   }
// }, [activeTabs]);

useEffect(() => {
  if (activeTabs.length > 0) {
    setSelectedTab((prevTab) => prevTab || activeTabs[0].value);
  }
}, [activeTabs]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutAsync(userId));
    navigate("/"); // Redirect to home after logout
  };

  // Find the component for the selected tab
  const selectedTabComponent =
    activeTabs.find((tab) => tab.value === selectedTab)?.component || (
      <Box>No content available for the selected tab.</Box>
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Header
          userId={userId}
          logInTimeStamp={logInTimeStamp}
          orglogo={logo}
          onLogout={handleLogout}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: "flex", flex: 1, mt: "64px" }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: "16.66%",
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: "16.66%",
              boxSizing: "border-box",
              marginTop: "6.4%",
              bgcolor: "rgba(232, 245, 233, 0.5)",
            },
          }}
        >
          <List>
            {activeTabs.map((tab) => (
              <ListItem
                button
                key={tab.value}
                onClick={() => setSelectedTab(tab.value)}
                sx={{
                  borderRadius: "8px",
                  marginBottom: "8px",
                  border: selectedTab === tab.value ? "2px solid #4B70F5" : "inherit",
                  "&:hover": {
                    backgroundColor: "#4B70F5",
                    color: "#fff",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px",
                  },
                  "&:hover .MuiListItemIcon-root": { color: "#fff" },
                  "&:hover .MuiListItemText-primary": { color: "#fff" }, // Add this line to target the text
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>{tab.icon}</ListItemIcon>
                <ListItemText primary={tab.label} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            padding: 3,
            width: "83.33%",
            height: "calc(100vh - 64px)",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {selectedTabComponent}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
