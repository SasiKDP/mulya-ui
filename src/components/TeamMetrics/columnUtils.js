import React from 'react';
import { Chip, Skeleton } from '@mui/material';

export const generateColumns = (role, handleEmployeeClick, loading = false) => {
  const baseColumns = [
    {
      key: "employeeId",
      label: "Employee ID",
      type: "text",
      sortable: true,
      filterable: true,
      width: 120,
      render: (row) => loading ? (
        <Skeleton variant="text" width={100} height={24} />
      ) : (
        <span 
          style={{ 
            cursor: 'pointer', 
            color: '#1976d2',
            textDecoration: 'underline' 
          }}
          onClick={() => handleEmployeeClick(row.employeeId)}
        >
          {row.employeeId}
        </span>
      ),
    },
    {
      key: "employeeName",
      label: "Employee Name",
      type: "text",
      sortable: true,
      filterable: true,
      width: 180,
      render: (row) => loading ? (
        <Skeleton variant="text" width={150} height={24} />
      ) : (
        row.employeeName
      ),
    },
  ];

  const roleSpecificColumns = {
    BDM: [
      {
        key: "status",
        label: "Status",
        type: "select",
        sortable: true,
        filterable: true,
        render: (row) => loading ? (
          <Skeleton variant="rectangular" width={80} height={24} />
        ) : (
          <Chip
            label={row.status === 'ACTIVE' ? 'Active' : 'Inactive'}
            size="small"
            sx={{
              fontWeight: 600,
              backgroundColor: row.status === 'ACTIVE' ? '#e8f5e9' : '#ffebee',
              color: row.status === 'ACTIVE' ? '#2e7d32' : '#c62828',
              '& .MuiChip-icon': {
                color: row.status === 'ACTIVE' ? '#4caf50' : '#f44336',
              }
            }}
            icon={
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: row.status === 'ACTIVE' ? '#4caf50' : '#f44336',
                marginRight: 4
              }} />
            }
          />
        ),
        width: 120,
        options: ["ACTIVE", "INACTIVE"],
      }
    ],
    TEAMLEAD: [
      {
        key: "role",
        label: "Role",
        type: "text",
        sortable: true,
        filterable: true,
        width: 100,
        render: (row) => loading ? (
          <Skeleton variant="rectangular" width={80} height={24} />
        ) : (
          <Chip
            label="Team Lead"
            size="small"
            color="primary"
            variant="outlined"
          />
        ),
      }
    ],
    EMPLOYEE: [
      {
        key: "role",
        label: "Role",
        type: "text",
        sortable: true,
        filterable: true,
        width: 100,
        render: (row) => loading ? (
          <Skeleton variant="rectangular" width={80} height={24} />
        ) : (
          <Chip
            label="Employee"
            size="small"
            color="secondary"
            variant="outlined"
          />
        ),
      }
    ]
  };

  const metricsColumns = [
    {
      key: role === 'BDM' ? "clientCount" : "numberOfClients",
      label: "Clients",
      type: "number",
      sortable: true,
      filterable: true,
      width: 100,
      render: (row) => loading ? (
        <Skeleton variant="rectangular" width={60} height={24} />
      ) : (
        <Chip
          label={row[role === 'BDM' ? "clientCount" : "numberOfClients"] || 0}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      key: role === 'BDM' ? "requirementsCount" : "numberOfRequirements",
      label: "Requirements",
      type: "number",
      sortable: true,
      filterable: true,
      width: 120,
      render: (row) => loading ? (
        <Skeleton variant="rectangular" width={60} height={24} />
      ) : (
        <Chip
          label={row[role === 'BDM' ? "requirementsCount" : "numberOfRequirements"] || 0}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      key: role === 'BDM' ? "submissionCount" : "numberOfSubmissions",
      label: "Submissions",
      type: "number",
      sortable: true,
      filterable: true,
      width: 120,
      render: (row) => loading ? (
        <Skeleton variant="rectangular" width={60} height={24} />
      ) : (
        <Chip
          label={row[role === 'BDM' ? "submissionCount" : "numberOfSubmissions"] || 0}
          size="small"
          variant="outlined"
          color="secondary"
        />
      ),
    },
    {
      key: role === 'BDM' ? "interviewCount" : "numberOfInterviews",
      label: "Interviews",
      type: "number",
      sortable: true,
      filterable: true,
      width: 110,
      render: (row) => loading ? (
        <Skeleton variant="rectangular" width={60} height={24} />
      ) : (
        <Chip
          label={row[role === 'BDM' ? "interviewCount" : "numberOfInterviews"] || 0}
          size="small"
          sx={{
            backgroundColor: '#e3f2fd',
            color: '#1565c0',
          }}
        />
      ),
    },
    {
      key: role === 'BDM' ? "placementCount" : "numberOfPlacements",
      label: "Placements",
      type: "number",
      sortable: true,
      filterable: true,
      width: 110,
      render: (row) => loading ? (
        <Skeleton variant="rectangular" width={60} height={24} />
      ) : (
        <Chip
          label={row[role === 'BDM' ? "placementCount" : "numberOfPlacements"] || 0}
          size="small"
          sx={{
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            fontWeight: 600,
          }}
        />
      ),
    }
  ];

  return [...baseColumns, ...(roleSpecificColumns[role] || []), ...metricsColumns];
};