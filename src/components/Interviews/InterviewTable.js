import React from "react";
import { Box, Tooltip, IconButton, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "../MuiComponents/DataTable";

const InterviewTable = ({
  data,
  setEditingInterview,
  setEditDialogOpen,
  setDeleteDialogOpen,
  setInterviewToDelete,
  searchQuery
}) => {
  const columns = [
    { key: "jobId", label: "Job ID" },
    { key: "candidateId", label: "Candidate ID" },
    { key: "candidateFullName", label: "Candidate Name" },
    { key: "candidateContactNo", label: "Contact Number" },
    { key: "candidateEmailId", label: "Candidate Email" },
    { key: "userEmail", label: "Recruiter Email" },
    { key: "userId", label: "Recruiter ID" },
    { key: "interviewDateTime", label: "Interview Date & Time" },
    { key: "duration", label: "Duration (minutes)" },
    {
        key: "zoomLink",
        label: "Meeting Link",
        render: (row) => {
          // Ensure zoomLink is a valid string URL
          const validUrl = typeof row.zoomLink === "string" ? row.zoomLink.trim() : "";
      
          return validUrl ? (
            <Button
            
              variant="contained"
              size="small"
              href={validUrl} 
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} 
            >
              Join Meeting
            </Button>
          ) : (
            "N/A"
          );
        },
      },
    { key: "interviewScheduledTimestamp", label: "Scheduled On" },
    { key: "clientEmail", label: "Client Email" },
    { key: "clientName", label: "Client Name" },
    { key: "interviewLevel", label: "Interview Level" },
    { key: "interviewStatus", label: "Interview Status" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Tooltip title="Edit" arrow>
            <IconButton
              onClick={() => {
                setEditingInterview(row);
                setEditDialogOpen(true);
              }}
               color="primary"
              
            >
              <EditIcon sx={{ fontSize: 25 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete" arrow>
            <IconButton
              onClick={() => {
                setInterviewToDelete(row);
                setDeleteDialogOpen(true);
              }}
               color="error"
              
            >
              <DeleteIcon sx={{ fontSize: 25 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <DataTable 
      data={data} 
      columns={columns} 
      pageLimit={5}
      searchQuery={searchQuery}
    />
  );
};

export default InterviewTable;