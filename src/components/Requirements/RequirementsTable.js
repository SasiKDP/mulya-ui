import React, { useMemo, useState } from "react";
import {
  Box,
  Tooltip,
  IconButton,
  Stack,
  Button,
  Typography,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import DataTable from "../MuiComponents/DataTable";
import BASE_URL from "../../redux/config";
import JobDetailsDialog from "./JobDetailsDialog"; // Import the new component


const RequirementsTable = ({
  requirementsList,
  handleEdit,
  handleDeleteClick,
  handleOpenDescriptionDialog,
}) => {
  const theme = useTheme();
  
  // State for job details dialog
  const [jobDetailsDialogOpen, setJobDetailsDialogOpen] = useState(false);
  const [selectedJobData, setSelectedJobData] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Function to handle job ID click
  const handleJobIdClick = async (jobId) => {
    
    setSelectedJobId(jobId);
    setJobDetailsDialogOpen(true);
  };

  // Sort requirementsList by requirementAddedTimeStamp in descending order
  const sortedRequirementsList = useMemo(() => {
    return [...requirementsList].sort(
      (a, b) =>
        new Date(b.requirementAddedTimeStamp) -
        new Date(a.requirementAddedTimeStamp)
    );
  }, [requirementsList]);

  // Define columns with the job description logic
  const generateColumns = () => {
    return [
      { 
        key: "jobId", 
        label: "Job ID", 
        type: "select",
        render: (row) => (
          <Link
            component="button"
            variant="body2"
            onClick={() => handleJobIdClick(row.jobId)}
            sx={{ 
              textDecoration: 'none', 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' } 
            }}
          >
            {row.jobId}
          </Link>
        ) 
      },
      {
        key: "recruiterName",
        label: "Recruiter Name",
        type: "text",
        render: (row) =>
          row.recruiterName && Array.isArray(row.recruiterName)
            ? row.recruiterName.join(", ")
            : "N/A",
      },
      {
        key: "requirementAddedTimeStamp",
        label: "Posted Date",
        type: "select",
        render: (row) => {
          if (!row.requirementAddedTimeStamp) return "N/A";
          const date = new Date(row.requirementAddedTimeStamp);
          return isNaN(date) ? "Invalid Date" : date.toISOString().split("T")[0];
        },
      },
      { key: "jobTitle", label: "Job Title", type: "text", render: (row) => row.jobTitle || "N/A" },
      { key: "clientName", label: "Client Name", type: "text", render: (row) => row.clientName || "N/A" },
      {
        key: "jobDescription",
        label: "Job Description",
        render: (row) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {row.jobDescription ? (
              <>
                <Typography noWrap sx={{ maxWidth: 80 }}>
                  {row.jobDescription.slice(0, 15)}
                  {row.jobDescription.length > 15 && "..."}
                </Typography>
                {row.jobDescription.length > 15 && (
                  <Tooltip title="View Full Description">
                    <Button
                      onClick={() =>
                        handleOpenDescriptionDialog(row.jobDescription, row.jobTitle)
                      }
                      size="small"
                      startIcon={<DescriptionIcon />}
                      sx={{ minWidth: 0 }}
                    >
                      more
                    </Button>
                  </Tooltip>
                )}
              </>
            ) : (
              <Tooltip title="Download Job Description">
                <Link
                  href={`${BASE_URL}/requirements/download-job-description/${row.jobId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  color="blue"
                >
                  Download JD
                </Link>
              </Tooltip>
            )}
          </Box>
        ),
      },
      { key: "jobType", label: "Job Type", type: "select", render: (row) => row.jobType || "N/A" },
      { key: "noOfPositions", label: "No. of Positions", type: "text", render: (row) => row.noOfPositions ?? "N/A" },
      { key: "salaryPackage", label: "Salary Package", type: "text", render: (row) => row.salaryPackage || "N/A" },
      { key: "jobMode", label: "Job Mode", type: "select", render: (row) => row.jobMode || "N/A" },
      { key: "location", label: "Location", type: "text", render: (row) => row.location || "N/A" },
      { key: "experienceRequired", label: "Experience Required", type: "text", render: (row) => row.experienceRequired || "N/A" },
      { key: "relevantExperience", label: "Relevant Experience", type: "text", render: (row) => row.relevantExperience || "N/A" },
      { key: "noticePeriod", label: "Notice Period", type: "select", render: (row) => row.noticePeriod || "N/A" },
      { key: "qualification", label: "Qualification", type: "text", render: (row) => row.qualification || "N/A" },
      {
        key: "recruiterIds",
        label: "Recruiter ID",
        type: "text",
        render: (row) =>
          row.recruiterIds && Array.isArray(row.recruiterIds) && row.recruiterIds.length > 0
            ? row.recruiterIds.join(", ")
            : "N/A",
      },
      { key: "status", label: "Status", type: "select", render: (row) => row.status || "N/A" },
  
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
  }, [
    sortedRequirementsList,
    handleEdit,
    handleDeleteClick,
    handleOpenDescriptionDialog,
  ]);

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
      
      {/* Job Details Dialog */}
      <JobDetailsDialog
        open={jobDetailsDialogOpen}
        handleClose={() => setJobDetailsDialogOpen(false)}
        jobData={selectedJobData}
        jobId={selectedJobId}
      />
    </Box>
  );
};

export default RequirementsTable;