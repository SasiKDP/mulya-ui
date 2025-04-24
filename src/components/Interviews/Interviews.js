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
import DataTable from "../muiComponents/DataTabel";
import { useSelector } from "react-redux";
import { useConfirm } from "../../hooks/useConfirm";
import ScheduleInterviewForm from "../Submissions/ScheduleInterviewForm";
import DateRangeFilter from "../muiComponents/DateRangeFilter";
import { getInterviewLevelChip, getStatusChip } from "../../utils/statusUtils";
import ConfirmDialog from "../muiComponents/ConfirmDialog";
import EditInterviewForm from "./EditInterviewForm"; // Make sure this import is correct
import httpService from "../../Services/httpService";

const Interviews = () => {
  const { userId } = useSelector((state) => state.auth);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    interview: null,
  });

  const { filterInterviewsForRecruiter } = useSelector(
    (state) => state.interview
  );
  const { isFilteredDataRequested } = useSelector((state) => state.bench);

  const [editDrawer, setEditDrawer] = useState({
    open: false,
    data: null,
  });

  const { confirm } = useConfirm();

  const processInterviewData = (data) => {
    return data.map((interview) => {
      const status = interview.latestInterviewStatus || "SCHEDULED";
      const candidateName =
        interview.candidateFullName ||
        interview.candidateEmailId?.split("@")[0] ||
        "Unknown Candidate";

      return {
        ...interview,
        candidateFullName: candidateName,
        interviewStatus: status,
      };
    });
  };

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await httpService.get(`/candidate/interviews/interviewsByUserId/${userId}`);
      const processedData = processInterviewData(response.data.payload || []);
      setInterviews(processedData);
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

  const handleEdit = (interview, isReschedule = false) => {
    setEditDrawer({
      open: true,
      data: {
        ...interview,
        isReschedule, // Pass this flag to the form
      },
    });
  };

  const handleConfirmDelete = async () => {
    const interview = confirmDialog.interview;
    if (!interview) return;

    try {
      await httpService.delete(
        `/candidate/deleteinterview/${interview.candidateId}/${interview.jobId}`
      );

      fetchInterviews();
    } catch (err) {
      console.error("Error deleting interview:", err);
    } finally {
      setConfirmDialog({ open: false, interview: null });
    }
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

  const columns = [
    
    { key: "interviewId", label: "Interview ID", width: 100 },
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
      render: (row) => getStatusChip(row.interviewStatus, row),
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
            <IconButton
              onClick={() => handleEdit(row)}
              color="primary"
              size="small"
              title="Edit Interview"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => setConfirmDialog({ open: true, interview: row })}
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
              Interviews List
            </Typography>
            <DateRangeFilter component="InterviewsForRecruiter" />
          </Stack>

          <DataTable
            data={
              isFilteredDataRequested
                ? filterInterviewsForRecruiter
                : interviews || []
            }
            columns={columns}
            title="Scheduled Interviews"
            enableSelection={false}
            defaultSortColumn="interviewDateTime"
            defaultSortDirection="asc"
            defaultRowsPerPage={20}
            refreshData={fetchInterviews}
            customStyles={{
              rowHover: "#e0f2f1",
              selectedRow: "#b2dfdb",
            }}
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
        </>
      )}

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
    </Box>
  );
};

export default Interviews;
