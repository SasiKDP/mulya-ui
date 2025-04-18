import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  CircularProgress, 
  Chip, 
  Paper, 
  Button, 
  Link,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Download } from '@mui/icons-material';
import httpService from '../../Services/httpService';
import ToastService from '../../Services/toastService';

const CandidateDetails = ({ candidateId, onClose, onDownloadResume }) => {
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
    <Card elevation={2} sx={{ borderRadius: 1, overflow: 'hidden' }}>
      {/* Header with Avatar and Name */}
      <Box sx={{ 
        p: 3, 
        bgcolor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Avatar 
          sx={{ width: 70, height: 70, mr: 3, bgcolor: '#3f51b5' }}
        >
          {candidateData.fullName?.charAt(0)?.toUpperCase() || 'C'}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>{candidateData.fullName}</Typography>
          <Typography variant="body2" color="text.secondary">
            Bench ID: {candidateData.id}
            {candidateData.referredBy && (
              <Box component="span" sx={{ ml: 2 }}>
                Referred by: {candidateData.referredBy}
              </Box>
            )}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ px: 3 }}>
        {/* Basic Information */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
            Basic Information
          </Typography>
          
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
        </Box>

        {/* Contact Information */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
            Contact Information
          </Typography>
          
          <List disablePadding>
            <ListItem disableGutters>
              <ListItemText 
                primary="Email" 
                secondary={candidateData.email || 'Not provided'} 
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText 
                primary="Phone" 
                secondary={candidateData.contactNumber || 'Not provided'} 
              />
            </ListItem>
            {candidateData.linkedin && (
              <ListItem disableGutters>
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
        </Box>

        {/* Work Experience */}
        {candidateData.workHistory && candidateData.workHistory.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
              Work Experience ({candidateData.workHistory.length})
            </Typography>
            
            {candidateData.workHistory.map((work, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 3, 
                  pb: 2,
                  borderBottom: index !== candidateData.workHistory.length - 1 ? '1px solid #eaeaea' : 'none'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{work.position}</Typography>
                <Typography variant="subtitle2">{work.company}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {work.startDate} - {work.endDate || 'Present'}
                </Typography>
                {work.description && (
                  <Typography variant="body2">
                    {work.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Skills */}
        {candidateData.skills && candidateData.skills.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
              Skills ({candidateData.skills.length})
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {candidateData.skills.map((skill, index) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Education */}
        {candidateData.education && candidateData.education.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
              Education ({candidateData.education.length})
            </Typography>
            
            {candidateData.education.map((edu, index) => (
              <Paper 
                key={index} 
                variant="outlined"
                sx={{ 
                  mb: 2, 
                  p: 2,
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle1" fontWeight="medium">{edu.degree}</Typography>
                <Typography variant="subtitle2">{edu.institution}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {edu.year}
                </Typography>
                {edu.description && (
                  <Typography variant="body2">
                    {edu.description}
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        )}

        {/* Documents */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
            Documents
          </Typography>
          
          <Paper 
            variant="outlined"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              p: 2,
              borderRadius: 1
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1">
                {candidateData.resumeAvailable ? 'Resume Available' : 'Resume Not Available'}
              </Typography>
            </Box>
            {candidateData.resumeAvailable && (
              <Button 
                variant="contained" 
                startIcon={<Download />}
                onClick={onDownloadResume}
                size="small"
              >
                Download Resume
              </Button>
            )}
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CandidateDetails;