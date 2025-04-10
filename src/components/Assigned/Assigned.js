import React, { useState, useEffect } from "react";
import DataTable from "../muiComponents/DataTabel";
import {
  IconButton,
  Box,
  Typography,
  Button,
  Chip,
  Tooltip,
  Drawer,
  CircularProgress,
} from "@mui/material";
import { Assignment as AssignmentIcon, Refresh, Edit as EditIcon } from "@mui/icons-material";
import httpService from "../../Services/httpService";
import CandidateSubmissionDrawer from "./CandidateSubmissionDrawer";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../../redux/employeesSlice";
import ReusableExpandedContent from "../muiComponents/ReusableExpandedContent"; 

const Assigned = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mode, setMode] = useState("create");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const { userId } = useSelector((state) => state.auth);
  const employeeList = useSelector((state) => state.employee.employeesList);
  const dispatch = useDispatch();

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await httpService.get(
          `/requirements/recruiter/${userId}`
        );
        if (Array.isArray(response.data)) {
          setData(response.data);
          setColumns(generateColumns(response.data));
        } else {
          setData([]);
          setColumns([]);
          if (response.data && response.data.message) {
            setError(new Error(response.data.message));
          } else {
            setError(new Error("Data fetched was not an array."));
          }
        }
      } catch (err) {
        setError(err);
        setData([]);
        setColumns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    dispatch(fetchEmployees());
  }, [userId, refreshTrigger, dispatch]);

  const handleSubmit = (jobId) => {
    setSelectedJob({ userId: userId, jobId });
    setMode("create");
    setSelectedCandidate(null);
    setOpenDrawer(true);
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
    setSelectedJob(null);
    setSelectedCandidate(null);
  };

  const renderStatus = (status) => {
    let color = "default";

    switch (status?.toLowerCase()) {
      case "submitted":
        color = "success";
        break;
      case "closed":
        color = "error";
        break;
      case "on hold":
        color = "warning";
        break;
      case "in progress":
        color = "info";
        break;
      default:
        color = "default";
    }

    return <Chip label={status || "Unknown"} size="small" color={color} />;
  };

  // Configuration for the expanded content
  const getExpandedContentConfig = () => {
    return {
      title: "Job Description",
      description: { 
        key: "jobDescription", 
        fallback: "No description available." 
      },
      backgroundColor: "#f5f5f5",
      sections: [
        {
          title: "Job Details",
          fields: [
            { label: "Type", key: "jobType", fallback: "-" },
            { label: "Mode", key: "jobMode", fallback: "-" },
            { label: "Location", key: "location", fallback: "-" }
          ]
        },
        {
          title: "Requirements",
          fields: [
            { label: "Experience", key: "experienceRequired", fallback: "-" },
            { label: "Relevant Experience", key: "relevantExperience", fallback: "-" },
            { label: "Qualification", key: "qualification", fallback: "-" }
          ]
        },
        {
          title: "Additional Info",
          fields: [
            { label: "Posted Date", key: "requirementAddedTimeStamp", fallback: "-" },
            { label: "Notice Period", key: "noticePeriod", fallback: "-" },
            { label: "Positions", key: "noOfPositions", fallback: "-" },
            { label: "Salary Package", key: "salaryPackage", fallback: "-" },
            { label: "Assigned By", key: "assignedBy", fallback: "-" }
          ]
        }
      ],
      actions: [
        {
          label: "Submit Candidate",
          icon: <AssignmentIcon />,
          onClick: (row) => handleSubmit(row.jobId),
          variant: "contained",
          size: "small",
          color: "primary",
          sx: { mr: 1 }
        }
      ]
    };
  };

  // Updated renderExpandedContent function that uses the reusable component
  const renderExpandedContent = (row) => {
    return <ReusableExpandedContent row={row} config={getExpandedContentConfig()} />;
  };

  const generateColumns = (data) => {
    if (data.length === 0) return [];

    return [
      {
        key: "jobId",
        label: "Job ID",
        type: "text",
        sortable: true,
        filterable: true,
        width: 120,
      },
      {
        key: "jobTitle",
        label: "Job Title",
        type: "text",
        sortable: true,
        filterable: true,
        width: 200,
      },
      {
        key: "clientName",
        label: "Client",
        type: "text",
        sortable: true,
        filterable: true,
      },
      {
        key: "assignedBy",
        label: "Assigned By",
        type: "text",
        sortable: true,
        filterable: true,
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        sortable: true,
        filterable: true,
        render: (row) => renderStatus(row.status),
        width: 120,
        options: ["Open", "Closed", "On Hold", "In Progress"],
      },
      {
        key: "location",
        label: "Location",
        type: "text",
        sortable: true,
        filterable: true,
      },
      {
        key: "experienceRequired",
        label: "Experience",
        type: "text",
        sortable: true,
        filterable: true,
        width: 120,
      },
      {
        key: "requirementAddedTimeStamp",
        label: "Posted Date",
        type: "date",
        sortable: true,
        filterable: true,
        width: 150,
        render: (row) => new Date(row.requirementAddedTimeStamp).toLocaleDateString(),
      },
      {
        key: "noOfPositions",
        label: "Positions",
        type: "number",
        sortable: true,
        filterable: true,
        width: 100,
        align: "center",
      },
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        filterable: false,
        width: 160,
        align: "center",
        render: (row) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Submit Candidate">
              <IconButton
                aria-label="submit"
                size="small"
                color="primary"
                onClick={() => handleSubmit(row.jobId)}
                sx={{ mr: 1 }}
              >
                <AssignmentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ];
  };

  const processedData = data.map((row) => ({
    ...row,
    expandContent: renderExpandedContent,
  }));

  if (loading && !data.length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">Error: {error.message}</Typography>
        <Button variant="outlined" onClick={refreshData} startIcon={<Refresh />} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <>
      <DataTable
        data={processedData}
        columns={columns}
        title=""
        loading={loading}
        enableSelection={false}
        defaultSortColumn="requirementAddedTimeStamp"
        defaultSortDirection="desc"
        defaultRowsPerPage={10}
        customTableHeight={650}
        refreshData={refreshData}
        primaryColor="#00796b"
        secondaryColor="#e0f2f1"
        customStyles={{
          headerBackground: "#1976d2",
          rowHover: "#e0f2f1",
          selectedRow: "#b2dfdb",
        }}
        uniqueId="jobId"
      />

      <Drawer anchor="right" open={openDrawer} onClose={closeDrawer}>
        {selectedJob && (
          <CandidateSubmissionDrawer
            userId={selectedJob?.userId}
            jobId={selectedJob?.jobId}
            candidateData={selectedCandidate}
            mode={mode}
            onClose={closeDrawer}
            refreshData={refreshData}
            employeeEmail={employeeList
              .filter((employee) => employee.employeeId === userId)
              .map((employee) => employee.email)}
          />
        )}
      </Drawer>
    </>
  );
};

export default Assigned;