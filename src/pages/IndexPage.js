import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
} from '@mui/material';
import ComponentTitle from '../utils/ComponentTitle';
import httpService from '../Services/httpService';
import ToastService from '../Services/toastService';
import { API_BASE_URL } from '../Services/httpService';

export default function HomePage() {
  const navigate = useNavigate();
  const { role,userId } = useSelector((state) => state.auth);

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

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        let url = `/candidate/dashboardcounts`; // Default API for SUPERADMIN
  
        // If the user is not SUPERADMIN, add recruiterId to the URL
        if (role !== 'SUPERADMIN') {
          url = `/candidate/dashboardcounts?recruiterId=${userId}`;
        }
  
        const response = await httpService.get(url);
        setStats({
          requirements: response.data.requirements || 0,
          candidates: response.data.candidates || 0,
          assigned: response.data.assigned || 0,
          interviews: response.data.interviews || 0,
          clients: response.data.clients || 0,
          placements: response.data.placements || 0,
          users: response.data.users || 0,
          bench: response.data.bench || 0,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        ToastService.error('Failed to load dashboard data');
        setLoading(false);
      }
    };
  
    fetchDashboardCounts();
  }, [userId, role]); // Add role as a dependency to re-fetch if it changes
  

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

  // ✅ Only show "Assigned" card for EMPLOYEE role
  const filteredCards = cards.filter((card) => {
    if (role === 'EMPLOYEE') {
      return card.key === 'assigned';
    }
    return card.key !== 'assigned';
  });

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

  return (
    <Box p={4} bgcolor="#FFF" sx={{ minHeight: '85vh' }}>
      <ComponentTitle title="Dashboard" sx={{ mb: 2 }} />

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
                      {stats[card.key]}
                    </Typography>
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
                        backgroundColor: card.color,
                        filter: 'brightness(0.9)',
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
}
