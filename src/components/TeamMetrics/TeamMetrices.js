import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, CircularProgress, Stack, Typography } from '@mui/material';
import UserTable from './UserTable';
import httpService from '../../Services/httpService';
import DateRangeFilter from '../muiComponents/DateRangeFilter';

const TeamMetrics = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    BDM: [],
    TEAMLEAD: [],
    EMPLOYEE: []
  });

  const tabsConfig = [
    { role: 'BDM', title: 'BDM Users' },
    { role: 'TEAMLEAD', title: 'Team Lead Users' },
    { role: 'EMPLOYEE', title: 'Employee Users' }
  ];

  useEffect(() => {
    fetchData(tabsConfig[activeTab].role);
  }, []);

  const fetchData = async (role) => {
    console.log(`Fetching ${role} data...`);
    setIsLoading(true);
    try {
      let endpoint = '';
      switch(role) {
        case 'BDM':
          endpoint = '/users/bdmlist';
          break;
        case 'TEAMLEAD':
        case 'EMPLOYEE':
          endpoint = '/requirements/stats';
          break;
        default:
          endpoint = '/requirements/stats';
      }

      const response = await httpService.get(endpoint);
      console.log(`${role} API Response:`, response);

      if (response.data && Array.isArray(response.data)) {
        // Filter data based on role if using common endpoint
        const filteredData = role === 'BDM' 
          ? response.data 
          : response.data.filter(user => user.role === role);
        
        setUserData(prev => ({
          ...prev,
          [role]: filteredData
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${role} data:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async (event, newValue) => {
    const role = tabsConfig[newValue].role;
    setActiveTab(newValue);
    
    // Only fetch if we don't already have data
    if (userData[role].length === 0) {
      await fetchData(role);
    }
  };

  const renderTabContent = () => {
    // if (isLoading) {
    //   return (
    //     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    //       <CircularProgress color="primary" />
    //     </Box>
    //   );
    // }

    const currentRole = tabsConfig[activeTab].role;
    return (
      <UserTable 
        role={currentRole} 
        title={tabsConfig[activeTab].title} 
        employeesList={userData[currentRole]} 
      />
    );
  };

  return (
    <>
     <Stack direction="row" alignItems="center" spacing={2}
              sx={{
                flexWrap: 'wrap',
                mb: 3,
                justifyContent: 'space-between',
                p: 2,
                backgroundColor: '#f9f9f9',
                borderRadius: 2,
                boxShadow: 1,
      
              }}>
      
              <Typography variant='h6' color='primary'>Team Metrics</Typography>
      
              <DateRangeFilter component="TeamMetrics"/>
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