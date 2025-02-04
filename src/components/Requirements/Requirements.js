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
  Grid,
  Checkbox,
  MenuItem,
  Select,
  ListItemText,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../redux/features/employeesSlice";
import BASE_URL from "../../redux/apiConfig";

// CellContent component for handling table cell display and dialog
const CellContent = ({ content, title }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const MAX_CELL_LENGTH = 15;

  const truncatedContent =
    content?.length > MAX_CELL_LENGTH
      ? `${content.slice(0, MAX_CELL_LENGTH)}...`
      : content;

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <TableCell
      sx={{
        border: "1px solid #ddd",
        minWidth: "100px",
        maxWidth: "200px",
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Typography noWrap>{truncatedContent}</Typography>
        {content?.length > MAX_CELL_LENGTH && (
          <Tooltip title="View Full Content">
            <IconButton
              size="small"
              onClick={() => setDialogOpen(true)}
              sx={{
                color: "primary.main",
                "&:hover": { backgroundColor: "rgba(0, 121, 107, 0.08)" },
              }}
            >
              <span
                className="material-icons-outlined"
                style={{ fontSize: "14px" }}
              >
                See more
              </span>
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            maxHeight: 500,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#00796b",
            color: "white",
            p: 2,
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <IconButton
            size="small"
            onClick={() => setDialogOpen(false)}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              position: "relative",
            }}
          >
            <Typography
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 1.6,
              }}
            >
              {content}
            </Typography>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={() => setDialogOpen(false)}
            sx={{
              backgroundColor: "primary.main",
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </TableCell>
  );
};

const Requirements = () => {
  const dispatch = useDispatch();
  const { employeesList } = useSelector((state) => state.employees);
  const [requirementsList, setRequirementsList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Filter active recruiters
  const recruiters = employeesList.filter(
    (emp) => emp.roles === "EMPLOYEE" && emp.status === "ACTIVE"
  );

  useEffect(() => {
    dispatch(fetchEmployees());
    fetchRequirements();
  }, [dispatch]);

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

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Edit handlers
  const handleEdit = (job) => {
    setEditFormData({
      ...job,
      recruiterName: Array.isArray(job.recruiterName)
        ? job.recruiterName.join(", ")
        : job.recruiterName,
      recruiterIds: Array.isArray(job.recruiterIds)
        ? job.recruiterIds.join(", ")
        : job.recruiterIds,
    });
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
      const recruiterNames = editFormData.recruiterName
        ? editFormData.recruiterName.split(",").map((name) => name.trim())
        : [];

      const recruiterIds = editFormData.recruiterIds
        ? editFormData.recruiterIds.split(",").map((id) => id.trim())
        : [];

      const updatedFormData = {
        ...editFormData,
        recruiterIds,
        recruiterName: recruiterNames,
      };

      await axios.put(
        `${BASE_URL}/requirements/updateRequirement/${updatedFormData.jobId}`,
        updatedFormData
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

  // Delete handlers
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

  // Snackbar handler
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Recruiter selection handler
  const handleSelectRecruiter = (event) => {
    const selectedNames = event.target.value;
    setEditFormData((prev) => ({
      ...prev,
      recruiterName: selectedNames.join(", "),
      recruiterIds: selectedNames
        .map(
          (name) => recruiters.find((emp) => emp.userName === name)?.employeeId
        )
        .join(", "),
    }));
  };

  // Pagination calculation
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
          <>
            <TableContainer
              sx={{
                border: "1px solid #ddd",
                borderRadius: 1,
                overflow: "auto",
                maxHeight: 500,
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {Object.keys(requirementsList[0] || {})
                      .filter(
                        (key) =>
                          key !== "requirementAddedTimeStamp" &&
                          key !== "recruiterIds" &&
                          key !== "recruiterName"
                      )
                      .map((key) => (
                        <TableCell
                          key={key}
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: "#00796b",
                            color: "white",
                            border: "1px solid #ddd",
                          }}
                        >
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </TableCell>
                      ))}
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#00796b",
                        color: "white",
                        border: "1px solid #ddd",
                      }}
                    >
                      Recruiter IDs
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#00796b",
                        color: "white",
                        border: "1px solid #ddd",
                      }}
                    >
                      Recruiter Names
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#00796b",
                        color: "white",
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
                      {Object.entries(row)
                        .filter(
                          ([key]) =>
                            key !== "recruiterIds" &&
                            key !== "requirementAddedTimeStamp" &&
                            key !== "recruiterName"
                        )
                        .map(([key, value]) => (
                          <CellContent
                            key={key}
                            content={String(value)}
                            title={key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          />
                        ))}
                      <CellContent
                        content={row.recruiterIds?.join(", ") || "No recruiter"}
                        title="Recruiter IDs"
                      />
                      <CellContent
                        content={
                          Array.isArray(row.recruiterName)
                            ? row.recruiterName.join(", ")
                            : row.recruiterName || "No recruiter"
                        }
                        title="Recruiter Names"
                      />
                      <TableCell
                        sx={{
                          border: "1px solid #ddd",
                          display: "flex",
                          alignItems: "center",
                          gap: 1, // Adds spacing between icons
                        }}
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(row)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(row.jobId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Edit Dialog */}
            <Dialog
              open={editDialogOpen}
              onClose={handleCloseEditDialog}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle
                sx={{
                  backgroundColor: "#00796b",
                  color: "white",
                }}
              >
                Edit Job Requirement
              </DialogTitle>
              <DialogContent sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  {Object.keys(editFormData)
                    .filter(
                      (key) =>
                        key !== "requirementAddedTimeStamp" &&
                        key !== "status" &&
                        key !== "recruiterIds" &&
                        key !== "recruiterName"
                    )
                    .map((key) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <TextField
                          name={key}
                          label={key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                          value={editFormData[key] || ""}
                          onChange={handleInputChange}
                          fullWidth
                          variant="outlined"
                          disabled={key === "jobId"}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                    ))}

                  {/* Recruiter Selection */}
                  <Grid item xs={12} sm={6}>
                    <Select
                      multiple
                      value={
                        editFormData.recruiterName
                          ? editFormData.recruiterName.split(", ")
                          : []
                      }
                      onChange={handleSelectRecruiter}
                      renderValue={(selected) => selected.join(", ")}
                      fullWidth
                      sx={{ minHeight: 56 }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 250,
                            overflow: "auto",
                          },
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          px: 2,
                          py: 1,
                          backgroundColor: "primary.light",
                          color: "white",
                        }}
                      >
                        Available Recruiters
                      </Typography>
                      {recruiters.map((emp) => (
                        <MenuItem key={emp.employeeId} value={emp.userName}>
                          <Checkbox
                            checked={
                              editFormData.recruiterName
                                ? editFormData.recruiterName
                                    .split(", ")
                                    .includes(emp.userName)
                                : false
                            }
                          />
                          <ListItemText primary={emp.userName} />
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="recruiterIds"
                      label="Recruiter IDs"
                      value={editFormData.recruiterIds || ""}
                      fullWidth
                      variant="outlined"
                      disabled
                      helperText="Auto-generated from selected recruiters"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2, backgroundColor: "grey.50" }}>
                <Button
                  onClick={handleCloseEditDialog}
                  variant="outlined"
                  color="primary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitEdit}
                  variant="contained"
                  color="primary"
                >
                  Update
                </Button>
              </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              maxWidth="sm"
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <DialogTitle
                sx={{
                  backgroundColor: "#00796b",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <DeleteIcon />
                Confirm Delete
              </DialogTitle>
              <DialogContent sx={{ mt: 2 }}>
                <Typography>
                  Are you sure you want to delete this job requirement? This
                  action cannot be undone.
                </Typography>
              </DialogContent>
              <DialogActions sx={{ p: 2, backgroundColor: "grey.50" }}>
                <Button
                  onClick={() => setDeleteDialogOpen(false)}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  variant="contained"
                  color="primary" // For primary button color (background)
                  sx={{
                    backgroundColor: "primary.main", // Custom background color using theme
                    color: "#fff", // Text color
                  }}
                  startIcon={<DeleteIcon />}
                >
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
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={requirementsList.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                backgroundColor: "white",
                borderTop: "1px solid #ddd",
              }}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Requirements;
