import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  CircularProgress,
  FormHelperText,
  Grid,
} from "@mui/material";
import { fetchEmployees } from "../../redux/features/employeesSlice";

const RecruiterMultiSelect = ({ values, setFieldValue, errors, touched }) => {
  const dispatch = useDispatch();

  // Get employees data from Redux store
  const { employeesList, fetchStatus } = useSelector((state) => state.employees);

  // Filter active employees with EMPLOYEE role
  const recruiters = employeesList.filter(
    (emp) => emp.roles === "EMPLOYEE" && emp.status === "ACTIVE"
  );

  // Fetch employees on component mount
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  return (
    <Grid item xs={12} md={5}>
      <FormControl fullWidth error={touched.recruiterName && Boolean(errors.recruiterName)}>
        <InputLabel>Select Recruiters</InputLabel>
        <Select
          multiple
          value={Array.isArray(values.recruiterName) ? values.recruiterName : []}
          onChange={(event) => {
            const selectedValues = event.target.value || [];
            const selectedNames = Array.isArray(selectedValues) ? selectedValues : [selectedValues];

            const selectedIds = selectedNames
              .map((name) => {
                const employee = recruiters.find((emp) => emp.userName === name);
                return employee ? employee.employeeId : null;
              })
              .filter((id) => id !== null);

            setFieldValue("recruiterName", selectedNames);
            setFieldValue("recruiterIds", selectedIds);
          }}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300, // Scrollable dropdown
              },
            },
          }}
        >
          {/* 🔄 **Loading State** */}
          {fetchStatus === "loading" ? (
            <MenuItem disabled>
              <CircularProgress size={20} sx={{ marginRight: 1 }} />
              Loading...
            </MenuItem>
          ) : recruiters.length > 0 ? (
            recruiters.map((emp) => (
              <MenuItem key={emp.employeeId} value={emp.userName}>
                <Checkbox checked={values.recruiterName.includes(emp.userName)} />
                <ListItemText primary={emp.userName} />
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No recruiters found</MenuItem>
          )}
        </Select>

        {touched.recruiterName && errors.recruiterName && (
          <FormHelperText>{errors.recruiterName}</FormHelperText>
        )}
      </FormControl>
    </Grid>
  );
};

export default RecruiterMultiSelect;