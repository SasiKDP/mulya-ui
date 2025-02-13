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
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../redux/features/employeesSlice";
import RequirementsTable from "./RequirementsTable";
import BASE_URL from "../../redux/config";

const Requirements = () => {
  const dispatch = useDispatch();
  const { employeesList } = useSelector((state) => state.employees);
  const [requirementsList, setRequirementsList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  const handleEdit = (job) => {
    // Ensure unique recruiter IDs and names while editing
    const uniqueRecruiters = job.recruiterIds
      ? job.recruiterIds.map((id, index) => ({
          id,
          name: job.recruiterName[index] || "",
        }))
      : [];
  
    const filteredRecruiters = uniqueRecruiters.reduce((acc, emp) => {
      if (emp.id && !acc.some((e) => e.id === emp.id)) {
        acc.push(emp);
      }
      return acc;
    }, []);
  
    setEditFormData({
      ...job,
      recruiterName: filteredRecruiters.map((emp) => emp.name),
      recruiterIds: filteredRecruiters.map((emp) => emp.id),
    });
  
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = {
        ...editFormData,
        recruiterIds: editFormData.recruiterIds,
        recruiterName: editFormData.recruiterName,
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

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
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

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleSelectRecruiter = (event) => {
    const selectedNames = event.target.value;
    const selectedRecruiters = selectedNames.map(
      (name) => recruiters.find((emp) => emp.userName === name)
    );
  
    // Ensure unique recruiter IDs
    const uniqueRecruiters = selectedRecruiters.reduce((acc, emp) => {
      if (emp && !acc.some((e) => e.employeeId === emp.employeeId)) {
        acc.push(emp);
      }
      return acc;
    }, []);
  
    setEditFormData((prev) => ({
      ...prev,
      recruiterName: uniqueRecruiters.map((emp) => emp.userName),
      recruiterIds: uniqueRecruiters.map((emp) => emp.employeeId),
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 1, backgroundColor: "#f5f5f5" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            backgroundColor: "#00796b",
            color: "white",
            padding: 2,
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
            <RequirementsTable
              requirementsList={requirementsList}
              handleEdit={handleEdit}
              handleDeleteClick={handleDeleteClick}
              recruiters={recruiters}
            />

            {/* Edit Dialog */}
            <Dialog
              open={editDialogOpen}
              onClose={handleCloseEditDialog}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle
                sx={{ backgroundColor: "#004d40", color: "white" }}
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
                        />
                      </Grid>
                    ))}

                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ overflowY: "auto", maxHeight: 400 }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Select Recruiters
                    </Typography>
                    <Select
                      multiple
                      value={editFormData.recruiterName || []}
                      onChange={handleSelectRecruiter}
                      renderValue={(selected) => selected.join(", ")}
                      fullWidth
                      sx={{ minHeight: 56 }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 300, // Limit dropdown height
                            overflowY: "auto", // Enable scrollbar
                          },
                        },
                      }}
                    >
                      {recruiters.map((emp) => (
                        <MenuItem key={emp.employeeId} value={emp.userName}>
                          <Checkbox
                            checked={
                              Array.isArray(editFormData.recruiterName) &&
                              editFormData.recruiterName.includes(emp.userName)
                            }
                          />
                          <ListItemText primary={emp.userName} />
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2, backgroundColor: "grey.100" }}>
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

            {/* Delete Dialog */}
            <Dialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              maxWidth="sm"
            >
              <DialogTitle
                sx={{ backgroundColor: "#00796b", color: "white" }}
              >
                Confirm Delete
              </DialogTitle>
              <DialogContent sx={{ mt: 2 }}>
                <Typography>
                  Are you sure you want to delete this job requirement?
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  Job ID: {jobToDelete}
                </Typography>
              </DialogContent>
              <DialogActions sx={{ p: 2, backgroundColor: "grey.100" }}>
                <Button
                  onClick={() => setDeleteDialogOpen(false)}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  variant="contained"
                  color="#fff"
                  backgroundColor='#00796b'
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
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Requirements;
