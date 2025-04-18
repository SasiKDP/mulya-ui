import React from 'react';
import { Chip, Skeleton } from '@mui/material';

/**
 * Unified column generator for all user types (BDM, TEAMLEAD, EMPLOYEE)
 * @param {string} role User role (BDM, TEAMLEAD, EMPLOYEE)
 * @param {function} handleEmployeeClick Function to handle click on employee name/id
 * @param {boolean} loading Loading state for skeleton display
 * @returns {Array} Array of column configurations
 */
export const generateColumns = (role, handleEmployeeClick, loading = false) => {
  // Common base columns for all roles
  const baseColumns = [
    {
      key: role === 'BDM' ? "employeeId" : "employeeId", // Key consistency
      label: role === 'BDM' ? "Employee ID" : "Employee ID",
      type: "text",
      sortable: true,
      filterable: true,
      width: role === 'BDM' ? 120 : 120,
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
          {role === 'BDM' ? row.employeeId : row.employeeId}
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
    }
  ];

  // // For non-BDM roles, add email field
  // if (role !== 'BDM') {
  //   baseColumns.push({
  //     key: 'employeeEmail',
  //     label: 'Email',
  //     type: 'text',
  //     sortable: true,
  //     filterable: true,
  //     width: 250,
  //     render: (row) => loading ? (
  //       <Skeleton variant="text" width={100} height={24} />
  //     ) : (
  //       row.employeeEmail
  //     ),
  //   });
  // }

  // Role-specific columns
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

  // Common metrics columns with appropriate key naming based on role
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

  // Add team lead specific metrics if role is TEAMLEAD
  const teamLeadExtras = role === 'TEAMLEAD' ? [
    {
      key: 'selfSubmissions',
      label: 'Self Submissions',
      type: 'number',
      sortable: true,
      filterable: true,
      width: 150,
      render: (row) => loading ? (
        <Skeleton variant="rectangular" width={60} height={24} />
      ) : (
        <Chip
          label={row.selfSubmissions || 0}
          size="small"
          variant="outlined"
          color="info"
        />
      ),
    },
    {
      key: 'selfInterviews',
      label: 'Self Interviews',
      type: 'number',
      sortable: true,
      filterable: true,
      width: 140,
      render: (row) => loading ? (
        <Skeleton variant="rectangular" width={60} height={24} />
      ) : (
        <Chip
          label={row.selfInterviews || 0}
          size="small"
          variant="outlined"
          color="info"
        />
      ),
    },
    {
      key: 'selfPlacements',
      label: 'Self Placements',
      type: 'number',
      sortable: true,
      filterable: true,
      width: 140,
      render: (row) => loading ? (
        <Skeleton variant="rectangular" width={60} height={24} />
      ) : (
        <Chip
          label={row.selfPlacements || 0}
          size="small"
          sx={{
            backgroundColor: '#f3e5f5',
            color: '#7b1fa2',
          }}
        />
      ),
    },
    {
      key: 'teamSubmissions',
      label: 'Team Submissions',
      type: 'number',
      sortable: true,
      filterable: true,
      width: 150,
      render: (row) => loading ? (
        <Skeleton variant="rectangular" width={60} height={24} />
      ) : (
        <Chip
          label={row.teamSubmissions || 0}
          size="small"
          variant="outlined"
          color="warning"
        />
      ),
    },
    {
      key: 'teamInterviews',
      label: 'Team Interviews',
      type: 'number',
      sortable: true,
      filterable: true,
      width: 140,
      render: (row) => loading ? (
        <Skeleton variant="rectangular" width={60} height={24} />
      ) : (
        <Chip
          label={row.teamInterviews || 0}
          size="small"
          variant="outlined"
          color="warning"
        />
      ),
    },
    {
      key: 'teamPlacements',
      label: 'Team Placements',
      type: 'number',
      sortable: true,
      filterable: true,
      width: 140,
      render: (row) => loading ? (
        <Skeleton variant="rectangular" width={60} height={24} />
      ) : (
        <Chip
          label={row.teamPlacements || 0}
          size="small"
          sx={{
            backgroundColor: '#fff8e1',
            color: '#ff8f00',
            fontWeight: 600,
          }}
        />
      ),
    }
  ] : [];

  // Combine all column types based on role
  return [
    ...baseColumns, 
    ...(roleSpecificColumns[role] || []), 
    ...metricsColumns,
    ...teamLeadExtras
  ];
};