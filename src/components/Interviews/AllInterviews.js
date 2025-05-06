import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Skeleton,
  Chip,
  Typography,
  Stack,
  Button,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Drawer,
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  VideoCall as VideoCallIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import DataTable from "../muiComponents/DataTabel";
import httpService from "../../Services/httpService";
import ToastService from "../../Services/toastService";
import ReusableExpandedContent from "../muiComponents/ReusableExpandedContent";
import DateRangeFilter from "../muiComponents/DateRangeFilter";
import { useSelector, useDispatch } from "react-redux";
import { getStatusChip, getInterviewLevelChip } from "../../utils/statusUtils";
import ConfirmDialog from "../muiComponents/ConfirmDialog";
import EditInterviewForm from "./EditInterviewForm";
import { fetchInterviewsTeamLead } from "../../redux/interviewSlice";

const AllInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});
  const [error, setError] = useState(null);
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
  const { userId, role } = useSelector((state) => state.auth);
  const { isFilteredDataRequested } = useSelector((state) => state.bench);
  const { filteredInterviewList } = useSelector((state) => state.interview);
  const { selfInterviewsTL, teamInterviewsTL } = useSelector((state) => state.interview);
  const { filterInterviewsForRecruiter } = useSelector((state) => state.interview);

  const processInterviewData = (data) => {
    return data.map((interview) => {
      const status = interview.latestInterviewStatus || interview.interviewStatus || "SCHEDULED";
      const candidateName =
        interview.candidateFullName ||
        interview.candidateEmailId?.split("@")[0] ||
        "Unknown Candidate";

      return {
        ...interview,
        candidateFullName: candidateName,
        interviewStatus: status,
        // Add temporary IDs if not present
        interviewId: interview.interviewId || `temp-${Math.random().toString(36).substr(2, 9)}`,
      };
    });
  };

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      let response;

      // Different API endpoints based on user role
      if (role === "SUPERADMIN") {
        response = await httpService.get("/candidate/allInterviews");
        // If the structure is different for superadmin, handle it
        const interviewData = response.data.data || response.data || [];
        const processedData = processInterviewData(interviewData);
        setInterviews(processedData);
      } else if (role === "TEAMLEAD") {
        // Team leads can see their own interviews and their team's
        dispatch(fetchInterviewsTeamLead());
        // Initial view will be their own interviews
        response = await httpService.get(`/candidate/interviews/interviewsByUserId/${userId}`);
        const processedData = processInterviewData(response.data || []);
        setInterviews(processedData);
      } else {
        // Regular users can only see their own interviews
        response = await httpService.get(`/candidate/interviews/interviewsByUserId/${userId}`);
        const processedData = processInterviewData(response.data || []);
        setInterviews(processedData);
      }
      
      setError(null);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      setError("Failed to load interviews");
      ToastService.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  // const formatDateTime = (dateTimeString) => {
  //   if (!dateTimeString) return "N/A";
  //   try {
  //     const date = new Date(dateTimeString);
  //     return date.toLocaleString("en-IN", {
  //       timeZone: "Asia/Kolkata",
  //       year: "numeric",
  //       month: "short",
  //       day: "numeric",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });
  //   } catch (e) {
  //     console.error("Error formatting date", e);
  //     return "Invalid Date";
  //   }
  // };
  const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "N/A";
  try {
    const date = new Date(dateTimeString);
    // Convert to UTC ISO string and replace Z with +00:00
    return date.toISOString().replace(".000Z", "+00:00");
  } catch (e) {
    console.error("Error formatting date", e);
    return "Invalid Date";
  }
};


  const handleEdit = (row, isReschedule = false) => {
    setEditDrawer({
      open: true,
      data: {
        ...row,
        isReschedule,
        userId: row.userId || userId
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
          icon: <Edit fontSize="small" />,
          onClick: (row) => handleEdit(row),
          variant: "outlined",
          size: "small",
          color: "primary",
          sx: { mr: 1 },
        },
        {
          label: "Delete Interview",
          icon: <Delete fontSize="small" />,
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
          <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Skeleton variant="rectangular" width="30%" height={100} />
            <Skeleton variant="rectangular" width="30%" height={100} />
            <Skeleton variant="rectangular" width="30%" height={100} />
          </Box>
        </Box>
      );
    }
    return (
      <ReusableExpandedContent row={row} config={getExpandedContentConfig()} />
    );
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

  const generateColumns = () => {
    const baseColumns = [
      {
        key: "interviewId",
        label: "ID",
        type: "text",
        sortable: true,
        width: 100,
        render: (row) => 
          loading ? (
            <Skeleton variant="text" width={60} height={24} />
          ) : (
            row.interviewId
          ),
      },
      {
        key: "candidateFullName",
        label: "Candidate",
        type: "text",
        sortable: true,
        filterable: true,
        width: 180,
        render: (row) => 
          loading ? (
            <Skeleton variant="text" width={120} height={24} />
          ) : (
            <Box>
              <Typography>{row.candidateFullName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {row.candidateEmailId}
              </Typography>
            </Box>
          ),
      },
      {
        key: "candidateContactNo",
        label: "Contact No",
        type: "text",
        sortable: true,
        filterable: true,
        width: 120,
        render: (row) =>
          loading ? (
            <Skeleton variant="text" width={100} height={24} />
          ) : (
            row.candidateContactNo
          ),
      },
      {
        key: "clientName",
        label: "Client Name",
        type: "text",
        sortable: true,
        filterable: true,
        width: 150,
        render: (row) =>
          loading ? (
            <Skeleton variant="text" width={120} height={24} />
          ) : (
            row.clientName
          ),
      },
      {
        key: "interviewLevel",
        label: "Level",
        type: "select",
        sortable: true,
        filterable: true,
        width: 120,
        render: (row) =>
          loading ? (
            <Skeleton variant="rectangular" width={100} height={24} />
          ) : (
            getInterviewLevelChip(row.interviewLevel)
          ),
      },
      {
        key: "interviewDateTime",
        label: "Interview Date & Time",
        type: "datetime",
        sortable: true,
        filterable: true,
        width: 180,
        render: (row) =>
          loading ? (
            <Skeleton variant="text" width={150} height={24} />
          ) : (
            formatDateTime(row.interviewDateTime)
          ),
      },
      {
        key: "duration",
        label: "Duration (min)",
        width: 120,
        align: "center",
        render: (row) =>
          loading ? (
            <Skeleton variant="text" width={50} height={24} />
          ) : (
            row.duration
          ),
      },
      {
        key: "interviewStatus",
        label: "Status",
        sortable: true,
        filterable: true,
        width: 140,
        render: (row) => loading ? (
          <Skeleton variant="rectangular" width={100} height={24} />
        ) : (
          getStatusChip(row.interviewStatus, row, dispatch)
        ),
      },
      {
        key: "zoomLink",
        label: "Meeting",
        type: "link",
        sortable: false,
        filterable: false,
        width: 120,
        render: (row) =>
          loading ? (
            <Skeleton variant="rectangular" width={120} height={24} />
          ) : row.zoomLink ? (
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
    ];

    // Add user/recruiter column for superadmin
    if (role === "SUPERADMIN") {
      baseColumns.push({
        key: "userEmail",
        label: "Recruiter",
        type: "text",
        sortable: true,
        filterable: true,
        width: 150,
        render: (row) =>
          loading ? (
            <Skeleton variant="text" width={120} height={24} />
          ) : (
            row.userEmail || "Unknown"
          ),
      });
    }

    return [
      ...baseColumns,
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        filterable: false,
        width: 200,
        align: "center",
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
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => toggleRowExpansion(row.interviewId)}
                  disabled={loading}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEdit(row)}
                  disabled={loading}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(row)}
                  disabled={loading}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
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
  };

  // Determine which component name to use for filtering
  const componentName = role === 'SUPERADMIN' ? 'allInterviews' : 'InterviewsForRecruiter';

  // Determine which title to display based on role
  const getTableTitle = () => {
    if (role === "SUPERADMIN") {
      return "All System Interviews";
    } else if (role === "TEAMLEAD") {
      return isTeamData ? "Team Interviews" : "Self Interviews";
    } else {
      return "My Scheduled Interviews";
    }
  };

  // Determine which data to display based on role and filters
  const getDisplayData = () => {
    if (isFilteredDataRequested) {
      return role === "SUPERADMIN" 
        ? filteredInterviewList 
        : filterInterviewsForRecruiter;
    }
    
    if (role === "TEAMLEAD") {
      return isTeamData ? teamInterviewsTL : selfInterviewsTL;
    }
    
    return interviews;
  };

  // Process data to include expanded content
  const processedData = getDisplayData().map((row) => ({
    ...row,
    expandContent: renderExpandedContent,
    isExpanded: expandedRows[row.interviewId],
  }));

  // Create loading rows if needed
  const loadingData = loading && interviews.length === 0
    ? Array(5).fill({}).map((_, index) => ({
        interviewId: `temp-${index + 1}`,
        expandContent: renderExpandedContent,
        isExpanded: expandedRows[`temp-${index + 1}`],
      }))
    : processedData;

  useEffect(() => {
    fetchInterviews();
  }, [userId, role]);

  return (
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
          {role === "SUPERADMIN" ? "Interviews Management (Admin)" : "Interviews Management"}
        </Typography>

        <DateRangeFilter component={componentName} />
      </Stack>

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
          {role === "TEAMLEAD" && (
            <Paper sx={{ mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                <Tab id="self" label="Self Interviews" />
                <Tab id="team" label="Team Interviews" />
              </Tabs>
            </Paper>
          )}

          <DataTable
            data={loadingData || []}
            columns={generateColumns()}
            title={getTableTitle()}
            loading={loading}
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
    </>
  );
};

export default AllInterviews;