import React from "react";
import { IconButton, Tooltip, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const generateInterviewColumns = (data = [], handlers = {}) => {
  const { handleEdit = () => {}, handleDelete = () => {} } = handlers;

  const baseColumns = [
    {
      key: "candidateFullName",
      label: "Candidate Name",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "candidateContactNo",
      label: "Contact No",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "interviewLevel",
      label: "Interview Level",
      type: "select",
      sortable: true,
      filterable: true,
      options: ["EXTERNAL", "INTERNAL", "HR", "Managerial", "Final"],
      render: (value) => value.toUpperCase(),
    },
    
    {
      key: "candidateEmailId",
      label: "Candidate Email",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "interviewDateTime",
      label: "Interview Date-Time",
      type: "datetime",
      sortable: true,
      filterable: true,
      render: (row) => new Date(row.interviewDateTime).toLocaleString(),
    },
    {
      key: "duration",
      label: "Duration (mins)",
      type: "number",
      sortable: true,
      filterable: true,
    },
    {
      key: "zoomLink",
      label: "Zoom Link",
      type: "link",
      sortable: false,
      filterable: false,
      render: (row) => (
        <a href={row.zoomLink} target="_blank" rel="noopener noreferrer">
          Join Meeting
        </a>
      ),
    },
    {
      key: "jobTitle",
      label: "Job Title",
      type: "text",
      sortable: true,
      filterable: true,
    },
    
    {
      key: "interviewStatus",
      label: "Status",
      type: "select",
      sortable: true,
      filterable: true,
      options: ["Scheduled", "Completed", "Cancelled", "Rescheduled"],
    },
  ];

  // Only include these columns if we have data with these fields
  const conditionalColumns = [];
  
  if (data.some(item => item.clientName)) {
    conditionalColumns.push({
      key: "clientName",
      label: "Client Name",
      type: "text",
      sortable: true,
      filterable: true,
    });
  }

  if (data.some(item => item.interviewScheduledTimestamp)) {
    conditionalColumns.push({
      key: "interviewScheduledTimestamp",
      label: "Scheduled On",
      type: "datetime",
      sortable: true,
      filterable: true,
      render: (row) => new Date(row.interviewScheduledTimestamp).toLocaleString(),
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