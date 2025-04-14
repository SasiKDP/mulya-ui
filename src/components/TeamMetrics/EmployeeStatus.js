import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Grid
} from '@mui/material';
import { 
  Work, 
  People, 
  EventNote, 
  CheckCircle, 
  Error 
} from '@mui/icons-material';

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

  // Get employeeId from URL params
  const { employeeId } = useParams();

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setIsLoading(true);
        const response = await httpService.get(`/requirements/list/${employeeId}`);
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
  }, [employeeId]);

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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="jobs table">
          <TableHead>
            <TableRow>
              <TableCell>Job ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Positions</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Mode</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Posted Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allJobs.map((job, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{job.jobId}</TableCell>
                <TableCell>{job.jobTitle}</TableCell>
                <TableCell>{job.clientName}</TableCell>
                <TableCell>{job.noOfPositions}</TableCell>
                <TableCell>{job.jobType}</TableCell>
                <TableCell>{job.jobMode}</TableCell>
                <TableCell>
                  <Chip 
                    label={job.status} 
                    color={getStatusColor(job.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
    
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="candidates table">
          <TableHead>
            <TableRow>
              <TableCell>Candidate ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Job ID</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Feedback</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allCandidates.map((candidate, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{candidate.candidateId}</TableCell>
                <TableCell>{candidate.fullName}</TableCell>
                <TableCell>{candidate.jobId}</TableCell>
                <TableCell>{candidate.jobTitle}</TableCell>
                <TableCell>{candidate.clientName}</TableCell>
                <TableCell>{candidate.skills}</TableCell>
                <TableCell>{candidate.overallFeedback}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="interviews table">
          <TableHead>
            <TableRow>
              <TableCell>Candidate Name</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Interview Level</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allInterviews.map((interview, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{interview.fullName}</TableCell>
                <TableCell>{interview.jobTitle}</TableCell>
                <TableCell>{interview.clientName}</TableCell>
                <TableCell>{interview.interviewLevel}</TableCell>
                <TableCell>{new Date(interview.interviewDateTime).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={interview.interviewStatus} 
                    color={getStatusColor(interview.interviewStatus)} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="placements table">
          <TableHead>
            <TableRow>
              <TableCell>Candidate Name</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Interview Level</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allPlacements.map((placement, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{placement.fullName}</TableCell>
                <TableCell>{placement.jobTitle}</TableCell>
                <TableCell>{placement.clientName}</TableCell>
                <TableCell>{placement.interviewLevel}</TableCell>
                <TableCell>{new Date(placement.interviewDateTime).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={placement.interviewStatus} 
                    color={getStatusColor(placement.interviewStatus)} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
    
      
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