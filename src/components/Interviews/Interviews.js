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
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VideoCall as VideoCallIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import DataTable from "../muiComponents/DataTabel"; // Adjust path as needed

import httpService from "../../Services/httpService";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "../../hooks/useConfirm"; // Create this hook or use a dialog component
import ScheduleInterviewForm from "../Submissions/ScheduleInterviewForm";
import DateRangeFilter from "../muiComponents/DateRangeFilter";
import { getInterviewLevelChip, getStatusChip } from "../../utils/statusUtils";
import { fetchInterviewsTeamLead } from "../../redux/interviewSlice";
import ConfirmDialog from "../muiComponents/ConfirmDialog";
import EditInterviewForm from "./EditInterviewForm"; // Make sure this import is correct


const Interviews = () => {

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

  const [isTeamData, setIsTeamData] = useState(false);
  const { selfInterviewsTL, teamInterviewsTL } = useSelector((state) => state.interview)

  const { userId, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

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
    setLoading(true);
    try {
      if (role === "SUPERADMIN") {
        const response = await httpService.get(`/candidate/interviews/interviewsByUserId/${userId}`);
        setInterviews(response.data.data || []);
      } else {
        const response = await httpService.get(`/candidate/interviews/interviewsByUserId/${userId}`);
        setInterviews(response.data || []);
      }
    } catch (err) {
      setError("Failed to fetch interview data");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchInterviews();
  }, [userId, role]);

  // useEffect(() => {
  //   if (role === "TEAMLEAD") {
  //     console.log("Team lead...");
      
  //     dispatch(fetchInterviewsTeamLead());
  //   }
  // }, [dispatch, role])

  const handleEdit = (interview, isReschedule = false) => {
    setEditDrawer({
      open: true,
      data: {
        ...interview,
        isReschedule, // Pass this flag to the form
        // Ensure we keep the original userId for editing
        userId: interview.userId || userId
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
  // const formatDateTime = (dateTimeString) => {
  //   if (!dateTimeString) return "N/A";
  //   try {
  //     const date = new Date(dateTimeString);
  //     // Convert to UTC ISO string and replace Z with +00:00
  //     return date.toISOString().replace(".000Z", "+00:00");
  //   } catch (e) {
  //     console.error("Error formatting date", e);
  //     return "Invalid Date";
  //   }
  // };
  

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const selected = event.target.id;
    if (selected === "team") {
      setIsTeamData(true);
      return;
    }
    setIsTeamData(false)
  };


  const columns = [
    {
      key:"candidateId",
      label:"Candidate Id",
      width:180,
      render:(row)=>(
          <Box>
            <Typography variant="body2">{row.candidateId}</Typography>
          </Box>
      ),
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
      key:"recruiterName",
      label:"Recruiter",
      width:180,
      render:(row)=>(
         <Typography variant="body2">{row.recruiterName}</Typography>
      ),
    },
    {
      key:"jobId",
      label:"Job Id",
      width:180,
      render:(row)=>(
        <Typography variant="body2">{row.jobId}</Typography>
      )
    }
    ,
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
    // { key: "interviewId", label: "Interview ID", width: 100 },
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


  const componentName = role === 'SUPERADMIN' ? 'allInterviews' : 'InterviewsForRecruiter';

  // Determine which title to display based on role
  const getTableTitle = () => {
    if (role === "SUPERADMIN") {
      return "All Interviews";
    } else if (role === "TEAMLEAD") {
      return isTeamData ? "Team Interviews" : "Self Interviews";
    } else {
      return "Scheduled Interviews";
    }
  };

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
          <Stack direction="row" alignItems="center" spacing={2}
            sx={{
              flexWrap: 'wrap',
              mb: 3,
              justifyContent: 'space-between',
              p: 2,
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
              boxShadow: 1,
            }}>

            <Typography variant='h6' color='primary'>
              {role === "SUPERADMIN" ? "All Interviews" : "Interviews List"}
            </Typography>

            <DateRangeFilter component={componentName} />
          </Stack>

          {role === "TEAMLEAD" &&
            <Paper sx={{ mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                <Tab id="self" label="Self Interviews" />
                <Tab id="team" label="Team Interviews" />
              </Tabs>
            </Paper>
          }

          <DataTable
            data={isFilteredDataRequested ? filterInterviewsForRecruiter :
              role === "TEAMLEAD" ? isTeamData ? teamInterviewsTL : selfInterviewsTL :
              interviews || []}
            columns={columns}
            title={getTableTitle()}
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