import React from "react";
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Card,
  CardContent,
  Divider,
  useTheme,
  Tooltip,
  Button,
} from "@mui/material";
import { Description as DescriptionIcon } from "@mui/icons-material";

const JobDetailsLayout = ({ jobDetails, BASE_URL }) => {
  const theme = useTheme();

  const formatHeaderText = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/Id$/, " ID")
      .replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  const detailOrder = [
    "assignedBy",
    "requirementAddedTimeStamp",
    "recruiterName",
    "status",
    "jobTitle",
    "clientName",
    "location",
    "jobMode",
    "jobType",
    "qualification",
    "experienceRequired",
    "relevantExperience",
    "salaryPackage",
    "noOfPositions",
    "noticePeriod",
    "recruiterIds",
    "jobId",
  ];

  const orderedDetails = detailOrder.map((key) => {
    if (jobDetails && jobDetails.hasOwnProperty(key)) {
      let value = jobDetails[key];

      if (key === "requirementAddedTimeStamp" && value) {
        value = new Date(value).toISOString().split("T")[0];
      }

      return [key, value];
    }
    return [key, "N/A"];
  });

  const handleDownloadBlob = () => {
    if (jobDetails?.jobDescriptionBlob) {
      const blobData = atob(jobDetails.jobDescriptionBlob);
      const byteArray = new Uint8Array(blobData.length);
      for (let i = 0; i < blobData.length; i++) {
        byteArray[i] = blobData.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      const fileName = jobDetails?.jobTitle
        ? jobDetails.jobTitle
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .replace(/\s+/g, "_") + ".pdf"
        : "Job_Description.pdf";

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Grid container spacing={3} sx={{ height: "60vh", overflow: "auto" }}>
      {/* Job Details Table */}
      <Grid item xs={12} md={6}>
        <Card
          elevation={3}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              boxShadow: theme.shadows[6],
            },
          }}
        >
          <CardContent
            sx={{ flex: 1, display: "flex", flexDirection: "column", p: 0 }}
          >
            <Box sx={{ bgcolor: theme.palette.info.light, p: 2 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={theme.palette.info.contrastText}
              >
                Job Details
              </Typography>
            </Box>
            <TableContainer sx={{ flex: 1, overflowY: "auto" }}>
              <Table size="medium">
                <TableBody>
                  {orderedDetails.map(([key, value]) => (
                    <TableRow
                      key={key}
                      sx={{
                        "&:nth-of-type(odd)": {
                          bgcolor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                        {formatHeaderText(key)}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1rem" }}>
                        {Array.isArray(value)
                          ? value.join(", ")
                          : value || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Job Description Section */}
      <Grid item xs={12} md={6}>
        <Card
          elevation={3}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              boxShadow: theme.shadows[6],
            },
          }}
        >
          <CardContent
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <DescriptionIcon
                sx={{ mr: 1, color: theme.palette.primary.main }}
              />
              <Typography variant="h5" fontWeight="bold" color="primary">
                Job Description
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {/* Job Description Content */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                padding: 2,
                bgcolor: "#f9f9f9",
                borderRadius: "8px",
                whiteSpace: "pre-line",
                lineHeight: 1.5,
                fontSize: "1rem",
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#ccc",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#aaa" },
              }}
            >
              {jobDetails?.jobDescription ? (
                <Typography sx={{ fontSize: "1rem" }}>
                  {jobDetails.jobDescription}
                </Typography>
              ) : jobDetails?.jobDescriptionBlob ? (
                <Tooltip title="Download Job Description">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownloadBlob}
                    sx={{
                      fontSize: "1rem",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: "bold",
                      boxShadow: theme.shadows[2],
                      "&:hover": {
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    Download JD
                  </Button>
                </Tooltip>
              ) : (
                <Typography sx={{ fontSize: "1rem" }}>
                  No job description available.
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default JobDetailsLayout;