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
  CircularProgress,
  Button,
  Avatar,
} from '@mui/material';
import ComponentTitle from '../utils/ComponentTitle';

export default function HomePage() {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);

  // Define allowed roles for each card
  const cardPermissions = {
    requirements: ['ADMIN', 'SUPERADMIN', 'BDM', 'TEAMLEAD'],
    candidates: ['ADMIN', 'SUPERADMIN', 'EMPLOYEE', 'BDM', 'TEAMLEAD', 'PARTNER'],
    assigned: ['ADMIN',  'EMPLOYEE', 'TEAMLEAD'],
    interviews: ['ADMIN', 'SUPERADMIN', 'EMPLOYEE', 'BDM', 'TEAMLEAD'],
    clients: ['ADMIN', 'SUPERADMIN', 'BDM'],
    placements: ['ADMIN', 'SUPERADMIN', 'BDM', 'TEAMLEAD'],
    bench: ['ADMIN', 'SUPERADMIN', 'BDM', 'TEAMLEAD', 'PARTNER','EMPLOYEE'],
  };

  // Dashboard access roles
  const allowedRoles = ['ADMIN', 'SUPERADMIN', 'EMPLOYEE', 'BDM', 'TEAMLEAD', 'PARTNER'];

  const [stats, setStats] = useState({
    requirements: 0,
    candidates: 0,
    assigned: 0,
    interviews: 0,
    clients: 0,
    placements: 0,
    bench: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        requirements: 24,
        candidates: 156,
        assigned: 42,
        interviews: 18,
        clients: 12,
        placements: 8,
        bench: 15,
      });
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    {
      title: 'Requirements',
      key: 'requirements',
      subtitle: 'Active',
      color: '#2563eb',
      bg: '#eff6ff',
      icon: <FileText size={24} />,
      buttonText: 'View Requirements',
      path: '/dashboard/requirements'
    },
    {
      title: 'Candidates',
      key: 'candidates',
      subtitle: 'Total',
      color: '#16a34a',
      bg: '#f0fdf4',
      icon: <Users size={24} />,
      buttonText: 'View Candidates',
      path: '/dashboard/submissions'
    },
    {
      title: 'Assigned',
      key: 'assigned',
      subtitle: 'Candidates',
      color: '#9333ea',
      bg: '#faf5ff',
      icon: <ClipboardCheck size={24} />,
      buttonText: 'View Assignments',
      path: '/dashboard/assigned'
    },
    {
      title: 'Interviews',
      key: 'interviews',
      subtitle: 'Scheduled',
      color: '#eab308',
      bg: '#fefce8',
      icon: <Calendar size={24} />,
      buttonText: 'View Interviews',
      path: '/dashboard/interviews'
    },
    {
      title: 'Clients',
      key: 'clients',
      subtitle: 'Active',
      color: '#dc2626',
      bg: '#fef2f2',
      icon: <Briefcase size={24} />,
      buttonText: 'View Clients',
      path: '/dashboard/clients'
    },
    {
      title: 'Placements',
      key: 'placements',
      subtitle: 'This Month',
      color: '#2563eb',
      bg: '#eff6ff',
      icon: <Award size={24} />,
      buttonText: 'View Placements',
      path: '/dashboard/placements'
    },
    {
      title: 'Bench',
      key: 'bench',
      subtitle: 'Available',
      color: '#0d9488',
      bg: '#f0fdfa',
      icon: <UserCheck size={24} />,
      buttonText: 'View Bench',
      path: '/dashboard/bench-users'
    },
  ];

  // Handle button click with permission check
  const handleCardClick = (cardKey, path) => {
    // Check if user has permission for this card
    if (cardPermissions[cardKey]?.includes(role)) {
      // User has permission, navigate to the page
      navigate(path);
    } else {
      // User doesn't have permission, navigate to access denied
      navigate('/access');
    }
  };

  // If user is not authorized to see the dashboard at all
  if (!allowedRoles.includes(role)) {
    return navigate('/access');
  }

  return (
    <Box p={4} bgcolor="#FFF" sx={{ minHeight: '85vh' }}>
    <ComponentTitle title="Dashboard" sx={{mb:2}}/>

    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  {card.title}
                </Typography>
                <Avatar sx={{ bgcolor: card.bg, color: card.color, width: 40, height: 40 }}>
                  {card.icon}
                </Avatar>
              </Box>

              {loading ? (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress size={24} />
                </Box>
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