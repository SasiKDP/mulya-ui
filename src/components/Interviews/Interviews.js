import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VideoCall as VideoCallIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import DataTable from "../muiComponents/DataTabel"; // Adjust path as needed

import httpService from "../../Services/httpService";
import { useSelector } from "react-redux";
import { useConfirm } from "../../hooks/useConfirm"; // Create this hook or use a dialog component
import ScheduleInterviewForm from "../Submissions/ScheduleInterviewForm";
import DateRangeFilter from "../muiComponents/DateRangeFilter";

const Interviews = () => {
  const { userId } = useSelector((state) => state.auth);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit drawer state
  const [editDrawer, setEditDrawer] = useState({
    open: false,
    data: null,
  });

  // Confirmation dialog hook (implement this or use a dialog component)
  const { confirm } = useConfirm();

  // Fetch interviews
  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await httpService.get(`/candidate/interviews/${userId}`);
      setInterviews(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch interview data");
      console.error("Error fetching interviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [userId]);

  // Handle edit interview
  const handleEdit = (interview) => {
    setEditDrawer({
      open: true,
      data: interview,
    });
  };

  // Handle delete interview
  const handleDelete = async (interview) => {
    const confirmed = await confirm({
      title: "Delete Interview",
      message: `Are you sure you want to delete the interview for ${interview.candidateFullName}?`,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (confirmed) {
      try {
        await httpService.delete(
          `/candidate/deleteinterview/${interview.candidateId}`
        );
        fetchInterviews();
      } catch (err) {
        console.error("Error deleting interview:", err);
      }
    }
  };

  // Close edit drawer
  const handleCloseEditDrawer = () => {
    setEditDrawer({
      open: false,
      data: null,
    });
  };

  // Handle successful interview update
  const handleInterviewUpdated = () => {
    fetchInterviews();
    handleCloseEditDrawer();
  };

  // Format date/time for display
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render status chip
  const renderStatusChip = (status) => {
    const statusConfig = {
      SCHEDULED: { color: "primary", variant: "filled" },
      COMPLETED: { color: "success", variant: "filled" },
      CANCELLED: { color: "error", variant: "filled" },
      RESCHEDULED: { color: "warning", variant: "filled" },
    };

    const config = statusConfig[status] || {
      color: "default",
      variant: "outlined",
    };

    return (
      <Chip
        label={status}
        size="small"
        color={config.color}
        variant={config.variant}
      />
    );
  };

  // Table columns
  const columns = [
    { key: "jobId", label: "Job ID", width: 100 },
    { key: "candidateFullName", label: "Candidate", width: 180 },
    { key: "clientName", label: "Client", width: 150 },
    { key: "interviewLevel", label: "Level", width: 100 },
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
      render: (row) => renderStatusChip(row.interviewStatus),
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
      width: 120,
      render: (row) => (
        <Box sx={{ display: "flex", gap: 1 }}>
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
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 1 }}>
      {loading && interviews.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress sx={{ color: "#00796b" }} />
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
              color: "#00796b",
              borderColor: "#00796b",
              "&:hover": { borderColor: "#00695c", backgroundColor: "#e0f2f1" },
            }}
          >
            Retry
          </Button>
        </Box>
      ) : (
        <>

          <DataTable
            data={interviews}
            columns={columns}
            title="Scheduled Interviews"
            // loading={loading}
            enableSelection={false}
            defaultSortColumn="interviewDateTime"
            defaultSortDirection="asc"
            defaultRowsPerPage={10}
            customTableHeight={650}
            refreshData={fetchInterviews}
            // primaryColor="#00796b"
            secondaryColor="#e0f2f1"
            customStyles={{
              // headerBackground: "#00796b",
              rowHover: "#e0f2f1",
              selectedRow: "#b2dfdb",
            }}
          />

          {/* Edit Interview Drawer */}
          <Drawer
            anchor="right"
            open={editDrawer.open}
            onClose={handleCloseEditDrawer}
            PaperProps={{
              sx: { width: { xs: "60%", sm: "40%", md: "35%" } },
            }}
          >
            {editDrawer.data && (
              <ScheduleInterviewForm
                data={editDrawer.data}
                onClose={handleCloseEditDrawer}
                mode="edit"
                onSuccess={handleInterviewUpdated}
              />
            )}
          </Drawer>
        </>
      )}
    </Box>
  );
};

export default Interviews;