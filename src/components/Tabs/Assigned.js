import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Grid,
  Card,
  CardContent,
  Fade,
  Alert,
  AlertTitle,
  Skeleton,
  Paper,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  Upload as UploadIcon,
  Description as DescriptionIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import CandidateSubmissionForm from "../CandidateSubmissionFrom";
import CustomDialog from "../MuiComponents/CustomDialog";
import DataTable from "../MuiComponents/DataTable";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SectionHeader from "../MuiComponents/SectionHeader";
import BASE_URL from "../../redux/config";

const Assigned = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [selectedJobForSubmit, setSelectedJobForSubmit] = useState(null);
  const [openDescriptionDialog, setOpenDescriptionDialog] = useState(false);
  const [selectedJobDescription, setSelectedJobDescription] = useState("");
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [employeesList, setEmployeesList] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [fetchError, setFetchError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  

  const { user } = useSelector((state) => state.auth);
  const userId = user;

  const generateColumns = (data) => {
    if (data.length === 0) return [];

    const headerLabels = {
      jobId: "Job ID",
      jobTitle: "Job Title",
      jobDescription: "Job Description",
      requirementAddedTimeStamp: "Posted Date",
      submitCandidate: "Actions",
      companyName: "Company",
      location: "Location",
      experience: "Experience",
      primarySkills: "Primary Skills",
      secondarySkills: "Secondary Skills",
      salaryPackage: "Salary Package",
    };

    return Object.keys(data[0]).map((key) => ({
      key,
      label:
        headerLabels[key] ||
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
    }));
  };

  const fetchUserSpecificData = async () => {
    setIsRefreshing(true);
    setFetchStatus("loading");
    try {
      const response = await axios.get(
        `${BASE_URL}/requirements/recruiter/${userId}`
      );
      const userData = response.data || [];
      setTotalCount(response.data.totalCount || userData.length || 0);

      const processedData = userData.map((item) => ({
        ...item,
        jobDescription: (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography noWrap sx={{ maxWidth: 250 }}>
              {item.jobDescription.slice(0, 15)}
              {item.jobDescription.length > 15 && "..."}
            </Typography>
            {item.jobDescription.length > 15 && (
              <Tooltip title="View Full Description">
                <Button
                  onClick={() =>
                    handleOpenDescriptionDialog(item.jobDescription, item.jobTitle)
                  }
                  size="small"
                  startIcon={<DescriptionIcon />}
                  sx={{ minWidth: 0 }}
                >
                  View
                </Button>
              </Tooltip>
            )}
          </Box>
        ),
        requirementAddedTimeStamp: new Date(
          item.requirementAddedTimeStamp
        ).toLocaleString(),
        salaryPackage: item.salaryPackage ? `${item.salaryPackage} LPA` : "N/A",
        submitCandidate: (
          <Tooltip title="Submit Candidate">
            <Button
              onClick={() => handleOpenSubmitDialog(item.jobId)}
              startIcon={<UploadIcon />}
              variant="contained"
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Submit
            </Button>
          </Tooltip>
        ),
      }));

      setData(processedData);
      if (processedData.length > 0) {
        setColumns(generateColumns(processedData));
      }
      setFetchStatus("succeeded");
    } catch (err) {
      setFetchStatus("failed");
      setFetchError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

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
      }
    };

    if (fetchStatus === "idle") {
      fetchEmployees();
    }
  }, [fetchStatus]);

  const getEmployeeEmail = (userId, employeesList) => {
    const employee = employeesList.find((emp) => emp.employeeId === userId);
    return employee ? employee.email : null;
  };

  const employeeEmail = getEmployeeEmail(userId, employeesList);

  useEffect(() => {
    if (!userId) return;
    fetchUserSpecificData();
  }, [userId]);

  const handleRefresh = () => {
    fetchUserSpecificData();
  };

  const handleOpenSubmitDialog = (job) => {
    setSelectedJobForSubmit(job);
    setOpenSubmitDialog(true);
  };

  const handleCloseSubmitDialog = () => {
    setOpenSubmitDialog(false);
    setSelectedJobForSubmit(null);
  };

  const handleOpenDescriptionDialog = (description, jobTitle) => {
    setSelectedJobDescription(description);
    setCurrentJobTitle(jobTitle);
    setOpenDescriptionDialog(true);
  };

  const handleCloseDescriptionDialog = () => {
    setOpenDescriptionDialog(false);
    setSelectedJobDescription("");
    setCurrentJobTitle("");
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
        <Alert severity="error" sx={{ width: "400px" }}>
          <AlertTitle>Authentication Error</AlertTitle>
          User ID not found. Please log in again.
        </Alert>
      </Box>
    );
  }

  if (fetchStatus === "loading" && !isRefreshing) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton
          variant="rectangular"
          height={48}
          sx={{ mb: 2, borderRadius: 1 }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={60}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (fetchStatus === "failed") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Alert
          severity="error"
          sx={{ width: "400px" }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              RETRY
            </Button>
          }
        >
          <AlertTitle>Error</AlertTitle>
          {fetchError || "Failed to load data. Please try again."}
        </Alert>
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}>
          <SectionHeader
            title="Assigned Requirements"
            totalCount={totalCount}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            icon={<ListAltIcon sx={{ color: "#FFF" }} />}
          />

          <Box sx={{ p: 2 }}>
            <Box sx={{ position: "relative" }}>
              {isRefreshing && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(255, 255, 255, 0.7)",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              <DataTable
                data={data}
                columns={columns}
                pageLimit={5}
                noDataMessage={
                  <Box sx={{ py: 4, textAlign: "center" }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Records Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No requirements have been assigned yet.
                    </Typography>
                  </Box>
                }
                sx={{
                  "& .MuiDataGrid-root": {
                    border: "none",
                    borderRadius: 2,
                    overflow: "hidden",
                  },
                }}
              />
            </Box>
          </Box>
        </Paper>

        <Dialog
          open={openSubmitDialog}
          onClose={handleCloseSubmitDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: "rgba(232, 245, 233)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
            >
              Submit Candidate
            </Typography>
            <IconButton onClick={handleCloseSubmitDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <CandidateSubmissionForm
              jobId={selectedJobForSubmit}
              userId={user}
              userEmail={employeeEmail}
              closeDialog={handleCloseSubmitDialog}
            />
          </DialogContent>
        </Dialog>

        <CustomDialog
          open={openDescriptionDialog}
          onClose={handleCloseDescriptionDialog}
          title={currentJobTitle}
          content={selectedJobDescription}
        />
      </Box>
    </Fade>
  );
};

export default Assigned;