import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  ButtonGroup,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { INTERVIEW_LEVELS } from "./constants";
import InterviewTable from "./InterviewTable";
import EditInterviewDialog from "./EditInterviewDialog";
import DeleteInterviewDialog from "./DeleteInterviewDialog";
import {
  fetchInterviewDetails,
  updateInterview,
  deleteInterview,
} from "./interviewService";

const InterviewMain = () => {
  const [data, setData] = useState([]); // Stores all data
  const [filteredData, setFilteredData] = useState([]); // Stores filtered data
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

  // Fetch Data Only Once (No Filtering at API Level)
  useEffect(() => {
    if (userId) {
      fetchInterviewDetails(userId, setData, setLoading, setSnackbar);
    } else {
      setLoading(false);
    }
  }, [userId]);

  // ✅ Apply Filters Locally
  useEffect(() => {
    const filtered =
      filterLevel === INTERVIEW_LEVELS.ALL
        ? data
        : data.filter(
            (i) => i.interviewLevel?.toUpperCase() === filterLevel.toUpperCase()
          );

    setFilteredData(filtered);
  }, [filterLevel, data]); // ✅ Re-runs only when data or filter changes

  // ✅ Filter Button Click Handler
  const handleFilterChange = (level) => {
    setFilterLevel(level); // ✅ Updates the filter level
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
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Interview Schedule ({filteredData.length} scheduled)
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <ButtonGroup
            sx={{
              display: "flex",

              flexWrap: "wrap",
              justifyContent: "start",
              backgroundColor: "#F8F9FA",
              padding: "8px",
              borderRadius: "12px",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {Object.entries(INTERVIEW_LEVELS).map(([key, value]) => (
              <Button
                key={key}
                onClick={() => handleFilterChange(value)}
                sx={{
                  backgroundColor:
                    filterLevel === value ? "#0F1C46" : "#FFFFFF",
                  color: filterLevel === value ? "#FFFFFF" : "#0F1C46",
                  fontWeight: "500",
                  borderRadius: "20px",
                  padding: "10px 18px",
                  minWidth: "140px",
                  textTransform: "capitalize",
                  transition: "all 0.2s ease-in-out",
                  border:
                    filterLevel === value
                      ? "2px solid #2A4DBD"
                      : "1px solid #D0D5DD",
                  "&:hover": {
                    backgroundColor:
                      filterLevel === value ? "#1B3A8C" : "#F0F0F0",
                    
                  },
                }}
              >
                {key === "ALL" ? "All" : value}
              </Button>
            ))}
          </ButtonGroup>

          <InterviewTable
            data={filteredData}
            setEditingInterview={setEditingInterview}
            setEditDialogOpen={setEditDialogOpen}
            setDeleteDialogOpen={setDeleteDialogOpen}
            setInterviewToDelete={setInterviewToDelete}
          />
        </Box>
      </Box>

      <EditInterviewDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        interview={editingInterview}
        onUpdate={(updatedInterview) =>
            updateInterview(
                userId,
                updatedInterview,
                setSnackbar,
                fetchInterviewDetails,
                setData, 
                setLoading 
              )
        }
      />

      <DeleteInterviewDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        interview={interviewToDelete}
        onDelete={() =>
          deleteInterview(interviewToDelete, setSnackbar, fetchInterviewDetails)
        }
      >
        
      </DeleteInterviewDialog>

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

export default InterviewMain;
