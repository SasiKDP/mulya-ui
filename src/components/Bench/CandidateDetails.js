import React, { useEffect, useState } from 'react';
import {
  Box, Typography, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, IconButton
} from '@mui/material';
import { Download, Email, Phone, Work, LinkedIn, Link as LinkIcon } from '@mui/icons-material';
import httpService from '../../Services/httpService';
import ToastService from '../../Services/toastService';

const CandidateDetails = ({ candidate, onDownloadResume }) => {
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        setLoading(true);
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
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !candidateData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error || 'No data found'}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>
              <Typography variant="h6" fontWeight={600}>
                {candidateData.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {candidateData.id}
              </Typography>
            </TableCell>
            <TableCell align="right">
              {candidateData.resumeAvailable && (
                <IconButton onClick={onDownloadResume} color="primary">
                  <Download />
                </IconButton>
              )}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Referred By */}
          <TableRow>
            <TableCell><Typography variant="body2">Referred By</Typography></TableCell>
            <TableCell colSpan={2}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {candidateData.referredBy || 'N/A'}
              </Typography>
            </TableCell>
          </TableRow>

          {/* Basic Information */}
          <TableRow>
            <TableCell><Typography variant="body2">Total Experience</Typography></TableCell>
            <TableCell>{candidateData.totalExperience} years</TableCell>
            <TableCell rowSpan={2}></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography variant="body2">Relevant Experience</Typography></TableCell>
            <TableCell>{candidateData.relevantExperience} years</TableCell>
          </TableRow>

          {/* Contact Info */}
          <TableRow>
            <TableCell><Typography variant="body2">Email</Typography></TableCell>
            <TableCell>{candidateData.email}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography variant="body2">Phone</Typography></TableCell>
            <TableCell>{candidateData.contactNumber}</TableCell>
          </TableRow>
          {candidateData.linkedin && (
            <TableRow>
              <TableCell><Typography variant="body2">LinkedIn</Typography></TableCell>
              <TableCell>
                <Button
                  component="a"
                  href={candidateData.linkedin}
                  target="_blank"
                  rel="noopener"
                  size="small"
                  startIcon={<LinkIcon fontSize="small" />}
                >
                  View Profile
                </Button>
              </TableCell>
            </TableRow>
          )}

          {/* Skills */}
          {candidateData.skills?.length > 0 && (
            <TableRow>
              <TableCell><Typography variant="body2">Skills</Typography></TableCell>
              <TableCell colSpan={2}>
                {candidateData.skills.map((skill, idx) => (
                  <Button key={idx} size="small" variant="outlined" sx={{ margin: 0.5 }}>
                    {skill}
                  </Button>
                ))}
              </TableCell>
            </TableRow>
          )}

          {/* Work Experience */}
          {candidateData.workHistory?.length > 0 && (
            <>
              <TableRow>
                <TableCell colSpan={3}><Typography variant="subtitle1">Work Experience</Typography></TableCell>
              </TableRow>
              {candidateData.workHistory.map((work, idx) => (
                <TableRow key={idx}>
                  <TableCell colSpan={2}>
                    <Typography variant="body2">{work.position} at {work.company}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {work.startDate} - {work.endDate || 'Present'}
                    </Typography>
                  </TableCell>
                  <TableCell>{work.description}</TableCell>
                </TableRow>
              ))}
            </>
          )}

          {/* Education */}
          {candidateData.education?.length > 0 && (
            <>
              <TableRow>
                <TableCell colSpan={3}><Typography variant="subtitle1">Education</Typography></TableCell>
              </TableRow>
              {candidateData.education.map((edu, idx) => (
                <TableRow key={idx}>
                  <TableCell colSpan={2}>
                    <Typography variant="body2">{edu.degree} at {edu.institution}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {edu.year}
                    </Typography>
                  </TableCell>
                  <TableCell>{edu.description}</TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CandidateDetails;
