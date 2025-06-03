import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, Tab, Box, CircularProgress, Stack, Typography, Alert, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Add these imports
import UserTable from './UserTable';
import DateRangeFilter from '../muiComponents/DateRangeFilter';
import { 
  fetchBdmUsers,
  fetchTeamLeadUsers, 
  fetchEmployeeUsers 
} from '../../redux/teamMetricsSlice';

const TeamMetrics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize activeTab from URL params or default to 0
  const initialTab = searchParams.get('activeTab');
 const getTabIndex = (tabName) => {
  switch(tabName?.toLowerCase()) {
    case 'bdm': return 0;
    case 'teamlead': return 1;
    case 'employee': return 2;
    default: return 0;
  }
};

const getTabKey = (index) => {
  switch(index) {
    case 0: return 'bdm';
    case 1: return 'teamlead';
    case 2: return 'employee';
    default: return 'bdm';
  }
};
  
  const [activeTab, setActiveTab] = useState(
    initialTab ? getTabIndex(initialTab) : 0
  );
  
  const { 
    filteredBdmUsers, 
    filteredTeamLeadUsers, 
    filteredEmployeeUsers,
    isLoading, 
    error 
  } = useSelector(state => state.teamMetrics);

  const tabsConfig = [
    { role: 'BDM', title: 'BDM Users', key: 'bdm' },
    { role: 'TEAMLEAD', title: 'Team Lead Users', key: 'teamlead' },
    { role: 'EMPLOYEE', title: 'Employee Users', key: 'employee' }
  ];

  // Update activeTab when URL params change
 useEffect(() => {
  const tabFromUrl = searchParams.get('activeTab');
  if (tabFromUrl && ['bdm', 'teamlead', 'employee'].includes(tabFromUrl)) {
    const newTabIndex = getTabIndex(tabFromUrl);
    setActiveTab(newTabIndex);
  }
}, [searchParams]);

  // Navigation handlers for different roles
  const handleBdmEmployeeClick = (employeeId) => {
    navigate(`/dashboard/team-metrics/bdmstatus/${employeeId}?tab=bdm`);
  };

// Update navigation handlers to use consistent parameter names
const handleTeamLeadEmployeeClick = (employeeId) => {
  navigate(`/dashboard/team-metrics/employeestatus/${employeeId}?source=teamlead`);
};

const handleEmployeeClick = (employeeId) => {
  navigate(`/dashboard/team-metrics/employeestatus/${employeeId}?source=employee`);
};

  // Get the appropriate navigation handler based on current tab
  const getNavigationHandler = useCallback(() => {
    const currentRole = tabsConfig[activeTab].role;
    
    switch(currentRole) {
      case 'BDM':
        return handleBdmEmployeeClick;
      case 'TEAMLEAD':
        return handleTeamLeadEmployeeClick;
      case 'EMPLOYEE':
        return handleEmployeeClick;
      default:
        return handleBdmEmployeeClick;
    }
  }, [activeTab]);

  // Memoize the fetch function to prevent it from being recreated on every render
  const fetchDataForActiveTab = useCallback(() => {
    const currentRole = tabsConfig[activeTab].role;
    
    switch(currentRole) {
      case 'BDM':
        dispatch(fetchBdmUsers());
        break;
      case 'TEAMLEAD':
        dispatch(fetchTeamLeadUsers());
        break;
      case 'EMPLOYEE':
        dispatch(fetchEmployeeUsers());
        break;
      default:
        console.warn(`Unknown role: ${currentRole}`);
    }
  }, [activeTab, dispatch]);

  // Only fetch data when the active tab changes or component mounts
  useEffect(() => {
    fetchDataForActiveTab();
  }, [fetchDataForActiveTab]);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Update URL params to maintain state
    const tabKey = getTabKey(newValue);
    navigate(`/dashboard/team-metrics?activeTab=${tabKey}`, { replace: true });
  };

  // Memoize the refresh handler
  const handleRefresh = useCallback(() => {
    fetchDataForActiveTab();
  }, [fetchDataForActiveTab]);

  // Memoize the function to get current role data
  const getCurrentRoleData = useCallback(() => {
    const currentRole = tabsConfig[activeTab].role;
    
    switch(currentRole) {
      case 'BDM':
        return filteredBdmUsers;
      case 'TEAMLEAD':
        return filteredTeamLeadUsers;
      case 'EMPLOYEE':
        return filteredEmployeeUsers;
      default:
        return [];
    }
  }, [activeTab, filteredBdmUsers, filteredTeamLeadUsers, filteredEmployeeUsers]);

  const renderTabContent = () => {
    const currentRole = tabsConfig[activeTab].role;
    const currentData = getCurrentRoleData();
    
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      );
    }

    return (
      <UserTable 
        role={currentRole} 
        title={tabsConfig[activeTab].title} 
        employeesList={currentData} 
        loading={isLoading}
        onEmployeeClick={getNavigationHandler()} // Pass the navigation handler
      />
    );
  };

  return (
    <>
      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={2}
        sx={{
          flexWrap: 'wrap',
          mb: 3,
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" color="primary">Team Metrics</Typography>
        <DateRangeFilter 
          component="TeamMetrics" 
          onDateChange={handleRefresh}
        />
      </Stack>

      <Box sx={{ width: '100%', height: '100vh', mt: -1.5 }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          aria-label="team metrics tabs"
          sx={{
            borderBottom: '2px solid #e0e0e0',
            px: 2,
            backgroundColor: '#f9f9f9',
            borderRadius: '8px 8px 0 0',
          }}
          TabIndicatorProps={{
            style: {
              backgroundColor: '#2A4DBD',
              height: 4,
              borderRadius: 4,
            },
          }}
        >
          {tabsConfig.map((tab, index) => (
            <Tab
              key={tab.role}
              label={tab.title}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 15,
                color: activeTab === index ? '#2A4DBD' : '#555',
                mx: 1,
                px: 3,
                py: 1,
                borderRadius: 2,
                backgroundColor: activeTab === index ? '#e6ecfc' : 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#f0f4ff',
                },
              }}
            />
          ))}
        </Tabs>

        <Box sx={{ mt: 2, px: 2 }}>
          {renderTabContent()}
        </Box>
      </Box>
    </>
  );
};

export default TeamMetrics;