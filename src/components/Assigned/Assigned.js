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
  Skeleton,
  Stack,
} from "@mui/material";
import { Assignment as AssignmentIcon, Refresh, Edit as EditIcon } from "@mui/icons-material";
import httpService from "../../Services/httpService";
import CandidateSubmissionDrawer from "./CandidateSubmissionDrawer";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../../redux/employeesSlice";
import ReusableExpandedContent from "../muiComponents/ReusableExpandedContent"; 
import ToastService from "../../Services/toastService";
import ComponentTitle from "../../utils/ComponentTitle";
import DateRangeFilter from "../muiComponents/DateRangeFilter";

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
    const { filterAssignedRequirements } = useSelector((state) => state.requirement);
    const { isFilteredDataRequested } = useSelector((state) => state.bench);

  const dispatch = useDispatch();

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    ToastService.info("Loading assigned jobs...");
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await httpService.get(
          `/requirements/recruiter/${userId}`
        );
        if (Array.isArray(response.data)) {
          setData(response.data);
          setColumns(generateColumns(response.data));
          ToastService.success(`${response.data.length} jobs loaded successfully`);
        } else {
          setData([]);
          setColumns([]);
          if (response.data && response.data.message) {
            setError(new Error(response.data.message));
            ToastService.error(response.data.message);
          } else {
            setError(new Error("Data fetched was not an array."));
            ToastService.error("Data fetched was not in the expected format");
          }
        }
      } catch (err) {
        setError(err);
        setData([]);
        setColumns([]);
        ToastService.error(`Error loading data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    dispatch(fetchEmployees());
  }, [userId, refreshTrigger, dispatch]);

  const handleSubmit = (row) => {
    const status = row.status?.toLowerCase();
    if (status === 'hold') {
      ToastService.warning("Submission disabled for jobs with HOLD status");
      return;
    }
    
    setSelectedJob({ userId: userId, jobId: row.jobId });
    setMode("create");
    setSelectedCandidate(null);
    setOpenDrawer(true);
    ToastService.info(`Preparing submission for job: ${row.jobTitle}`);
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
    setSelectedJob(null);
    setSelectedCandidate(null);
  };

  const renderStatus = (status) => {
    if (loading) return <Skeleton variant="rounded" width={80} height={24} />;
    
    const statusLower = status?.toLowerCase();
    let color = "default";

    switch (statusLower) {
      case "submitted":
        color = "success";
        break;
      case "closed":
        color = "error";
        break;
      case "on hold":
      case "hold":
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
          onClick: (row) => handleSubmit(row),
          variant: "contained",
          size: "small",
          color: "primary",
          sx: { mr: 1 },
          disabled: (row) => row.status?.toLowerCase() === 'hold'
        }
      ]
    };
  };

  const renderExpandedContent = (row) => {
    if (loading) {
      return (
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" width="30%" height={100} />
            <Skeleton variant="rectangular" width="30%" height={100} />
            <Skeleton variant="rectangular" width="30%" height={100} />
          </Box>
        </Box>
      );
    }
    return <ReusableExpandedContent row={row} config={getExpandedContentConfig()} />;
  };

  const generateColumns = (data) => {
    if (loading) {
      return [
        {
          key: "jobId",
          label: "Job ID",
          render: () => <Skeleton variant="text" width={60} />,
          width: 120,
        },
        {
          key: "jobTitle",
          label: "Job Title",
          render: () => <Skeleton variant="text" width={120} />,
          width: 200,
        },
        {
          key: "clientName",
          label: "Client",
          render: () => <Skeleton variant="text" width={100} />,
        },
        {
          key: "assignedBy",
          label: "Assigned By",
          render: () => <Skeleton variant="text" width={100} />,
        },
        {
          key: "status",
          label: "Status",
          render: () => <Skeleton variant="rounded" width={80} height={24} />,
          width: 120,
        },
        {
          key: "location",
          label: "Location",
          render: () => <Skeleton variant="text" width={80} />,
        },
        {
          key: "experienceRequired",
          label: "Experience",
          render: () => <Skeleton variant="text" width={60} />,
          width: 120,
        },
        {
          key: "requirementAddedTimeStamp",
          label: "Posted Date",
          render: () => <Skeleton variant="text" width={80} />,
          width: 150,
        },
        {
          key: "noOfPositions",
          label: "Positions",
          render: () => <Skeleton variant="text" width={40} sx={{ mx: 'auto' }} />,
          width: 100,
          align: "center",
        },
        {
          key: "actions",
          label: "Actions",
          render: () => (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          ),
          width: 160,
          align: "center",
        },
      ];
    }

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
        render: (row) => {
          const isDisabled = row.status?.toLowerCase() === 'hold';
          return (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Tooltip title={isDisabled ? "Submission disabled for HOLD status" : "Submit Candidate"}>
                <span>
                  <IconButton
                    aria-label="submit"
                    size="small"
                    color="primary"
                    onClick={() => handleSubmit(row)}
                    sx={{ mr: 1 }}
                    disabled={isDisabled}
                  >
                    <AssignmentIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          );
        },
      },
    ];
  };

  const processedData = loading 
    ? Array(5).fill({}).map((_, index) => ({
        jobId: index,
        expandContent: renderExpandedContent,
      }))
    : data.map((row) => ({
        ...row,
        expandContent: renderExpandedContent,
      }));

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
     <Stack direction="row" alignItems="center" spacing={2}
        sx={{
          flexWrap: 'wrap',
          mb: 3,
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          boxShadow: 1,

        }}>

        <Typography variant='h6' color='primary'>Assigned List</Typography>

        <DateRangeFilter component="AssignedList" />
      </Stack>

      <DataTable
        // data={processedData}
        data={isFilteredDataRequested ? filterAssignedRequirements : processedData || []} 
        columns={generateColumns(data)}  // Always call generateColumns to handle loading state
        title=""
        loading={loading}
        enableSelection={false}
        defaultSortColumn="requirementAddedTimeStamp"
        defaultSortDirection="desc"
        defaultRowsPerPage={10}
        
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