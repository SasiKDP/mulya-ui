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

const CustomDialog = ({ open, onClose, title, content }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle sx={{ paddingRight: "16px",paddingTop:'5px', position: "relative" }}>
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
    <DialogContent>{content}</DialogContent>
  </Dialog>
);

export default CustomDialog;
