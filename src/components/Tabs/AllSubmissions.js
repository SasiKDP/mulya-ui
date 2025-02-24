import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CircularProgress,
  Box,
  Container,
  Alert,
  AlertTitle,
} from "@mui/material";
import BASE_URL from "../../redux/config";
import DataTable from "../MuiComponents/DataTable"; // Reusable DataTable component
import SectionHeader from "../MuiComponents/SectionHeader"; // Import the reusable SectionHeader

const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const columns = [
   
    { key: "fullName", label: "Candidate Name", type: "text" },
    { key: "emailId", label: "Candidate Email", type: "text" },
    { key: "contactNumber", label: "Candidate Contact", type: "text" },
    { key: "currentOrganization", label: "Organization", type: "text" },
    { key: "qualification", label: "Qualification", type: "select" },
    { key: "totalExperience", label: "Total Exp", type: "text" },
    { key: "relevantExperience", label: "Relevant Exp", type: "text" },
    { key: "currentCTC", label: "Current CTC", type: "text" },
    { key: "expectedCTC", label: "Expected CTC", type: "text" },
    { key: "noticePeriod", label: "Notice Period", type: "select" },
    { key: "currentLocation", label: "Current Location", type: "text" },
    { key: "preferredLocation", label: "Preferred Location", type: "text" },
    { key: "skills", label: "Skills", type: "text" },
    { key: "communicationSkills", label: "Communication", type: "select" },
    { key: "requiredTechnologiesRating", label: "Tech Rating", type: "text" },
    { key: "overallFeedback", label: "Feedback", type: "text" },
    { key: "userEmail", label: "User Email", type: "text" },
    { key: "interviewStatus", label: "Status", type: "select" },
    { key: "candidateId", label: "Candidate ID", type: "select" },
    { key: "jobId", label: "Job ID", type: "text" },
    { key: "userId", label: "User ID", type: "text" },
  ];

  const fetchSubmissions = async () => {
    setIsRefreshing(true);
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/candidate/submissions/allsubmittedcandidates`
      );
      setSubmissions(response.data);
    } catch (err) {
      setError(err.message || "Failed to load submissions");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 100px)">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{
        height: "calc(100vh - 20px)", 
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      {/* Section Header with Fixed Height */}
      <Box sx={{ flexShrink: 0, mb: 2 }}>
        <SectionHeader
          title="Submitted Candidates"
          totalCount={submissions.length}
          onRefresh={fetchSubmissions}
          isRefreshing={isRefreshing}
        />
      </Box>

      {/* DataTable should take the remaining space */}
      <Box
        sx={{
          flexGrow: 1, 
          overflow: "hidden",
          height: "calc(100vh - 20vh)", // Subtract header & padding
        }}
      >
        <DataTable 
          data={submissions} 
          columns={columns} 
          pageLimit={10} 
        />
      </Box>
    </Container>
  );
};

export default AllSubmissions;
