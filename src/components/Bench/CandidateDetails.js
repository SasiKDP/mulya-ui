import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Chip, Button, CircularProgress, Divider } from '@mui/material';
import { Download } from '@mui/icons-material';
import httpService from '../../Services/httpService';
import ToastService from '../../Services/toastService';

const CandidateDetails = ({ candidateId, onClose }) => {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        setLoading(true);
        const response = await httpService.get(`/candidate/bench/getById/${candidateId}`);
        setCandidate(response.data);
      } catch (error) {
        console.error('Failed to fetch candidate details:', error);
        ToastService.error('Failed to load candidate details');
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidateDetails();
    }
  }, [candidateId]);

  const downloadResume = async () => {
    try {
      const toastId = ToastService.loading("Downloading resume...");
      const response = await httpService.get(`/candidate/bench/download/${candidateId}`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${candidate.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      ToastService.update(toastId, "Resume downloaded successfully!", "success");
    } catch (error) {
      ToastService.error("Failed to download resume");
      console.error("Error downloading resume:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!candidate) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Candidate not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {candidate.fullName}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Email
          </Typography>
          <Typography variant="body1" gutterBottom>
            {candidate.email}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Contact Number
          </Typography>
          <Typography variant="body1" gutterBottom>
            {candidate.contactNumber}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Relevant Experience
          </Typography>
          <Typography variant="body1" gutterBottom>
            {candidate.relevantExperience} years
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Total Experience
          </Typography>
          <Typography variant="body1" gutterBottom>
            {candidate.totalExperience} years
          </Typography>
        </Grid>

        {candidate.linkedin && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              LinkedIn
            </Typography>
            <Typography variant="body1" gutterBottom>
              {candidate.linkedin}
            </Typography>
          </Grid>
        )}

        {candidate.referredBy && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Referred By
            </Typography>
            <Typography variant="body1" gutterBottom>
              {candidate.referredBy}
            </Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Skills
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {candidate.skills && candidate.skills.length > 0 ? (
              candidate.skills.map((skill, index) => (
                <Chip key={index} label={skill} color="primary" variant="outlined" size="small" />
              ))
            ) : (
              <Typography variant="body2">No skills specified</Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {candidate.resumeAvailable && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Download />}
            onClick={downloadResume}
          >
            Download Resume
          </Button>
        )}
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default CandidateDetails;