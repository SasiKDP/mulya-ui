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

  const handleChange = (event) => {
    const selectedNames = event.target.value;

    // Extract recruiterIds, recruiterEmails, and recruiterNames
    const selectedRecruiters = recruiters.filter((emp) =>
      selectedNames.includes(emp.userName)
    );

    const recruiterIds = selectedRecruiters.map((emp) => emp.employeeId);
    const recruiterEmails = selectedRecruiters.map((emp) => emp.email);
    const recruiterNames = selectedRecruiters.map((emp) => emp.userName);

    // Set recruiter details in Formik
    setFieldValue("recruiterName", recruiterNames);
    setFieldValue("recruiterIds", recruiterIds);
    setFieldValue("recruiterEmails", recruiterEmails);
  };

  return (
    <Grid item xs={12} md={5}>
      <FormControl fullWidth error={touched.recruiterName && Boolean(errors.recruiterName)}>
        <InputLabel>Select Recruiters</InputLabel>
        <Select
          multiple
          value={Array.isArray(values.recruiterName) ? values.recruiterName : []}
          onChange={handleChange}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={{
            PaperProps: {
              style: { maxHeight: 300 }, // Scrollable dropdown
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
                <ListItemText primary={`${emp.userName} (${emp.email})`} />
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
