import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Stack,
  useTheme,
} from "@mui/material";

const VALID_ROLES = ["SUPERADMIN", "EMPLOYEE", "ADMIN"];
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

const EditEmployeeDialog = ({ open, onClose, employee, onSave }) => {
  const theme = useTheme();
  const [editFormData, setEditFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Update editFormData when the employee prop changes
  useEffect(() => {
    if (employee) {
      setEditFormData({
        ...employee,
        role: employee.roles?.[0] || "", // Set the first role as the selected role
      });
    }
  }, [employee]);

  // Handle input changes dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Dynamic validation
  const validateForm = () => {
    const errors = {};
    const requiredFields = ["firstName", "lastName", "role", "status"];
    requiredFields.forEach((field) => {
      if (!editFormData[field]?.trim()) {
        errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });
    if (editFormData.phone && !/^\d{10}$/.test(editFormData.phone)) {
      errors.phone = "Phone must be 10 digits";
    }
    return errors;
  };

  // Handle form submission
  const handleSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    onSave(editFormData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        Edit Employee Details
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2}>
          {Object.keys(employee || {}).map((key) => {
            // Disable non-editable fields
            const isDisabled = ["employeeId", "email", "personalemail"].includes(key);

            if (key === "role") {
              return (
                <FormControl fullWidth key={key} error={!!formErrors[key]}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name={key}
                    value={editFormData[key] || ""}
                    onChange={handleInputChange}
                  >
                    {VALID_ROLES.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors[key] && <FormHelperText>{formErrors[key]}</FormHelperText>}
                </FormControl>
              );
            }

            if (key === "status") {
              return (
                <FormControl fullWidth key={key} error={!!formErrors[key]}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name={key}
                    value={editFormData[key] || ""}
                    onChange={handleInputChange}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors[key] && <FormHelperText>{formErrors[key]}</FormHelperText>}
                </FormControl>
              );
            }

            return (
              <TextField
                key={key}
                label={key.replace(/([A-Z])/g, " $1")}
                name={key}
                value={editFormData[key] || ""}
                onChange={handleInputChange}
                fullWidth
                disabled={isDisabled}
                error={!!formErrors[key]}
                helperText={formErrors[key]}
                InputProps={
                  isDisabled
                    ? { sx: { backgroundColor: theme.palette.action.disabledBackground } }
                    : {}
                }
              />
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployeeDialog;