import React, { useState, useEffect, useCallback, useMemo } from "react";
import DataTable from "../muiComponents/DataTabel";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Drawer,
} from "@mui/material";
import {
  Refresh,
  CloudDownload,
  Close,
  Edit,
  Delete,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllClients,
  downloadClientDocs,
  updateClient,
  deleteClient,
  createClient,
  resetStatus,
} from "../../redux/clientsSlice";
import { showToast } from "../../utils/ToastNotification";
import ToastNotification from "../../utils/ToastNotification";
import ComponentTitle from "../../utils/ComponentTitle";
import OnBoardClient from "./OnBoardClient"; // Import the new reusable component

const ClientList = () => {
  const dispatch = useDispatch();
  const {
    list: clients,
    loading,
    error,
    downloadStatus,
    updateStatus,
    deleteStatus,
    createStatus,
  } = useSelector((state) => state.clients);
  const [selectedClient, setSelectedClient] = useState(null);
  const [openDocsDialog, setOpenDocsDialog] = useState(false);

  // Use drawer instead of dialog for edit/add
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAllClients());
  }, [dispatch]);

  useEffect(() => {
    if (downloadStatus === "succeeded") {
      dispatch(resetStatus());
    } else if (downloadStatus === "failed" && error) {
      dispatch(resetStatus());
    }
  }, [downloadStatus, error, dispatch]);

  useEffect(() => {
    if (
      updateStatus === "succeeded" ||
      createStatus === "succeeded" ||
      deleteStatus === "succeeded"
    ) {
      dispatch(resetStatus());
      setDrawerOpen(false);
      setCurrentClient(null);
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    } else if (
      updateStatus === "failed" ||
      createStatus === "failed" ||
      (deleteStatus === "failed" && error)
    ) {
      dispatch(resetStatus());
    }
  }, [updateStatus, createStatus, deleteStatus, error, dispatch]);

  const handleDownloadDocs = (clientId) => {
    dispatch(downloadClientDocs(clientId))
      .unwrap()
      .then((result) => {
        const blob = new Blob([result.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `client_documents_${clientId}.zip`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((rejectedValue) => {
        // Error is handled in the slice
      });
  };

  const handleViewDocs = (client) => {
    setSelectedClient(client);
    setOpenDocsDialog(true);
  };

  // Edit functionality with drawer
  const handleEditClick = (clientId) => {
    const clientToEdit = clients.find((client) => client.id === clientId);
    if (clientToEdit) {
      setCurrentClient(clientToEdit);
      setDrawerOpen(true);
    } else {
      showToast("Client not found", "error");
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setCurrentClient(null);
  };

  const handleClientSubmit = (formData, isEdit) => {
    if (isEdit && currentClient) {
      dispatch(
        updateClient({ clientId: currentClient.id, updatedData: formData })
      );
    } else {
      dispatch(createClient(formData));
    }
  };

  // Delete client functionality
  const handleDeleteClick = (clientId) => {
    const client = clients.find((client) => client.id === clientId);
    if (client) {
      setClientToDelete(client);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      dispatch(deleteClient(clientToDelete.id));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const handleDocsDialogClose = () => {
    setOpenDocsDialog(false);
    setSelectedClient(null);
  };

  const fetchClients = useCallback(() => {
    dispatch(fetchAllClients());
  }, [dispatch]);

  const generateColumns = useCallback((data) => {
    if (!data || data.length === 0) return [];

    return [
      {
        key: "id",
        label: "Client ID",
        render: (row) => row.id,
      },
      {
        key: "clientName",
        label: "Client Name",
        render: (row) => row.clientName || "N/A",
      },
      {
        key: "onBoardedBy",
        label: "BDM",
        render: (row) => row.onBoardedBy || "N/A",
      },
      {
        key: "clientSpocName",
        label: "Contact Person",
        render: (row) =>
          row.clientSpocName && Array.isArray(row.clientSpocName)
            ? row.clientSpocName.filter(Boolean).join(", ") || "N/A"
            : "N/A",
      },
      {
        key: "positionType",
        label: "Position Type",
        render: (row) => (
          <Chip
            label={row.positionType || "Not specified"}
            color={row.positionType ? "primary" : "default"}
            variant="outlined"
            size="small"
          />
        ),
      },
      {
        key: "netPayment",
        label: "Net Payment",
        render: (row) =>
          row.currency
            ? `${row.currency} ${row.netPayment}`
            : row.netPayment || "N/A",
      },
      {
        key: "supportingCustomers",
        label: "Supporting Customers",
        render: (row) =>
          row.supportingCustomers && Array.isArray(row.supportingCustomers) ? (
            <Tooltip
              title={row.supportingCustomers.filter(Boolean).join(", ")}
              arrow
            >
              <Typography variant="body2" noWrap>
                {row.supportingCustomers.filter(Boolean).join(", ") || "None"}
              </Typography>
            </Tooltip>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
            >
              None
            </Typography>
          ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <Box display="flex" gap={1}>
            <Tooltip title="Edit Client">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleEditClick(row.id)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download Documents">
              <IconButton
                size="small"
                color="secondary"
                onClick={() => handleDownloadDocs(row.id)}
              >
                <CloudDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Client">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteClick(row.id)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ];
  }, []);

  const columns = useMemo(
    () => generateColumns(clients),
    [clients, generateColumns]
  );

  console.log("Clients data from Redux:", clients);
  console.log("Generated Columns:", columns);

  return (
    <>
      <ToastNotification />

      <ComponentTitle title="Client Management">
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchClients}
          disabled={loading}
        >
          Refresh
        </Button>
        <Button 
          variant="contained"
          color="primary"
          onClick={() => setDrawerOpen(true)}
        >
          Add New Client
        </Button>
      </ComponentTitle>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

     
        <DataTable
          data={clients}
          columns={columns}
          title=""
          loading={loading}
          enableSelection={false}
          defaultSortColumn="clientName"
          defaultSortDirection="asc"
          defaultRowsPerPage={10}
          refreshData={fetchClients}
          primaryColor="#1976d2"
          secondaryColor="#f5f5f5"
          uniqueId="id"
        />
      

      {/* Client Form Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: "80%", md: "60%" },
            maxWidth: "1000px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6">
            {currentClient ? "Edit Client" : "Add New Client"}
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ overflowY: "auto" }}>
          <OnBoardClient
            initialData={currentClient}
            onSubmit={handleClientSubmit}
            isEdit={!!currentClient}
            onCancel={handleDrawerClose}
            showToast={showToast}
          />
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {clientToDelete
              ? `Are you sure you want to delete the client "${clientToDelete.clientName}"? This action cannot be undone.`
              : "Are you sure you want to delete this client? This action cannot be undone."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteStatus === "loading"}
          >
            {deleteStatus === "loading" ? (
              <CircularProgress size={24} />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Documents Dialog */}
      <Dialog
        open={openDocsDialog}
        onClose={handleDocsDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedClient
            ? `Documents for ${selectedClient.clientName}`
            : "Client Documents"}
          <IconButton
            aria-label="close"
            onClick={handleDocsDialogClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedClient?.supportingDocuments &&
          selectedClient.supportingDocuments.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {selectedClient.supportingDocuments.map((doc, index) => (
                <Chip
                  key={index}
                  label={doc}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              ))}
              <Button
                startIcon={<CloudDownload />}
                variant="contained"
                onClick={() => handleDownloadDocs(selectedClient.id)}
                sx={{ mt: 2, alignSelf: "flex-start" }}
                disabled={downloadStatus === "loading"}
              >
                {downloadStatus === "loading" ? (
                  <CircularProgress size={24} />
                ) : (
                  "Download All Documents"
                )}
              </Button>
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No documents available for this client.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientList;
