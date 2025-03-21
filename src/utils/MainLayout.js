import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Icons
import WorkIcon from '@mui/icons-material/Work';
import SendIcon from '@mui/icons-material/Send';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HomeIcon from '@mui/icons-material/Home';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Page Components
import Assigned from './pages/Assigned';
import Submissions from './pages/Submissions';
import Interview from './pages/Interview';
import AttendanceTracker from './pages/AttendanceTracker';
import Planned from './pages/Planned';
import Bench from './pages/Bench';
import AddUser from './pages/AddUser';
import AdminDashboard from './pages/AdminDashboard';
import Requirements from './pages/Requirements';
import JobForm from './pages/JobForm';

// Tab Configuration
const TABS_BY_ROLE = {
  EMPLOYEE: [
    {
      label: "Assigned",
      value: "ASSIGNED",
      component: <Assigned />,
      icon: <WorkIcon />,
      path: "/assigned"
    },
    {
      label: "Submissions",
      value: "SUBMISSIONS",
      component: <Submissions />,
      icon: <SendIcon />,
      path: "/submissions"
    },
    {
      label: "Interview",
      value: "INTERVIEW",
      component: <Interview />,
      icon: <GroupIcon />,
      path: "/interview"
    },
    {
      label: "Timesheet",
      value: "TIMESHEET",
      component: <AttendanceTracker />,
      icon: <AccessTimeIcon />,
      path: "/timesheet"
    },
  ],
  ADMIN: [
    {
      label: "Timesheet",
      value: "TIMESHEET",
      component: <AttendanceTracker />,
      icon: <AccessTimeIcon />,
      path: "/timesheet"
    },
    {
      label: "Planned",
      value: "PLANNED",
      component: <Planned />,
      icon: <HomeIcon />,
      path: "/planned"
    },
    {
      label: "Bench",
      value: "BENCH",
      component: <Bench />,
      icon: <HourglassEmptyIcon />,
      path: "/bench"
    },
    {
      label: "Add User",
      value: "ADDUSER",
      component: <AddUser />,
      icon: <PersonAddIcon />,
      path: "/add-user"
    },
  ],
  SUPERADMIN: [
    {
      label: "Dashboard",
      value: "DASHBOARD",
      component: <AdminDashboard />,
      icon: <DashboardIcon />,
      path: "/dashboard"
    },
    {
      label: "Requirements ",
      value: "REQ_MANAGEMENT",
      icon: <AssignmentIcon />,
      isParent: true,
      path: "/requirements",
      children: [
        {
          label: "Requirements",
          value: "REQUIREMENTS",
          component: <Requirements />,
          icon: <AssignmentIcon />,
          path: "/requirements/list"
        },
        {
          label: "Job Form",
          value: "JOB_FORM",
          component: <JobForm />,
          icon: <AddCircleOutlineIcon />,
          path: "/requirements/job-form"
        }
      ]
    }
  ]
};

const drawerWidth = 240;

// Main Layout Component
function MainLayout() {
  const [open, setOpen] = useState(true);
  const [userRole, setUserRole] = useState('SUPERADMIN'); // Default as example, should come from auth
  const [openSubmenu, setOpenSubmenu] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle drawer
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Toggle submenu
  const handleSubmenuToggle = (value) => {
    setOpenSubmenu(prev => ({
      ...prev,
      [value]: !prev[value]
    }));
  };

  // Get the current tab items based on user role
  const tabItems = TABS_BY_ROLE[userRole] || [];

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    // Initialize submenu open state based on current path
    tabItems.forEach(item => {
      if (item.isParent && item.children) {
        const isChildActive = item.children.some(child => 
          location.pathname === child.path
        );
        if (isChildActive) {
          setOpenSubmenu(prev => ({...prev, [item.value]: true}));
        }
      }
    });
  }, [location.pathname, userRole]);

  // Get current page title
  const getPageTitle = () => {
    let title = "";
    
    tabItems.forEach(item => {
      if (item.path === location.pathname) {
        title = item.label;
      } else if (item.isParent && item.children) {
        item.children.forEach(child => {
          if (child.path === location.pathname) {
            title = child.label;
          }
        });
      }
    });
    
    return title || "Dashboard";
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { sm: `${open ? drawerWidth : 0}px` },
          transition: theme => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {getPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 72,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 72,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: theme => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: [1],
          }}
        >
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, ml: 2 }}>
            {open ? 'MyApp' : ''}
          </Typography>
        </Toolbar>
        <Divider />
        
        {/* Navigation List */}
        <List>
          {tabItems.map((item) => 
            item.isParent ? (
              <React.Fragment key={item.value}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleSubmenuToggle(item.value)}
                    sx={{ minHeight: 48 }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    {open && (
                      <>
                        <ListItemText primary={item.label} />
                        {openSubmenu[item.value] ? <ExpandLess /> : <ExpandMore />}
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
                
                <Collapse in={open && openSubmenu[item.value]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.value}
                        sx={{ pl: 4 }}
                        selected={location.pathname === child.path}
                        onClick={() => handleNavigation(child.path)}
                      >
                        <ListItemIcon>{child.icon}</ListItemIcon>
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ) : (
              <ListItem key={item.value} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                  sx={{ minHeight: 48 }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {open && <ListItemText primary={item.label} />}
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Drawer>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px', // To account for AppBar height
        }}
      >
        <Routes>
          {/* Create routes for all tabs */}
          {tabItems.map(item => 
            item.isParent && item.children ? (
              // Map parent's children routes
              item.children.map(child => (
                <Route 
                  key={child.value} 
                  path={child.path} 
                  element={child.component} 
                />
              ))
            ) : (
              // Map regular routes
              <Route 
                key={item.value} 
                path={item.path} 
                element={item.component} 
              />
            )
          )}
          
          {/* Default redirect based on role */}
          <Route 
            path="/" 
            element={
              <Navigate 
                to={tabItems.length > 0 ? (tabItems[0].path || '/dashboard') : '/dashboard'} 
                replace 
              />
            } 
          />
        </Routes>
      </Box>
    </Box>
  );
}

