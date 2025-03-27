import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Link,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DataTable from "../MuiComponents/DataTable";
import BenchForm from "./BenchForm";
import { candidateAPI } from "./candidateAPI";

const BenchList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [benchData, setBenchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editCandidate, setEditCandidate] = useState(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  

   // Toast state
   const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const showToast = (message, severity = 'info') => {
    setToast({
      open: true,
      message,
      severity
    });
  };

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({ ...toast, open: false });
  };

  const fetchBenchList = async () => {
    try {
      const response = await candidateAPI.fetchBenchList();
      setBenchData(response.data);
    } catch (error) {
      console.error("Error fetching bench list:", error);
      showToast("Failed to fetch bench candidates. Please try again.", "error");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBenchList();
  }, []);

  const handleEditClick = async (candidateId) => {
    setIsEditing(true);
    try {
      const candidateToEdit = benchData.find(
        (candidate) => candidate.id === candidateId
      );

      if (candidateToEdit) {
        let parsedSkills = [];
        try {
          if (typeof candidateToEdit.skills === "string") {
            const cleanSkillsString = candidateToEdit.skills
              .replace(/^\[|\]$/g, "")
              .replace(/'/g, '"')
              .trim();
            parsedSkills = cleanSkillsString
              ? JSON.parse(`[${cleanSkillsString}]`)
              : [];
          } else if (Array.isArray(candidateToEdit.skills)) {
            parsedSkills = candidateToEdit.skills;
          }
        } catch (error) {
          parsedSkills = candidateToEdit.skills
            ? candidateToEdit.skills.split(/,\s*/)
            : [];
        }

        const formattedData = {
          fullName: candidateToEdit.fullName || "",
          email: candidateToEdit.email || "",
          relevantExperience: candidateToEdit.relevantExperience || "",
          totalExperience: candidateToEdit.totalExperience || "",
          contactNumber: candidateToEdit.contactNumber || "",
          skills: parsedSkills,
          linkedin: candidateToEdit.linkedin
            ? candidateToEdit.linkedin.replace(
                "https://www.linkedin.com/in/",
                ""
              )
            : "",
          referredBy: candidateToEdit.referredBy || "",
          resumeFile: null,
        };

        setEditCandidate({
          id: candidateId,
          data: formattedData,
        });
        setOpenFormDialog(true);
      } else {
        showToast("Candidate details not found.", "error");
      }
    } catch (error) {
      console.error("Error preparing edit data:", error);
      showToast("Failed to prepare candidate data for editing.", "error");
    } finally {
      setIsEditing(false);
    }
  };

  const handleAddClick = () => {
    setEditCandidate(null);
    setOpenFormDialog(true);
  };

  const handleDeleteClick = (candidateId) => {
    setCandidateToDelete(candidateId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await candidateAPI.delete(candidateToDelete);

      if (response.data?.status === "Success") {
        showToast(
          `Candidate deleted successfully! ID: ${candidateToDelete}`,
          "success"
        );
        fetchBenchList();
      } else {
        throw new Error(response.data?.message || "Failed to delete candidate.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast(
        error.response?.data?.message || "Failed to delete candidate.",
        "error"
      );
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
      setCandidateToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setOpenFormDialog(false);
    fetchBenchList();
    showToast(
      editCandidate
        ? "Candidate updated successfully!"
        : "Candidate added successfully!",
      "success"
    );
  };

  const handleDownloadResume = async (candidateId) => {
    try {
      const response = await candidateAPI.downloadResume(candidateId);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${candidateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast("Resume download started", "success");
    } catch (error) {
      console.error("Error downloading resume:", error);
      showToast("Failed to download resume. Please try again.", "error");
    }
  };

  const generateColumns = () => {
    return [
      { key: "id", label: "Bench User ID", type: "text" },
      { key: "fullName", label: "Full Name", type: "text" },
      { key: "email", label: "Email", type: "text" },
      {
        key: "relevantExperience",
        label: "Relevant Exp (yrs)",
        type: "text",
        render: (row) => parseFloat(row.relevantExperience).toFixed(1),
      },
      {
        key: "totalExperience",
        label: "Total Exp (yrs)",
        type: "text",
        render: (row) => parseFloat(row.totalExperience).toFixed(1),
      },
      { key: "contactNumber", label: "Contact", type: "text" },
      {
        key: "skills",
        label: "Skills",
        type: "text",
        render: (row) => (
          <Tooltip
            title={row.skills.length > 0 ? row.skills.join(", ") : "No skills"}
            arrow
          >
            <Box
              sx={{
                maxWidth: isMobile ? 100 : 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {row.skills.length > 0 ? row.skills.join(", ") : "No skills"}
            </Box>
          </Tooltip>
        ),
      },
      {
        key: "linkedin",
        label: "LinkedIn",
        type: "text",
        render: (row) => {
          const isValidUrl = row.linkedin?.startsWith(
            "https://www.linkedin.com/in/"
          );
          return isValidUrl ? (
            <Link
              href={row.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "inline-block",
                maxWidth: isMobile ? 100 : 150,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              View Profile
            </Link>
          ) : (
            "Invalid URL"
          );
        },
      },
      { key: "referredBy", label: "Referred By", type: "text" },
      {
        key: "downloadResume",
        label: "Resume",
        type: "action",
        render: (row) => (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleDownloadResume(row.id)}
            sx={{
              textTransform: "none",
              fontSize: isMobile ? "0.7rem" : "0.8rem",
            }}
          >
            Download
          </Button>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        type: "action",
        render: (row) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Edit candidate">
              <IconButton
                onClick={() => handleEditClick(row.id)}
                size="small"
                disabled={isEditing}
                sx={{
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              >
                {isEditing && editCandidate?.id === row.id ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <EditIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete candidate">
              <IconButton
                onClick={() => handleDeleteClick(row.id)}
                size="small"
                disabled={isDeleting}
                sx={{
                  color: theme.palette.error.main,
                  "&:hover": {
                    backgroundColor: theme.palette.error.light,
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ];
  };

  if (loading && !openFormDialog) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Dialog
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 24,
          },
        }}
      >
        <BenchForm
          isEditMode={!!editCandidate}
          candidateId={editCandidate?.id}
          initialValues={editCandidate?.data}
          onSuccess={handleFormSuccess}
          onClose={() => setOpenFormDialog(false)}
          showToast={showToast}
        />
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this bench candidate? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ p: isMobile ? 2 : 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 2 : 0,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.dark,
            }}
          >
            Bench Candidates
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                py: 1,
              }}
            >
              Add Candidate
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setIsRefreshing(true);
                fetchBenchList();
              }}
              disabled={isRefreshing}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                py: 1,
              }}
            >
              {isRefreshing ? <CircularProgress size={20} /> : "Refresh"}
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
            p: isMobile ? 1 : 2,
            overflowX: "auto",
          }}
        >
          <DataTable
            columns={generateColumns()}
            data={benchData}
            loading={loading || isRefreshing}
            pagination
            rowsPerPageOptions={[5, 10, 25]}
            defaultRowsPerPage={10}
            sx={{
              "& .MuiDataGrid-cell": {
                py: 1,
              },
            }}
          />
        </Box>
      </Box>
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleToastClose} 
          severity={toast.severity} 
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BenchList;