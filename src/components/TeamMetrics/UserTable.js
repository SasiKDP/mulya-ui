import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import DataTable from '../muiComponents/DataTabel';
import { generateColumns } from './columnUtils';

const UserTable = ({ role, title, employeesList, loading = false }) => {
  const navigate = useNavigate();

  const handleEmployeeClick = useCallback((employeeId) => {
    if (!employeeId) return;
    
    if (role === 'BDM') {
      navigate(`/dashboard/team-metrics/bdmstatus/${employeeId}`);
    } else if (role === 'TEAMLEAD' || role === "EMPLOYEE") {
      navigate(`/dashboard/team-metrics/employeestatus/${employeeId}`);
    } else {
      navigate(`/dashboard/team-metrics/overview/${employeeId}`);
    }
  }, [navigate, role]);

  const columns = useMemo(() => 
    generateColumns(role, handleEmployeeClick, loading), 
  [role, handleEmployeeClick, loading]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!employeesList || employeesList.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <Typography variant="body1" color="text.secondary">
          No {title.toLowerCase()} found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <DataTable
        data={employeesList || []}
        columns={columns}
        title={title}
        loading={loading}
        enableSelection={false}
        defaultSortColumn="employeeName"
        defaultSortDirection="asc"
        defaultRowsPerPage={10}
        customTableHeight={550}
        primaryColor="#1976d2"
        secondaryColor="#e0f2f1"
        customStyles={{
          headerBackground: "#1976d2",
          rowHover: "#e0f2f1",
          selectedRow: "#b2dfdb",
        }}
        uniqueId="employeeId"
      />
    </Box>
  );
};

export default UserTable;