import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Snackbar, Alert, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import SectionHeader from "../MuiComponents/SectionHeader";
import GroupsIcon from "@mui/icons-material/Groups";
import SubmissionDataTable from "../Submissions/SubmissionDataTable";
import InterviewDialog from "../Submissions/InterviewDialog";
import EditCandidateDialog from "../Submissions/EditCandidateDialog";
import DeleteCandidateDialog from "../Submissions/DeleteCandidateDialog";
import { fetchCandidates, downloadResume } from "../Submissions/candidateService";
import { Grid } from "lucide-react";

const SubmissionsMain = () => {
    // State variables
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Filtered Data
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState(""); // Global Search Query
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(null);
    const [openInterviewDialog, setOpenInterviewDialog] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const { user } = useSelector((state) => state.auth);
    const userId = user;

    // Table columns configuration
    const columns = [
        { key: "candidateId", label: "Candidate ID" },
        { key: "jobId", label: "Job ID" },
        { key: "fullName", label: "Full Name" },
        { key: "emailId", label: "Email" },
        { key: "contactNumber", label: "Contact Number" },
        { key: "currentOrganization", label: "Current Organization" },
        { key: "qualification", label: "Qualification" },
        { key: "totalExperience", label: "Total Experience (Years)" },
        { key: "relevantExperience", label: "Relevant Experience (Years)" },
        { key: "skills", label: "Skills" },
        { key: "interviewStatus", label: "Interview Status" },
        { key: "resume", label: "Resume" },
        { key: "schedule", label: "Schedule Interview" },
        { key: "actions", label: "Actions" },
    ];

    /**
     * Fetch Candidate Submissions
     */
    const fetchSubmissionData = async () => {
        try {
            setLoading(true);
            const response = await fetchCandidates(userId);
            const candidateData = Array.isArray(response) ? response : [];
            setData(candidateData);
            setFilteredData(candidateData); // Set filtered data initially
        } catch (err) {
            console.error("Error fetching candidates:", err);
            setSnackbar({ open: true, message: "Failed to fetch candidates", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle Global Search
     */
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        if (!query) {
            setFilteredData(data);
            return;
        }

        const filtered = data.filter((row) =>
            Object.values(row).some(
                (value) => typeof value === "string" && value.toLowerCase().includes(query)
            )
        );

        setFilteredData(filtered);
    };

    /**
     * Handle Resume Download
     */
    const handleDownloadResume = (candidateId) => {
        downloadResume(candidateId);
    };

    /**
     * Handle Opening Interview Dialog
     */
    const handleOpenInterviewDialog = (candidate) => {
        setSelectedCandidate(candidate);
        setOpenInterviewDialog(true);
    };

    /**
     * Handle Edit Candidate
     */
    const handleEditCandidate = (candidate) => {
        setEditingCandidate(candidate);
        setEditDialogOpen(true);
    };

    /**
     * Handle Delete Candidate
     */
    const handleDeleteCandidate = (candidate) => {
        setCandidateToDelete(candidate);
        setDeleteDialogOpen(true);
    };

    useEffect(() => {
        if (userId) fetchSubmissionData();
    }, [userId]);

    return (
        <>
            <SectionHeader
                title="Candidate Submissions"
                totalCount={filteredData.length}
                onRefresh={fetchSubmissionData}
                isRefreshing={loading}
                icon={<GroupsIcon sx={{ color: "#1B5E20" }} />}
            />

            {/* Global Search Input */}
            <Box sx={{ mb: 2, px: 2 }}>
                
                <TextField
                    sx={{width:350}}
                    label="Search..."
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search... [email,Name,PhoneNumber..etc]"
                />
                
            </Box>

            <SubmissionDataTable
                data={filteredData}
                columns={columns}
                loading={loading}
                page={page}
                rowsPerPage={rowsPerPage}
                searchQuery={searchQuery} // Pass search query
                handleChangePage={(event, newPage) => setPage(newPage)}
                handleChangeRowsPerPage={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                onDownloadResume={handleDownloadResume}
                onScheduleInterview={handleOpenInterviewDialog}
                onEdit={handleEditCandidate}
                onDelete={handleDeleteCandidate}
            />

            {/* Edit Candidate Dialog */}
            <EditCandidateDialog
                open={editDialogOpen}
                handleClose={() => setEditDialogOpen(false)}
                candidate={editingCandidate}
                onUpdateSuccess={fetchSubmissionData}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteCandidateDialog
                open={deleteDialogOpen}
                handleClose={() => setDeleteDialogOpen(false)}
                candidate={candidateToDelete}
                onDeleteSuccess={fetchSubmissionData}
            />

            {/* Interview Dialog */}
            <InterviewDialog
                open={openInterviewDialog}
                handleClose={() => setOpenInterviewDialog(false)}
                candidate={selectedCandidate}
                onSuccess={fetchSubmissionData}
            />

            {/* Snackbar for Notifications */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </>
    );
};

export default SubmissionsMain;
