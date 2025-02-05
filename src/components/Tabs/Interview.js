import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Alert,
  CircularProgress,
  Box,
  Button,
  Typography,
  ButtonGroup,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DataTable from "../MuiComponents/DataTable";
const appconfig = require("../../redux/apiConfig");

// ✅ Directly use the production URL
const BASE_URL = appconfig.PROD_appconfig.PROD_BASE_URL;

const INTERVIEW_LEVELS = {
  ALL: "all",
  INTERNAL: "Internal",
  EXTERNAL: "External",
};

const Interview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterLevel, setFilterLevel] = useState(INTERVIEW_LEVELS.ALL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const userId = user;

  // Function to generate column headers from data
  const generateColumns = (data) => {
    if (data.length === 0) return [];

    const sampleData = data[0];
    const headerLabels = {
      candidateName: "Candidate Name",
      candidateEmailId: "Candidate Email",
      candidateContactNo: "Contact Number",
      interviewLevel: "Interview Level",
      interviewDateTime: "Interview Time",
      duration: "Duration",
      zoomLink: "Meeting Link",
      interviewScheduledTimestamp: "Scheduled On",
      userEmail: "Recruiter Email",
      clientEmail: "Client Email",
      // Add more mappings as needed
    };

    return Object.keys(sampleData).map((key) => ({
      key: key,
      label:
        headerLabels[key] ||
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
    }));
  };

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(false);

        const response = await axios.get(
          `${appconfig.PROD_appconfig.PROD_BASE_URL}/candidate/interviews/${userId}`
        );
        const interviewData = response.data || [];

        // Process the data to include formatted values
        const processedData = interviewData.map((interview) => ({
          ...interview,
          interviewDateTime: formatDateTime(interview.interviewDateTime),
          interviewScheduledTimestamp: formatDateTime(
            interview.interviewScheduledTimestamp
          ),
          duration: interview.duration ? `${interview.duration} minutes` : "",
          zoomLink: interview.zoomLink ? (
            <Button
              variant="contained"
              size="small"
              href={interview.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textTransform: "none",
                minWidth: "100px",
                fontSize: "0.875rem",
              }}
            >
              Join Meeting
            </Button>
          ) : (
            ""
          ),
          candidateContactNo: interview.candidateContactNo ? (
            <a
              href={`tel:${interview.candidateContactNo}`}
              style={{
                textDecoration: "none",
                color: theme.palette.primary.main,
              }}
            >
              {interview.candidateContactNo}
            </a>
          ) : (
            ""
          ),
          candidateEmailId: interview.candidateEmailId ? (
            <a
              href={`mailto:${interview.candidateEmailId}`}
              style={{
                textDecoration: "none",
                color: theme.palette.primary.main,
              }}
            >
              {interview.candidateEmailId}
            </a>
          ) : (
            ""
          ),
          userEmail: interview.userEmail ? (
            <a
              href={`mailto:${interview.userEmail}`}
              style={{
                textDecoration: "none",
                color: theme.palette.primary.main,
              }}
            >
              {interview.userEmail}
            </a>
          ) : (
            ""
          ),
          clientEmail: interview.clientEmail ? (
            <a
              href={`mailto:${interview.clientEmail}`}
              style={{
                textDecoration: "none",
                color: theme.palette.primary.main,
              }}
            >
              {interview.clientEmail}
            </a>
          ) : (
            ""
          ),
        }));

        setData(processedData);

        // Generate columns after data is processed
        if (processedData.length > 0) {
          const generatedColumns = generateColumns(processedData);
          setColumns(generatedColumns);
        }

        applyFilter(processedData, INTERVIEW_LEVELS.ALL);
      } catch (err) {
        console.error("Failed to fetch interview details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [userId, theme.palette.primary.main]);

  const filterDataWithValidSchedule = (interviews) => {
    return interviews.filter((interview) => {
      return (
        interview.interviewDateTime && interview.duration && interview.zoomLink
      );
    });
  };

  const applyFilter = (interviews, level) => {
    let filtered = [];

    if (level === INTERVIEW_LEVELS.ALL) {
      filtered = filterDataWithValidSchedule(interviews);
    } else {
      filtered = interviews.filter(
        (interview) =>
          interview.interviewLevel === level &&
          interview.interviewDateTime &&
          interview.duration &&
          interview.zoomLink
      );
    }

    setFilteredData(filtered);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    try {
      return new Date(dateTime).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
    } catch (error) {
      return "";
    }
  };

  const handleFilterChange = (level) => {
    setFilterLevel(level);
    applyFilter(data, level);
  };

  const FilterButtonGroup = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          width: "100%",
          mb: 2,
          px: { xs: 1, sm: 2 },
        }}
      >
        <ButtonGroup
          variant="outlined"
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            "& .MuiButton-root": {
              minWidth: { xs: "80px", sm: "110px" },
              height: "44px",
              textTransform: "none",
              fontSize: { xs: "0.8rem", sm: "0.95rem" },
              fontWeight: 600,
              borderColor: "#004d40", // Dark teal border color
              color: "#004d40", // Matching text color
              backgroundColor: "transparent", // Transparent background
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(18, 107, 94, 0.1)", // Soft teal hover effect
                borderColor: "#004d40", // Retain border color on hover
                color: "#004d40", // Retain text color on hover
              },
              "&.active": {
                backgroundColor: "#004d40", // Dark teal background for active button
                color: "#fff", // White text for active button
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Subtle shadow on active state
              },
            },
          }}
        >
          {Object.entries(INTERVIEW_LEVELS).map(([key, value]) => (
            <Button
              key={key}
              className={filterLevel === value ? "active" : ""}
              onClick={() => handleFilterChange(value)}
            >
              {key === "ALL" ? "All" : value}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Alert severity="error" sx={{ width: "100%", maxWidth: 600 }}>
          Failed to load interviews. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" maxHeight="100vh" sx={{ py: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 1,
          boxShadow: 1,
          display: "flex",
          flexDirection: "column",
          height: "88vh",
        }}
      >
        <Box
          sx={{
            pl: 1,
            borderBottom: 1,
            borderColor: "divider",
            flexShrink: 0,
            backgroundColor: "rgba(232, 245, 233)",
            padding: 1,
            borderRadius: 1,
            marginBottom: 1,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              fontWeight: 600,
              color: "#333",
              mb: 2,
            }}
          >
            Interview Schedule{" "}
            {data.length > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "inline",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  fontWeight: 500,
                  ml: 1,
                }}
              >
                [scheduled interviews {filteredData.length}{" "}
                {filterLevel !== "all" ? filterLevel : ""}]
              </Typography>
            )}
          </Typography>
        </Box>

        <FilterButtonGroup />

        <Box
          sx={{
            p: { xs: 1, sm: 2 },
            flexGrow: 1,
            overflowY: "auto",
            maxHeight: "calc(100vh - 230px)",
          }}
        >
          {filteredData.length === 0 ? (
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                py: 4,
                color: "text.secondary",
              }}
            >
              No interview data available.
            </Typography>
          ) : (
            <DataTable data={filteredData} columns={columns} pageLimit={5} />
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Interview;
