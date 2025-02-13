import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";

const DeleteInterviewDialog = ({ open, onClose, interview, onDelete }) => {
  if (!interview) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete this interview?
        </Typography>
        
        {/* Show Candidate Details */}
        <Box sx={{ mt: 2, p: 2, backgroundColor: "grey.100", borderRadius: 1 }}>
          <Typography variant="body2">
            <strong>Candidate ID:</strong> {interview.candidateId}
          </Typography>
          <Typography variant="body2">
            <strong>Candidate Name:</strong> {interview.candidateFullName}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onDelete}>
          Delete Interview
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteInterviewDialog;
