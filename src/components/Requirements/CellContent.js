import React, { useState } from "react";
import {
  TableCell,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from '@mui/icons-material/Description';


const CellContent = ({ content, title, globalSearch }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const MAX_CELL_LENGTH = 15;

  // Ensure content is a string (fix for `replace` error)
  const textContent = content ? String(content) : "N/A";

  // Function to highlight the searched text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive search
    return text.replace(
      regex,
      `<mark style="background-color: yellow; color: black;">$1</mark>`
    );
  };

  // Truncate text for cell display
  const truncatedContent =
    textContent.length > MAX_CELL_LENGTH
      ? `${textContent.slice(0, MAX_CELL_LENGTH)}...`
      : textContent;

  return (
    <TableCell
      sx={{ border: "1px solid #ddd", minWidth: "100px", maxWidth: "200px" }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {/* Apply highlighting only if there's search text */}
        <Typography
          noWrap
          dangerouslySetInnerHTML={{
            __html: highlightText(truncatedContent, globalSearch),
          }}
        />

        {textContent.length > MAX_CELL_LENGTH && (
          <Tooltip title="View Full Content">
            <Button
              onClick={() => setDialogOpen(true)}
              size="small"
              startIcon={<DescriptionIcon />} // Use the same icon as job description
              sx={{ minWidth: 0 }}
            >
              View
            </Button>
          </Tooltip>
        )}
      </Box>

      {/* Full Content Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
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
            p: 2,
            fontWeight: "bold",
            borderRadius: 0.5,
          }}
        >
          <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
            {title}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setDialogOpen(false)}
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
              position: "relative",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#333",
            }}
          >
            <Typography
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              dangerouslySetInnerHTML={{
                __html: highlightText(textContent, globalSearch),
              }}
            />
          </Paper>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => setDialogOpen(false)}
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
    </TableCell>
  );
};

export default CellContent;
