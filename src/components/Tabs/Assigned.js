import React, { useState, useEffect } from "react";
import axios from "axios";
import ReusableTable from "../ReusableTable";
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
  Button,
  DialogActions,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CandidateSubmissionForm from "../CandidateSubmissionFrom";
import BASE_URL from "../../redux/apiConfig";
import UploadIcon from "@mui/icons-material/Upload";
import CustomDialog from "../MuiComponents/CustomDialog";

const Assigned = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false); // State for Submit dialog visibility
  const [selectedJobForSubmit, setSelectedJobForSubmit] = useState(null); // Store the selected job for submit
  const [openDescriptionDialog, setOpenDescriptionDialog] = useState(false); // Job Description dialog
  const [selectedJobDescription, setSelectedJobDescription] = useState(""); // Store selected job description
  const [employeesList, setEmployeesList] = useState([]); // Local state for employee data
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [fetchError, setFetchError] = useState(null);

  const { user } = useSelector((state) => state.auth); // Use selector to get user from Redux state
  const userId = user;

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setFetchStatus("loading");
      try {
        const response = await axios.get(`${BASE_URL}/users/employee`);
        setEmployeesList(response.data);
        setFetchStatus("succeeded");
      } catch (error) {
        setFetchStatus("failed");
        setFetchError(error.message);
        console.error("Failed to fetch employees:", error.message);
      }
    };

    // Only fetch employees on initial load
    if (fetchStatus === "idle") {
      fetchEmployees();
    }
  }, []);

  // Function to find the employee email based on userId
  const getEmployeeEmail = (userId, employeesList) => {
    const employee = employeesList.find((emp) => emp.employeeId === userId);
    return employee ? employee.email : null;
  };

  // Dynamically get employee email
  const employeeEmail = getEmployeeEmail(userId, employeesList);

  useEffect(() => {
    if (!userId) return;

    const fetchUserSpecificData = async () => {
      try {
        const response = await axios.get(
          `http://35.188.150.92/requirements/recruiter/${userId}`
        );
        const userData = response.data || [];
        console.log(userData);

        setTotalCount(response.data.totalCount || userData.length || 0);

        // Manually add the "submit" column to each row
        const updatedData = userData.map((item) => ({
          ...item,
          submitCandidate: "submit candidate", // Adding the "Submit" column manually
        }));
        setData(updatedData);

        if (updatedData.length > 0) {
          const dynamicHeaders = Object.keys(updatedData[0]);
          setHeaders(dynamicHeaders);
        }
      } catch (err) {
        console.error("Failed to fetch user-specific data", err);
      }
    };

    fetchUserSpecificData();
  }, [userId, page, rowsPerPage]);

  const handleOpenSubmitDialog = (job) => {
    setSelectedJobForSubmit(job); // Store the job for the submit dialog
    setOpenSubmitDialog(true);
  };

  const handleCloseSubmitDialog = () => {
    setOpenSubmitDialog(false);
    setSelectedJobForSubmit(null);
  };

  const handleOpenDescriptionDialog = (description) => {
    setSelectedJobDescription(description); // Store the full job description
    setOpenDescriptionDialog(true);
  };

  const handleCloseDescriptionDialog = () => {
    setOpenDescriptionDialog(false);
    setSelectedJobDescription("");
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onCellRender = (row, header) => {
    if (header === "submitCandidate") {
      return (
        <Link
          to="#"
          onClick={() => handleOpenSubmitDialog(row["jobId"])} // Open Submit Dialog
          style={{
            color: "blue",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px", // Adjust spacing between text and icon
          }}
        >
          {row[header]}
          <UploadIcon fontSize="small" />
        </Link>
      );
    }

    if (header === "jobDescription") {
      const description = row[header];
      return description.length > 10 ? (
        <>
          {description.slice(0, 10)}...{" "}
          <Button
            onClick={() => handleOpenDescriptionDialog(description)}
            size="small"
            variant="text"
            sx={{
              color: "#3f51b5",
              textTransform: "capitalize",
              padding: 0,
              minWidth: "auto",
            }}
          >
            View More
          </Button>
        </>
      ) : (
        description
      );
    }

    if (header === "requirementAddedTimeStamp") {
      return new Date(row[header]).toLocaleString();
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
  if (fetchStatus === "loading") {
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
      <Grid item xs={10} md={8}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            //width: { xs: "100%", sm: "90%", md: "165vh" }, // Responsive width
            width: "calc(165vh - 5vh)", // Dynamically calculated maxWidth
            mb: 2,
            px: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            variant="h5"
            align="start"
            color="primary"
            gutterBottom
            sx={{
              backgroundColor: "rgba(232, 245, 233)",
              padding: 1,
              borderRadius: 1,
              width: "165vh", // Ensures the Typography matches the container width
              textAlign: "start", // Optional: Center-align the text
            }}
          >
            Assigned Requirements
          </Typography>
          <ReusableTable
            data={data}
            headers={headers}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onCellRender={onCellRender}
          />
        </Box>
      </Grid>

      {/* Dialog for Submit Candidate */}
      <Dialog
        open={openSubmitDialog}
        onClose={handleCloseSubmitDialog}
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
            Candidate Submission Form
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseSubmitDialog}
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
          <CandidateSubmissionForm
            jobId={selectedJobForSubmit}
            userId={user}
            userEmail={employeeEmail} // Dynamically fetched email
          />
        </DialogContent>
      </Dialog>
      {/* Submit Candidate Dialog */}
      {/* <CustomDialog
        open={openSubmitDialog}
        onClose={handleCloseSubmitDialog}
        title="Candidate Submission Form"
        content={
          <CandidateSubmissionForm
            jobId={selectedJobForSubmit}
            userId={user}
            userEmail={employeeEmail}
          />
        }
      /> */}

      {/* Dialog for Job Description */}
      <Dialog
        open={openDescriptionDialog}
        onClose={handleCloseDescriptionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" align="center" color="primary">
            Job Description
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: "300px", overflowY: "auto" }}>
          <Typography>{selectedJobDescription}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDescriptionDialog}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Job Description Dialog */}
      {/* <CustomDialog
        open={openDescriptionDialog}
        onClose={handleCloseDescriptionDialog}
        title="Job Description"
        content={<Typography>{selectedJobDescription}</Typography>}
      /> */}
    </>
  );
};

export default Assigned;
