import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CircularProgress,
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link as MuiLink
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../MuiComponents/DataTable";

import BASE_URL from "../../redux/config";





const ClientJobs = () => {
  const { clientName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [jobsData, setJobsData] = useState({ jobs: [], recruiters: {}, submittedCandidates: {}, interviewScheduledCandidates: {} });
  const [tabValue, setTabValue] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);

  c

  useEffect(() => {
    fetchJobsData();
  }, [clientName]);

  const fetchJobsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/requirements/bdm/jobs/${clientName}`);
      setJobsData(response.data);
      
      // Set default selections if data exists
      if (response.data.jobs && response.data.jobs.length > 0) {
        setSelectedJob(response.data.jobs[0].jobId);
        
        // Set default recruiter if available for this job
        const recruitersForJob = response.data.recruiters[response.data.jobs[0].jobId];
        if (recruitersForJob && recruitersForJob.length > 0) {
          setSelectedRecruiter(recruitersForJob[0].recruiterName);
        }
      }
    } catch (error) {
      console.error("Error fetching jobs data:", error);
      toast.error(error.response?.data?.message || "Failed to load jobs data");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleJobChange = (jobId) => {
    setSelectedJob(jobId);
    
    // Reset and set recruiter when job changes
    const recruitersForJob = jobsData.recruiters[jobId];
    if (recruitersForJob && recruitersForJob.length > 0) {
      setSelectedRecruiter(recruitersForJob[0].recruiterName);
    } else {
      setSelectedRecruiter(null);
    }
  };

  const handleRecruiterChange = (recruiterName) => {
    setSelectedRecruiter(recruiterName);
  };

  const handleGoBack = () => {
    // This would return to the clients page in your dashboard structure
    // Assuming your clients page is accessed via a specific tab in your dashboard
    const tabPath = location.pathname.split('/').slice(0, -1).join('/');
    navigate(tabPath);
  };

  // Job columns
  const jobColumns = [
    { key: "jobId", label: "Job ID", type: "text", editable: false },
    { key: "jobTitle", label: "Job Title", type: "text", editable: false },
    { key: "clientId", label: "Client ID", type: "text", editable: false },
    { 
      key: "actions", 
      label: "Actions", 
      render: (row) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="View Job Details">
            <IconButton 
              size="small" 
              color="primary" 
              onClick={() => handleJobChange(row.jobId)}
              disabled={selectedJob === row.jobId}
            >
              <PersonIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  // Recruiter columns
  const recruiterColumns = [
    { key: "recruiterId", label: "Recruiter ID", type: "text", editable: false },
    { key: "recruiterName", label: "Recruiter Name", type: "text", editable: false },
    { 
      key: "actions", 
      label: "Actions", 
      render: (row) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="View Recruiter Candidates">
            <IconButton 
              size="small" 
              color="primary" 
              onClick={() => handleRecruiterChange(row.recruiterName)}
              disabled={selectedRecruiter === row.recruiterName}
            >
              <PersonIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  // Candidate columns (for both submitted and interview scheduled)
  const candidateColumns = [
    { key: "candidateId", label: "Candidate ID", type: "text", editable: false },
    { key: "candidateName", label: "Name", type: "text", editable: false },
    { key: "contactNumber", label: "Contact", type: "text", editable: false },
    { key: "email", label: "Email", type: "text", editable: false, render: (row) => row.email || "--" },
    { key: "qualification", label: "Qualification", type: "text", editable: false },
    { key: "skills", label: "Skills", type: "text", editable: false, render: (row) => row.skills || "--" },
    { key: "interviewStatus", label: "Interview Status", type: "text", editable: false },
    { key: "overallFeedback", label: "Feedback", type: "text", editable: false, render: (row) => row.overallFeedback || "--" }
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Get current data based on selections
  const getCurrentCandidates = () => {
    if (!selectedJob || !selectedRecruiter) return [];
    
    if (tabValue === 0) {
      return jobsData.submittedCandidates[selectedJob]?.[selectedRecruiter] || [];
    } else {
      return jobsData.interviewScheduledCandidates[selectedJob]?.[selectedRecruiter] || [];
    }
  };

  const getRecruitersForSelectedJob = () => {
    if (!selectedJob) return [];
    return jobsData.recruiters[selectedJob] || [];
  };

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink color="inherit" sx={{ cursor: "pointer" }} onClick={handleGoBack}>
            Clients
          </MuiLink>
          <Typography color="text.primary">{clientName} - Jobs</Typography>
        </Breadcrumbs>
      </Box>

      <Paper sx={{ mb: 3, p: 1, borderRadius: 2 }}>
        <DataTable
          data={jobsData.jobs || []}
          columns={jobColumns}
          title="Jobs"
          pageLimit={10}
          onRefresh={fetchJobsData}
          isRefreshing={loading}
          showToolbar={true}
        />
      </Paper>

      {selectedJob && (
        <>
          <Paper sx={{ mb: 3, p: 1, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              Recruiters for Job: {selectedJob}
            </Typography>
            <DataTable
              data={getRecruitersForSelectedJob()}
              columns={recruiterColumns}
              pageLimit={5}
              showToolbar={false}
            />
          </Paper>

          {selectedRecruiter && (
            <Paper sx={{ mb: 3, flex: 1, display: "flex", flexDirection: "column", borderRadius: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="candidate tabs">
                  <Tab label="Submitted Candidates" />
                  <Tab label="Interview Scheduled Candidates" />
                </Tabs>
              </Box>
              <Box sx={{ p: 2, flex: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  {tabValue === 0 ? "Submitted" : "Interview Scheduled"} Candidates for {selectedRecruiter}
                </Typography>
                <DataTable
                  data={getCurrentCandidates()}
                  columns={candidateColumns}
                  pageLimit={10}
                  showToolbar={false}
                  emptyStateMessage={tabValue === 0 ? "No submitted candidates" : "No scheduled interviews"}
                />
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default ClientJobs;