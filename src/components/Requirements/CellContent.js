import React, { useState } from "react";
import { TableCell, Box, Typography, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CellContent = ({ content, title }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const MAX_CELL_LENGTH = 15;

  const truncatedContent = content?.length > MAX_CELL_LENGTH ? `${content.slice(0, MAX_CELL_LENGTH)}...` : content;

  return (
    <TableCell sx={{ border: "1px solid #ddd", minWidth: "100px", maxWidth: "200px" }}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography noWrap>{truncatedContent}</Typography>
        {content?.length > MAX_CELL_LENGTH && (
          <Tooltip title="View Full Content">
            <IconButton size="small" onClick={() => setDialogOpen(true)} sx={{ color: "primary.main", "&:hover": { backgroundColor: "rgba(0, 121, 107, 0.08)" } }}>
              <span className="material-icons-outlined" style={{ fontSize: "14px" }}>See more</span>
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", maxHeight: 500 } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#00796b", color: "white", p: 2 }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton size="small" onClick={() => setDialogOpen(false)} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1, position: "relative" }}>
            <Typography sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.6 }}>{content}</Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => setDialogOpen(false)} sx={{ backgroundColor: "primary.main", "&:hover": { backgroundColor: "primary.dark" } }}>Close</Button>
        </DialogActions>
      </Dialog>
    </TableCell>
  );
};

export default CellContent;