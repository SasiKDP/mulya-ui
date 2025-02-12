import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Tooltip,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomDialog from "../MuiComponents/CustomDialog"; // Import Dialog Component

const SubmissionDataTable = ({
  data,
  columns,
  loading,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  onDownloadResume,
  onScheduleInterview,
  onEdit,
  onDelete,
  searchQuery, // 🔥 Add search query prop for filtering
}) => {
  // State for opening the dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");

  // Open Dialog and set content
  const handleDialogOpen = (title, content) => {
    setDialogTitle(title);
    setDialogContent(content);
    setDialogOpen(true);
  };

  // 🔥 Highlight function to match search text
  const highlightText = (text, highlight) => {
    if (!highlight.trim() || !text) return text;

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span
          key={index}
          style={{
            backgroundColor: "#fff3cd",
            padding: "2px",
            borderRadius: "3px",
          }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <TableContainer
        component={Paper}
        maxWidth='md'
        sx={{
          borderRadius: "8px",
          boxShadow: 2,
          overflow: "auto",
          maxHeight: 500,
          border: "1px solid #ccc", // Table border
        }}
      >
        <Table sx={{ borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#00796b" }}>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "10px",
                    border: "1px solid #ccc", // Header cell border
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No records available
                </TableCell>
              </TableRow>
            ) : (
              data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index} sx={{ border: "1px solid #ccc" }}>
                    {" "}
                    {/* Row border */}
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        sx={{
                          textAlign: "center",
                          padding: "8px",
                          border: "1px solid #ccc", // Cell border
                        }}
                      >
                        {/* Highlight text if it matches search query */}
                        {typeof row[column.key] === "string" && searchQuery ? (
                          highlightText(row[column.key], searchQuery)
                        ) : typeof row[column.key] === "string" &&
                          row[column.key].length > 15 ? (
                          <>
                            {row[column.key].substring(0, 15)}...
                            <Button
                              variant="text"
                              color="primary"
                              onClick={() =>
                                handleDialogOpen(column.label, row[column.key])
                              }
                              sx={{
                                marginLeft: "0.25rem",
                                textTransform: "none",
                                padding: "0.125rem 0.25rem",
                                borderRadius: "0.2rem",
                                fontWeight: "500",
                                fontSize: "0.6875rem",
                                minWidth: "auto",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <VisibilityIcon
                                sx={{
                                  marginRight: "0.125rem",
                                  fontSize: "0.875rem",
                                }}
                              />
                              See More
                            </Button>
                          </>
                        ) : column.key === "resume" ? (
                            <Typography
                            component="a"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onDownloadResume(row.candidateId);
                            }}
                            sx={{
                             
                              textDecoration: "none",
                              fontWeight: 300,
                              display: "flex",
                              alignItems: "center",
                              "&:hover": { textDecoration: "underline", color: "#1565C0" }, // Darker Blue on Hover
                            }}
                          >
                            Download <OpenInNewIcon fontSize="small" sx={{ ml: 0.5 }} />
                          </Typography>
                          ) : column.key === "schedule" ? (
                          <Typography
                            component="a"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onScheduleInterview(row);
                            }}
                            sx={{
                              
                              textDecoration: "none",
                              fontWeight: 300,
                              display: "flex",
                              alignItems: "center",
                              "&:hover": { textDecoration: "underline", color: "#2E7D32" }, // Darker Green on Hover
                            }}
                          >
                            Schedule Interview
                          </Typography>
                          
                        ) : column.key === "actions" ? (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="Edit">
                              <IconButton
                                color="primary"
                                onClick={() => onEdit(row)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                onClick={() => onDelete(row)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          row[column.key] || "-"
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Reusable Custom Dialog */}
      <CustomDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={dialogTitle}
        content={dialogContent}
      />
    </>
  );
};

export default SubmissionDataTable;
