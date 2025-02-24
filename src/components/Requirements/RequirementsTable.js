import React, { useMemo } from "react";
import { Box, Tooltip, IconButton, Stack } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterListOff as FilterListOffIcon,
} from "@mui/icons-material";
import DataTable from "../MuiComponents/DataTable"; // Import the DataTable component
import CellContent from "./CellContent";



const RequirementsTable = ({
  requirementsList,
  handleEdit,
  handleDeleteClick,
}) => {
  // Sort requirementsList by requirementAddedTimeStamp in descending order
  const sortedRequirementsList = useMemo(() => {
    return [...requirementsList].sort(
      (a, b) =>
        new Date(b.requirementAddedTimeStamp) -
        new Date(a.requirementAddedTimeStamp)
    );
  }, [requirementsList]);

  // Define pre-configured columns with specific ordering and filtering types
  const generateColumns = () => {
    return [
      
      { 
        key: "recruiterName", 
        label: "Recruiter Name", 
        type: "text",
       
      },
  
      { 
        key: "recruiterIds", 
        label: "Recruiter ID", 
        type: "text",
        
      },
  
      { key: "jobTitle", label: "Job Title", type: "text" },
      { key: "jobId", label: "Job ID", type: "select" },
      { key: "clientName", label: "Client Name", type: "text" },
  
      { 
        key: "jobDescription", 
        label: "Job Description",
        render: (row) => (
          <CellContent 
            content={row.jobDescription}
            title="Job Description"
          />
        ),
      },
  
      { key: "jobType", label: "Job Type", type: "select" },
      { key: "jobMode", label: "Job Mode", type: "select" },
      { key: "location", label: "Location", type: "text" },
      { key: "experienceRequired", label: "Experience Required", type: "text" },
      { key: "noticePeriod", label: "Notice Period", type: "select" },
      { key: "relevantExperience", label: "Relevant Experience", type: "text" },
      { key: "qualification", label: "Qualification", type: "text" },
  
      { 
        key: "requirementAddedTimeStamp", 
        label: "Posted Date", 
        type: "select",
        render: (row) => {
          const date = new Date(row.requirementAddedTimeStamp);
          return date.toISOString().split("T")[0]; 
        }
      },
  
      { key: "status", label: "Status", type: "select" },
      { key: "salaryPackage", label: "Salary Package", type: "text" },
      { key: "noOfPositions", label: "No. of Positions", type: "text" },
      { 
        key: "actions", 
        label: "Actions",
        render: (row) => (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleEdit(row)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteClick(row.jobId)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      }, 
    ];
  };
    

  

  const columns = useMemo(() => {
    if (sortedRequirementsList.length === 0) return [];
    return generateColumns();
  }, [sortedRequirementsList, handleEdit, handleDeleteClick]);

  return (
    <Box sx={{ width: "100%", height: "100%", p: 2 }}>
      {sortedRequirementsList.length > 0 ? (
        <DataTable
          data={sortedRequirementsList}
          columns={columns}
          pageLimit={10}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
            color: "#777",
          }}
        >
          No requirements found.
        </Box>
      )}
    </Box>
  );
};

export default RequirementsTable;