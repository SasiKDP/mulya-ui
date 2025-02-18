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
  TextField,
  Snackbar,
  Alert,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InterviewForm from "../InterviewForm";
import DataTable from "../MuiComponents/DataTable";
import { Tooltip } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import SectionHeader from "../MuiComponents/SectionHeader";
import BASE_URL from "../../redux/config";



const Submissions = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [openInterviewDialog, setOpenInterviewDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [currentResume, setCurrentResume] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const userId = user;

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
      Actions: "Actions",
    };

    return Object.keys(sampleData).map((key) => ({
      key: key,
      label:
        headerLabels[key] ||
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
    }));
  };

  const fetchCurrentResume = async (candidateId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/candidate/download-resume/${candidateId}`,
        {
          responseType: "blob",
          headers: { "Content-Type": "application/json" },
        }
      );

      const fileName = response.headers["content-disposition"]
        ? response.headers["content-disposition"].split("filename=")[1]
        : "resume.pdf";

      const file = new File([response.data], fileName, {
        type: response.data.type,
      });

      setCurrentResume(file);
      return file;
    } catch (error) {
      console.error("Error fetching resume:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch current resume",
        severity: "error",
      });
      return null;
    }
  };

  const downloadResume = async (candidateId) => {
    try {
      setLoading(true);
      const resumeUrl = `${BASE_URL}/candidate/download-resume/${candidateId}`;

      console.log("Downloading Resume from:", resumeUrl);

      const response = await axios.get(resumeUrl, {
        responseType: "blob",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.data) {
        throw new Error("No file received from the server.");
      }

      // Get the file extension from the response content-type
      const contentType = response.headers["content-type"];
      const extension =
        contentType === "application/pdf"
          ? ".pdf"
          : contentType === "application/msword"
          ? ".doc"
          : contentType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ? ".docx"
          : ".pdf"; // default to .pdf if content-type is not recognized

      // Create filename using candidateId
      const filename = `${candidateId}${extension}`;

      const blob = new Blob([response.data], { type: response.data.type });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading resume:", error);
      setSnackbar({
        open: true,
        message: "Failed to download resume. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/candidate/submissions/${userId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Fetched Candidate Data:", response.data); // 🔍 Debugging step

      const userData = response.data || [];

      const processedData = userData.map((item) => ({
        ...item,
        resumeFilePath: item.candidateId ? (
          <a
            href={`${BASE_URL}/candidate/download-resume/${item.candidateId}`}
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
        ) : (
          <Typography variant="body2" color="error">
            No Resume Available
          </Typography>
        ),
        Interview: (
          <Link
            to="#"
            onClick={() => handleOpenInterviewDialog(item)}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Schedule Interview
          </Link>
        ),
        Actions: (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() => handleEditCandidate(item)}
                sx={{
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#1B3A8C1A" },
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => handleDeleteClick(item)}
                sx={{
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#B71C1C1A" },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      }));

      setData(processedData);
      if (processedData.length > 0) {
        setColumns(generateColumns(processedData));
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch candidates. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSubmissionData();
    }
  }, [userId]);

  const handleOpenInterviewDialog = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenInterviewDialog(true);
  };

  const handleCloseInterviewDialog = () => {
    setOpenInterviewDialog(false);
    setSelectedCandidate(null);
  };

  const handleEditCandidate = async (candidate) => {
    setEditingCandidate(candidate);
    const resumeFile = await fetchCurrentResume(candidate.candidateId);
    if (resumeFile) {
      setEditingCandidate((prev) => ({
        ...prev,
        resumeFile: resumeFile,
        resumeFileName: resumeFile.name,
      }));
    }
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingCandidate(null);
    setFormErrors({});
    setCurrentResume(null);
  };

  const handleDeleteClick = (candidate) => {
    setCandidateToDelete(candidate);
    setDeleteDialogOpen(true);
  };

  const updateCandidate = async () => {
    try {
      setLoading(true);
      const { candidateId, resumeFile, ...otherFields } = editingCandidate;

      const formData = new FormData();

      const numericFields = {
        totalExperience: parseFloat(otherFields.totalExperience),
        relevantExperience: parseFloat(otherFields.relevantExperience),
        requiredTechnologiesRating: parseFloat(
          otherFields.requiredTechnologiesRating
        ),
      };

      Object.entries(numericFields).forEach(([key, value]) => {
        if (!isNaN(value)) {
          formData.append(key, value);
        }
      });

      Object.entries(otherFields).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          !Object.keys(numericFields).includes(key)
        ) {
          formData.append(key, value.toString());
        }
      });

      if (resumeFile instanceof File) {
        formData.append("resumeFile", resumeFile);
      }

      const response = await axios.put(
        `${BASE_URL}/candidate/candidatesubmissions/${candidateId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { message, payload } = response.data;

      const successMessage = `${message}
      Candidate ID: ${payload?.candidateId}
      Employee ID: ${payload?.employeeId}
      Job ID: ${payload?.jobId}`;

      setSnackbar({
        open: true,
        message: successMessage,
        severity: "success",
      });

      handleCloseEditDialog();
      fetchSubmissionData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to update candidate: ${
          error.response?.data?.message || "Please try again"
        }`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCandidate = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${BASE_URL}/candidate/deletecandidate/${candidateToDelete.candidateId}`
      );
      setSnackbar({
        open: true,
        message: "Candidate deleted successfully!",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      fetchSubmissionData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete candidate. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
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
      <SectionHeader
        title="Candidate Submissions"
        totalCount={data.length}
        onRefresh={fetchSubmissionData}
        isRefreshing={loading}
        icon={<GroupsIcon sx={{ color: "#1B5E20" }} />}
      />

      <Box
        sx={{
          width: "100%",
          overflow: "auto",
          overflowX: "auto",
          maxHeight: 600,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable data={data} columns={columns} pageLimit={5} />
        )}
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Candidate
          <IconButton
            aria-label="close"
            onClick={handleCloseEditDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editingCandidate && (
            <Box
              component="form"
              sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}
            >
              {Object.entries(editingCandidate).map(([key, value]) => {
                if (key === "resumeFilePath" || key === "resumeFile")
                  return null;

                return (
                  <Box key={key} sx={{ width: "48%" }}>
                    {key === "interviewStatus" ? (
                      <FormControl fullWidth margin="dense">
                        <InputLabel>Interview Status</InputLabel>
                        <Select
                          value={value || ""}
                          onChange={(e) =>
                            setEditingCandidate({
                              ...editingCandidate,
                              [key]: e.target.value,
                            })
                          }
                        >
                          <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                          <MenuItem value="COMPLETED">Completed</MenuItem>
                          <MenuItem value="PENDING">Pending</MenuItem>
                          <MenuItem value="CANCELLED">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        fullWidth
                        label={key.replace(/([A-Z])/g, " $1").trim()}
                        value={value || ""}
                        onChange={(e) =>
                          setEditingCandidate({
                            ...editingCandidate,
                            [key]: e.target.value,
                          })
                        }
                        margin="dense"
                        disabled={[
                          "candidateId",
                          "jobId",
                          "userId",
                          "userEmail",
                        ].includes(key)}
                      />
                    )}
                  </Box>
                );
              })}

              {/* Resume Upload Section */}
              <Box sx={{ width: "100%", mt: 2 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    border: "1px dashed",
                    borderColor: "primary.main",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Resume
                  </Typography>

                  {/* Current Resume Display */}
                  {editingCandidate.resumeFile && (
                    <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                      <AttachFileIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Current: {editingCandidate.resumeFileName}
                      </Typography>
                    </Box>
                  )}

                  {/* File Upload Input with Styled Button */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<AttachFileIcon />}
                    >
                      Upload New Resume
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          setEditingCandidate({
                            ...editingCandidate,
                            resumeFile: e.target.files[0],
                            resumeFileName: e.target.files[0]?.name || "",
                          })
                        }
                      />
                    </Button>
                    {editingCandidate.resumeFile && (
                      <Typography variant="body2" color="text.secondary">
                        Selected: {editingCandidate.resumeFileName}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseEditDialog}
            variant="outlined"
            color="primary"
            startIcon={<CloseIcon />}
          >
            Discard Changes
          </Button>

          <Button
            onClick={updateCandidate}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update Candidate"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {candidateToDelete?.fullName}'s
            submission? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={deleteCandidate}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Interview Dialog */}
      <Dialog
        open={openInterviewDialog}
        onClose={handleCloseInterviewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" color="primary" gutterBottom>
            Schedule Interview
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseInterviewDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
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
            onSuccess={() => {
              handleCloseInterviewDialog();
              fetchSubmissionData();
              setSnackbar({
                open: true,
                message: "Interview scheduled successfully!",
                severity: "success",
              });
            }}
            onError={(error) => {
              setSnackbar({
                open: true,
                message:
                  error || "Failed to schedule interview. Please try again.",
                severity: "error",
              });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Global Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Loading Backdrop */}
      <Dialog
        open={loading}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <CircularProgress />
      </Dialog>
    </>
  );
};

export default Submissions;