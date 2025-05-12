import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Button,
  CircularProgress,
  Drawer,
  Stack,
  Paper,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VideoCall as VideoCallIcon,
  Refresh as RefreshIcon,
  Visibility,
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
import { fetchInterviewsTeamLead } from "../../redux/interviewSlice";

/**
 * Component for team leads to view and manage both their own interviews and their team's interviews
 */
const TeamLeadInterviews = () => {
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
  const [tabValue, setTabValue] = useState(0);
  const [isTeamData, setIsTeamData] = useState(false);

  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { isFilteredDataRequested } = useSelector((state) => state.bench);
  const { selfInterviewsTL, teamInterviewsTL } = useSelector((state) => state.interview);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      // Fetch both self and team interviews
      dispatch(fetchInterviewsTeamLead());
      
      // For immediate display, also fetch self interviews directly
      const response = await httpService.get(`/candidate/interviews/teamlead/${userId}`);
      console.log("response",response.data)
      const processedData = processInterviewData(response.data || []);
    
      setInterviews(processedData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch interview data");
      console.error("Error fetching interviews:", err);
      ToastService.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const processInterviewData = (data) => {
    return data.map((interview) => {
      const status = interview.latestInterviewStatus || interview.interviewStatus || "SCHEDULED";
      const candidateName = interview.candidateFullName || 
        interview.candidateEmailId?.split("@")[0] || 
        "Unknown Candidate";

      return {
        ...interview,
        candidateFullName: candidateName,
        interviewStatus: status,
        interviewId: interview.interviewId || `temp-${Math.random().toString(36).substr(2, 9)}`,
      };
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Error formatting date", e);
      return "Invalid Date";
    }
  };

  const handleEdit = (interview, isReschedule = false) => {
    setEditDrawer({
      open: true,
      data: {
        ...interview,
        isReschedule,
        userId: interview.userId || userId
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
      
      // Determine the correct API endpoint based on available data
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const selected = event.target.id;
    if (selected === "team") {
      setIsTeamData(true);
      return;
    }
    setIsTeamData(false);
  };

  const getExpandedContentConfig = () => {
    return {
      title: "Interview Details",
      description: {
        key: "notes",
        fallback: "No additional notes available.",
      },
      backgroundColor: "#f5f5f5",
      sections: [
        {
          title: "Candidate Information",
          fields: [
            {
              label: "Name",
              key: "candidateFullName",
              fallback: "-",
            },
            {
              label: "Email",
              key: "candidateEmailId",
              fallback: "-",
            },
            {
              label: "Contact",
              key: "candidateContactNo",
              fallback: "-",
            },
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
            {
              label: "Duration",
              key: "duration",
              fallback: "-",
              format: (value) => `${value} minutes`,
            },
            { 
              label: "Level", 
              key: "interviewLevel", 
              fallback: "-" 
            },
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
  };

  const renderExpandedContent = (row) => {
    if (loading) {
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

  // Define columns for the data table
  const columns = [
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
      key: "interviewStatus",
      label: "Status",
      width: 140,
      render: (row) => getStatusChip(row.interviewStatus, row, dispatch),
    },
  ];

  // Add recruiter column for team view
  const teamColumns = [
    ...columns,
    {
      key: "userEmail",
      label: "Recruiter",
      width: 150,
      render: (row) => (
        <Typography variant="body2">
          {row.userEmail || "Unknown"}
        </Typography>
      ),
    },
  ];

  // Add meeting and actions columns to whichever view is active
  const finalColumns = [
    ...(isTeamData ? teamColumns : columns),
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
    {
      key: "actions",
      label: "Actions",
      width: 200,
      render: (row) => {
        const status = row.interviewStatus?.toUpperCase();
        const showReschedule = [
          "CANCELLED",
          "RESCHEDULED",
          "SELECTED",
          "NO_SHOW",
        ].includes(status);

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
            <Tooltip title="View Details">
              <IconButton
                size="small"
                color="primary"
                onClick={() => toggleRowExpansion(row.interviewId)}
              >
                <Visibility fontSize="small" />
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
            {showReschedule && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleEdit(row, true)} // true for reschedule or joining
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

  useEffect(() => {
    fetchInterviews();
  }, [userId, isFilteredDataRequested]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <DateRangeFilter 
          onFilter={fetchInterviews} 
          disabled={loading}
        />
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchInterviews}
          disabled={loading}
        >
          Refresh
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Interviews" id="self" />
          <Tab label="Team Interviews" id="team" />
        </Tabs>
      </Paper>

      {loading && !interviews.length ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      ) : (
        <DataTable
          columns={finalColumns}
          rows={interviews}
          loading={loading}
          expandedRows={expandedRows}
          onRowToggle={toggleRowExpansion}
          renderExpandedContent={renderExpandedContent}
          getRowId={(row) => row.interviewId}
          sx={{ mt: 2 }}
        />
      )}

      {/* Edit Interview Drawer */}
      <Drawer
        anchor="right"
        open={editDrawer.open}
        onClose={handleCloseEditDrawer}
        PaperProps={{ sx: { width: "40%", minWidth: 400 } }}
      >
        {editDrawer.data && (
          <EditInterviewForm
            interview={editDrawer.data}
            onSuccess={handleInterviewUpdated}
            onCancel={handleCloseEditDrawer}
            isReschedule={editDrawer.data.isReschedule}
          />
        )}
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, interview: null })}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        content="Are you sure you want to delete this interview? This action cannot be undone."
      />
    </Box>
  );
};

export default TeamLeadInterviews;