import React, { useState, useEffect } from "react";
import ReusableTable from "../ReusableTable";
import axios from "axios";
import BASE_URL from "../../redux/apiConfig";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
import InterviewForm from "../InterviewForm";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CustomDialog from "../MuiComponents/CustomDialog";

const Submissions = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openInterviewDialog, setOpenInterviewDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const userId = user;

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

        const updatedData = userData.map((item) => ({
          ...item,
          Interview: "schedule-Interview",
        }));
        setData(updatedData);

        if (updatedData.length > 0) {
          const dynamicHeaders = Object.keys(updatedData[0]).filter(
            (header) => header !== "interviewStatus" // Exclude the interviewStatus column
          );
          setHeaders(dynamicHeaders);
        }
      } catch (err) {
        console.error("Failed to fetch user-specific data", err);
      }
    };

    fetchSubmissionData();
  }, [userId]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page on rows per page change
  };

  const handleOpenInterviewDialog = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenInterviewDialog(true);
  };

  const handleCloseInterviewDialog = () => {
    setOpenInterviewDialog(false);
    setSelectedCandidate(null);
  };

  const downloadResume = async (candidateId) => {
    try {
      const response = await axios.get(
        `http://192.168.0.246:8085/candidate/download-resume/${candidateId}`,
        {
          responseType: "blob", // Important for file download
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const blob = new Blob([response.data], { type: response.data.type });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "resume.pdf"; // You can adjust this if you get the filename from the response
      link.click();
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  const onCellRender = (row, header) => {
    if (header === "resumeFilePath" && row[header]) {
      return (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            downloadResume(row.candidateId);
          }}
          style={{
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px", // Adjust spacing between text and icon
          }}
        >
          Download Resume
          <OpenInNewIcon fontSize="small" />
        </a>
      );
    }
    if (header === "Interview") {
      const isScheduled = row.interviewStatus === "Scheduled"; // Check if the interview is already scheduled
      return isScheduled ? (
        <span style={{ color: "gray", cursor: "not-allowed" }}>Scheduled</span>
      ) : (
        <Link
          to="#"
          onClick={() => handleOpenInterviewDialog(row)}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {row[header]}
        </Link>
      );
    }

    return row[header];
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

  // Calculate paginated data
  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <ReusableTable
        data={paginatedData} // Use paginated data here
        headers={headers}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onCellRender={onCellRender}
      />

      {/* Dialog for the candidate interview */}
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
      {/* <CustomDialog
        open={openInterviewDialog}
        onClose={handleCloseInterviewDialog}
        title="Schedule Interview"
        content={
          <InterviewForm
            jobId={selectedCandidate?.jobId}
            candidateId={selectedCandidate?.candidateId}
            candidateFullName={selectedCandidate?.fullName}
            candidateContactNo={selectedCandidate?.contactNumber}
            clientName={selectedCandidate?.currentOrganization}
            userId={selectedCandidate?.userId}
            candidateEmailId={selectedCandidate?.candidateEmailId}
            userEmail={selectedCandidate?.userEmail}
            handleCloseInterviewDialog={handleCloseInterviewDialog}
          />
        }
        maxWidth="md"
      /> */}
    </>
  );
};

export default Submissions;
