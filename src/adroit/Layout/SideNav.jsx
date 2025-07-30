import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Box,
  Typography,
  Collapse,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  People,
  ShoppingCart,
  BarChart,
  Settings,
  Home,
  ExpandLess,
  ExpandMore,
  Inbox,
  Mail,
} from '@mui/icons-material';

const drawerWidth = 230;
const collapsedDrawerWidth = 64;

const menuItems = [
  { text: 'Home', icon: <Home />, path: '/' },
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Users', icon: <People />, path: '/users' },
  { text: 'Products', icon: <ShoppingCart />, path: '/products' },
  { text: 'Analytics', icon: <BarChart />, path: '/analytics' },
];

const SideNav = ({ 
  mobileOpen, 
  onDrawerToggle, 
  collapsed = false, 
  variant = 'permanent' 
}) => {
  const [expandedMenu, setExpandedMenu] = React.useState(!collapsed);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleExpandClick = () => {
    setExpandedMenu(!expandedMenu);
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  // Reset expanded menu when sidebar is collapsed
  React.useEffect(() => {
    if (collapsed) {
      setExpandedMenu(false);
    }
  }, [collapsed]);

  const drawer = (
    <Box>
      <Toolbar>
        {!collapsed && (
          <Typography variant="h6" noWrap component="div">
            Navigation
          </Typography>
        )}
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <Tooltip 
              title={collapsed ? item.text : ''} 
              placement="right"
              arrow
            >
              <ListItemButton
                selected={selectedIndex === index}
                onClick={(event) => handleListItemClick(event, index)}
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed ? 'center' : 'initial',
                  px: collapsed ? 1.5 : 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 3,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <Tooltip 
          title={collapsed ? 'More Options' : ''} 
          placement="right"
          arrow
        >
          <ListItemButton 
            onClick={handleExpandClick}
            sx={{
              justifyContent: collapsed ? 'center' : 'initial',
              px: collapsed ? 1.5 : 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 3,
                justifyContent: 'center',
              }}
            >
              <Inbox />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="More Options" />}
            {!collapsed && (expandedMenu ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </Tooltip>
        
        {!collapsed && (
          <Collapse in={expandedMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Mail />
                </ListItemIcon>
                <ListItemText primary="Messages" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </List>
          </Collapse>
        )}
      </List>
    </Box>
  );

  const currentDrawerWidth = collapsed ? collapsedDrawerWidth : drawerWidth;

  return (
    <Box
      component="nav"
      sx={{ 
        width: { md: currentDrawerWidth }, 
        flexShrink: { md: 0 },
        transition: 'width 0.3s ease-in-out'
      }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: currentDrawerWidth,
            transition: 'width 0.3s ease-in-out',
            overflowX: 'hidden',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};


export default SideNav;