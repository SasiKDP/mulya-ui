import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../redux/config";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`job-details-tabpanel-${index}`}
      aria-labelledby={`job-details-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const JobDetailsDialog = ({ open, handleClose, jobId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [jobData, setJobData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataError, setDataError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (jobId && open) {
        setIsLoading(true);
        setDataError(null);
        try {
          const response = await axios.get(`${BASE_URL}/requirements/${jobId}`);
          if (response.status === 200) {
            setJobData(response.data);
          } else {
            setDataError(`Unexpected response status: ${response.status}`);
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
          setDataError(`Error fetching job details: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      } else {
          setJobData(null);
      }
    };

    fetchData();
  }, [jobId, open]);

  if (isLoading) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (dataError) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Job Details - {jobId}</Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="error">{dataError}</Alert>
          {jobData && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Data received:</Typography>
              <pre style={{ overflowX: "auto", backgroundColor: "#f5f5f5", padding: 16 }}>
                {JSON.stringify(jobData, null, 2)}
              </pre>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  if (!jobData) {
    return null;
  }

  const { recruiters, submitted_Candidates, interview_Scheduled_Candidates } = jobData;

  const generateTableHeaders = (dataObject) => {
    if (!dataObject || Object.keys(dataObject).length === 0) return;
  
    for (const recruiterId in dataObject) {
      const candidates = dataObject[recruiterId];
      if (Array.isArray(candidates) && candidates.length > 0) {
        // Found a recruiter with candidates, use the first candidate for headers
        const firstCandidate = candidates[0];
        return Object.keys(firstCandidate);
      }
    }
  
    // No candidates found for any recruiter
    return;
  };

  const submittedCandidateHeaders = generateTableHeaders(submitted_Candidates);
  const scheduledInterviewHeaders = generateTableHeaders(interview_Scheduled_Candidates);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Job Details - {jobId}</Typography>
          <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="job details tabs" textColor="primary" indicatorColor="primary" variant="fullWidth">
          <Tab label="Recruiters" id="job-details-tab-0" aria-controls="job-details-tabpanel-0" />
          <Tab label="Submitted Candidates" id="job-details-tab-1" aria-controls="job-details-tabpanel-1" />
          <Tab label="Scheduled Interviews" id="job-details-tab-2" aria-controls="job-details-tabpanel-2" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {Array.isArray(recruiters) && recruiters.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {Object.keys(recruiters[0]).map((key) => (
                      <TableCell key={key}>
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).replace(/Id$/, "ID").replace(/([a-z])([A-Z])/g, "$1 $2")}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recruiters.map((recruiter, index) => (
                    <TableRow key={recruiter.recruiterId || index}>
                      {Object.entries(recruiter).map(([key, value]) => (
                        <TableCell key={key}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="textSecondary">No recruiters found</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {Object.keys(submitted_Candidates).length > 0 ? (
            Object.entries(submitted_Candidates).map(([recruiterId, candidates]) => (
              <Box key={recruiterId} mb={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>Recruiter: {recruiterId}</Typography>
                {Array.isArray(candidates) && candidates.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {submittedCandidateHeaders.map((header) => (
                            <TableCell key={header} sx={{ fontWeight: "bold" }}>
                              {header.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).replace(/Id$/, "ID")}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {candidates.map((candidate, index) => (
                          <TableRow key={candidate.candidateId || `candidate-${index}`}>
                            {submittedCandidateHeaders.map((header) => (
                              <TableCell key={header}>
                                {header === "email" && candidate[header] ? (
                                  <a href={`mailto:${candidate[header]}`} style={{ textDecoration: "none", color: "#0073e6" }}>
                                    {candidate[header]}
                                  </a>
                                ) : (
                                  candidate[header] || "N/A"
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="textSecondary" sx={{ fontStyle: "italic" }}>No candidates found for thisrecruiter.</Typography>
                )}
              </Box>
            ))
          ) : (
            <Typography color="textSecondary">No submitted candidates available.</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {Object.keys(interview_Scheduled_Candidates).length > 0 ? (
            Object.entries(interview_Scheduled_Candidates).map(([recruiterId, candidates]) => (
              <Box key={recruiterId} mb={3}>
                <Typography variant="subtitle1" gutterBottom>Recruiter: {recruiterId}</Typography>
                {Array.isArray(candidates) && candidates.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {scheduledInterviewHeaders.map((header) => (
                            <TableCell key={header}>
                              {header.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).replace(/Id$/, "ID").replace(/([a-z])([A-Z])/g, "$1 $2")}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {candidates.map((candidate, idx) => (
                          <TableRow key={candidate.candidateId || `interview-${idx}`}>
                            {scheduledInterviewHeaders.map((header) => (
                              <TableCell key={`${candidate.candidateId || idx}-${header}`}>
                                {header === "email" && candidate[header]?.includes("@") ? (
                                  <a href={candidate[header].startsWith("mailto:") ? candidate[header] : `mailto:${candidate[header]}`}>
                                    {candidate[header].replace("mailto:", "")}
                                  </a>
                                ) : (
                                  candidate[header]
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="textSecondary">No scheduled interviews for this recruiter</Typography>
                )}
              </Box>
            ))
          ) : (
            <Typography color="textSecondary">No scheduled interviews</Typography>
          )}
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsDialog;