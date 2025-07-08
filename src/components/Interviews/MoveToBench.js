import React, { useState, useCallback } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography
} from '@mui/material';
import httpService from '../../Services/httpService';
import { showToast } from '../../utils/ToastNotification';
import { useSelector } from 'react-redux';

const MoveToBench = ({ row, onSuccess, isLoading }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchedCandidate, setMatchedCandidate] = useState(null);
  
  const { userId, role } = useSelector((state) => state.auth);

  // Fetch and match candidate by fullName
  const fetchAndMatchCandidate = useCallback(async () => {
    try {
      const candidateName = row.candidateFullName || row.fullName;
      if (!candidateName) {
        throw new Error("Candidate name not found");
      }

      let response;
      if (role === "SUPERADMIN") {
        response = await httpService.get(`/candidate/submissions`);
      } else if (role === "TEAMLEAD") {
        response = await httpService.get(`/candidate/submission/teamlead/${userId}`);
      } else if (role === "EMPLOYEE" || role === "BDM") {
        response = await httpService.get(`/candidate/submissionsByUserId/${userId}`);
      }

      if (!response.data) {
        throw new Error("No candidates data found");
      }

      // Ensure response.data is an array
      let candidatesArray = response.data;
      
      // Handle different response structures
      if (typeof candidatesArray === 'object' && !Array.isArray(candidatesArray)) {
        // If it's an object with a data property that contains the array
        if (candidatesArray.data && Array.isArray(candidatesArray.data)) {
          candidatesArray = candidatesArray.data;
        }
        // If it's an object with candidates property
        else if (candidatesArray.candidates && Array.isArray(candidatesArray.candidates)) {
          candidatesArray = candidatesArray.candidates;
        }
        // If it's an object with submissions property
        else if (candidatesArray.submissions && Array.isArray(candidatesArray.submissions)) {
          candidatesArray = candidatesArray.submissions;
        }
        // If it's an object but we need to convert it to array
        else if (candidatesArray.results && Array.isArray(candidatesArray.results)) {
          candidatesArray = candidatesArray.results;
        }
        else {
          throw new Error("Invalid response format: expected array or object with array property");
        }
      }

      // Final check to ensure we have an array
      if (!Array.isArray(candidatesArray)) {
        console.error("Response data structure:", response.data);
        throw new Error("Response data is not in expected array format");
      }

      // Find candidate by full name (case insensitive)
      const foundCandidate = candidatesArray.find(candidate => 
        candidate.fullName?.toLowerCase() === candidateName.toLowerCase() ||
        candidate.candidateFullName?.toLowerCase() === candidateName.toLowerCase()
      );

      if (!foundCandidate) {
        throw new Error(`Candidate ${candidateName} not found in records`);
      }

      setMatchedCandidate(foundCandidate);
    } catch (error) {
      console.error("Error matching candidate:", error);
      showToast(error.message, "error");
    }
  }, [row.candidateFullName, row.fullName, userId, role]);

  const handleOpen = (e) => {
    e.stopPropagation();
    fetchAndMatchCandidate();
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setFeedback('');
    setMatchedCandidate(null);
  };

  const getCompleteCandidateData = useCallback(() => {
    // Priority: matched candidate data > row data
    const source = matchedCandidate || row;
    
    return {
      fullName: source.fullName || source.candidateFullName || "",
      emailId: source.email || source.emailId || source.candidateEmailId || "",
      contactNumber: source.contactNumber || source.candidateContactNo || "",
      relevantExperience: source.relevantExperience || "0",
      totalExperience: source.totalExperience || "0",
      skills: Array.isArray(source.skills) ? source.skills : 
             typeof source.skills === 'string' ? source.skills.split(',') : [],
      userEmail: source.userEmail || "",
      linkedin: source.linkedin || "",
      submissionId: source.submissionId || null,
      candidateId: source.candidateId || null,
      jobId: source.jobId || null,
      technology:source.technology||null,
      // Include any other relevant fields
      ...(matchedCandidate || {}),
      ...(row || {})
    };
  }, [matchedCandidate, row]);

const handleMoveToBench = async (e) => {
  e.stopPropagation();
  setIsSubmitting(true);
  
  try {
    const candidate = getCompleteCandidateData();
    
    if (!candidate.fullName || !candidate.emailId) {
      throw new Error("Candidate name and email are required");
    }

    const formData = new FormData();
    
    // Required fields
    formData.append("fullName", candidate.fullName);
    formData.append("email", candidate.emailId);
    formData.append("contactNumber", candidate.contactNumber || "");

    // Experience
    formData.append("relevantExperience", candidate.relevantExperience);
    formData.append("totalExperience", candidate.totalExperience);

    // Skills (ensure array format)
    const skillsArray = Array.isArray(candidate.skills) ? candidate.skills : 
                      [candidate.skills].filter(Boolean);
    formData.append("skills", JSON.stringify(skillsArray));

    // Optional fields
    formData.append("linkedin", candidate.linkedin || "");
    formData.append("referredBy", candidate.userEmail || "");
    formData.append("remarks", feedback || "");
    formData.append("technology", candidate.technology || "");

    try {
      // Move to bench
      const response = await httpService.post("/candidate/bench/save", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Delete submission if exists
      if (candidate.submissionId) {
        try {
          await httpService.delete(`/candidate/deletesubmission/${candidate.submissionId}`);
        } catch (deleteError) {
          console.error("Error deleting submission:", deleteError);
        }
      }

      showToast(`${candidate.fullName} moved to bench successfully!`, "success");
      onSuccess?.(candidate);
      handleClose();
    } catch (apiError) {
      // Handle API-specific errors
      if (apiError.response?.data?.message?.includes("already exists") || 
          apiError.response?.data?.message?.includes("Duplicate entry")) {
        showToast(apiError.response.data.message, "error", { autoClose: 5000 });
      } else {
        throw apiError; // Re-throw other errors to be caught by the outer catch
      }
    }
  } catch (error) {
    console.error("Error moving to bench:", error);
    
    let errorMessage = "Failed to move candidate to bench";
    if (error.response) {
      errorMessage = error.response.data?.message || error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    showToast(errorMessage, "error", { autoClose: 5000 });
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <>
      <Button
        variant="outlined"
        size="small"
        color="secondary"
        onClick={handleOpen}
        disabled={isLoading}
        sx={{
          textTransform: "none",
          borderRadius: 2,
          px: 2,
          py: 0.5,
          "&:hover": {
            backgroundColor: "secondary.light",
            color: "secondary.contrastText",
          },
        }}
      >
        {isLoading ? <CircularProgress size={20} /> : "To Bench"}
      </Button>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Move to Bench</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {matchedCandidate ? (
              `Moving ${matchedCandidate.fullName || row.candidateFullName} to bench`
            ) : (
              `Preparing to move ${row.candidateFullName} to bench`
            )}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Remarks"
            type="text"
            fullWidth
            variant="outlined"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            multiline
            rows={4}
            required
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleMoveToBench}
            disabled={isSubmitting || !feedback.trim()}
            color="primary"
            variant="contained"
          >
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Confirm Move"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(MoveToBench);