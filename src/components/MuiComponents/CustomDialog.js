import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Helper function to format content
const formatContent = (content) => {
  if (typeof content !== "string") {
    console.error("Content is not a string:", content);
    return <Typography variant="body2" color="error">Invalid content format</Typography>;
  }

  const paragraphs = content.split("\n");

  return paragraphs.map((paragraph, index) => {
    const isHeading = /[A-Za-z ]+[:]/.test(paragraph);

    return (
      <Typography
        key={index}
        variant="body2"
        sx={{
          marginBottom: 2,
          fontWeight: isHeading ? "bold" : "normal",
          lineHeight: 1.6,
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
    fullWidth
    maxWidth="sm" // Decreased the max width
    sx={{
      "& .MuiDialog-paper": {
        minWidth: "300px", // Min width for the dialog
        maxWidth: "600px", // Max width for the dialog
      },
    }}
  >
    <DialogTitle sx={{ paddingRight: "16px", paddingTop: "5px", position: "relative" }}>
      <Typography
        variant="h5"
        align="start"
        color="primary"
        gutterBottom
        sx={{
          backgroundColor: "rgba(232, 245, 233)",
          padding: 1,
          borderRadius: 1,
        }}
      >
        {title}
      </Typography>

      {/* Custom close button */}
      <Button
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "#000",
        }}
      >
        <CloseIcon />
      </Button>
    </DialogTitle>
    <DialogContent
      sx={{
        padding: 2,
        maxHeight: "30vh", // Decreased height to make dialog more compact
        overflowY: "auto",
        whiteSpace: "pre-line",
      }}
    >
      {formatContent(content)}
    </DialogContent>
  </Dialog>
);

export default CustomDialog;
