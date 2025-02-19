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
    { key: "fullName", label: "Candidate Name" },
    { key: "emailId", label: "Candidate Email" },
    { key: "contactNumber", label: "Candidate Contact" },
    { key: "currentOrganization", label: "Organization" },
    { key: "qualification", label: "Qualification" },
    { key: "totalExperience", label: "Total Exp" },
    { key: "relevantExperience", label: "Relevant Exp" },
    { key: "currentCTC", label: "Current CTC" },
    { key: "expectedCTC", label: "Expected CTC" },
    { key: "noticePeriod", label: "Notice Period" },
    { key: "currentLocation", label: "Current Location" },
    { key: "preferredLocation", label: "Preferred Location" },
    { key: "skills", label: "Skills" },
    { key: "communicationSkills", label: "Communication" },
    { key: "requiredTechnologiesRating", label: "Tech Rating" },
    { key: "candidateId", label: "Candidate ID" },
    { key: "overallFeedback", label: "Feedback" },
    { key: "interviewStatus", label: "Status" }
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
