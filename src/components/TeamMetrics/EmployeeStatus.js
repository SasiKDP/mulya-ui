import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import httpService from '../../Services/httpService';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  CircularProgress,
  Card, 
  CardContent, 
  Grid,
  Button,
  IconButton
} from '@mui/material';
import { 
  Work, 
  People, 
  EventNote, 
  CheckCircle, 
  Error,
  ArrowBack
} from '@mui/icons-material';
import DataTable from '../muiComponents/DataTabel';
import { generateClientColumns } from '../TableColumns/ClientColumns';
import { generateJobDetailsColumns } from '../TableColumns/JobDetailsColumnsTL';
import { generateCandidateColumns } from '../TableColumns/CandidateColumns';
import { generateInterviewColumns, generateInterviewColumnsTeamLead } from '../TableColumns/InterviewsColumnsTM';
import {fetchTeamLeadUsers} from '../../redux/teamMetricsSlice';
import { useDispatch, useSelector } from 'react-redux';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EmployeeStatus = () => {
  const [requirements, setRequirements] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalJobs: 0,
    submittedCandidates: 0,
    scheduledInterviews: 0,
    placements: 0
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get employeeId from URL params and source tab from search params
  const { employeeId } = useParams();

  // FIX: Get date parameters from URL
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  const { teamLeadUsers, employeeUsers, coordinators} = useSelector((state) => state.teamMetrics);
  const { role } = useSelector((state) => state.auth);

  // Better source determination with more explicit fallback
  const source = searchParams.get('source');
  
  // Determine source based on which array contains the employee if not explicitly set
  const actualSource = source || (() => {
    const isInEmployeeUsers = employeeUsers.some(user => user.employeeId === employeeId);
    const isInTeamLeadUsers = teamLeadUsers.some(user => user.employeeId === employeeId);
     // const isInCoordinators = coordinators.some(user => user.employeeId === employeeId);
    
    if (isInEmployeeUsers && !isInTeamLeadUsers) return 'employee';
    if (isInTeamLeadUsers && !isInEmployeeUsers) return 'teamlead';
     // if (isInCoordinators && !isInEmployeeUsers) return 'coordinator';
    
    // If found in both or neither, default to teamlead
    return 'teamlead';
  })();

  useEffect(() => {
    dispatch(fetchTeamLeadUsers());
  }, [dispatch]);

  // Enhanced back click handler with better logic
  const handleBackClick = () => {
    console.log('Back click - actualSource:', actualSource);
    // FIX: Preserve date parameters when navigating back
    const params = new URLSearchParams();
    params.set('activeTab', actualSource);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    
    navigate(`/dashboard/team-metrics?${params.toString()}`);
  };

  // More robust name finding logic
  const Name = (() => {
    const allUsers = [...teamLeadUsers, ...employeeUsers];
    const user = allUsers.find(user => user.employeeId === employeeId);
    return user ? user.employeeName : 'Unknown Employee';
  })();

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setIsLoading(true);
        
        // FIX: Build API URL with date parameters if they exist
        let apiUrl = `/requirements/list/${employeeId}`;
        if (startDate && endDate) {
          apiUrl += `/filterByDate?startDate=${startDate}&endDate=${endDate}`;
        }
        
        console.log('Fetching from API:', apiUrl); // Debug log
        
        const response = await httpService.get(apiUrl);
        setRequirements(response.data);
        
        // Calculate statistics
        if (response.data) {
          const data = response.data;
          // Calculate total jobs
          const totalJobs = data.jobDetails ? 
            Object.values(data.jobDetails).reduce((sum, jobs) => sum + jobs.length, 0) : 0;
          
          // Calculate submitted candidates
          const submittedCandidates = data.submittedCandidates ? 
            Object.values(data.submittedCandidates).reduce((sum, candidates) => sum + candidates.length, 0) : 0;
          
          // Calculate scheduled interviews
          const scheduledInterviews = data.scheduledInterviews ? 
            Object.values(data.scheduledInterviews).reduce((sum, interviews) => sum + interviews.length, 0) : 0;
          
          // Calculate placements
          const placements = data.placements ? 
            Object.values(data.placements).reduce((sum, placed) => sum + placed.length, 0) : 0;
          
          setStats({
            totalJobs,
            submittedCandidates,
            scheduledInterviews,
            placements
          });
        }
      } catch (err) {
        console.error("Error fetching requirements:", err);
        setError("Failed to load requirements. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) {
      fetchRequirements();
    }
  }, [employeeId, startDate, endDate]); // FIX: Add date dependencies

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted':
        return 'primary';
      case 'In Progress':
        return 'warning';
      case 'Hold':
        return 'default';
      case 'Placed':
        return 'success';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Error color="error" sx={{ fontSize: 60 }} />
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  const renderJobs = () => {
    if (!requirements?.jobDetails) return <Typography>No job data available</Typography>;
    
    const allJobs = [];
    
    // Flatten the job details structure
    Object.entries(requirements.jobDetails).forEach(([clientName, jobs]) => {
      jobs.forEach(job => {
        allJobs.push({
          ...job,
          clientName
        });
      });
    });
    
    return (
      <DataTable
        data={allJobs || []}
        columns={generateJobDetailsColumns()}
        title={`Job Details `}
        enableSelection={false}
        defaultSortColumn="clientName"
        defaultSortDirection="asc"
        defaultRowsPerPage={10}
        primaryColor="#1976d2"
        secondaryColor="#e0f2f1"
        customStyles={{
          headerBackground: "#1976d2",
          rowHover: "#e0f2f1",
          selectedRow: "#b2dfdb",
        }}
        uniqueId="jobId"
      />
    );
  };

  const renderCandidates = () => {
    if (!requirements?.submittedCandidates) return <Typography>No candidate data available</Typography>;
    
    const allCandidates = [];
    
    // Flatten the candidates structure
    Object.entries(requirements.submittedCandidates).forEach(([clientName, candidates]) => {
      candidates.forEach(candidate => {
        allCandidates.push({
          ...candidate,
          clientName
        });
      });
    });

    console.log("requirements", requirements);
    
    return (
      <DataTable
        data={allCandidates || []}
        columns={generateCandidateColumns()}
        title={`Candidate Details `}
        enableSelection={false}
        defaultSortColumn="clientName"
        defaultSortDirection="asc"
        defaultRowsPerPage={10}
        primaryColor="#1976d2"
        secondaryColor="#e0f2f1"
        customStyles={{
          headerBackground: "#1976d2",
          rowHover: "#e0f2f1",
          selectedRow: "#b2dfdb",
        }}
        uniqueId="candidateId"
      />
    );
  };

  const renderInterviews = () => {
    if (!requirements?.scheduledInterviews) return <Typography>No interview data available</Typography>;
    
    const allInterviews = [];
    
    // Flatten the interviews structure
    Object.entries(requirements.scheduledInterviews).forEach(([clientName, interviews]) => {
      interviews.forEach(interview => {
        allInterviews.push({
          ...interview,
          clientName
        });
      });
    });
    
    return (
      <DataTable
        data={allInterviews || []}
        columns={generateInterviewColumnsTeamLead()}
        title={`Interview Details `}
        enableSelection={false}
        defaultSortColumn="clientName"
        defaultSortDirection="asc"
        defaultRowsPerPage={10}
        primaryColor="#1976d2"
        secondaryColor="#e0f2f1"
        customStyles={{
          headerBackground: "#1976d2",
          rowHover: "#e0f2f1",
          selectedRow: "#b2dfdb",
        }}
        uniqueId="candidateId"
      />
    );
  };

  const renderPlacements = () => {
    if (!requirements?.placements) return <Typography>No placement data available</Typography>;
    
    const allPlacements = [];
    
    // Flatten the placements structure
    Object.entries(requirements.placements).forEach(([clientName, placements]) => {
      placements.forEach(placement => {
        allPlacements.push({
          ...placement,
          clientName
        });
      });
    });
    
    return (
      <DataTable
        data={allPlacements || []}
        columns={generateInterviewColumnsTeamLead()}
        title={`Placement Details `}
        enableSelection={false}
        defaultSortColumn="clientName"
        defaultSortDirection="asc"
        defaultRowsPerPage={10}
        primaryColor="#1976d2"
        secondaryColor="#e0f2f1"
        customStyles={{
          headerBackground: "#1976d2",
          rowHover: "#e0f2f1",
          selectedRow: "#b2dfdb",
        }}
        uniqueId="candidateId"
      />
    );
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Enhanced back button with better text logic */}
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBackClick}
        sx={{ mb: 2 }}
        variant="outlined"
      >
        Back to {actualSource === 'employee' ? 'Employee Users' : 'Team Lead Users'}
      </Button>
     
      <Typography variant='h5'>{Name}[{employeeId}]</Typography>
      
  
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mt: 1, mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Work sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Jobs</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>{stats.totalJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">Candidates</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>{stats.submittedCandidates}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventNote sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Interviews</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>{stats.scheduledInterviews}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Placements</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>{stats.placements}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="recruitment tabs">
          <Tab label="Jobs" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Candidates" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Interviews" id="tab-2" aria-controls="tabpanel-2" />
          <Tab label="Placements" id="tab-3" aria-controls="tabpanel-3" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        {renderJobs()}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderCandidates()}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderInterviews()}
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {renderPlacements()}
      </TabPanel>
    </Box>
  );
};

export default EmployeeStatus;