import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Button,
  Chip,
  Link,
  Tooltip,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  TextField
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VideoCall as VideoCallIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import DataTable from "../muiComponents/DataTabel";
import httpService from "../../Services/httpService";
import ToastService from "../../Services/toastService";
import { useSelector, useDispatch } from "react-redux";
import DateRangeFilter from "../muiComponents/DateRangeFilter";
import { getStatusChip, getInterviewLevelChip } from "../../utils/statusUtils";
import ConfirmDialog from "../muiComponents/ConfirmDialog";
import EditInterviewForm from "./EditInterviewForm";
import ReusableExpandedContent from "../muiComponents/ReusableExpandedContent";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../utils/dateformate";
import CloseIcon from '@mui/icons-material/Close';
import MoveToBench from "./MoveToBench";
import DownloadResume from "../../utils/DownloadResume";
import { API_BASE_URL } from "../../Services/httpService";
import { showToast } from "../../utils/ToastNotification";
import InternalFeedbackCell from "./FeedBack";

const processInterviewData = (interviews) => {
  if (!Array.isArray(interviews)) return [];

  return interviews.map((interview) => ({
    ...interview,
    interviewId: interview.interviewId || `${interview.candidateId}_${interview.jobId}`,
    interviewStatus: interview.latestInterviewStatus,
  }));
};

const RecruiterInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    interview: null,
  });
  const [editDrawer, setEditDrawer] = useState({
    open: false,
    data: null,
  });
  const [jobDetailsDialog, setJobDetailsDialog] = useState({
    open: false,
    job: null,
    loading: false,
  });
  const [moveToBenchLoading, setMoveToBenchLoading] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState({
    open: false,
    interview: null,
  });
  const [feedback, setFeedback] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const dispatch = useDispatch();
  const { userId, role } = useSelector((state) => state.auth);
  const { isFilteredDataRequested } = useSelector((state) => state.bench);
  const { filterInterviewsForRecruiter } = useSelector(
    (state) => state.interview
  );
  const navigate = useNavigate();

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      if(role=="COORDINATOR"){
      const response = await httpService.get(
        `/candidate/interviews/interviewsByUserId/${userId}?coordinator=true`
      );
      const processedData = processInterviewData(response.data || []);
      setInterviews(processedData);
      setError(null);
    }
    else{
      const response= await httpService.get(`/candidate/interviews/interviewsByUserId/${userId}`)
      const processedData = processInterviewData(response.data || []);
      setInterviews(processedData);
      setError(null);
    }
    } catch (err) {
      setError("Failed to fetch interview data");
      console.error("Error fetching interviews:", err);
      ToastService.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFeedbackDialog = (interview) => {
    setFeedbackDialog({
      open: true,
      interview: interview
    });
    setFeedback(interview.internalFeedback || "");
  };

  const handleCloseFeedbackDialog = () => {
    setFeedbackDialog({
      open: false,
      interview: null
    });
    setFeedback("");
    setIsSubmittingFeedback(false);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      showToast("Feedback cannot be empty", "error");
      return;
    }

    setIsSubmittingFeedback(true);
    
    try {
      const { interview } = feedbackDialog;
      if (!interview || !interview.interviewId) {
        throw new Error('Missing interview data');
      }

      const response = await httpService.put(
        `/candidate/updateInterviewByCoordinator/${userId}/${interview.interviewId}`,{internalFeedBack: feedback});

      if (response.data.success) {
        showToast('Feedback submitted successfully!', 'success');
        handleCloseFeedbackDialog();
        fetchInterviews(); // Refresh the data
      } else {
        throw new Error(response.data.message || 'Failed to submit feedback');
      }
      return response.data
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showToast(error.message || 'Error submitting feedback', 'error');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleBenchSuccess = (row) => {
    setInterviews(prevInterviews => 
      prevInterviews.filter(item => item.interviewId !== row.interviewId)
    );
  };

  const handleJobIdClick = (jobId) => {
    console.log("Job ID clicked:", jobId);
    ToastService.info(`Viewing details for Job ID: ${jobId}`);
    navigate(`/dashboard/requirements/job-details/${jobId}`);
  };

  const handleEdit = (interview, isReschedule = false) => {
    setEditDrawer({
      open: true,
      data: {
        ...interview,
        isReschedule,
        userId: interview.userId || userId,
      },
    });
  };

  const handleCloseEditDrawer = () => {
    setEditDrawer({
      open: false,
      data: null,
    });
  };

  const handleInterviewUpdated = () => {
    fetchInterviews();
    handleCloseEditDrawer();
  };

  const handleDelete = async (row) => {
    setConfirmDialog({ open: true, interview: row });
  };

  const handleConfirmDelete = async () => {
    const interview = confirmDialog.interview;
    if (!interview) return;

    try {
      const toastId = ToastService.loading("Deleting interview...");

      let deleteEndpoint;
      if (interview.candidateId && interview.jobId) {
        deleteEndpoint = `/candidate/deleteinterview/${interview.candidateId}/${interview.jobId}`;
      } else {
        deleteEndpoint = `/interview/${interview.interviewId}`;
      }

      await httpService.delete(deleteEndpoint);
      await fetchInterviews();
      ToastService.update(toastId, "Interview deleted successfully", "success");
    } catch (error) {
      ToastService.error("Failed to delete interview");
      console.error("Error deleting interview:", error);
    } finally {
      setConfirmDialog({ open: false, interview: null });
    }
  };

  const toggleRowExpansion = (interviewId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [interviewId]: !prev[interviewId],
    }));
  };

const getExpandedContentConfig = (row) => {
  const baseConfig = {
    title: "Interview Details",
    description: {
      key: "notes",
      fallback: "No additional notes available.",
    },
    backgroundColor: "#f5f5f5",
    sections: [],
    actions: []
  };

  if (role !== "COORDINATOR") {
    return {
      ...baseConfig,
      sections: [
        {
          title: "Candidate Information",
          fields: [
            { label: "Name", key: "candidateFullName", fallback: "-" },
            { label: "Email", key: "candidateEmailId", fallback: "-" },
            { label: "Contact", key: "candidateContactNo", fallback: "-" },
          ],
        },
        {
          title: "Schedule Details",
          fields: [
            {
              label: "Interview Date & Time",
              key: "interviewDateTime",
              fallback: "-",
              format: (value) => formatDateTime(value),
            },
            { label: "Duration", key: "duration", fallback: "-" },
            { label: "Level", key: "interviewLevel", fallback: "-" },
            { label: "Status", key: "latestInterviewStatus", fallback: "-" },
          ],
        },
        {
          title: "Job Information",
          fields: [
            { label: "Job ID", key: "jobId", fallback: "-" },
            { label: "Client", key: "clientName", fallback: "-" },
            { label: "Scheduled By", key: "userEmail", fallback: "-" },
          ],
        },
      ],
      actions: [
        {
          label: "Edit Interview",
          icon: <EditIcon fontSize="small" />,
          onClick: (row) => handleEdit(row),
          variant: "outlined",
          size: "small",
          color: "primary",
          sx: { mr: 1 },
        },
        {
          label: "Delete Interview",
          icon: <DeleteIcon fontSize="small" />,
          onClick: (row) => handleDelete(row),
          variant: "outlined",
          size: "small",
          color: "error",
        },
      ],
    };
  }

  // For COORDINATOR role, return a minimal config or different view
  return {
    ...baseConfig,
    sections: [
      {
        title: "Candidate Information",
        fields: [
          { label: "Name", key: "candidateFullName", fallback: "-" },
          { label: "Email", key: "candidateEmailId", fallback: "-" },
        ],
      },
      {
        title: "Interview Details",
        fields: [
          {
            label: "Interview Date & Time",
            key: "interviewDateTime",
            fallback: "-",
            format: (value) => formatDateTime(value),
          },
          { label: "Level", key: "interviewLevel", fallback: "-" },
          { label: "Status", key: "latestInterviewStatus", fallback: "-" },
        ],
      },
    ],
    actions: []
  };
};

  const renderExpandedContent = (row) => {
    if (loading && role!=="COORDINATOR") {
      return (
        <Box sx={{ p: 2 }}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography variant="body2">Loading details...</Typography>
        </Box>
      );
    }
    return (
      <ReusableExpandedContent row={row} config={getExpandedContentConfig()} />
    );
  };

  const columns = [
    {
      key: "jobId",
      label: "Job ID",
      width: 180,
      render: (row) => (
        <Link
          component="button"
          variant="body2"
          onClick={() => handleJobIdClick(row.jobId)}
          sx={{
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {row.jobId}
        </Link>
      ),
    },
     {
      key:"technology",
      label:"Technologies",
       width: 180,
      sortable: true,
      render:(row)=>(row.technology),
    },
    {
      key: "candidateFullName",
      label: "Candidate",
      width: 180,
      render: (row) => (
        <Box>
          <Typography>{row.candidateFullName}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.candidateEmailId}
          </Typography>
        </Box>
      ),
    },
    { key: "clientName", label: "Client", width: 150 },
    ...(role === "COORDINATOR" ? [{
      key: "recruiterName",
      label: "Recruiter",
      width: 120
    }] : []),
    {
      key: "interviewLevel",
      label: "Level",
      width: 120,
      render: (row) => getInterviewLevelChip(row.interviewLevel),
    },
    {
      key: "interviewDateTime",
      label: "Interview Date & Time",
      width: 200,
      render: (row) => formatDateTime(row.interviewDateTime),
    },
    { key: "duration", label: "Duration (min)", width: 120, align: "center" },
    {
      key: "latestInterviewStatus",
      label: "Status",
      width: 140,
      render: (row) => getStatusChip(row.latestInterviewStatus, row, dispatch),
    },

   ...(
  role !== "COORDINATOR"
    ? [
        {
          key: "moveToBench",
          label: "Move to Bench",
          sortable: false,
          filterable: false,
          width: 130,
          align: "center",
          render: loading
            ? () => <Skeleton variant="text" width={100} />
            : (row) => (
                <MoveToBench
                  row={row}
                  onSuccess={handleBenchSuccess}
                  isLoading={moveToBenchLoading}
                />
              ),
        },
      ]
    : []
),

    {
      key: "zoomLink",
      label: "Meeting",
      width: 120,
      render: (row) =>
        row.zoomLink ? (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<VideoCallIcon />}
            href={row.zoomLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ px: 1, py: 0.5 }}
          >
            Join
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No link
          </Typography>
        ),
    },

 ...(
  role === "COORDINATOR" ? [
    {
      key: "comments",
      label: "Recruiter Comments",
      sortable: false,
      filterable: false,
      width: 160,
      render: (row) => (
        <InternalFeedbackCell 
         value={row.comments}
        loading={loading}
        isCoordinator={false} // This ensures it's read-only
        candidateName={row.candidateFullName}
       
        />
      )
    }
  ] : [
    {
  key: "internalFeedback",
  label: "Internal Feedback",
  render: (row) => (
    <InternalFeedbackCell 
      value={row.internalFeedback}
      loading={loading}
      isCoordinator={role === "COORDINATOR"}
      onFeedbackSubmit={(feedback) => handleSubmitFeedback(row, feedback)}
      candidateName={row.candidateFullName}
    />
  )
}
  ]
),
    {
      key: "actions",
      label: "Actions",
      width: 200,
      render: (row) => {
        const status = row.latestInterviewStatus?.toUpperCase();
        const showReschedule = [
          "CANCELLED",
          "RESCHEDULED",
          "SELECTED",
          "NO_SHOW",
        ].includes(status) && role !== "COORDINATOR";

        const getButtonText = () => {
          switch (status) {
            case "SELECTED":
              return "Schedule Joining";
            case "CANCELLED":
            case "RESCHEDULED":
            case "NO_SHOW":
              return "Reschedule";
            default:
              return "Update";
          }
        };

        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            {role !== "COORDINATOR" && (
              <>
                <Tooltip title="View Details">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => toggleRowExpansion(row.interviewId)}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <IconButton
                  onClick={() => handleEdit(row)}
                  color="primary"
                  size="small"
                  title="Edit Interview"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(row)}
                  color="error"
                  size="small"
                  title="Delete Interview"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}

            <DownloadResume
              candidate={row}
              getDownloadUrl={(candidate, format) =>
                `${API_BASE_URL}/candidate/download-resume/${candidate.candidateId}/${candidate.jobId}?format=${format}`
              }
            />

            {role === "COORDINATOR" && (
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => handleOpenFeedbackDialog(row)}
              >
                Feedback
              </Button>
            )}

            {showReschedule && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleEdit(row, true)}
                sx={{ px: 1, py: 0.5 }}
              >
                {getButtonText()}
              </Button>
            )}
          </Box>
        );
      },
    },
  ];

  const processedData = loading
    ? []
    : interviews.map((row) => ({
        ...row,
        expandContent: renderExpandedContent,
        isExpanded: expandedRows[row.interviewId],
      }));

  const displayData = isFilteredDataRequested
    ? filterInterviewsForRecruiter
    : processedData;

  useEffect(() => {
    fetchInterviews();
  }, [userId]);

  return (
    <Box sx={{ p: 1 }}>
      {loading && interviews.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress sx={{ color: "#1976d2" }} />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography color="error">{error}</Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchInterviews}
            sx={{
              mt: 2,
              color: "#1976d2",
              borderColor: "#1976d2",
              "&:hover": { borderColor: "#1565c0", backgroundColor: "#e3f2fd" },
            }}
          >
            Retry
          </Button>
        </Box>
      ) : (
        <>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              flexWrap: "wrap",
              mb: 3,
              justifyContent: "space-between",
              p: 2,
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography variant="h6" color="primary">
              My Scheduled Interviews
            </Typography>

            <DateRangeFilter component="InterviewsForRecruiter" />
          </Stack>

          <DataTable
            data={displayData || []}
            columns={columns}
            title="My Interviews"
            enableSelection={false}
            defaultSortColumn="interviewDateTime"
            defaultSortDirection="desc"
            defaultRowsPerPage={10}
            refreshData={fetchInterviews}
            primaryColor="#1976d2"
            secondaryColor="#e3f2fd"
            customStyles={{
              headerBackground: "#1976d2",
              rowHover: "#f5f5f5",
              selectedRow: "#e3f2fd",
            }}
            uniqueId="interviewId"
            enableRowExpansion={true}
            onRowExpandToggle={toggleRowExpansion}
          />

          <Drawer
            anchor="right"
            open={editDrawer.open}
            onClose={handleCloseEditDrawer}
            PaperProps={{
              sx: { width: { xs: "60%", sm: "50%", md: "50%" } },
            }}
          >
            {editDrawer.data && (
              <EditInterviewForm
                data={editDrawer.data}
                onClose={handleCloseEditDrawer}
                onSuccess={handleInterviewUpdated}
              />
            )}
          </Drawer>

          <ConfirmDialog
            open={confirmDialog.open}
            title="Delete Interview?"
            content={`Do you really want to delete the interview for ${
              confirmDialog.interview?.candidateFullName ||
              confirmDialog.interview?.candidateEmailId ||
              "this candidate"
            }? This action cannot be undone.`}
            onClose={() => setConfirmDialog({ open: false, interview: null })}
            onConfirm={handleConfirmDelete}
          />

          {/* Feedback Dialog */}
          <Dialog
            open={feedbackDialog.open}
            onClose={handleCloseFeedbackDialog}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle sx={{ px: 4, pt: 3 }}>
              Feedback for {feedbackDialog.interview?.candidateFullName || 'Candidate'}
            </DialogTitle>
            <DialogContent sx={{ px: 2, py: 2 }}>
              <Box sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Feedback"
                  multiline
                  minRows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 4, pb: 3 }}>
              <Button onClick={handleCloseFeedbackDialog}>Cancel</Button>
              <Button 
                onClick={handleSubmitFeedback} 
                variant="contained"
                color="primary"
                disabled={!feedback.trim() || isSubmittingFeedback}
              >
                {isSubmittingFeedback ? (
                  <CircularProgress size={24} />
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default RecruiterInterviews;