import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Users, ClipboardCheck, Calendar, Briefcase, Award, UserCheck,
} from 'lucide-react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Skeleton,
  Stack
} from '@mui/material';
import ComponentTitle from '../utils/ComponentTitle';
import httpService from '../Services/httpService';
import ToastService from '../Services/toastService';
import { API_BASE_URL } from '../Services/httpService';
import DateRangeFilter from '../components/muiComponents/DateRangeFilter';
import { filterDashBoardCountByDateRange } from '../redux/dashboardSlice';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role, userId } = useSelector((state) => state.auth);
  const { statsByFilter: dashboardStats } = useSelector((state) => state.dashboard);

  const [isFiltered, setIsFiltered] = useState(false);
  const [defaultStats, setDefaultStats] = useState({});
  const [filteredStats, setFilteredStats] = useState(null);
  const [stats, setStats] = useState({
    requirements: 0,
    candidates: 0,
    assigned: 0,
    interviews: 0,
    clients: 0,
    placements: 0,
    users: 0,
    bench: 0,
  });
  const [loading, setLoading] = useState(true);

  // Card permission mapping
  const cardPermissions = {
    requirements: ['ADMIN', 'SUPERADMIN', 'BDM', 'TEAMLEAD'],
    candidates: ['ADMIN', 'EMPLOYEE', 'BDM', 'TEAMLEAD'],
    assigned: ['ADMIN', 'EMPLOYEE', 'TEAMLEAD', 'BDM'],
    interviews: ['ADMIN', 'EMPLOYEE', 'BDM', 'TEAMLEAD'],
    clients: ['ADMIN', 'SUPERADMIN', 'BDM', 'PARTNER'],
    placements: ['ADMIN', 'SUPERADMIN', 'PARTNER'],
    users: ['ADMIN', 'SUPERADMIN', 'PARTNER'],
    bench: ['ADMIN', 'SUPERADMIN', 'BDM', 'TEAMLEAD', 'PARTNER', 'EMPLOYEE'],
  };

  const allowedRoles = ['ADMIN', 'SUPERADMIN', 'EMPLOYEE', 'BDM', 'TEAMLEAD', 'PARTNER'];

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        let url = `/candidate/dashboardcounts`;
        if (role !== 'SUPERADMIN') {
          url = `/candidate/dashboardcounts?recruiterId=${userId}`;
        }

        const response = await httpService.get(url);
        setDefaultStats({
          requirements: response.data.requirements || 0,
          candidates: response.data.candidates || 0,
          assigned: response.data.assigned || 0,
          interviews: response.data.interviews || 0,
          internalInterviews: response.data.internalInterviews || 0,
          externalInterviews: response.data.externalInterviews || 0,
          clients: response.data.clients || 0,
          placements: response.data.placements || 0,
          users: response.data.users || 0,
          bench: response.data.bench || 0,
        });

        // if (!isFiltered) {
        //   setStats(response.data); // Set stats only if not filtered
        // }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        ToastService.error('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardCounts();
  }, [userId, role]);

  // useEffect(() => {
  //   if (isFiltered) {
  //     setStats(dashboardStats); // Update stats with filtered data
  //   }
  // }, [dashboardStats, isFiltered]);

  const cards = [
    {
      title: 'Requirements',
      key: 'requirements',
      subtitle: 'Active',
      color: '#3B82F6',
      bg: '#EFF6FF',
      icon: <FileText size={24} />,
      buttonText: 'View Requirements',
      path: '/dashboard/requirements',
    },
    {
      title: 'Candidates',
      key: 'candidates',
      subtitle: 'Total',
      color: '#10B981',
      bg: '#ECFDF5',
      icon: <Users size={24} />,
      buttonText: 'View Candidates',
      path: '/dashboard/submissions',
    },
    {
      title: 'Assigned',
      key: 'assigned',
      subtitle: 'Candidates',
      color: '#8B5CF6',
      bg: '#F5F3FF',
      icon: <ClipboardCheck size={24} />,
      buttonText: 'View Assignments',
      path: '/dashboard/assigned',
    },
    {
      title: 'Interviews',
      key: 'interviews',
      subtitle: 'Scheduled',
      color: '#F59E0B',
      bg: '#FFFBEB',
      icon: <Calendar size={24} />,
      buttonText: 'View Interviews',
      path: '/dashboard/interviews',
    },
    {
      title: 'Internal Interviews',
      key: 'internalInterviews',
      subtitle: 'Scheduled',
      color: '#1D4ED8',
      bg: '#E0F2FE',
      icon: <Calendar size={24} />,
      buttonText: 'View Internal Interviews',
      path: '/dashboard/interviews',
    },
    {
      title: 'External Interviews',
      key: 'externalInterviews',
      subtitle: 'Scheduled',
      color: '#D97706',
      bg: '#FEF3C7',
      icon: <Calendar size={24} />,
      buttonText: 'View External Interviews',
      path: '/dashboard/interviews',
    },
    {
      title: 'Clients',
      key: 'clients',
      subtitle: 'Active',
      color: '#EF4444',
      bg: '#FEF2F2',
      icon: <Briefcase size={24} />,
      buttonText: 'View Clients',
      path: '/dashboard/clients',
    },
    {
      title: 'Placements',
      key: 'placements',
      subtitle: 'This Month',
      color: '#6366F1',
      bg: '#EEF2FF',
      icon: <Award size={24} />,
      buttonText: 'View Placements',
      path: '/dashboard/placements',
    },
    {
      title: 'Employees',
      key: 'users',
      subtitle: 'Available',
      color: '#06B6D4',
      bg: '#ECFEFF',
      icon: <UserCheck size={24} />,
      buttonText: 'View Employees',
      path: '/dashboard/users',
    },
    {
      title: 'Bench',
      key: 'bench',
      subtitle: 'Available',
      color: '#14B8A6',
      bg: '#F0FDFA',
      icon: <UserCheck size={24} />,
      buttonText: 'View Bench',
      path: '/dashboard/bench-users',
    },
  ];

  const filteredCards = cards.filter((card) => {
    if (role === 'EMPLOYEE') {
      return card.key === 'assigned';
    }
    return card.key !== 'assigned';
  });

  const handleDateFilterApply = async (startDate, endDate) => {
  if (startDate && endDate) {
    try {
       const response = await dispatch(filterDashBoardCountByDateRange({ startDate, endDate })).unwrap();
      setFilteredStats(response);
      ToastService.success("Filter applied successfully");
    } catch (error) {
      ToastService.error("Failed to apply filter");
    }
  }
};


  console.log("filter apply",handleDateFilterApply())

  const handleClearFilter = () => {
    setFilteredStats(null); // Reset to original stats
  };

  const handleCardClick = (cardKey, path) => {
    if (cardPermissions[cardKey]?.includes(role)) {
      navigate(path);
    } else {
      navigate('/access');
    }
  };

  if (!allowedRoles.includes(role)) {
    return navigate('/access');
  }

  const currentStats = filteredStats ? filteredStats : defaultStats;

  return (
    <Box p={4} bgcolor="#FFF" sx={{ minHeight: '85vh' }}>
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
        <Typography variant="h6" color="primary">
          Dashboard
        </Typography>
        <DateRangeFilter
          component="dashboard"
          onDateChange={handleDateFilterApply}
          onClear={handleClearFilter}
        />
      </Stack>

      <Grid container spacing={3}>
        {filteredCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {card.title}
                  </Typography>

                  {loading ? (
                    <Skeleton variant="circular" width={40} height={40} />
                  ) : (
                    <Avatar sx={{ bgcolor: card.bg, color: card.color, width: 40, height: 40 }}>
                      {card.icon}
                    </Avatar>
                  )}
                </Box>

                {loading ? (
                  <>
                    <Skeleton variant="text" width={40} height={32} />
                    <Skeleton variant="text" width={60} height={20} />
                  </>
                ) : (
                  <>
                    <Typography variant="h5" fontWeight="bold">
                       {currentStats[card.key] || 0}
                    </Typography>
                    {/* <Typography variant="h5" fontWeight="bold">
                      {dashboardStats[card.key] || 0 }
                    </Typography> */}
                    <Typography variant="caption" color="textSecondary">
                      {card.subtitle}
                    </Typography>
                  </>
                )}

                <Box mt={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleCardClick(card.key, card.path)}
                    disabled={loading}
                    sx={{
                      backgroundColor: card.color,
                      '&:hover': {
                        backgroundColor: card.bg,
                      },
                    }}
                  >
                    {card.buttonText}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;
