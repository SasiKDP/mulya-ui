import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "../MuiComponents/DataTable";
import {
    CircularProgress,
    Box,
    Container,
    Link,
    IconButton,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CustomDialog from "../MuiComponents/CustomDialog";
import ClientEditDialog from "./ClientEditDialog";
import BASE_URL from "../../redux/config";

// const BASE_URL = 'http://192.168.0.194:8111';



const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContent, setDialogContent] = useState("");

    const handleOpenDialog = (title, content) => {
        setDialogTitle(title);
        setDialogContent(content);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/requirements/bdm/getAll`);
            setClients(Array.isArray(response.data?.data) ? response.data.data : Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching clients:", error);
            toast.error(error.response?.data?.message || "Failed to load clients. Please refresh the page.");
            setClients([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileDownload = async (clientId) => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/requirements/bdm/${clientId}/downloadAll`, {
                responseType: "arraybuffer", // Change responseType to arraybuffer
            });
    
            // Create a Blob from the ArrayBuffer
            const blob = new Blob([response.data], { type: "application/zip" }); // Assuming it's a ZIP file
    
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `documents_${clientId}.zip`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Documents downloaded successfully!");
        } catch (error) {
            console.error("Error downloading ZIP file:", error);
            toast.error("Failed to download documents. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (clientId) => {
        const clientToEdit = clients.find((client) => client.id === clientId);
        if (clientToEdit) {
            setCurrentClient(clientToEdit);
            setEditDialogOpen(true);
        } else {
            toast.error("Client not found");
        }
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setCurrentClient(null);
    };

    const handleClientUpdated = () => {
        fetchClients();
    };

    const handleDeleteClick = (client) => {
        setClientToDelete(client);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!clientToDelete) return;

        try {
            setLoading(true);
            const response = await axios.delete(`${BASE_URL}/requirements/bdm/delete/${clientToDelete.id}`);

            if (response.data.success) {
                setClients((prevClients) =>
                    prevClients.filter((client) => client.id !== clientToDelete.id)
                );
                toast.success("Client deleted successfully!");
            } else {
                toast.error(response.data.message || "Failed to delete client. Please try again.");
                console.error("Server error deleting client:", response.data.error);
            }

        } catch (error) {
            console.error("Error deleting client:", error);
            toast.error("Failed to delete client. Please try again.");
        } finally {
            setDeleteDialogOpen(false);
            setClientToDelete(null);
            setLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setClientToDelete(null);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleCellUpdate = async (rowId, columnKey, newValue) => {
        try {
            setLoading(true);
            await axios.put(`${BASE_URL}/requirements/bdm/${rowId}`, {
                [columnKey]: newValue,
            });

            const updatedClients = clients.map((client) => {
                if (client.id === rowId) {
                    return { ...client, [columnKey]: newValue };
                }
                return client;
            });
            setClients(updatedClients);
            toast.success("Client updated successfully!");
        } catch (error) {
            console.error("Error updating client:", error);
            toast.error("Failed to update client. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const generateColumns = (
        handleFileDownload,
        handleEditClick,
        handleDeleteClick
    ) => {
        return [
            { key: "id", label: "Client ID", type: "text", editable: false, render: (row) => row.id || "--" },
            { key: "onBoardedBy", label: "BDM", type: "text", editable: true, width: "200px", render: (row) => row.onBoardedBy || "--" },
            {
                key: "clientName", label: "Client Name", type: "text", editable: true, render: (row) => (
                    <Typography sx={{ wordBreak: "break-word", whiteSpace: "pre-line", maxWidth: 120, overflowWrap: "break-word", color: "black" }}>
                        {row.clientName.length > 10 ? row.clientName.replace(/(.{10})/g, "$1\n") : row.clientName || "--"}
                    </Typography>
                ),
            },
            {
                key: "clientAddress", label: "Address", type: "text", editable: true, render: (row) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {row.clientAddress ? (
                            <>
                                <Typography noWrap sx={{ maxWidth: 80 }}>{row.clientAddress.slice(0, 15)}{row.clientAddress.length > 15 && "..."}</Typography>
                                {row.clientAddress.length > 15 && (<Tooltip title="View Full Address"><Button onClick={() => handleOpenDialog("Full Address", row.clientAddress)} size="small">more</Button></Tooltip>)}
                            </>
                        ) : ("--")}
                    </Box>
                ),
            },
            { key: "positionType", label: "Position Type", type: "select", editable: true, options: ["Full-time", "Part-time", "Contract"], render: (row) => row.positionType || "--" },
            { key: "netPayment", label: "Net Payment", type: "number", editable: true, render: (row) => row.netPayment || "--" },
            { key: "gst", label: "GST (%)", type: "number", editable: true, render: (row) => row.gst || "--" },
            {
                key: "supportingCustomers", label: "Supporting Customers", type: "text", editable: true, render: (row) => (
                    <Box sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>{row.supportingCustomers?.length > 0 ? row.supportingCustomers.join(", ") : "--"}</Box>
                ),
            },
            {
                key: "clientWebsiteUrl", label: "Website", type: "text", editable: true, render: (row) => row.clientWebsiteUrl ? (
                    <Link href={row.clientclientWebsiteUrl} target="_blank" rel="noopener noreferrer">Go to Website</Link>
                ) : ("--"),
            },
            {
                key: "clientLinkedInUrl", label: "LinkedIn", type: "text", editable: true, render: (row) => row.clientLinkedInUrl ? (
                    <Link href={row.clientLinkedInUrl} target="_blank" rel="noopener noreferrer">Go to LinkedIn</Link>
                ) : ("--"),
            },
            {
                key: "clientSpocName", label: "SPOC Name", type: "text", editable: true, render: (row) => (
                    <Box sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>{row.clientSpocName?.length > 0 ? row.clientSpocName.join(", ") : "--"}</Box>
                ),
            },
            {
                key: "clientSpocEmailid", label: "SPOC Email", type: "text", editable: true, render: (row) => (
                    <Box sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>{row.clientSpocEmailid?.length > 0 ? row.clientSpocEmailid.join(", ") : "--"}</Box>
                ),
            },
            {
                key: "clientSpocMobileNumber", label: "SPOC Mobile", type: "text", editable: true, render: (row) => (
                    <Box sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>{row.clientSpocMobileNumber?.length > 0 ? row.clientSpocMobileNumber.join(", ") : "--"}</Box>
                ),
            },
            {
                key: "clientSpocLinkedin", label: "SPOC LinkedIn", type: "text", editable: true, render: (row) => row.clientSpocLinkedin ? (
                    <Link href={row.clientSpocLinkedin} target="_blank" rel="noopener noreferrer">View LinkedIn</Link>
                ) : ("--"),
            },
            {
                key: "supportingDocuments", label: "Documents", render: (row) => row.supportingDocuments && row.supportingDocuments.length > 0 ? (
                    <Link onClick={() => handleFileDownload(row.id)} sx={{ cursor: "pointer", color: "#2A4DBD", fontWeight: 500, textDecoration: "none", "&:hover": { color: "#0F1C46", textDecoration: "underline", }, }}>Download</Link>
                ) : ("--"),
            },
            {
                key: "actions", label: "Actions", render: (row) => (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Edit Client">
                            <IconButton size="small" color="primary" onClick={() => handleEditClick(row.id)} aria-label="edit">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Client">
                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(row)} aria-label="delete">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ),
            },
        ];
    };

    if (loading && !editDialogOpen && !deleteDialogOpen) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth={false} disableGutters sx={{ width: "100%", height: "calc(100vh - 20px)", display: "flex", flexDirection: "column", }}>
            <DataTable data={clients} columns={generateColumns(handleFileDownload, handleEditClick, handleDeleteClick)} title="Clients" pageLimit={20} onRefresh={fetchClients} isRefreshing={loading} onCellUpdate={handleCellUpdate} />
            <ClientEditDialog open={editDialogOpen} onClose={handleEditClose} currentClient={currentClient} onClientUpdated={handleClientUpdated} baseUrl={BASE_URL} />
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
                <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete client "{clientToDelete?.clientName}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>Delete</Button>
                </DialogActions>
            </Dialog>
            <CustomDialog open={dialogOpen} onClose={handleCloseDialog} title={dialogTitle} content={dialogContent} />
        </Container>
    );
};

export default Clients;