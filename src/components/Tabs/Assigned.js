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
  Button,
  DialogActions,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import CandidateSubmissionForm from "../CandidateSubmissionFrom";
import CustomDialog from "../MuiComponents/CustomDialog";

import DataTable from "../MuiComponents/DataTable";

const appconfig = require("../../redux/apiConfig");

const BASE_URL = appconfig.PROD_appconfig.PROD_BASE_URL;

const Assigned = () => {
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

  const { user } = useSelector((state) => state.auth);
  const userId = user;

  // Function to generate column headers from data
  const generateColumns = (data) => {
    if (data.length === 0) return [];

    const sampleData = data[0];
    const headerLabels = {
      jobId: "Job ID",
      jobTitle: "Job Title",
      jobDescription: "Job Description",
      requirementAddedTimeStamp: "Added Time",
      submitCandidate: "Submit Candidate",
      companyName: "Company Name",
      location: "Location",
      experience: "Experience",
      primarySkills: "Primary Skills",
      secondarySkills: "Secondary Skills",
    };

    return Object.keys(sampleData).map((key) => ({
      key: key,
      label:
        headerLabels[key] ||
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
    }));
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setFetchStatus("loading");
      try {
        const response = await axios.get(`${appconfig.PROD_appconfig.PROD_BASE_URL}/users/employee`);
        setEmployeesList(response.data);
        setFetchStatus("succeeded");
      } catch (error) {
        setFetchStatus("failed");
        setFetchError(error.message);
        console.error("Failed to fetch employees:", error.message);
      }
    };

    if (fetchStatus === "idle") {
      fetchEmployees();
    }
  }, []);

  const getEmployeeEmail = (userId, employeesList) => {
    const employee = employeesList.find((emp) => emp.employeeId === userId);
    return employee ? employee.email : null;
  };

  const employeeEmail = getEmployeeEmail(userId, employeesList);

  useEffect(() => {
    if (!userId) return;

    const fetchUserSpecificData = async () => {
      try {
        const response = await axios.get(
          `${appconfig.PROD_appconfig.PROD_BASE_URL}/requirements/recruiter/${userId}`
        );
        const userData = response.data || [];
        setTotalCount(response.data.totalCount || userData.length || 0);

        const processedData = userData.map((item) => {
          const processedItem = {
            ...item,
            jobDescription: (
              <Box>
                {item.jobDescription.length > 30
                  ? `${item.jobDescription.slice(0, 30)}...`
                  : item.jobDescription}
                {item.jobDescription.length > 30 && (
                  <Button
                    onClick={() => handleOpenDescriptionDialog(item.jobDescription, item.jobTitle)}
                    size="small"
                    variant="text"
                    sx={{
                      color: "#3f51b5",
                      textTransform: "capitalize",
                      padding: 0,
                      minWidth: "auto",
                      ml: 1
                    }}
                  >
                    View More
                  </Button>
                )}
              </Box>
            ),
            requirementAddedTimeStamp: new Date(
              item.requirementAddedTimeStamp
            ).toLocaleString(),
            submitCandidate: (
              <Link
                to="#"
                onClick={() => handleOpenSubmitDialog(item.jobId)}
                style={{
                  color: "blue",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Submit Candidate
                <UploadIcon fontSize="small" />
              </Link>
            ),
          };
          return processedItem;
        });

        setData(processedData);

        if (processedData.length > 0) {
          const generatedColumns = generateColumns(processedData);
          setColumns(generatedColumns);
        }
      } catch (err) {
        console.error("Failed to fetch user-specific data", err);
      }
    };

    fetchUserSpecificData();
  }, [userId]);

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

  if (!userId || fetchStatus === "loading") {
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
      <Grid item xs={10} md={8} sx={{marginTop:'2vh'}}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            width: "calc(165vh - 5vh)",
            mb: 2,
            px: { xs: 1, sm: 2 },
            maxHeight: "calc(100vh - 150px)",
            overflowY: "auto",
            overflowX: "auto",
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
              width: "165vh",
              textAlign: "start",
            }}
          >
            Assigned Requirements
          </Typography>
          {/* Conditional check for empty data */}
        {data.length === 0 ? (
          <Typography variant="h6" color="textSecondary">
            No assigned jobs available.
          </Typography>
        ) : (
          <DataTable
            data={data}
            columns={columns}
            pageLimit={5}
            sx={{
              maxHeight: "400px",
              overflowY: "auto",
              overflowX: "auto",
            }}
          />
        )}
        </Box>
      </Grid>

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
            userEmail={employeeEmail}
          />
        </DialogContent>
      </Dialog>

      <CustomDialog
        open={openDescriptionDialog}
        onClose={handleCloseDescriptionDialog}
        title={currentJobTitle}
        content={selectedJobDescription}
      />
    </>
  );
};

export default Assigned;