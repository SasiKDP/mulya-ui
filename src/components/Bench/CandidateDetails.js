import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  CircularProgress, 
  Divider, 
  Chip, 
  Paper, 
  Button, 
  Link,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent
} from '@mui/material';
import { 
  Email, 
  Phone, 
  LinkedIn, 
  Person, 
  Work, 
  School, 
  Code, 
  Description, 
  Download,
  ContactPhone,
  ExpandMore,
  CalendarToday,
  Business,
  Star
} from '@mui/icons-material';
import httpService from '../../Services/httpService';
import ToastService from '../../Services/toastService';

const CandidateDetails = ({ candidateId, onClose, onDownloadResume }) => {
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState('panel1'); // Default open panel
  
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await httpService.get(`/candidate/getBenchBy/${candidateId}`);
        setCandidateData(response.data);
      } catch (error) {
        console.error('Failed to fetch candidate details:', error);
        setError('Failed to load candidate details');
        ToastService.error('Failed to load candidate details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidateDetails();
  }, [candidateId]);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !candidateData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error || 'No data found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {/* Header with Avatar and Name */}
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(to right, #3f51b5, #5c6bc0)',
        color: 'white',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Avatar 
          sx={{ width: 80, height: 80, mr: 3, bgcolor: 'white', color: '#3f51b5', border: '3px solid white' }}
        >
          {candidateData.fullName?.charAt(0)?.toUpperCase() || 'C'}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 500 }}>{candidateData.fullName}</Typography>
          <Typography variant="body1">
            Bench ID: {candidateData.id}
            {candidateData.referredBy && (
              <Box component="span" sx={{ ml: 2, display: 'inline-flex', alignItems: 'center' }}>
                <Person fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                Referred by: {candidateData.referredBy}
              </Box>
            )}
          </Typography>
        </Box>
      </Box>

      <CardContent>
        {/* Basic Information */}
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1 }} />
              <Typography variant="h6">Basic Information</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Full Name:</strong> {candidateData.fullName}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Bench ID:</strong> {candidateData.id}
                </Typography>
              </Grid>
              {candidateData.totalExperience && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Total Experience:</strong> {candidateData.totalExperience} years
                  </Typography>
                </Grid>
              )}
              {candidateData.relevantExperience && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Relevant Experience:</strong> {candidateData.relevantExperience} years
                  </Typography>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Contact Information */}
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ContactPhone sx={{ mr: 1 }} />
              <Typography variant="h6">Contact Information</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Email fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email" 
                  secondary={candidateData.email || 'Not provided'} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Phone" 
                  secondary={candidateData.contactNumber || 'Not provided'} 
                />
              </ListItem>
              {candidateData.linkedin && (
                <ListItem>
                  <ListItemIcon>
                    <LinkedIn fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="LinkedIn" 
                    secondary={
                      <Link href={candidateData.linkedin} target="_blank" rel="noopener">
                        {candidateData.linkedin}
                      </Link>
                    } 
                  />
                </ListItem>
              )}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Experience */}
        {candidateData.workHistory && candidateData.workHistory.length > 0 && (
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Work sx={{ mr: 1 }} />
                <Typography variant="h6">Work Experience</Typography>
                <Badge badgeContent={candidateData.workHistory.length} color="primary" sx={{ ml: 2 }} />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {candidateData.workHistory.map((work, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 3, 
                    pl: 2, 
                    borderLeft: '3px solid', 
                    borderColor: 'primary.main',
                    pb: 1
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{work.position}</Typography>
                  <Typography variant="subtitle2">
                    <Business fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {work.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                    {work.startDate} - {work.endDate || 'Present'}
                  </Typography>
                  {work.description && (
                    <Typography variant="body2">
                      {work.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Skills */}
        {candidateData.skills && candidateData.skills.length > 0 && (
          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Code sx={{ mr: 1 }} />
                <Typography variant="h6">Skills</Typography>
                <Badge badgeContent={candidateData.skills.length} color="primary" sx={{ ml: 2 }} />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {candidateData.skills.map((skill, index) => (
                  <Chip 
                    key={index} 
                    label={skill} 
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1, fontSize: '0.9rem', py: 0.5 }}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Education */}
        {candidateData.education && candidateData.education.length > 0 && (
          <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <School sx={{ mr: 1 }} />
                <Typography variant="h6">Education</Typography>
                <Badge badgeContent={candidateData.education.length} color="primary" sx={{ ml: 2 }} />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {candidateData.education.map((edu, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 3, 
                    p: 2, 
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="h6">{edu.degree}</Typography>
                  <Typography variant="subtitle1">
                    <School fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {edu.institution}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                    {edu.year}
                  </Typography>
                  {edu.description && (
                    <Typography variant="body2">
                      {edu.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Documents */}
        <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Description sx={{ mr: 1 }} />
              <Typography variant="h6">Documents</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1">
                  {candidateData.resumeAvailable ? (
                    <Badge color="success" variant="dot" sx={{ mr: 1 }}>
                      <Typography component="span">Resume Available</Typography>
                    </Badge>
                  ) : (
                    <Badge color="error" variant="dot" sx={{ mr: 1 }}>
                      <Typography component="span">Resume Not Available</Typography>
                    </Badge>
                  )}
                </Typography>
              </Box>
              {candidateData.resumeAvailable && (
                <Button 
                  variant="contained" 
                  startIcon={<Download />}
                  onClick={onDownloadResume}
                >
                  Download Resume
                </Button>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default CandidateDetails;