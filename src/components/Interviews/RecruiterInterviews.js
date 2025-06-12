import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Button,
  CircularProgress,
  Drawer,
  Stack,
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


import { formatDateTime } from "../../utils/dateformate";

/**
 * Process interview data to ensure consistency and prepare for display
 * @param {Array} interviews - Raw interview data from API
 * @returns {Array} - Processed interview data
 */
const processInterviewData = (interviews) => {
  if (!Array.isArray(interviews)) return [];

  return interviews.map((interview) => {
    // Ensure we're using the correct interview status property
    const interviewStatus =
     interview.latestInterviewStatus
      

    return {
      ...interview,
      interviewId:
        interview.interviewId || `${interview.candidateId}_${interview.jobId}`,
      interviewStatus,
      // Add any other processing needed for consistency
    };
  });
};

/**
 * Component for regular recruiters to view and manage their interviews
 */
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

  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { isFilteredDataRequested } = useSelector((state) => state.bench);
  const { filterInterviewsForRecruiter } = useSelector(
    (state) => state.interview
  );

  const fetchInterviews = async () => {
    try {
      setLoading(true);
    
      const response = await httpService.get(
        `/candidate/interviews/interviewsByUserId/${userId}`
      );
      const processedData = processInterviewData(response.data || []);
     
      setInterviews(processedData||[]);
      setError(null);
    } catch (err) {
      setError("Failed to fetch interview data");
      console.error("Error fetching interviews:", err);
      ToastService.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
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
              fallback: "-",
            },
            {
              label: "Status",
              key: "latestInterviewStatus",
              fallback: "-",
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
      key: "latestInterviewStatus",
      label: "Status",
      width: 140,
      render: (row) => getStatusChip(row.latestInterviewStatus, row, dispatch),
    },
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
        const status = row.latestInterviewStatus?.toUpperCase();
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

  // Process data to include expanded content
  const processedData = loading
    ? []
    : interviews.map((row) => ({
        ...row,
        expandContent: renderExpandedContent,
        isExpanded: expandedRows[row.interviewId],
      }));

  // Use filtered data if available
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
            s
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
        </>
      )}
    </Box>
  );
};

export default RecruiterInterviews;