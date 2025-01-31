import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Box,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  AlertTitle,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import BASE_URL from "../../redux/apiConfig";
import CustomDialog from "../MuiComponents/CustomDialog";

const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const [dialogOpen, setDialogOpen] = useState(false); // State to manage dialog visibility
  const [feedbackContent, setFeedbackContent] = useState(""); // Store feedback content
  const [fullFeedback, setFullFeedback] = useState(""); // Store full content of feedback for the dialog
  const [isContentTruncated, setIsContentTruncated] = useState(false); // Track if content is truncated

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/candidate/submissions/allsubmittedcandidates`
        );
        setSubmissions(response.data);
      } catch (err) {
        setError(err.message || "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const generateColumns = (data) => {
    if (!data.length) return [];
    return Object.keys(data[0]).map((key) => ({
      key,
      label: key
        .split(/(?=[A-Z])/)
        .join(" ")
        .replace(/^./, (str) => str.toUpperCase()),
    }));
  };

  const columns = generateColumns(submissions);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when rows per page changes
  };

  const handleOpenDialog = (feedback) => {
    if (feedback.length > 15) {
      setFeedbackContent(feedback.slice(0, 15)); // Display only first 15 characters initially
      setFullFeedback(feedback); // Store the full feedback
      setIsContentTruncated(true); // Mark content as truncated
    } else {
      setFeedbackContent(feedback); // If content is short, display it fully
      setFullFeedback(feedback);
      setIsContentTruncated(false); // No truncation
    }
    setDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Close the dialog
    setFeedbackContent(""); // Clear feedback content
    setFullFeedback(""); // Clear full content
    setIsContentTruncated(false); // Reset truncation state
  };

  const handleSeeMore = () => {
    setFeedbackContent(fullFeedback); // Display full content in the dialog
    setIsContentTruncated(false); // Set truncation flag to false
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper
        elevation={2}
        sx={{
          overflow: "auto",
          borderRadius: 2,
          height: 600,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              backgroundColor: "rgba(232, 245, 233)",
              color: "#000",
              px: 2,
              py: 1,
              borderRadius: 1,
              mb: 3,
            }}
          >
             Submitted candidates
          </Typography>

          <TableContainer
            sx={{ border: "1px solid #ddd", overflow: "auto", maxHeight: 500 }}
          >
            <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
              <TableHead sx={{ backgroundColor: "#00796b" }}>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      sx={{
                        fontWeight: "bold",
                        color: "#fff",
                        border: "1px solid #ddd",
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.jobId} hover>
                      {columns.map((col) => (
                        <TableCell
                          key={col.key}
                          sx={{ border: "1px solid #ddd" }}
                          onClick={
                            col.key === "overallFeedback" &&
                            row[col.key]?.length > 15 // Check if feedback length is greater than 15
                              ? () => handleOpenDialog(row[col.key])
                              : undefined
                          }
                        >
                          {col.key === "overallFeedback" ? (
                            <>
                              {row[col.key]?.slice(0, 15)}{" "}
                              {row[col.key]?.length > 15 && (
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={() => handleOpenDialog(row[col.key])}
                                  sx={{ padding: 0, minWidth: "auto" }}
                                >
                                  See More
                                </Button>
                              )}
                            </>
                          ) : (
                            row[col.key]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={submissions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>

      {/* Dialog Box to show the full content of the overallFeedback */}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Overall Feedback</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{fullFeedback}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AllSubmissions;
