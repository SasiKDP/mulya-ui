import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CircularProgress,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InterviewForm from "../InterviewForm";
//import appconfig.PROD_appconfig.PROD_BASE_URL from "../../redux/apiConfig";
import DataTable from "../MuiComponents/DataTable";

const appconfig = require("../../redux/apiConfig");
const BASE_URL = appconfig.PROD_appconfig.PROD_BASE_URL;

const Submissions = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [openInterviewDialog, setOpenInterviewDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const userId = user;

  // Function to generate columns dynamically
  const generateColumns = (data) => {
    if (data.length === 0) return [];

    const sampleData = data[0];
    const headerLabels = {
      candidateId: "Candidate ID",
      fullName: "Full Name",
      emailId: "Email",
      contactNumber: "Contact Number",
      currentOrganization: "Current Organization",
      experience: "Experience",
      jobId: "Job ID",
      resumeFilePath: "Resume",
      Interview: "Interview Status",
      // Add more mappings as needed
    };

    return Object.keys(sampleData)
      .filter((key) => key !== "interviewStatus") // Exclude interviewStatus as per original logic
      .map((key) => ({
        key: key,
        label:
          headerLabels[key] ||
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
      }));
  };

  const downloadResume = async (candidateId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/candidate/download-resume/${candidateId}`,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const blob = new Blob([response.data], { type: response.data.type });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "resume.pdf";
      link.click();
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const fetchSubmissionData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/candidate/submissions/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const userData = response.data || [];
        setTotalCount(userData.length || 0);

        const processedData = userData.map((item) => ({
          ...item,
          resumeFilePath: (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                downloadResume(item.candidateId);
              }}
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Download Resume
              <OpenInNewIcon fontSize="small" />
            </a>
          ),
          Interview:
            item.interviewStatus === "Scheduled" ? (
              <span style={{ color: "gray", cursor: "not-allowed" }}>
                Scheduled
              </span>
            ) : (
              <Link
                to="#"
                onClick={() => handleOpenInterviewDialog(item)}
                style={{ color: "blue", cursor: "pointer" }}
              >
                Schedule Interview
              </Link>
            ),
        }));

        setData(processedData);

        // Generate columns after data is processed
        if (processedData.length > 0) {
          const generatedColumns = generateColumns(processedData);
          setColumns(generatedColumns);
        }
      } catch (err) {
        console.error("Failed to fetch user-specific data", err);
      }
    };

    fetchSubmissionData();
  }, [userId]);

  const handleOpenInterviewDialog = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenInterviewDialog(true);
  };

  const handleCloseInterviewDialog = () => {
    setOpenInterviewDialog(false);
    setSelectedCandidate(null);
  };

  if (!userId) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography
        variant="h5"
        align="start"
        color="primary"
        gutterBottom
        sx={{
          backgroundColor: "rgba(232, 245, 233)",
          padding: 1,
          borderRadius: 1,
          textAlign: "start",
        }}
      >
        Candidate Submissions
      </Typography>
      <Box
        sx={{
          width: "100%",
          overflow: "auto",
          overflowX: "auto",
          maxHeight: 600,
        }}
      >
        <DataTable data={data} columns={columns} pageLimit={5} />
      </Box>

      <Dialog
        open={openInterviewDialog}
        onClose={handleCloseInterviewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography
            variant="h5"
            align="start"
            color="primary"
            gutterBottom
            sx={{
              backgroundColor: "rgba(232, 245, 233)",
              padding: 1,
              borderRadius: 1,
            }}
          >
            Schedule Interview
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseInterviewDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "primary",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <InterviewForm
            jobId={selectedCandidate?.jobId}
            candidateId={selectedCandidate?.candidateId}
            candidateFullName={selectedCandidate?.fullName}
            candidateContactNo={selectedCandidate?.contactNumber}
            clientName={selectedCandidate?.currentOrganization}
            userId={selectedCandidate?.userId}
            candidateEmailId={selectedCandidate?.emailId}
            userEmail={selectedCandidate?.userEmail}
            handleCloseInterviewDialog={handleCloseInterviewDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Submissions;
