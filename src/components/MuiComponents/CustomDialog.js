import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Helper function to format content
const formatContent = (content) => {
 

  const paragraphs = content.split("\n");

  return paragraphs.map((paragraph, index) => {
    const isHeading = /[A-Za-z ]+[:]/.test(paragraph);

    return (
      <Typography
        key={index}
        variant="body2"
        sx={{
          marginBottom: 1.5,
          fontWeight: isHeading ? "bold" : "normal",
          lineHeight: 1.6,
          color: isHeading ? "primary.main" : "text.secondary",
        }}
      >
        {paragraph}
      </Typography>
    );
  });
};

const CustomDialog = ({ open, onClose, title, content }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: 3,
        boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.15)",
        maxHeight: 500,
        p: 1,
        backgroundColor: "#ffffff",
      },
    }}
  >
    {/* Dialog Title */}
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#004d40",
        color: "white",
        
        fontWeight: "bold",
        borderRadius: "4px 4px 0 0",
      }}
    >
      <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
        {title}
      </Typography>
      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          color: "white",
          transition: "0.2s",
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>

    {/* Dialog Content */}
    <DialogContent sx={{ mt: 2, px: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          fontSize: "1rem",
          lineHeight: 1.6,
          color: "#333",
        }}
      >
        {formatContent(content)}
      </Paper>
    </DialogContent>

    {/* Dialog Actions */}
    <DialogActions sx={{ p: 2, justifyContent: "end" }}>
      <Button
        variant="contained"
        onClick={onClose}
        sx={{
          backgroundColor: "#00796b",
          color: "white",
          borderRadius: 2,
          px: 3,
          py: 1,
          textTransform: "none",
          fontSize: "0.95rem",
          "&:hover": { backgroundColor: "#005a4f" },
        }}
      >
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default CustomDialog;
