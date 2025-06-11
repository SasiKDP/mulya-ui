import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Tabs, Tab, Box, CircularProgress, Stack, Typography, Alert, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import UserTable from './UserTable';
import DateRangeFilter from '../muiComponents/DateRangeFilter';
import { 
    fetchBdmUsers,
    fetchTeamLeadUsers, 
    fetchEmployeeUsers,
    filterTeamMetricsByDateRange,
    selectFilteredBdms,
    selectFilteredTeamLeads,
    selectFilteredEmployees,
    selectIsLoading
} from '../../redux/teamMetricsSlice';

const TeamMetrics = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [activeTab, setActiveTab] = useState(0);
    
    const filteredBdmUsers = useSelector(selectFilteredBdms);
    const filteredTeamLeadUsers = useSelector(selectFilteredTeamLeads);
    const filteredEmployeeUsers = useSelector(selectFilteredEmployees);
    const isLoading = useSelector(selectIsLoading);
    
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const tabFromUrl = searchParams.get('activeTab');

    const tabsConfig = useMemo(() => [
        { role: 'BDM', title: 'BDM Users', key: 'bdm' },
        { role: 'TEAMLEAD', title: 'Team Lead Users', key: 'teamlead' },
        { role: 'EMPLOYEE', title: 'Employee Users', key: 'employee' }
    ], []);

    // Set initial tab from URL
    useEffect(() => {
        if (tabFromUrl && ['bdm', 'teamlead', 'employee'].includes(tabFromUrl)) {
            const newTabIndex = tabsConfig.findIndex(tab => tab.key === tabFromUrl);
            if (newTabIndex !== -1) {
                setActiveTab(newTabIndex);
            }
        }
    }, [tabFromUrl, tabsConfig]);

    // Navigation handlers
    const navigationHandlers = useMemo(() => ({
        BDM: (employeeId) => {
            const params = new URLSearchParams(searchParams);
            navigate(`/dashboard/team-metrics/bdmstatus/${employeeId}?${params.toString()}`);
        },
        TEAMLEAD: (employeeId) => {
            const params = new URLSearchParams(searchParams);
            params.set('source', 'teamlead');
            navigate(`/dashboard/team-metrics/employeestatus/${employeeId}?${params.toString()}`);
        },
        EMPLOYEE: (employeeId) => {
            const params = new URLSearchParams(searchParams);
            params.set('source', 'employee');
            navigate(`/dashboard/team-metrics/employeestatus/${employeeId}?${params.toString()}`);
        }
    }), [navigate, searchParams]);

    const getNavigationHandler = useCallback(() => {
        const currentRole = tabsConfig[activeTab].role;
        return navigationHandlers[currentRole] || navigationHandlers.BDM;
    }, [activeTab, navigationHandlers, tabsConfig]);

    // Data fetching
    const fetchDataForActiveTab = useCallback(async () => {
        const currentRole = tabsConfig[activeTab].role;
        
        try {
            if (startDate && endDate) {
                await dispatch(filterTeamMetricsByDateRange({ startDate, endDate })).unwrap();
            } else {
                switch (currentRole) {
                    case 'BDM':
                        await dispatch(fetchBdmUsers()).unwrap();
                        break;
                    case 'TEAMLEAD':
                        await dispatch(fetchTeamLeadUsers()).unwrap();
                        break;
                    case 'EMPLOYEE':
                        await dispatch(fetchEmployeeUsers()).unwrap();
                        break;
                    default:
                        console.warn(`Unknown role: ${currentRole}`);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [activeTab, dispatch, startDate, endDate, tabsConfig]);

    useEffect(() => {
        const controller = new AbortController();
        
        fetchDataForActiveTab();
        
        return () => {
            controller.abort();
        };
    }, [fetchDataForActiveTab]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        const tabKey = tabsConfig[newValue].key;
        
        const params = new URLSearchParams(searchParams);
        params.set('activeTab', tabKey);
        
        navigate(`/dashboard/team-metrics?${params.toString()}`, { replace: true });
    };

    const handleRefresh = useCallback(() => {
        fetchDataForActiveTab();
    }, [fetchDataForActiveTab]);

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
    }, [activeTab, filteredBdmUsers, filteredTeamLeadUsers, filteredEmployeeUsers, tabsConfig]);

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
        
        return (
            <UserTable 
                role={currentRole} 
                title={tabsConfig[activeTab].title} 
                employeesList={currentData} 
                loading={isLoading}
                onEmployeeClick={getNavigationHandler()}
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
                    onChange={handleTabChange}
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