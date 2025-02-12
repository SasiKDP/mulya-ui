import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InterviewForm from "../InterviewForm";

const InterviewDialog = ({ open, handleClose, candidate, onSuccess }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" color="primary">Schedule Interview</Typography>
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <InterviewForm
          jobId={candidate?.jobId}
          candidateId={candidate?.candidateId}
          candidateFullName={candidate?.fullName}
          candidateContactNo={candidate?.contactNumber}
          clientName={candidate?.currentOrganization}
          userId={candidate?.userId}
          candidateEmailId={candidate?.emailId}
          onSuccess={onSuccess}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InterviewDialog;
