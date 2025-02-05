import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Container, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TablePagination, Alert, Snackbar, CircularProgress, TextField, Grid, Checkbox, MenuItem, Select, ListItemText, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../redux/features/employeesSlice";
//import appconfig.PROD_appconfig.PROD_BASE_URL from "../../redux/apiConfig";
import CellContent from "./CellContent"; // Import the CellContent component
import RequirementsTable from "./RequirementsTable"; // Import the table component




const appconfig = require("../../redux/apiConfig");

// ✅ Directly use the production URL
const BASE_URL = appconfig.PROD_appconfig.PROD_BASE_URL;

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
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [jobToDeleteDetails, setJobToDeleteDetails] = useState({ jobId: "" });

  const recruiters = employeesList.filter(emp => emp.roles === "EMPLOYEE" && emp.status === "ACTIVE");

  useEffect(() => {
    dispatch(fetchEmployees());
    fetchRequirements();
  }, [dispatch]);

  const fetchRequirements = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/requirements/getAssignments`);
      setRequirementsList(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load job requirements");
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (job) => {
    setEditFormData({ ...job, recruiterName: Array.isArray(job.recruiterName) ? job.recruiterName.join(", ") : job.recruiterName, recruiterIds: Array.isArray(job.recruiterIds) ? job.recruiterIds.join(", ") : job.recruiterIds });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const recruiterNames = editFormData.recruiterName ? editFormData.recruiterName.split(",").map((name) => name.trim()) : [];
      const recruiterIds = editFormData.recruiterIds ? editFormData.recruiterIds.split(",").map((id) => id.trim()) : [];
      const updatedFormData = { ...editFormData, recruiterIds, recruiterName: recruiterNames };

      await axios.put(`${BASE_URL}/requirements/updateRequirement/${updatedFormData.jobId}`, updatedFormData);

      setSnackbar({ open: true, message: "Job requirement updated successfully", severity: "success" });
      handleCloseEditDialog();
      fetchRequirements();
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to update job requirement", severity: "error" });
    }
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setJobToDeleteDetails({ jobId: job });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/requirements/deleteRequirement/${jobToDelete}`);
      setSnackbar({ open: true, message: "Job requirement deleted successfully", severity: "success" });
      fetchRequirements();
      setJobToDeleteDetails({ jobId: "" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to delete job requirement", severity: "error" });
    }
    setDeleteDialogOpen(false);
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const handleSelectRecruiter = (event) => {
    const selectedNames = event.target.value;
    setEditFormData(prev => ({
      ...prev,
      recruiterName: selectedNames.join(", "),
      recruiterIds: selectedNames.map(name => recruiters.find(emp => emp.userName === name)?.employeeId).join(", ")
    }));
  };

  const paginatedData = requirementsList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, backgroundColor: "rgba(232, 245, 233)", color: "primary.main", padding: "10px", borderRadius: 1 }}>
          Requirements List
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        ) : (
          <>
            <RequirementsTable
              requirementsList={paginatedData}
              handleEdit={handleEdit}
              handleDeleteClick={handleDeleteClick}
              recruiters={recruiters}
            />

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
              <DialogTitle sx={{ backgroundColor: "#00796b", color: "white" }}>Edit Job Requirement</DialogTitle>
              <DialogContent sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  {Object.keys(editFormData)
                    .filter(key => key !== "requirementAddedTimeStamp" && key !== "status" && key !== "recruiterIds" && key !== "recruiterName")
                    .map(key => (
                      <Grid item xs={12} sm={6} key={key}>
                        <TextField
                          name={key}
                          label={key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                          value={editFormData[key] || ""}
                          onChange={handleInputChange}
                          fullWidth
                          variant="outlined"
                          disabled={key === "jobId"}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                    ))}

                  <Grid item xs={12} sm={6}>
                    <Select
                      multiple
                      value={editFormData.recruiterName ? editFormData.recruiterName.split(", ") : []}
                      onChange={handleSelectRecruiter}
                      renderValue={selected => selected.join(", ")}
                      fullWidth
                      sx={{ minHeight: 56 }}
                      MenuProps={{ PaperProps: { style: { maxHeight: 250, overflow: "auto" } } }}
                    >
                      <Typography variant="subtitle2" sx={{ px: 2, py: 1, backgroundColor: "primary.light", color: "white" }}>
                        Available Recruiters
                      </Typography>
                      {recruiters.map(emp => (
                        <MenuItem key={emp.employeeId} value={emp.userName}>
                          <Checkbox checked={editFormData.recruiterName ? editFormData.recruiterName.split(", ").includes(emp.userName) : false} />
                          <ListItemText primary={emp.userName} />
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
 {/* Recruiter IDs (disabled) */}
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
                <Button onClick={handleCloseEditDialog} variant="outlined" color="primary">
                  Cancel
                </Button>
                <Button onClick={handleSubmitEdit} variant="contained" color="primary">
                  Update
                </Button>
              </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
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
                  Are you sure you want to delete this job requirement?
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  Job ID: {jobToDeleteDetails.jobId}
                </Typography>
                <Typography sx={{ mt: 1 }}>This action cannot be undone.</Typography>
              </DialogContent>
              <DialogActions sx={{ p: 2, backgroundColor: "grey.50" }}>
                <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor: "primary.main",
                    color: "#fff",
                  }}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
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
