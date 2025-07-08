import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Skeleton,
  Typography,
  Stack,
  Button,
  CircularProgress,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Link
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
import { filterInterviewsByDateRange } from "../../redux/interviewSlice";
import { formatDateTime } from "../../utils/dateformate";
import { showToast } from "../../utils/ToastNotification";
import MoveToBench from "./MoveToBench";
import {  useNavigate } from "react-router-dom";

const AllInterviews = () => {
  const [data, setData] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});
  const [error, setError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    interview: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editDrawer, setEditDrawer] = useState({ open: false, data: null });
  const [moveToBenchLoading, setMoveToBenchLoading] = useState(false);

  const dispatch = useDispatch();
  const { isFilteredDataRequested } = useSelector((state) => state.bench);
  const { filteredInterviewList } = useSelector((state) => state.interview);

  const navigate=useNavigate();

  const processInterviewData = (data) =>
    data.map((interview) => ({
      ...interview,
      candidateFullName:
        interview.candidateFullName ||
        interview.candidateEmailId?.split("@")[0] ||
        "Unknown Candidate",
      interviewStatus:
        interview.latestInterviewStatus ||
        interview.interviewStatus ||
        "SCHEDULED",
    }));

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await httpService.get("/candidate/allInterviews");
      setInterviews(
        processInterviewData(response.data.data || response.data || [])
      );
      setError(null);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      setError("Failed to load interviews");
      ToastService.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row, isReschedule = false) =>
    setEditDrawer({
      open: true,
      data: { ...row, isReschedule },
    });

  const handleBenchSuccess = (row) => {
  setInterviews(prev => prev.filter(item => item.submissionId !== row.submissionId));
  if (isFilteredDataRequested) {
    dispatch(filterInterviewsByDateRange(filteredInterviewList.filter(item => item.submissionId !== row.submissionId)));
  }
};


  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
    showToast(message, severity);
  };

  const handleCloseEditDrawer = () =>
    setEditDrawer({ open: false, data: null });

  const handleInterviewUpdated = () => {
    fetchInterviews();
    handleCloseEditDrawer();
  };
  const handleJobIdClick = (jobId) => {
  navigate(`/dashboard/requirements/job-details/${jobId}`, {
    state: { from: "/dashboard/interviews" }
  });
};

  const handleDelete = async (row) =>
    setConfirmDialog({ open: true, interview: row });

  const handleConfirmDelete = async () => {
    const { interview } = confirmDialog;
    if (!interview) return;

    try {
      const toastId = ToastService.loading("Deleting interview...");
      const deleteEndpoint =
        interview.candidateId && interview.jobId
          ? `/candidate/deleteinterview/${interview.candidateId}/${interview.jobId}`
          : `/interview/${interview.interviewId}`;

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

  const toggleRowExpansion = (interviewId) =>
    setExpandedRows((prev) => ({
      ...prev,
      [interviewId]: !prev[interviewId],
    }));

  const expandedContentConfig = {
    title: "Interview Details",
    description: { key: "notes", fallback: "No additional notes available." },
    backgroundColor: "#f5f5f5",
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
            format: formatDateTime,
          },
          {
            label: "Duration",
            key: "duration",
            fallback: "-",
            format: (value) => `${value} minutes`,
          },
          { label: "Level", key: "interviewLevel", fallback: "-" },
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
        onClick: handleEdit,
        variant: "outlined",
        size: "small",
        color: "primary",
        sx: { mr: 1 },
      },
      {
        label: "Delete Interview",
        icon: <Delete fontSize="small" />,
        onClick: handleDelete,
        variant: "outlined",
        size: "small",
        color: "error",
      },
    ],
  };

  const renderExpandedContent = (row) =>
    loading ? (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Skeleton variant="rectangular" width="30%" height={100} />
          <Skeleton variant="rectangular" width="30%" height={100} />
          <Skeleton variant="rectangular" width="30%" height={100} />
        </Box>
      </Box>
    ) : (
      <ReusableExpandedContent row={row} config={expandedContentConfig} />
    );

  const getTableColumns = () => [
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
      render: (row) =>
        loading ? (
          <Skeleton width={120} height={24} />
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
      width: 120,
      render: (row) =>
        loading ? <Skeleton width={100} height={24} /> : row.candidateContactNo,
    },
    {
      key: "recruiterName",
      label: "Recruiter",
      width: 150,
      render: (row) =>
        loading ? (
          <Skeleton width={120} height={24} />
        ) : (
          <Tooltip title={row.recruiterEmail || ""}>
            <Typography>
              {row.recruiterName || "Unknown"}
              {row.recruiterEmail && (
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  {row.recruiterEmail}
                </Typography>
              )}
            </Typography>
          </Tooltip>
        ),
    },
    {
      key: "clientName",
      label: "Client Name",
      width: 150,
      render: (row) =>
        loading ? <Skeleton width={120} height={24} /> : row.clientName,
    },
    {
      key: "interviewLevel",
      label: "Level",
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
      label: "Date & Time",
      width: 180,
      render: (row) =>
        loading ? (
          <Skeleton width={150} height={24} />
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
        loading ? <Skeleton width={50} height={24} /> : row.duration,
    },
    {
      key: "latestInterviewStatus",
      label: "Status",
      width: 140,
      render: (row) =>
        loading ? (
          <Skeleton variant="rectangular" width={100} height={24} />
        ) : (
          getStatusChip(row.latestInterviewStatus, row, dispatch)
        ),
    },
    {
      key: "zoomLink",
      label: "Meeting",
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
    {
      key:"internalFeedback",
      label:"Internal Feedback",
      width:120,
      align: "center",
       render: (row) =>
        loading ? <Skeleton width={120} height={24} /> : row.internalFeedback || "-",
    },

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
    {
      key: "actions",
      label: "Actions",
      width: 200,
      align: "center",
      render: (row) => {
        const status = row.latestInterviewStatus?.toUpperCase();
        const showReschedule = [
          "CANCELLED",
          "RESCHEDULED",
          "SELECTED",
          "NO_SHOW",
        ].includes(status);
        const buttonText =
          status === "SELECTED"
            ? "Schedule Joining"
            : ["CANCELLED", "RESCHEDULED", "NO_SHOW"].includes(status)
            ? "Reschedule"
            : "Update";

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
                {buttonText}
              </Button>
            )}
          </Box>
        );
      },
    },
  ];

  const getDisplayData = () => {
    return isFilteredDataRequested ? filteredInterviewList : interviews;
  };

  const processedData = getDisplayData().map((row) => ({
    ...row,
    expandContent: renderExpandedContent,
    isExpanded: expandedRows[row.interviewId],
  }));

  useEffect(() => {
    fetchInterviews();
  }, []);

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
          Interviews Management
        </Typography>
        <DateRangeFilter component="allInterviews" />
      </Stack>

      {loading && !interviews.length ? (
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
          <DataTable
            data={processedData}
            columns={getTableColumns()}
            title=""
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
            PaperProps={{ sx: { width: { xs: "60%", sm: "50%", md: "50%" } } }}
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