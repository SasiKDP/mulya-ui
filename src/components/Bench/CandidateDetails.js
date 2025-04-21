import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, CircularProgress, Chip, Paper, Button, Link,
  Avatar, List, ListItem, ListItemText, Card, CardContent, Divider, Stack
} from '@mui/material';
import { Download, Email, Phone, Work, School, Info } from '@mui/icons-material';
import httpService from '../../Services/httpService';
import ToastService from '../../Services/toastService';

const SectionCard = ({ title, children }) => (
  <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Info fontSize="small" /> {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Paper>
);

const CandidateDetails = ({ candidate, onClose, onDownloadResume }) => {
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await httpService.get(`/candidate/getBenchBy/${candidate.id}`);
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
  }, [candidate]);

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
    <Box>
      {/* Header */}
      <Paper elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 3, mb: 4, borderRadius: 2 }}>
        <Avatar sx={{ width: 70, height: 70, mr: 3, bgcolor: '#3f51b5' }}>
          {candidateData.fullName?.charAt(0)?.toUpperCase() || 'C'}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {candidateData.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bench ID: {candidateData.id}
            {candidateData.referredBy && (
              <Box component="span" sx={{ ml: 2 }}>
                • Referred by: {candidateData.referredBy}
              </Box>
            )}
          </Typography>
        </Box>
      </Paper>

      {/* Basic Info */}
      <SectionCard title="Basic Information">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography><strong>Full Name:</strong> {candidateData.fullName}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography><strong>Bench ID:</strong> {candidateData.id}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography><strong>Total Experience:</strong> {candidateData.totalExperience} years</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography><strong>Relevant Experience:</strong> {candidateData.relevantExperience} years</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography><strong>Created Date:</strong> {new Date(candidateData.createdDate).toLocaleDateString()}</Typography>
          </Grid>
        </Grid>
      </SectionCard>

      {/* Contact Info */}
      <SectionCard title="Contact Information">
        <Stack spacing={1}>
          <Typography><Email fontSize="small" sx={{ mr: 1 }} /> {candidateData.email || 'Not provided'}</Typography>
          <Typography><Phone fontSize="small" sx={{ mr: 1 }} /> {candidateData.contactNumber || 'Not provided'}</Typography>
          {candidateData.linkedin && (
            <Typography>
              <Link href={candidateData.linkedin} target="_blank" rel="noopener">
                LinkedIn Profile
              </Link>
            </Typography>
          )}
        </Stack>
      </SectionCard>

      {/* Skills */}
      {candidateData.skills?.length > 0 && (
        <SectionCard title={`Skills (${candidateData.skills.length})`}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {candidateData.skills.map((skill, idx) => (
              <Chip key={idx} label={skill} variant="outlined" color="primary" />
            ))}
          </Box>
        </SectionCard>
      )}

      {/* Work Experience */}
      {candidateData.workHistory?.length > 0 && (
        <SectionCard title={`Work Experience (${candidateData.workHistory.length})`}>
          {candidateData.workHistory.map((work, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}><Work sx={{ fontSize: 18, mr: 1 }} />{work.position}</Typography>
              <Typography variant="body2" fontWeight={500}>{work.company}</Typography>
              <Typography variant="body2" color="text.secondary">{work.startDate} - {work.endDate || 'Present'}</Typography>
              {work.description && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>{work.description}</Typography>
              )}
            </Box>
          ))}
        </SectionCard>
      )}

      {/* Education */}
      {candidateData.education?.length > 0 && (
        <SectionCard title={`Education (${candidateData.education.length})`}>
          {candidateData.education.map((edu, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}><School sx={{ fontSize: 18, mr: 1 }} />{edu.degree}</Typography>
              <Typography variant="body2">{edu.institution}</Typography>
              <Typography variant="body2" color="text.secondary">{edu.year}</Typography>
              {edu.description && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>{edu.description}</Typography>
              )}
            </Box>
          ))}
        </SectionCard>
      )}

      {/* Documents */}
      <SectionCard title="Documents">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography>
            {candidateData.resumeAvailable ? 'Resume Available' : 'Resume Not Available'}
          </Typography>
          {candidateData.resumeAvailable && (
            <Button variant="contained" size="small" onClick={onDownloadResume} startIcon={<Download />}>
              Download Resume
            </Button>
          )}
        </Stack>
      </SectionCard>
    </Box>
  );
};

export default CandidateDetails;
