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
  Chip,Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify"; // Importing toast
import "react-toastify/dist/ReactToastify.css";

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

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (updateStatus === "succeeded") {
      toast.success("Employee updated successfully!");
      handleCloseEditDialog();
      dispatch(fetchEmployees());
    } else if (updateStatus === "failed") {
      toast.error(updateError || "Failed to update employee");
    }
  }, [updateStatus, updateError, dispatch]);

  const handleDeleteEmployee = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      dispatch(deleteEmployee(employeeToDelete)).then(() => {
        toast.success("Employee deleted successfully!");
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
    setEditFormData({
      ...employee,
      roles: Array.isArray(employee.roles) ? employee.roles : ["EMPLOYEE"],
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedEmployee(null);
    setEditFormData({});
    dispatch(resetUpdateStatus());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();

    // Ensure roles is an array before sending it to the backend
    if (!editFormData.roles || editFormData.roles.length === 0) {
      toast.error("Please select at least one role.");
      return;
    }

    const normalizedData = {
      ...editFormData,
      personalemail:
        editFormData["personal email"] || editFormData.personalemail,
      roles: Array.isArray(editFormData.roles)
        ? editFormData.roles
        : [editFormData.roles], // Ensure roles is always an array
    };

    // Dispatch the action to update the employee with the roles included
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
                        onClick={() =>
                          handleDeleteEmployee(employee.employeeId)
                        }
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
                  ) : (
                    <TextField
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      name={key}
                      value={editFormData[key] || ""}
                      onChange={handleInputChange}
                      fullWidth
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
            <Button
              onClick={handleSubmitEdit}
              variant="contained"
              color="primary"
            >
              Update User
            </Button>
          </DialogActions>
        </Dialog>

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
