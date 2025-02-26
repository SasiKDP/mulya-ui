import React, { useMemo } from "react";
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

const RequirementsTable = ({
  requirementsList,
  handleEdit,
  handleDeleteClick,
  handleOpenDescriptionDialog,
}) => {
  const theme = useTheme();

  // const BASE_URL = "http://192.168.0.246:8111";

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
        key: "recruiterName",
        label: "Recruiter Name",
        type: "text",
        render: (row) =>
          Array.isArray(row.recruiterName)
            ? row.recruiterName.join(", ")
            : "N/A",
      },
      {
        key: "requirementAddedTimeStamp",
        label: "Posted Date",
        type: "select",
        render: (row) => {
          const date = new Date(row.requirementAddedTimeStamp);
          return date.toISOString().split("T")[0];
        },
      },

      { key: "jobTitle", label: "Job Title", type: "text" },

      { key: "clientName", label: "Client Name", type: "text" },
      {
        key: "jobDescription",
        label: "Job Description",
        render: (row) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {row.jobDescription ? (
              // If a text job description is available
              <>
                <Typography noWrap sx={{ maxWidth: 80 }}>
                  {row.jobDescription.slice(0, 15)}
                  {row.jobDescription.length > 15 && "..."}
                </Typography>
                {row.jobDescription.length > 15 && (
                  <Tooltip title="View Full Description">
                    <Button
                      onClick={() =>
                        handleOpenDescriptionDialog(
                          row.jobDescription,
                          row.jobTitle
                        )
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
              // If JD is a file/image, show download button
              <Tooltip title="Download Job Description">
                <Link
                  href={`${BASE_URL}/requirements/download-job-description/${row.jobId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                >
                  <a
                    href={`${BASE_URL}/requirements/download-job-description/${row.jobId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="blue"
                  >
                    Download JD
                  </a>
                </Link>
              </Tooltip>
            )}
          </Box>
        ),
      },
      { key: "jobType", label: "Job Type", type: "select" },
      { key: "noOfPositions", label: "No. of Positions", type: "text" },
      { key: "salaryPackage", label: "Salary Package", type: "text" },
      { key: "jobMode", label: "Job Mode", type: "select" },
      { key: "location", label: "Location", type: "text" },
      { key: "experienceRequired", label: "Experience Required", type: "text" },
      { key: "relevantExperience", label: "Relevant Experience", type: "text" },
      { key: "noticePeriod", label: "Notice Period", type: "select" },
      { key: "qualification", label: "Qualification", type: "text" },
      {
        key: "recruiterIds",
        label: "Recruiter ID",
        type: "text",
      },
      { key: "status", label: "Status", type: "select" },
      { key: "jobId", label: "Job ID", type: "select" },
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
    </Box>
  );
};

export default RequirementsTable;
