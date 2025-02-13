import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Box,
  Paper,
  Container,
  Alert,
  AlertTitle,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import BASE_URL from "../../redux/config";
import DataTable from "../MuiComponents/DataTable"; // Importing the reusable DataTable component

const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    { key: "fullName", label: "Full Name" },
    { key: "emailId", label: "Email" },
    { key: "contactNumber", label: "Contact" },
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

  useEffect(() => {
    const fetchSubmissions = async () => {
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
      }
    };

    fetchSubmissions();
  }, []);



  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
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
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            backgroundColor: "rgba(232, 245, 233)",
            color: "#000",
            px: 2,
            py: 1,
            borderRadius: 1,
            mb: 3
          }}
        >
          Submitted Candidates
        </Typography>

       

        {/* DataTable Component with Search Query */}
        <DataTable
          data={submissions}
          columns={columns}
          pageLimit={10}
         
        />
      </Paper>
    </Container>
  );
};

export default AllSubmissions;
