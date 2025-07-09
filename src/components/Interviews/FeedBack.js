import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tooltip,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

const InternalFeedbackCell = ({ 
  value, 
  loading = false,
  maxLength = 15,
  emptyText = '-',
  isCoordinator = false,
  onFeedbackSubmit,
  candidateName = 'Candidate'
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editableFeedback, setEditableFeedback] = useState(value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleViewFull = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditableFeedback(value); // Reset to original value on close
  };

  const handleSubmitFeedback = async () => {
    if (!editableFeedback.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onFeedbackSubmit?.(editableFeedback);
      setDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Skeleton width={120} height={24} />;
  }

  if (!value) {
    return isCoordinator ? (
      <Button 
        variant="outlined" 
        size="small"
        onClick={handleViewFull}
      >
        Add Feedback
      </Button>
    ) : (
      emptyText
    );
  }

  return (
    <>
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        gap: 1 
      }}>
        <Typography noWrap sx={{ maxWidth: 80 }}>
          {value.length > maxLength
            ? `${value.slice(0, maxLength)}...`
            : value}
        </Typography>
        {value.length > maxLength && (
          <Tooltip title="View full feedback">
            <Button
              onClick={handleViewFull}
              size="small"
              startIcon={<DescriptionIcon />}
              sx={{ 
                minWidth: 0, 
                p: 0.5,
                '& .MuiButton-startIcon': {
                  marginRight: 0.5
                }
              }}
            >
              more
            </Button>
          </Tooltip>
        )}
        {isCoordinator && !value.length > maxLength && (
          <Button
            onClick={handleViewFull}
            size="small"
            sx={{ minWidth: 0, p: 0.5 }}
          >
            Edit
          </Button>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ px: 4, pt: 3 }}>
          {isCoordinator ? (value ? "Edit Feedback" : "Add Feedback") : "Feedback"} for {candidateName}
        </DialogTitle>
        <DialogContent sx={{ px: 2, py: 2 }}>
          <Box sx={{ p: 2 }}>
            {isCoordinator ? (
              <TextField
                fullWidth
                variant="outlined"
                label="Feedback"
                multiline
                minRows={4}
                value={editableFeedback}
                onChange={(e) => setEditableFeedback(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <Typography whiteSpace="pre-line">
                {value}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3 }}>
          <Button onClick={handleCloseDialog}>
            {isCoordinator ? "Cancel" : "Close"}
          </Button>
          {isCoordinator && (
            <Button 
              onClick={handleSubmitFeedback} 
              variant="contained"
              color="primary"
              disabled={!editableFeedback.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} />
              ) : (
                value ? "Update" : "Submit"
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InternalFeedbackCell;