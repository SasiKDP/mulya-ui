import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  useTheme,
  Typography,
  IconButton
} from '@mui/material';
import {
  
  
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAsync } from '../redux/authSlice'; // Update the path as needed
import AssignmentIcon from '@mui/icons-material/Assignment';
import SendIcon from '@mui/icons-material/Send';
import ListAltIcon from '@mui/icons-material/ListAlt';         // for Requirements
import PostAddIcon from '@mui/icons-material/PostAdd';         // for JobForm
import EventNoteIcon from '@mui/icons-material/EventNote';     // for Interviews
import GroupIcon from '@mui/icons-material/Group';             // for Users
import BusinessIcon from '@mui/icons-material/Business';       // for Clients
import PersonAddIcon from '@mui/icons-material/PersonAdd';     // for Add New Client
import { Clock, Hourglass } from 'lucide-react';


const drawerWidth = 220;
const collapsedWidth = 72;

const SideNav = ({ handleDrawerToggle, isCollapsed, isMobile }) => {
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { userId, role } = useSelector((state) => state.auth);
  
  const handleLogout = () => {
    dispatch(logoutAsync(userId));
  };
  
  const navItems = [
    {
      text: 'Assigned',
      path: 'assigned',
      icon: <AssignmentIcon />,
      roles: ['ADMIN', 'EMPLOYEE',  'BDM', 'TEAMLEAD'],
    },
    {
      text: 'Submissions',
      path: 'submissions',
      icon: <SendIcon />,
      roles: ['ADMIN', 'EMPLOYEE', 'BDM', 'TEAMLEAD', ],
    },
    {
      text: 'Requirements',
      path: 'requirements',
      icon: <ListAltIcon />,
      roles: ['ADMIN',  'SUPERADMIN', 'BDM', 'TEAMLEAD',],
    },
    // {
    //   text: 'JobForm',
    //   path: 'jobForm',
    //   icon: <PostAddIcon />,
    //   roles: ['ADMIN', 'SUPERADMIN', 'BDM', 'TEAMLEAD'],
    // },
    {
      text: 'Interviews',
      path: 'interviews',
      icon: <EventNoteIcon />,
      roles: ['ADMIN', 'EMPLOYEE',  'BDM', 'TEAMLEAD',],
    },
    {
      text: 'Users',
      path: 'users',
      icon: <GroupIcon />,
      roles: ['ADMIN',  'SUPERADMIN', 'BDM', 'TEAMLEAD', 'PARTNER'],
    },
    {
      text: 'Clients',
      path: 'clients',
      icon: <BusinessIcon />,
      roles: ['ADMIN',  'SUPERADMIN', 'BDM', 'TEAMLEAD', 'PARTNER'],
    },
    // {
    //   text: 'Add Client',
    //   path: 'addNewClient',
    //   icon: <PersonAddIcon />,
    //   roles: [ 'SUPERADMIN', 'BDM'  ],
    // },

    {
      text: 'Placements',
      path: 'placements',
      icon: <PersonAddIcon />,
      roles: [ 'SUPERADMIN', 'PARTNER'  ],
    },
    {
      text: 'BenchList',
      path: 'bench-users',
      icon: <Hourglass />,
      roles: [ 'SUPERADMIN', 'EMPLOYEE','ADMIN','TEAMLEAD' ,'BDM'],
    },
    {
      text: 'Submissions',
      path: 'submissions-all',
      icon: <EventNoteIcon />,
      roles: [ 'SUPERADMIN', 'ADMIN'],
    },
    {
      text: 'Interviews',
      path: 'interviews-all',
      icon: <EventNoteIcon />,
      roles: [ 'SUPERADMIN', 'ADMIN'],
    },
    

  ];
  
  

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(role)
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? "open" : true}
      onClose={isMobile ? handleDrawerToggle : undefined}
      sx={{
        width: isCollapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? collapsedWidth : drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.background.default 
            : theme.palette.primary.dark,
          color: theme.palette.primary.contrastText,
          transition: theme.transitions.create(['width', 'background-color'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          px: isCollapsed ? 0 : 2,
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.background.paper 
            : theme.palette.primary.main,
        }}>
          {!isCollapsed && (
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                color: theme.palette.primary.contrastText,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <DashboardIcon sx={{ mr: 1 }} /> Dashboard
            </Typography>
          )}
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ 
              ml: isCollapsed ? 0 : 'auto',
              color: theme.palette.primary.contrastText
            }}
          >
            {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
        
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
        
        <List sx={{ 
          flexGrow: 1, 
          pt: 2,
          overflow: 'hidden', 
          '&:hover': { overflow: 'auto' },
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
          },
        }}>
          {filteredNavItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <Tooltip title={isCollapsed ? item.text : ''} placement="right">
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname.includes(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: isCollapsed ? 'center' : 'initial',
                    px: 2.5,
                    mx: isCollapsed ? 0.5 : 1.5,
                    borderRadius: '8px',
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? theme.palette.primary.dark 
                        : 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? theme.palette.primary.main 
                          : 'rgba(255, 255, 255, 0.3)',
                      }
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isCollapsed ? 'auto' : 3,
                      justifyContent: 'center',
                      color: location.pathname.includes(item.path) 
                        ? theme.palette.primary.contrastText 
                        : 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{
                        fontWeight: location.pathname.includes(item.path) ? 'bold' : 'regular',
                        color: location.pathname.includes(item.path) 
                          ? theme.palette.primary.contrastText 
                          : 'rgba(255, 255, 255, 0.7)',
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
        
        <Box sx={{ p: 1, mt: 'auto' }}>
          <Tooltip title={isCollapsed ? "Logout" : ""} placement="right">
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'initial',
                px: 2.5,
                mx: isCollapsed ? 0.5 : 1.5,
                my: 1,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 'auto' : 3,
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SideNav;