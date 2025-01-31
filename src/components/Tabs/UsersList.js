import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  updateEmployee,
  deleteEmployee,
  resetUpdateStatus,
} from "../../redux/features/employeesSlice";
import {
  CircularProgress,
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
  TextField,
  Stack,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Autocomplete,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const UsersList = () => {
  const dispatch = useDispatch();
  const { employeesList, fetchStatus, fetchError, updateStatus, updateError } =
    useSelector((state) => state.employees);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const VALID_ROLES = ["SUPERADMIN", "EMPLOYEE", "ADMIN"];

  // Regular expressions for validation
  const personalEmailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;
  const emailRegex = /^[a-z0-9._%+-]+@dataqinc\.com$/;
  const phoneRegex = /^[0-9]{10}$/;
  const userIdRegex = /^DQIND\d{2,4}$/;

  const [formErrors, setFormErrors] = useState({
    personalemail: "",
    email: "",
    phoneNumber: "",
    employeeId: "",
  });

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (updateStatus === "succeeded") {
      setSnackbar({
        open: true,
        message: "Employee updated successfully!",
        severity: "success",
      });
      handleCloseEditDialog();
      dispatch(fetchEmployees());
    } else if (updateStatus === "failed") {
      setSnackbar({
        open: true,
        message: updateError || "Failed to update employee",
        severity: "error",
      });
    }
  }, [updateStatus, updateError, dispatch]);

  const handleDeleteEmployee = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      dispatch(deleteEmployee(employeeToDelete)).then(() => {
        setSnackbar({
          open: true,
          message: "Employee deleted successfully!",
          severity: "success",
        });
        dispatch(fetchEmployees());
      });
    }
    handleCloseDeleteDialog();
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenEditDialog = (employee) => {
    setSelectedEmployee(employee);
    const currentRoles = Array.isArray(employee.roles)
      ? employee.roles
      : typeof employee.roles === "string"
      ? employee.roles.split(", ")
      : [];
  
    setEditFormData({
      ...employee,
      roles: currentRoles,
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedEmployee(null);
    setEditFormData({});
    setFormErrors({});
    dispatch(resetUpdateStatus());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Basic validation on each input field
    let errors = { ...formErrors };

    if (name === "personalemail" && !personalEmailRegex.test(value)) {
      errors.personalemail = "Invalid Gmail address";
    } else if (name === "employeeId" && !emailRegex.test(value)) {
      errors.email = "Invalid DataQ email address";
    } else if (name === "phoneNumber" && !phoneRegex.test(value)) {
      errors.phoneNumber = "Phone number must be 10 digits";
    } else if (name === "userId" && !userIdRegex.test(value)) {
      errors.userId = "User ID must match DQINDXX format";
    } else {
      errors[name] = "";
    }

    setFormErrors(errors);

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
  
    // Prevent SuperAdmin from editing their role
    if (
      selectedEmployee &&
      selectedEmployee.roles.includes("SUPERADMIN") &&
      editFormData.roles.includes("SUPERADMIN")
    ) {
      setSnackbar({
        open: true,
        message: "SuperAdmin role cannot be changed by SuperAdmin.",
        severity: "error",
      });
      return;
    }
  
    // Validate all fields before submission
    const errors = {};
    if (editFormData.personalemail && !personalEmailRegex.test(editFormData.personalemail)) {
      errors.personalemail = "Invalid Gmail address";
    }
    if (!editFormData.roles || editFormData.roles.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one role.",
        severity: "error",
      });
      return;
    }
  
    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
  
    const normalizedData = {
      ...editFormData,
      personalemail: editFormData.personalemail,
      roles: Array.isArray(editFormData.roles) ? editFormData.roles : [editFormData.roles],
    };
  
    dispatch(updateEmployee(normalizedData));
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const paginatedEmployees = employeesList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 12 }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: "#f5f5f5" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 600,
            backgroundColor: "#00796b",
            color: "#fff",
            padding: "10px",
          }}
        >
          Employees List
        </Typography>

        {fetchStatus === "loading" && (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        )}

        {fetchStatus === "failed" && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {fetchError}
          </Alert>
        )}

        {fetchStatus === "succeeded" && (
          <TableContainer
            sx={{ border: "1px solid #ddd", overflow: "auto", maxHeight: 500 }}
          >
            <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
              <TableHead sx={{ backgroundColor: "#00796b" }}>
                <TableRow>
                  {Object.keys(employeesList[0] || {}).map((key) => (
                    <TableCell
                      key={key}
                      sx={{
                        fontWeight: "bold",
                        color: "#fff",
                        border: "1px solid #ddd",
                      }}
                    >
                      {key.charAt(0).toUpperCase() +
                        key.slice(1).replace(/([A-Z])/g, " $1")}
                    </TableCell>
                  ))}
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
                {paginatedEmployees.map((employee) => (
                  <TableRow key={employee.employeeId} hover>
                    {Object.keys(employee).map((key, index) => (
                      <TableCell key={index} sx={{ border: "1px solid #ddd" }}>
                        {key === "employeeId" ? (
                          <Box display="flex" alignItems="center">
                            <Typography>{employee[key]}</Typography>
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenEditDialog(employee)}
                              sx={{ ml: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Box>
                        ) : Array.isArray(employee[key]) ? (
                          employee[key].join(", ")
                        ) : (
                          employee[key]
                        )}
                      </TableCell>
                    ))}
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteEmployee(employee.employeeId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={employeesList.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
        )}

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

        {/* Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          fullWidth
          sx={{
            maxWidth: 500,
          }}
        >
          <DialogTitle>Edit Employee Details</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={2}>
              {selectedEmployee &&
                Object.keys(selectedEmployee).map((key) =>
                  key === "roles" ? (
                    <Autocomplete
                      key={key}
                      
                      options={VALID_ROLES}
                      value={editFormData.roles || []}
                      onChange={(event, newValue) => {
                        setEditFormData((prev) => ({
                          ...prev,
                          roles: newValue,
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Roles"
                          placeholder="Select roles"
                          disabled={selectedEmployee && selectedEmployee.roles.includes("SUPERADMIN")}
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            key={index}
                            label={option}
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                    />
                  ) : key === "status" ? (
                    <FormControl fullWidth key={key}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={editFormData.status || "INACTIVE"}
                        onChange={handleInputChange}
                        label="Status"
                      >
                        <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                        <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                      </Select>
                    </FormControl>
                  ) : key === "employeeId" ? (
                    <TextField
                      key={key}
                      label="Employee ID"
                      value={editFormData[key] || ""}
                      disabled
                      fullWidth
                    />
                  ) : key === "email" ? (
                    <TextField
                      key={key}
                      label="Employee Email"
                      value={editFormData[key] || ""}
                      disabled
                      fullWidth
                    />
                  ) : key === "personalemail" ? (
                    <TextField
                      key={key}
                      label="Personal Email"
                      name="personalemail"
                      value={editFormData[key] || ""}
                      onChange={handleInputChange}
                      error={!!formErrors.personalemail}
                      helperText={formErrors.personalemail}
                      fullWidth
                    />
                  ) : (
                    <TextField
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      name={key}
                      value={editFormData[key] || ""}
                      onChange={handleInputChange}
                      fullWidth
                      error={!!formErrors[key]}
                      helperText={formErrors[key]}
                    />
                  )
                )}
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
            <Button onClick={handleSubmitEdit} variant="contained" color="primary">
              Update User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <Typography id="alert-dialog-description">
              Are you sure you want to delete this employee?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleConfirmDelete} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default UsersList;