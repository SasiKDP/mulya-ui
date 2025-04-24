// Column definitions for Candidates

import { Chip,Box , Typography } from "@mui/material";

export const generateCandidatesColumns = () => [
  {
    key: "candidateName",
    label: "Name",
    sortable: true,
    filterable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    filterable: true,
  },
  {
    key: "recruiterName",
    label: "Recruiter",
    sortable: true,
    filterable: true,
    render: (row) => (
      <Chip
        label={row.recruiterName}
        variant="outlined"
        sx={{
          fontSize: 14,
          fontWeight: 500,
          color: '#2E7D32',
          borderColor: '#A5D6A7',
          borderRadius: 2,
        }}
      />
    )
  },  
  {
    key: "contactNumber",
    label: "Contact",
    sortable: true,
    filterable: true,
  },
  {
    key: "qualification",
    label: "Qualification",
    sortable: true,
    filterable: true,
  },
  {
    key: "skills",
    label: "Skills",
    sortable: true,
    filterable: true,
    render: (row) => {
      const { skills } = row;
  
      // If it's a string like "React-5 yrs, D3-2 yrs"
      if (typeof skills === "string" && skills.trim().length > 0) {
        const parsedSkills = skills
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0 && item.includes("-")) // Ensure valid entries
          .map((item) => {
            const [skill, exp] = item.split("-").map((s) => s.trim());
            return {
              skill,
              exp: exp || "",
            };
          })
          .filter(({ skill }) => skill); // Remove any empty skill names
  
        if (parsedSkills.length === 0) {
          return (
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              N/A
            </Typography>
          );
        }
  
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {parsedSkills.map(({ skill, exp }, index) => (
              <Chip
                key={index}
                label={`${skill} ${exp ? `(${exp})` : ""}`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.75rem",
                  bgcolor: "#F5F5F5",
                  borderRadius: 2,
                  fontWeight: 500,
                  color: "#424242",
                }}
              />
            ))}
          </Box>
        );
      }
  
      // If it's an array
      if (Array.isArray(skills) && skills.length > 0) {
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.75rem",
                  bgcolor: "#E3F2FD",
                  color: "#1976D2",
                  borderRadius: 2,
                }}
              />
            ))}
          </Box>
        );
      }
  
      return (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          N/A
        </Typography>
      );
    }
  }
  
  ,
  {
    key: "overallFeedback",
    label: "Feedback",
    sortable: true,
    filterable: true,
    
  }
  
];
// Column definitions for Interviews
export const generateInterviewsColumns = () => [
  {
    key: "candidateName",
    label: "Name",
    sortable: true,
    filterable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    filterable: true,
  },
  {
    key: "interviewLevel",
    label: "Interview Level",
    sortable: true,
    filterable: true,
  },
  {
    key: "interviewDateTime",
    label: "Date & Time",
    sortable: true,
    filterable: true,
    render: (row) => {
      const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return "N/A";
        const date = new Date(dateTimeStr);
        return date.toLocaleString();
      };
      return formatDateTime(row.interviewDateTime);
    },
  },
  {
    key: "interviewStatus",
    label: "Status",
    sortable: true,
    filterable: true,
    render: (row) => {
      const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
          case "completed":
            return "success";
          case "scheduled":
            return "info";
          case "cancelled":
            return "error";
          case "rescheduled":
            return "warning";
          case "rejected":
            return "error";
          case "selected":
            return "success";
          default:
            return "default";
        }
      };
  
      // Assuming row.interviewStatus is an array of stage objects
      const interviewStages = row.interviewStatus;
      const latestStatus =
        Array.isArray(interviewStages) && interviewStages.length > 0
          ? interviewStages[interviewStages.length - 1].status
          : "Scheduled";
  
      return (
        <Chip
          label={latestStatus}
          color={getStatusColor(latestStatus)}
          size="small"
          sx={{ textTransform: "capitalize" }}
        />
      );
    }
  }
  ,
  {
    key: "recruiterName",
    label: "Recruiter",
    sortable: true,
    filterable: true,
  },
];

// Column definitions for Placements
export const generatePlacementsColumns = () => [
  {
    key: "placementId",
    label: "Placement Id",
    sortable: true,
    filterable: true,
  },
  
  {
    key: "consultnantName",
    label: "Consultant Name",
    sortable: true,
    filterable: true,
  },
  {
    key: "technology",
    label: "Technology",
    sortable: true,
    filterable: true,
  },
  {
    key: "recuiter",
    label: "Recuiter",
    sortable: true,
    filterable: true,
  },
  {
    key: "client",
    label: "Client",
    sortable: true,
    filterable: true,
  },
  {
    key: "vendor",
    label: "Vendor",
    sortable: true,
    filterable: true,
  },
];

// Column definitions for Job Details
export const generateJobDetailsColumns = () => [
    {
      id: "jobTitle",
      label: "Job Title",
      sortable: false,
      filterable: false,
      render: (row) => row.jobTitle || "N/A",
    },
    {
      id: "clientName",
      label: "Client Name",
      sortable: false,
      filterable: false,
      render: (row) => row.clientName || "N/A",
    },
    {
        id: "recruiterName",
        label: "Assigned Recruiters",
        sortable: false,
        filterable: false,
        render: (row) => (
          <>
            {row.recruiterName?.map((name, idx) => (
              <Chip key={idx} label={name} size="small" sx={{ m: 0.5 }} />
            ))}
          </>
        ),
      },
    
    {
      id: "jobType",
      label: "Job Type",
      sortable: false,
      filterable: false,
      render: (row) => row.jobType || "N/A",
    },
    {
        id: "assignedBy",
        label: "Assigned By",
        sortable: false,
        filterable: false,
        render: (row) => row.assignedBy || "N/A",
      },
    {
      id: "location",
      label: "Location",
      sortable: false,
      filterable: false,
      render: (row) => row.location || "N/A",
    },
    {
      id: "jobMode",
      label: "Job Mode",
      sortable: false,
      filterable: false,
      render: (row) => row.jobMode || "N/A",
    },
    {
      id: "experienceRequired",
      label: "Experience Required",
      sortable: false,
      filterable: false,
      render: (row) => row.experienceRequired || "N/A",
    },
    {
      id: "noticePeriod",
      label: "Notice Period",
      sortable: false,
      filterable: false,
      render: (row) => row.noticePeriod || "N/A",
    },
    {
      id: "relevantExperience",
      label: "Relevant Experience",
      sortable: false,
      filterable: false,
      render: (row) => row.relevantExperience || "N/A",
    },
    {
      id: "qualification",
      label: "Qualification",
      sortable: false,
      filterable: false,
      render: (row) => row.qualification || "N/A",
    },
    {
      id: "salaryPackage",
      label: "Salary Package",
      sortable: false,
      filterable: false,
      render: (row) => row.salaryPackage || "N/A",
    },
    {
      id: "noOfPositions",
      label: "Number of Positions",
      sortable: false,
      filterable: false,
      render: (row) => row.noOfPositions || "N/A",
    },
    {
      id: "status",
      label: "Status",
      sortable: false,
      filterable: false,
      render: (row) => {
        const getStatusColor = (status) => {
          switch (status?.toLowerCase()) {
            case "submitted":
              return "primary";
            case "internal reject":
              return "error";
            case "processed":
              return "success";
            case "duplicate":
              return "warning";
            default:
              return "default";
          }
        };
        return (
          <Chip
            label={row.status || "N/A"}
            color={getStatusColor(row.status)}
            size="small"
          />
        );
      },
    },
    {
      id: "requirementAddedTimeStamp",
      label: "Posted On",
      sortable: false,
      filterable: false,
      render: (row) => {
        const formatDateTime = (dateTimeStr) => {
          if (!dateTimeStr) return "N/A";
          const date = new Date(dateTimeStr);
          return date.toLocaleString();
        };
        return formatDateTime(row.requirementAddedTimeStamp);
      },
    },
    
    
    {
        id: "jobDescription",
        label: "Job Description",
        sortable: false,
        filterable: false,
        render: (row) => (
          <div style={{ whiteSpace: "pre-line" }}>
            {row.jobDescription || "N/A"}
          </div>
        ),
      },
  ];