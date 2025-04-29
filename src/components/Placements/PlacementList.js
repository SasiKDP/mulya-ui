import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip, Button, Drawer, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { MoreVert, Edit, Visibility, Delete, Add, Refresh, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from '../muiComponents/DataTabel';
import ComponentTitle from '../../utils/ComponentTitle';
import PlacementForm from './PlacementForm';
import PlacementCard from './PlacementCard';
import httpService from '../../Services/httpService';

const PlacementsList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [editingPlacement, setEditingPlacement] = useState(null);
  const navigate = useNavigate();

  const handleOpenDrawer = (placement = null) => {
    setEditingPlacement(placement);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingPlacement(null);
  };

  const handleOpenDetailsDialog = (row) => {
    setSelectedPlacement(row);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedPlacement(null);
  };

  const handleView = (row) => {
    handleOpenDetailsDialog(row);
  };

  const handleEdit = (row) => {
    const formattedRow = {
      ...row,
      startDate: row.startDate ? formatDateForEdit(row.startDate) : '',
      endDate: row.endDate ? formatDateForEdit(row.endDate) : ''
    };
    handleOpenDrawer(formattedRow);
  };

  const formatDateForEdit = (dateStr) => {
    if (!dateStr) return '';
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    if (dateStr.includes('/')) {
      const [month, day, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  const handleDelete = async (row) => {
    if (window.confirm('Are you sure you want to delete this placement?')) {
      try {
        const response = await httpService.delete(
          `/candidate/placement/delete-placement/${row.id}`
        );

        if (response.data.success) {
          fetchPlacementDetails();
          toast.success('Placement deleted successfully!');
        } else {
          console.error('Failed to delete placement:', response.data.error);
          toast.error(response.data.error || 'Failed to delete placement');
        }
      } catch (error) {
        console.error('Error deleting placement:', error);
        toast.error('An error occurred while deleting the placement');
      }
    }
  };

  const generateColumns = (placementData) => {
    if (!placementData || placementData.length === 0) return [];
    return [
      { key: 'id', label: 'Placement ID', type: 'text', sortable: true, filterable: true, width: 100 },
      { key: 'candidateFullName', label: 'Consultant Name', type: 'text', sortable: true, filterable: true, width: 150 },
      { key: 'candidateEmailId', label: 'Email', type: 'text', sortable: true, filterable: true, width: 200 },
      { key: 'candidateContactNo', label: 'Phone', type: 'text', sortable: true, filterable: true, width: 120 },
      { key: 'technology', label: 'Technology', type: 'select', sortable: true, filterable: true, width: 130 },
      { key: 'sales', label: 'Sales',  width: 130 },
      { key: 'recruiter', label: 'Recruiter', width: 130 },
      { key: 'clientName', label: 'Client', type: 'select', sortable: true, filterable: true, width: 130 },
      { key: 'vendorName', label: 'Vendor', type: 'select', sortable: true, filterable: true, width: 130 },
      { key: 'startDate', label: 'Start Date', type: 'text', sortable: true, filterable: true, width: 120 },
      { key: 'endDate', label: 'End Date', type: 'text', sortable: true, filterable: true, width: 120 },
      { key: 'billRateUSD', label: 'Bill Rate (USD)', type: 'text', sortable: true, filterable: true, width: 150 },
      { key: 'payRate', label: 'Pay Rate', type: 'text', sortable: true, filterable: true, width: 130 },
      { key: 'grossProfit', label: 'Gross Profit', type: 'text', sortable: true, filterable: true, width: 130 },
      { key: 'employmentType', label: 'Employment Type', type: 'select', sortable: true, filterable: true, width: 150 },
      { key: 'status', label: 'Status', type: 'select', sortable: true, filterable: true, width: 120 },
      {
        key: 'actions',
        label: 'Actions',
        sortable: false,
        filterable: false,
        width: 150,
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
          </Box>
        ),
      },
    ];
  };

  const fetchPlacementDetails = async () => {
    setLoading(true);
    try {
      const response = await httpService.get('/candidate/placement/placements-list');
      const rawData = response.data.data;
  
      const formattedData = rawData.map((item) => ({
        ...item,
        startDate: item.startDate ? formatDate(item.startDate) : '',
        endDate: item.endDate ? formatDate(item.endDate) : '',
      }));
  
      setData(formattedData);
      toast.success('Placement data refreshed successfully!');
    } catch (error) {
      console.error('Error fetching placement data:', error);
      setData([]);
      toast.error('Failed to load placement data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    
    if (isoDate.includes('-')) {
      const [year, month, day] = isoDate.split('-');
      return `${month}/${day}/${year}`;
    } else if (isoDate.includes('/')) {
      return isoDate;
    }
    
    try {
      const date = new Date(isoDate);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const formatDateForAPI = (dateStr) => {
    if (!dateStr) return null;
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch (e) {
      return null;
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const submissionValues = {
        ...values,
        startDate: values.startDate ? formatDateForAPI(values.startDate) : null,
        endDate: values.endDate ? formatDateForAPI(values.endDate) : null,
      };

      console.log(submissionValues);

      if (editingPlacement) {
        const response = await httpService.put(
          `/candidate/placement/update-placement/${editingPlacement.id}`,
          submissionValues
        );
        if (response.data.success) {
          toast.success('Placement updated successfully!');
          fetchPlacementDetails();
          handleCloseDrawer();
        }
      } else {
        const response = await httpService.post(
          '/candidate/placement/create-placement',
          submissionValues
        );
        if (response.data.success) {
          toast.success('New placement created successfully!');
          fetchPlacementDetails();
          handleCloseDrawer();
        }
      }
    } catch (error) {
      console.error('Error saving placement:', error);
      toast.error(error.response?.data?.message || 'Failed to save placement. Please try again.');
    }
  };

  useEffect(() => {
    fetchPlacementDetails();
  }, []);

  const columns = generateColumns(data);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <ComponentTitle title="Placement Management">
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchPlacementDetails}
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
          Add Placement
        </Button>
      </ComponentTitle>
      
      <DataTable
        data={data}
        columns={columns}
        pageLimit={20}
        title=""
        onRefresh={fetchPlacementDetails}
        isRefreshing={loading}
        enableSelection={false}
        defaultSortColumn="id"
        defaultSortDirection="desc"
        noDataMessage={
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Records Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No placement records found.
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

      {/* Form Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: '80%', md: '50%' },
            maxWidth: '800px',
          },
        }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            borderBottom: '1px solid #eee',
            pb: 2
          }}>
            <Typography variant="h5" component="h2">
              {editingPlacement ? 'Edit Placement' : 'Add New Placement'}
            </Typography>
            <IconButton 
              onClick={handleCloseDrawer} 
              aria-label="close"
              sx={{
                color: (theme) => theme.palette.grey[500],
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.action.hover
                }
              }}
            >
              <Close />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <PlacementForm 
              initialValues={editingPlacement || {}}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseDrawer}
            />
          </Box>
        </Box>
      </Drawer>

      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #eee',
          pb: 2
        }}>
          <Typography variant="h5">
            Placement Details
          </Typography>
          <IconButton 
            onClick={handleCloseDetailsDialog}
            aria-label="close"
            sx={{
              color: (theme) => theme.palette.grey[500],
              '&:hover': {
                backgroundColor: (theme) => theme.palette.action.hover
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          {selectedPlacement && (
            <PlacementCard data={selectedPlacement} />
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #eee', py: 2, px: 3 }}>
          <Button onClick={handleCloseDetailsDialog} color="primary">
            Close
          </Button>
         
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlacementsList;