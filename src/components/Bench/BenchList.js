import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpService from '../../Services/httpService';
import DataTable from '../muiComponents/DataTabel';
import { Box, Typography, Tooltip, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Edit, Delete, Visibility, Download, Refresh, Add } from '@mui/icons-material';
import ToastService from '../../Services/toastService';
import BenchForm from './BenchForm';
import CandidateDetails from './CandidateDetails';
import ComponentTitle from "../../utils/ComponentTitle";

const BenchList = () => {
  const [benchData, setBenchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const fetchBenchList = async () => {
    try {
      setLoading(true);
      const response = await httpService.get('/candidate/bench/getBenchList');
      setBenchData(response.data || []);
    } catch (error) {
      console.error('Failed to fetch bench list:', error);
      ToastService.error('Failed to load bench candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenchList();
  }, []);

  const handleView = (row) => {
    setSelectedCandidate(row);
    setIsViewModalOpen(true);
  };

  const handleEdit = async (row) => {
    try {
      // Get full candidate details including skills
      const response = await httpService.get(`/candidate/bench/getById/${row.id}`);
      const candidateData = response.data;
      
      // Format candidate data for the form
      const formData = {
        id: candidateData.id,
        fullName: candidateData.fullName,
        email: candidateData.email,
        contactNumber: candidateData.contactNumber,
        relevantExperience: candidateData.relevantExperience,
        totalExperience: candidateData.totalExperience,
        skills: candidateData.skills || [],
        linkedin: candidateData.linkedin || "",
        referredBy: candidateData.referredBy || "",
        resumeAvailable: candidateData.resumeAvailable
      };
      
      setEditData(formData);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch candidate details:', error);
      ToastService.error('Failed to load candidate details for editing');
    }
  };

  const handleDelete = (row) => {
    setCandidateToDelete(row);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const toastId = ToastService.loading("Deleting candidate...");
      await httpService.delete(`/candidate/bench/delete/${candidateToDelete.id}`);
      ToastService.update(toastId, "Candidate deleted successfully!", "success");
      fetchBenchList(); // Refresh the list
      setDeleteDialogOpen(false);
    } catch (error) {
      ToastService.error("Failed to delete candidate");
      console.error("Error deleting candidate:", error);
    }
  };

  const downloadResume = async (candidateId, candidateName) => {
    try {
      const toastId = ToastService.loading("Downloading resume...");
      const response = await httpService.get(`/candidate/bench/download/${candidateId}`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${candidateName.replace(/\s+/g, "_")}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      ToastService.update(toastId, "Resume downloaded successfully!", "success");
    } catch (error) {
      ToastService.error("Failed to download resume");
      console.error("Error downloading resume:", error);
    }
  };

  const handleFormSubmitSuccess = () => {
    fetchBenchList(); // Refresh the list after successful form submission
    setIsEditModalOpen(false);
    setEditData(null);
    setIsAddFormOpen(false);
  };

  const handleOpenDrawer = () => {
    setIsAddFormOpen(true);
  };

  const generateColumns = () => [
    { key: 'id', label: 'Bench ID', type: 'text', sortable: true, filterable: true, width: 120 },
    { key: 'fullName', label: 'Full Name', type: 'text', sortable: true, filterable: true, width: 180 },
    { key: 'email', label: 'Email', type: 'text', sortable: true, filterable: true, width: 220 },
    { key: 'contactNumber', label: 'Contact Number', type: 'text', sortable: true, filterable: true, width: 150 },
    { key: 'referredBy', label: 'Referred By', type: 'text', sortable: true, filterable: true, width: 180 },
    
    { key: 'totalExperience', label: 'Total Exp (Yrs)', type: 'text', sortable: true, filterable: true, width: 150 },
    { key: 'relevantExperience', label: 'Relevant Exp (Yrs)', type: 'text', sortable: true, filterable: true, width: 150 },
    
    // { 
    //   key: 'skills', 
    //   label: 'Skills', 
    //   type: 'text', 
    //   sortable: false, 
    //   filterable: false, 
    //   width: 250,
    //   render: (row) => row.skills?.join(', ') || 'N/A',
    // },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      filterable: false,
      width: 200,
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="View">
            <IconButton color="info" size="small" onClick={() => handleView(row)}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton color="primary" size="small" onClick={() => handleEdit(row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton color="error" size="small" onClick={() => handleDelete(row)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={row.resumeAvailable ? "Download Resume" : "Resume not available"}>
            <span>
              <IconButton
                color="success"
                size="small"
                onClick={() => row.resumeAvailable && downloadResume(row.id, row.fullName)}
                disabled={!row.resumeAvailable}
              >
                <Download fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      <ComponentTitle title="Bench Candidate Management">
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchBenchList}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          Refresh
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={() => handleOpenDrawer()}
        >
          Add Candidate
        </Button>
      </ComponentTitle>

      <DataTable
        data={benchData}
        columns={generateColumns()}
        pageLimit={20}
        title="Bench List"
        onRefresh={fetchBenchList}
        isRefreshing={loading}
        enableSelection={false}
        defaultSortColumn="fullName"
        defaultSortDirection="asc"
        noDataMessage={
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Records Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No bench consultants found.
            </Typography>
          </Box>
        }
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
            borderRadius: 2,
            overflow: 'hidden',
          },
        }}
        uniqueId="id"
      />

      {/* Edit Modal */}
      <Dialog 
        open={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Candidate</DialogTitle>
        <DialogContent>
          {editData && (
            <BenchForm 
              initialValues={editData} 
              onCancel={() => setIsEditModalOpen(false)}
              onSuccess={handleFormSubmitSuccess}
              isEditMode={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add New Candidate Modal */}
      <Dialog 
        open={isAddFormOpen} 
        onClose={() => setIsAddFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        
        <DialogContent>
          <BenchForm 
            onCancel={() => setIsAddFormOpen(false)}
            onSuccess={handleFormSubmitSuccess}
            isEditMode={false}
          />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog 
        open={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Candidate Details</DialogTitle>
        <DialogContent>
          {selectedCandidate && (
            <CandidateDetails 
              candidateId={selectedCandidate.id} 
              onClose={() => setIsViewModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {candidateToDelete?.fullName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BenchList;