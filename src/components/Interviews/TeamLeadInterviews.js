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
  Tabs,
  Tab,
  Link
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VideoCall as VideoCallIcon,
  Refresh as RefreshIcon,
  Visibility,
  People,
  Person,
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
import {
  fetchInterviewsTeamLead,
  filterInterviewsByTeamLead,
} from "../../redux/interviewSlice";
import { useNavigate } from "react-router-dom";

/**
 * Process interview data to ensure consistency and prepare for display
 * @param {Array} interviews - Raw interview data from API
 * @returns {Array} - Processed interview data
 */
const processInterviewData = (interviews) => {
  if (!Array.isArray(interviews)) return [];

  return interviews.map((interview) => {
    const interviewStatus =
      interview.interviewStatus ||
      interview.latestInterviewStatus ||
      "SCHEDULED";

    return {
      ...interview,
      interviewId:
        interview.interviewId || `${interview.candidateId}_${interview.jobId}`,
      interviewStatus,
    };
  });
};

/**
 * Component for team leads to view and manage their own and team interviews
 */
const TeamLeadInterviews = () => {
  const [activeTab, setActiveTab] = useState(0);
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

  const navigate=useNavigate();

  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { isFilteredDataRequested } = useSelector((state) => state.bench);
  const {
    selfInterviewsTL,
    teamInterviewsTL,
    filterInterviewsForTeamLeadTeam,
    filterInterviewsForTeamLeadSelf,
    loading: reduxLoading,
  } = useSelector((state) => state.interview);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      await dispatch(fetchInterviewsTeamLead()).unwrap();
      setError(null);
    } catch (err) {
      setError("Failed to fetch interview data");
      console.error("Error fetching interviews:", err);
      ToastService.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

 const handleJobIdClick = (jobId) => {
  navigate(`/dashboard/requirements/job-details/${jobId}`, {
    state: { from: "/dashboard/interviews" }
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
      key:"jobId",
      label:"Job ID",
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
                          </Link>),
            sortable: true,
            filterable: true,
            width: 120
    },
    {
      key:"technology",
      label:"Technologies",
      sortable: true,
      render:(row)=>(row.technology),
      filterable: true,
      width: 120
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
      key:"internalFeedback",
      label:"Internal Feedback",
       width: 120,
      render:(row)=>(row.technology || "-"),
      filterable: true,
      width: 120
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

  // Process data for each tab - ensuring we handle empty arrays properly
  const processedSelfInterviews = processInterviewData(selfInterviewsTL || []);
  const processedTeamInterviews = processInterviewData(teamInterviewsTL || []);
  
  // Process filtered data if available - ensuring we handle empty arrays properly
  const processedFilteredSelfInterviews = processInterviewData(filterInterviewsForTeamLeadSelf || []);
  const processedFilteredTeamInterviews = processInterviewData(filterInterviewsForTeamLeadTeam || []);

  // Map data with expanded content
  const mapDataWithExpandedContent = (data) => {
    return data.map((row) => ({
      ...row,
      expandContent: renderExpandedContent,
      isExpanded: expandedRows[row.interviewId],
    }));
  };

  const selfInterviewData = mapDataWithExpandedContent(processedSelfInterviews);
  const teamInterviewData = mapDataWithExpandedContent(processedTeamInterviews);
  const filteredSelfInterviewData = mapDataWithExpandedContent(processedFilteredSelfInterviews);
  const filteredTeamInterviewData = mapDataWithExpandedContent(processedFilteredTeamInterviews);

  // Determine which data to display based on filtering and tab selection
  let displayData = [];
  if (isFilteredDataRequested) {
    displayData = activeTab === 0 ? filteredSelfInterviewData : filteredTeamInterviewData;
  } else {
    displayData = activeTab === 0 ? selfInterviewData : teamInterviewData;
  }

  // Set title based on filtering and tab selection
  let tableTitle = isFilteredDataRequested
    ? activeTab === 0 ? "Filtered My Interviews" : "Filtered Team Interviews"
    : activeTab === 0 ? "My Interviews" : "Team Interviews";

  useEffect(() => {
    fetchInterviews();
  }, [userId]);

  return (
    <Box sx={{ p: 1 }}>
      {loading &&
      selfInterviewsTL.length === 0 &&
      teamInterviewsTL.length === 0 ? (
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
              Team Lead Interviews
            </Typography>

            <DateRangeFilter component="InterviewsForTeamLead" />
          </Stack>

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Person fontSize="small" />
                    <span>
                      My Interviews ({isFilteredDataRequested 
                        ? filteredSelfInterviewData.length 
                        : selfInterviewsTL.length})
                    </span>
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <People fontSize="small" />
                    <span>
                      Team Interviews ({isFilteredDataRequested 
                        ? filteredTeamInterviewData.length 
                        : teamInterviewsTL.length})
                    </span>
                  </Box>
                }
              />
            </Tabs>
          </Box>

          <DataTable
            data={displayData}
            columns={columns}
            title={tableTitle}
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
        </>
      )}
    </Box>
  );
};

export default TeamLeadInterviews;