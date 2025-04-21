import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpService from '../../Services/httpService';
import DataTable from '../muiComponents/DataTabel';

import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Skeleton,
  Chip,
  Stack
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Download,
  Add,
  FilterList,
  Person,
  Work,
  School,
  ContactPhone,
  Code,
} from '@mui/icons-material';
import ToastService from '../../Services/toastService';
import BenchCandidateForm from './BenchForm';
import CandidateDetails from './CandidateDetails';
import { useDispatch, useSelector } from 'react-redux';
import { filterBenchListByDateRange, setFilteredDataRequested } from '../../redux/benchSlice';
import DateRangeFilter from '../muiComponents/DateRangeFilter';
import { User2Icon } from 'lucide-react';

const BenchList = () => {
  const [benchData, setBenchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  
  // Form handling states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editCandidateId, setEditCandidateId] = useState(null);

  const { isFilteredDataRequested, filteredBenchList } = useSelector((state) => state.bench);
  const dispatch = useDispatch();

  const fetchBenchList = async () => {
    try {
      setLoading(true);
      ToastService.info("Loading bench candidates...");

      const response = await httpService.get('/candidate/bench/getBenchList');
      setBenchData(response.data);
      ToastService.success(`Loaded ${response.data?.length || 0} bench candidates`);
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
    setSelectedCandidate({
      ...row,
      filterCriteria: {
        showBasicInfo: true,
        showContact: true,
        showExperience: true,
        showSkills: true,
        showEducation: true,
        showDocuments: true
      }
    });
    setIsViewModalOpen(true);
    ToastService.info(`Viewing details for ${row.fullName}`);
  };

  const toggleFilter = (filterKey) => {
    if (selectedCandidate) {
      setSelectedCandidate({
        ...selectedCandidate,
        filterCriteria: {
          ...selectedCandidate.filterCriteria,
          [filterKey]: !selectedCandidate.filterCriteria[filterKey]
        }
      });
    }
  };

  const handleAdd = () => {
    setEditCandidateId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (row) => {
    setEditCandidateId(row.id);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditCandidateId(null);
  };

  const handleFormSuccess = () => {
    fetchBenchList();
  };

  const handleDelete = (row) => {
    setCandidateToDelete(row);
    setDeleteDialogOpen(true);
    ToastService.warning(`Preparing to delete ${row.fullName}`);
  };

  const confirmDelete = async () => {
    try {
      const toastId = ToastService.loading("Deleting candidate...");
      await httpService.delete(`/candidate/bench/deletebench/${candidateToDelete.id}`);
      ToastService.update(toastId, "Candidate deleted successfully!", "success");
      fetchBenchList();
      setDeleteDialogOpen(false);
    } catch (error) {
      ToastService.error("Failed to delete candidate");
      console.error("Error deleting candidate:", error);
    }
  };

  const downloadResume = async (id, candidateName) => {
    try {
      const toastId = ToastService.loading("Preparing resume download...");

      const response = await httpService.get(`/candidate/bench/download/${id}`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf,application/octet-stream'
        }
      });

      if (!(response.data instanceof Blob) || response.data.size === 0) {
        throw new Error("Invalid or empty file received");
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      let filename = `${candidateName.replace(/\s+/g, '_')}_Resume.pdf`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^";\n]*)"/i);
        if (fileNameMatch && fileNameMatch[1]) {
          filename = fileNameMatch[1];
        }
      }

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);

      ToastService.update(toastId, "Resume downloaded successfully!", "success");
    } catch (error) {
      console.error("Download error:", error);

      if (error.response) {
        if (error.response.status === 404) {
          ToastService.error("Resume file not found for this candidate");
        } else if (error.response.status === 403) {
          ToastService.error("You don't have permission to download this resume");
        } else {
          ToastService.error(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        ToastService.error("Network error - please check your connection");
      } else {
        ToastService.error(error.message || "Failed to download resume");
      }
    }
  };

  const generateColumns = (loading = false) => [
    {
      key: 'id',
      label: 'Bench ID',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 120,
      render: loading ? () => <Skeleton variant="text" width={60} /> : undefined
    },
    {
      key: 'fullName',
      label: 'Full Name',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 180,
      render: loading ? () => <Skeleton variant="text" width={120} /> : undefined
    },
    {
      key: 'skills',
      label: 'Skills',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 250,
      render: (row) =>
        loading ? (
          <Skeleton variant="text" width={120} />
        ) : !row.skills || row.skills.length === 0 ? (
          "N/A"
        ) : Array.isArray(row.skills) ? (
          row.skills.join(", ")
        ) : (
          "Invalid Data"
        )
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 220,
      render: loading ? () => <Skeleton variant="text" width={180} /> : undefined
    },
    {
      key: 'contactNumber',
      label: 'Contact Number',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 150,
      render: loading ? () => <Skeleton variant="text" width={100} /> : undefined
    },
    {
      key: 'referredBy',
      label: 'Referred By',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 180,
      render: loading ? () => <Skeleton variant="text" width={120} /> : undefined
    },
    {
      key: 'totalExperience',
      label: 'Total Exp (Yrs)',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 150,
      render: loading ? () => <Skeleton variant="text" width={80} /> : undefined
    },
    {
      key: 'relevantExperience',
      label: 'Rel Exp (Yrs)',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 150,
      render: loading ? () => <Skeleton variant="text" width={80} /> : undefined
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      filterable: false,
      width: 200,
      align: 'center',
      render: loading ? () => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="circular" width={32} height={32} />
          ))}
        </Box>
      ) : (row) => (
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
                disabled={!row.resumeAvailable}
                onClick={() => downloadResume(row.id, row.fullName)}
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
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          flexWrap: 'wrap',
          mb: 3,
          p: 2,
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          boxShadow: 1,
          justifyContent: 'space-between', 
        }}
      >
        <Typography variant="h6" color="primary">
          Bench Candidate Management
        </Typography>
       
        <Stack direction="row" alignItems="center" spacing={2} sx={{ ml: 'auto' }}>
          <DateRangeFilter component="BenchList" />
          <Button
            variant="text"
            color="primary"
            onClick={handleAdd}
          >
            <Add /> <User2Icon />
          </Button>
        </Stack>
      </Stack>

      <DataTable
        data={isFilteredDataRequested ? filteredBenchList : benchData || []}
        columns={generateColumns(loading)}
        pageLimit={20}
        title="Bench List"
        onRefresh={fetchBenchList}
        refreshData={fetchBenchList}
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

      {/* Reusable Form Component - handles both Add and Edit */}
      <BenchCandidateForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        id={editCandidateId}
        initialData={editCandidateId ? benchData.find(item => item.id === editCandidateId) : null} 
      />

      {/* View Modal with Filter Controls */}
      <Dialog
        open={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          ToastService.info("Closed candidate details view");
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Candidate Details - {selectedCandidate?.fullName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Toggle Personal Info">
                <IconButton
                  color={selectedCandidate?.filterCriteria?.showBasicInfo ? "primary" : "default"}
                  size="small"
                  onClick={() => toggleFilter('showBasicInfo')}
                >
                  <Person fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle Contact Info">
                <IconButton
                  color={selectedCandidate?.filterCriteria?.showContact ? "primary" : "default"}
                  size="small"
                  onClick={() => toggleFilter('showContact')}
                >
                  <ContactPhone fontSize="small" />
                  </IconButton>
              </Tooltip>
              <Tooltip title="Toggle Experience">
                <IconButton
                  color={selectedCandidate?.filterCriteria?.showExperience ? "primary" : "default"}
                  size="small"
                  onClick={() => toggleFilter('showExperience')}
                >
                  <Work fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle Skills">
                <IconButton
                  color={selectedCandidate?.filterCriteria?.showSkills ? "primary" : "default"}
                  size="small"
                  onClick={() => toggleFilter('showSkills')}
                >
                  <Code fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle Education">
                <IconButton
                  color={selectedCandidate?.filterCriteria?.showEducation ? "primary" : "default"}
                  size="small"
                  onClick={() => toggleFilter('showEducation')}
                >
                  <School fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <CandidateDetails candidate={selectedCandidate} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete{' '}
            <strong>{candidateToDelete?.fullName}</strong> from the bench list?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BenchList;