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
} from "@mui/material";
//import appconfig.PROD_appconfig.PROD_BASE_URL from "../../redux/apiConfig";
import DataTable from "../MuiComponents/DataTable";
import CustomDialog from "../MuiComponents/CustomDialog"; // Import CustomDialog
import BASE_URL from "../../redux/config";




const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [skillsContent, setSkillsContent] = useState(""); // Store the skills content

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

  const generateColumns = (data) => {
    if (!data.length) return [];
    return Object.keys(data[0]).map((key) => ({
      key,
      label: key
        .split(/(?=[A-Z])/)
        .join(" ")
        .replace(/^./, (str) => str.toUpperCase()),
    }));
  };

  const columns = generateColumns(submissions);

  const handleOpenDialog = (skills) => {
    setSkillsContent(skills); // Set the skills content when clicked
    setDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSkillsContent(""); // Reset skills content when closing
  };

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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper
        elevation={2}
        sx={{
          overflow: "auto",
          borderRadius: 2,
          height: 600,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              backgroundColor: "rgba(232, 245, 233)",
              color: "#000",
              px: 2,
              py: 1,
              borderRadius: 1,
              mb: 3,
            }}
          >
            Submitted candidates
          </Typography>

          {/* Reuse DataTable component */}
          <DataTable
            data={submissions}
            columns={columns}
            onRowClick={(row) =>
              handleOpenDialog(row.skills) // Open dialog for the skills content
            }
          />
        </Box>
      </Paper>

      {/* Dialog Box to show the full content of the skills */}
      <CustomDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title="Skills"
        content={skillsContent} // Pass the skills content to the dialog
      />
    </Container>
  );
};

export default AllSubmissions;
