// CandidateDetails.jsx
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
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Email, 
  Phone, 
  LinkedIn, 
  Person, 
  Work, 
  School, 
  Code, 
  Business, 
  CalendarToday, 
  Description, 
  Download,
  ContactPhone
} from '@mui/icons-material';
import httpService from '../../Services/httpService';
import ToastService from '../../Services/toastService';



const CandidateDetails = ({ candidateId, filterCriteria, onClose, onDownloadResume }) => {
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await httpService.get(`/candidate/bench/${candidateId}`);
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
    <Box sx={{ p: 1 }}>
      {/* Basic Info Section */}
      {filterCriteria?.showBasicInfo && (
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}
            >
              {candidateData.fullName?.charAt(0)?.toUpperCase() || 'C'}
            </Avatar>
            <Box>
              <Typography variant="h5">{candidateData.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Bench ID: {candidateData.id}
              </Typography>
              {candidateData.referredBy && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Person fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                  <Typography variant="body2">
                    Referred by: {candidateData.referredBy}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      )}
      
      {/* Contact Information */}
      {filterCriteria?.showContact && (
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <ContactPhone sx={{ mr: 1 }} /> Contact Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
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
        </Paper>
      )}
      
      {/* Experience Information */}
      {filterCriteria?.showExperience && (
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <Work sx={{ mr: 1 }} /> Experience
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Experience
                  </Typography>
                  <Typography variant="h5">
                    {candidateData.totalExperience} years
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Relevant Experience
                  </Typography>
                  <Typography variant="h5">
                    {candidateData.relevantExperience} years
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Work history if available */}
          {candidateData.workHistory && candidateData.workHistory.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Work History</Typography>
              {candidateData.workHistory.map((work, index) => (
                <Box key={index} sx={{ mb: 2, pl: 1, borderLeft: '2px solid', borderColor: 'primary.light' }}>
                  <Typography variant="subtitle2">{work.position}</Typography>
                  <Typography variant="body2">{work.company}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {work.startDate} - {work.endDate || 'Present'}
                  </Typography>
                  {work.description && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {work.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      )}
      
      {/* Skills Information */}
      {filterCriteria?.showSkills && candidateData.skills && candidateData.skills.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <Code sx={{ mr: 1 }} /> Skills
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {candidateData.skills.map((skill, index) => (
              <Chip 
                key={index} 
                label={skill} 
                variant="outlined" 
                color="primary"
              />
            ))}
          </Box>
        </Paper>
      )}
      
      {/* Education Information */}
      {filterCriteria?.showEducation && candidateData.education && candidateData.education.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <School sx={{ mr: 1 }} /> Education
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {candidateData.education.map((edu, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{edu.degree}</Typography>
              <Typography variant="body1">{edu.institution}</Typography>
              <Typography variant="body2" color="text.secondary">
                {edu.year}
              </Typography>
              {edu.description && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {edu.description}
                </Typography>
              )}
              {index < candidateData.education.length - 1 && (
                <Divider sx={{ my: 1 }} />
              )}
            </Box>
          ))}
        </Paper>
      )}
      
      {/* Documents/Resume Section */}
      {filterCriteria?.showDocuments && (
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <Description sx={{ mr: 1 }} /> Documents
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Resume: {candidateData.resumeAvailable ? 'Available' : 'Not available'}
            </Typography>
            {candidateData.resumeAvailable && (
              <Button 
                variant="outlined" 
                startIcon={<Download />}
                onClick={onDownloadResume}
                size="small"
              >
                Download Resume
              </Button>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default CandidateDetails;