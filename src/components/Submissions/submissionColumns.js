import React from "react";
import { IconButton, Tooltip, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const generateSubmissionColumns = (data = [], handlers = {}) => {
  const { handleEdit = () => {}, handleDelete = () => {} } = handlers;

  const baseColumns = [
    {
      key: "fullName",
      label: "Full Name",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "candidateEmailId",
      label: "Email",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "contactNumber",
      label: "Contact Number",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "currentOrganization",
      label: "Organization",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "totalExperience",
      label: "Total Experience",
      type: "number",
      sortable: true,
      filterable: true,
    },
    {
      key: "relevantExperience",
      label: "Relevant Experience",
      type: "number",
      sortable: true,
      filterable: true,
    },
    {
      key: "currentCTC",
      label: "Current CTC",
      type: "number",
      sortable: true,
      filterable: true,
    },
    {
      key: "expectedCTC",
      label: "Expected CTC",
      type: "number",
      sortable: true,
      filterable: true,
    },
    {
      key: "noticePeriod",
      label: "Notice Period",
      type: "select",
      sortable: true,
      filterable: true,
      options: ["Immediate", "15 Days", "30 Days", "45 Days", "60 Days", "90 Days"],
    },
    {
      key: "communicationSkills",
      label: "Communication",
      type: "select",
      sortable: true,
      filterable: true,
      options: ["Excellent", "Good", "Average", "Poor"],
    },
    {
      key: "interviewStatus",
      label: "Status",
      type: "select",
      sortable: true,
      filterable: true,
      options: ["New", "Screening", "Interview Scheduled", "Rejected", "Hired"],
    },
    {
      key: "currentLocation",
      label: "Location",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "preferredLocation",
      label: "Preferred Location",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "clientName",
      label: "Client Name",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "profileReceivedDate",
      label: "Profile Received Date",
      type: "date",
      sortable: true,
      filterable: true,
    },
    {
      key: "skills",
      label: "Skills",
      type: "text",
      sortable: false,
      filterable: true,
      render: (row) => (
        <div style={{ whiteSpace: "pre-wrap" }}>
          {Array.isArray(row.skills) ? row.skills.join(", ") : row.skills}
        </div>
      ),
    },
  ];

  // Conditional columns based on data availability
  const conditionalColumns = [];
  
  if (data.some(item => item.qualification)) {
    conditionalColumns.push({
      key: "qualification",
      label: "Qualification",
      type: "text",
      sortable: true,
      filterable: true,
    });
  }

  if (data.some(item => item.skills)) {
    conditionalColumns.push({
      key: "skills",
      label: "Skills",
      type: "text",
      sortable: false,
      filterable: true,
      render: (row) => (
        <div style={{ whiteSpace: "pre-wrap" }}>
          {Array.isArray(row.skills) ? row.skills.join(", ") : row.skills}
        </div>
      ),
    });
  }

  return [
    ...baseColumns,
    ...conditionalColumns,
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      filterable: false,
      width: 120,
      align: "center",
      render: (row) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Edit">
            <IconButton
              aria-label="edit"
              size="small"
              color="primary"
              onClick={() => handleEdit(row)}
              sx={{ mr: 0.5 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              aria-label="delete"
              size="small"
              color="error"
              onClick={() => handleDelete(row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];
};
