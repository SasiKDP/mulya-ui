import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  Snackbar,
  CircularProgress,
  TextField,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDialog from "../MuiComponents/CustomDialog";
import BASE_URL from "../../redux/apiConfig";

const Requirements = () => {
  const user = useSelector((state) => state.auth.user);
  const [requirementsList, setRequirementsList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [fullDescription, setFullDescription] = useState("");
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/requirements/getAssignments`
      );
      setRequirementsList(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load job requirements");
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (description, jobTitle) => {
    setFullDescription(description);
    setCurrentJobTitle(jobTitle);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleEdit = (job) => {
    setEditFormData(job);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BASE_URL}/requirements/updateRequirement/${editFormData.jobId}`,
        editFormData
      );
      setSnackbar({
        open: true,
        message: "Job requirement updated successfully",
        severity: "success",
      });
      handleCloseEditDialog();
      fetchRequirements();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update job requirement",
        severity: "error",
      });
    }
  };

  const handleDeleteClick = (jobId) => {
    setJobToDelete(jobId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/requirements/deleteRequirement/${jobToDelete}`
      );
      setSnackbar({
        open: true,
        message: "Job requirement deleted successfully",
        severity: "success",
      });
      fetchRequirements();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to delete job requirement",
        severity: "error",
      });
    }
    setDeleteDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const paginatedData = requirementsList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: "#f5f5f5" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            backgroundColor: "rgba(232, 245, 233)",
            color: "primary.main",
            padding: "10px",
            borderRadius: 1,
          }}
        >
          Requirements List
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : (
          <TableContainer
            sx={{ border: "1px solid #ddd", overflow: "auto", maxHeight: 500 }}
          >
            <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
              <TableHead sx={{ backgroundColor: "#00796b" }}>
                <TableRow>
                  {Object.keys(requirementsList[0] || {}).map(
                    (key) =>
                      key !== "requirementAddedTimeStamp" &&
                      key !== "recruiterIds" &&
                      key !== "recruiterName" && (
                        <TableCell
                          key={key}
                          sx={{
                            fontWeight: "bold",
                            color: "#fff",
                            border: "1px solid #ddd",
                          }}
                        >
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </TableCell>
                      )
                  )}
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#fff",
                      border: "1px solid #ddd",
                    }}
                  >
                    Recruiter IDs
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#fff",
                      border: "1px solid #ddd",
                    }}
                  >
                    Recruiter Names
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#fff",
                      border: "1px solid #ddd",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.jobId} hover>
                    {Object.keys(row)
                      .filter(
                        (key) =>
                          key !== "recruiterIds" &&
                          key !== "requirementAddedTimeStamp" &&
                          key !== "recruiterName"
                      )
                      .map((key) => (
                        <TableCell key={key} sx={{ border: "1px solid #ddd" }}>
                          {key === "jobId" ? (
                            <Box display="flex" alignItems="center">
                              <Typography>{row[key]}</Typography>
                              <IconButton
                                color="primary"
                                onClick={() => handleEdit(row)}
                                sx={{ ml: 1 }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Box>
                          ) : key === "jobDescription" ? (
                            <>
                              {row[key].length > 20
                                ? `${row[key].slice(0, 30)}...`
                                : row[key]}
                              {row[key].length > 30 && (
                                <Button
                                  size="small"
                                  onClick={() =>
                                    handleOpenDialog(row[key], row.jobTitle)
                                  }
                                  sx={{ ml: 1 }}
                                >
                                  View More
                                </Button>
                              )}
                            </>
                          ) : (
                            row[key]
                          )}
                        </TableCell>
                      ))}
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {row.recruiterIds
                        ? row.recruiterIds.join(", ")
                        : "No recruiter"}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {Array.isArray(row.recruiterName)
                        ? row.recruiterName.join(", ")
                        : row.recruiterName || "No recruiter"}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(row.jobId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Keep all existing dialogs and other components */}
        <CustomDialog
          open={openDialog}
          onClose={handleCloseDialog}
          title={currentJobTitle}
          content={fullDescription}
        />

        <Dialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Job Requirement</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {Object.keys(editFormData)
                .filter(
                  (key) =>
                    key !== "recruiterIds" &&
                    key !== "requirementAddedTimeStamp" &&
                    key !== "recruiterName"
                )
                .map((key) => (
                  <TextField
                    key={key}
                    name={key}
                    label={key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    value={editFormData[key] || ""}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                  />
                ))}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseEditDialog}
              color="primary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitEdit}
              color="primary"
              variant="contained"
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this job requirement?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        <TablePagination
          component="div"
          count={requirementsList.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default Requirements;
