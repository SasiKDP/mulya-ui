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
  TextField,
  Snackbar,
  Alert,
  DialogActions,
  Container,
  ButtonGroup,
  Tooltip,
  MenuItem,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../MuiComponents/DataTable";
import BASE_URL from "../../redux/config";



const INTERVIEW_LEVELS = {
  ALL: "all",
  INTERNAL: "Internal",
  EXTERNAL: "External",
};

const Interview = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterLevel, setFilterLevel] = useState(INTERVIEW_LEVELS.ALL);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { user } = useSelector((state) => state.auth);
  const userId = user;

  const generateColumns = (data) => {
    if (data.length === 0) return [];
  
    const headerLabels = {
      candidateId: "Candidate ID",
      candidateFullName: "Full Name",
      candidateContactNo: "Contact Number",
      candidateEmailId: "Candidate Email",
      userEmail: "Recruiter Email",
      interviewDateTime: "Interview Time",
      duration: "Duration",
      zoomLink: "Meeting Link",
      interviewScheduledTimestamp: "Scheduled On",
      clientEmail: "Client Email",
      clientName: "Client Name",
      interviewLevel: "Interview Level",
      interviewStatus: "Interview Status",
      actions: "Actions",
    };
  
    // Define which columns should have filters (select or text)
    const filterableColumns = {
      candidateFullName: "text",
      candidateEmailId: "text",
      candidateContactNo: "text",
      interviewDateTime: "text",
      duration: "text",
      interviewLevel: "select",
      interviewStatus: "select",
      candidateId:'select',
      interviewDateTime:'select'
    };
  
    // Define manual column order
    const columnOrder = [
      "candidateId",
      "candidateFullName",
      "candidateEmailId",
      "candidateContactNo",
      "userEmail",
      "clientEmail",
      "clientName",
      "interviewLevel",
      "interviewDateTime",
      "duration",
      "zoomLink",
      "interviewScheduledTimestamp",
      "interviewStatus",
      "actions",
    ];
  
    return columnOrder
      .filter((key) => data[0].hasOwnProperty(key)) // Ensure key exists in the data
      .map((key) => ({
        key: key,
        label: headerLabels[key] || key.replace(/([A-Z])/g, " $1").trim(),
        ...(filterableColumns[key] ? { type: filterableColumns[key] } : {}), // Apply type only if defined
      }));
  };
  

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    try {
      return new Date(dateTime).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
    } catch (error) {
      return "";
    }
  };

  const fetchInterviewDetails = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/candidate/interviews/${userId}`
      );
      const interviewData = response.data || [];

      const scheduledInterviews = interviewData.filter(
        (interview) => interview.interviewStatus.toUpperCase() === "SCHEDULED"
      );

      const processedData = scheduledInterviews.map((interview) => ({
        ...interview,
        interviewDateTime: formatDateTime(interview.interviewDateTime),
        interviewScheduledTimestamp: formatDateTime(
          interview.interviewScheduledTimestamp
        ),
        duration: interview.duration ? `${interview.duration} minutes` : "",
        zoomLink: interview.zoomLink ? (
          <Button
            variant="contained"
            size="small"
            href={interview.zoomLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textTransform: "none",
              minWidth: "100px",
              fontSize: "0.875rem",
            }}
          >
            Join Meeting
          </Button>
        ) : (
          ""
        ),
        Actions: (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() => handleEditInterview(interview)}
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
                onClick={() => handleDeleteClick(interview)}
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
        const generatedColumns = generateColumns(processedData);
        setColumns(generatedColumns);
      }
      applyFilter(processedData, filterLevel);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch interview details. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewDetails();
  }, [userId]);

  const handleEditInterview = (interview) => {
    setEditingInterview(interview);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (interview) => {
    setInterviewToDelete(interview);
    setDeleteDialogOpen(true);
  };

  const updateInterview = async () => {
    if (!editingInterview || !userId) return;

    const payload = {
      interviewDateTime: editingInterview.interviewDateTime,
      duration: editingInterview.duration,
      zoomLink: editingInterview.zoomLink,
      userId: userId,
      candidateId: editingInterview.candidateId,
      jobId: editingInterview.jobId,
      clientName: editingInterview.clientName,
      fullName: editingInterview.fullName,
      contactNumber: editingInterview.contactNumber,
      userEmail: editingInterview.userEmail,
      interviewLevel: editingInterview.interviewLevel,
      clientEmail: editingInterview.clientEmail,
    };

    try {
      setLoading(true);
      await axios.put(
        `${BASE_URL}/candidate/interview-update/${userId}/${editingInterview.candidateId}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSnackbar({
        open: true,
        message: "Interview updated successfully!",
        severity: "success",
      });
      setEditDialogOpen(false);
      fetchInterviewDetails();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update interview. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteInterview = async () => {
    if (!interviewToDelete || !interviewToDelete.candidateId) return;

    try {
      setLoading(true);
      await axios.delete(
        `${BASE_URL}/candidate/deleteinterview/${interviewToDelete.candidateId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSnackbar({
        open: true,
        message: "Interview deleted successfully!",
        severity: "success",
      });

      setDeleteDialogOpen(false);
      fetchInterviewDetails();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete interview. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (interviews, level) => {
    let filtered =
      level === INTERVIEW_LEVELS.ALL
        ? interviews
        : interviews.filter((interview) => interview.interviewLevel === level);
    setFilteredData(filtered);
  };

  const handleFilterChange = (level) => {
    setFilterLevel(level);
    applyFilter(data, level);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(232, 245, 233)",
            padding: 2,
            borderRadius: "4px 4px 0 0",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 600, color: "#333" }}
          >
            Interview Schedule
            {data.length > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "inline", ml: 1 }}
              >
                [scheduled interviews {filteredData.length}{" "}
                {filterLevel !== "all" ? filterLevel : ""}]
              </Typography>
            )}
          </Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          <ButtonGroup
            variant="outlined"
            sx={{
              mb: 3,
              "& .MuiButton-root": {
                minWidth: "110px",
                textTransform: "none",
                borderColor: "#004d40",
                color: "#004d40",
                "&.active": {
                  backgroundColor: "#004d40",
                  color: "#fff",
                },
              },
            }}
          >
            {Object.entries(INTERVIEW_LEVELS).map(([key, value]) => (
              <Button
                key={key}
                className={filterLevel === value ? "active" : ""}
                onClick={() => handleFilterChange(value)}
              >
                {key === "ALL" ? "All" : value}
              </Button>
            ))}
          </ButtonGroup>

          <DataTable data={filteredData} columns={columns} pageLimit={5} />
        </Box>
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Interview
          <IconButton
            onClick={() => setEditDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editingInterview && (
            <Box sx={{ flexGrow: 1, mt: 2 }}>
              <Grid container spacing={2}>
                {Object.entries(editingInterview).map(([key, value]) => {
                  if (
                    ![
                      "Actions",
                      "id",
                      "interviewDateTime",
                      "externalInterviewDetails",
                    ].includes(key)
                  ) {
                    return (
                      <Grid item xs={12} sm={6} key={key}>
                        {/* Dropdown for interviewLevel */}
                        {key === "interviewLevel" ? (
                          <TextField
                            select
                            label="Interview Level"
                            value={value || editingInterview.interviewLevel}
                            onChange={(e) =>
                              setEditingInterview({
                                ...editingInterview,
                                [key]: e.target.value,
                              })
                            }
                            fullWidth
                          >
                            <MenuItem value="INTERNAL">INTERNAL</MenuItem>
                            <MenuItem value="EXTERNAL">EXTERNAL</MenuItem>
                          </TextField>
                        ) : (
                          <TextField
                            label={key.replace(/([A-Z])/g, " $1").trim()}
                            value={value || ""}
                            onChange={(e) =>
                              setEditingInterview({
                                ...editingInterview,
                                [key]: e.target.value,
                              })
                            }
                            fullWidth
                            disabled={[
                              "jobId",
                              "candidateId",
                              "userId",
                              "interviewScheduledTimestamp",
                            ].includes(key)}
                          />
                        )}
                      </Grid>
                    );
                  }
                  return null;
                })}

                {/* Ensure interviewDateTime appears immediately after interviewScheduledTimestamp */}
                {editingInterview.interviewScheduledTimestamp && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      key="interviewDateTime"
                      label="Interview Date & Time"
                      type="datetime-local"
                      value={
                        editingInterview.interviewDateTime
                          ? new Date(editingInterview.interviewDateTime)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);

                        // Get dynamic timezone offset
                        const timezoneOffset = selectedDate.getTimezoneOffset();
                        const offsetHours = Math.abs(
                          Math.floor(timezoneOffset / 60)
                        )
                          .toString()
                          .padStart(2, "0");
                        const offsetMinutes = Math.abs(timezoneOffset % 60)
                          .toString()
                          .padStart(2, "0");
                        const offsetSign = timezoneOffset > 0 ? "-" : "+";

                        const formattedDateTime = `${selectedDate.getFullYear()}-${(
                          selectedDate.getMonth() + 1
                        )
                          .toString()
                          .padStart(2, "0")}-${selectedDate
                          .getDate()
                          .toString()
                          .padStart(2, "0")}T${selectedDate
                          .getHours()
                          .toString()
                          .padStart(2, "0")}:${selectedDate
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}:${selectedDate
                          .getSeconds()
                          .toString()
                          .padStart(
                            2,
                            "0"
                          )}${offsetSign}${offsetHours}:${offsetMinutes}`;

                        setEditingInterview({
                          ...editingInterview,
                          interviewDateTime: formattedDateTime,
                        });
                      }}
                      fullWidth
                    />
                  </Grid>
                )}

                {/* Show External Interview Details when interviewLevel is EXTERNAL */}
                {editingInterview.interviewLevel === "EXTERNAL" && (
                  <Grid item xs={12}>
                    <TextField
                      key="externalInterviewDetails"
                      label="External Interview Details"
                      multiline
                      rows={3}
                      value={editingInterview.externalInterviewDetails || ""}
                      onChange={(e) =>
                        setEditingInterview({
                          ...editingInterview,
                          externalInterviewDetails: e.target.value,
                        })
                      }
                      fullWidth
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={updateInterview} variant="contained" color="primary">
          Reschedule Interview
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Confirm Delete
          <IconButton
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to delete this interview? This action cannot
            be undone.
          </Typography>
          {interviewToDelete && (
            <Box
              sx={{ mt: 2, backgroundColor: "grey.100", p: 2, borderRadius: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Candidate: {interviewToDelete.candidateName}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={deleteInterview}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete Interview
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Interview;
