import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInProgressData, clearFilterData, sendingUsersData } from '../../redux/inProgressSlice';
import DataTable from '../muiComponents/DataTabel';
import DateRangeFilter from '../muiComponents/DateRangeFilter';
import { Stack, Typography, Alert, Snackbar } from '@mui/material';

const InProgress = () => {
    const dispatch = useDispatch();
    const { 
        inProgress = [], 
        loading, 
        filterinProgressByDateRange,
        isFiltered,
        error 
    } = useSelector((state) => state.inProgress);
   
    const { userName, userId } = useSelector((state) => state.auth);

    const [sortConfig, setSortConfig] = useState({
        key: 'bdm',
        direction: 'asc'
    });

    // State for email sending feedback
    const [emailStatus, setEmailStatus] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        dispatch(fetchInProgressData());
    }, [dispatch]);

    // Enhanced sorting function
    const customSort = (a, b, key) => {
        const valA = (a[key] || '').toString().trim().toLowerCase();
        const valB = (b[key] || '').toString().trim().toLowerCase();

        // Only apply name-specific logic on people-related keys
        const isNameField = ['bdm', 'teamlead', 'recruiterName'].includes(key);

        if (isNameField) {
            // Split by capital letters and spaces (covers "JohnDoe" and "John Doe")
            const splitName = (name) => name.split(/(?=[A-Z])|\s+/).filter(Boolean);

            const partsA = splitName(valA);
            const partsB = splitName(valB);

            // Compare parts one by one
            for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
                const cmp = partsA[i].localeCompare(partsB[i], undefined, { sensitivity: 'base' });
                if (cmp !== 0) return cmp;
            }

            // If all parts matched, shorter name comes first
            return partsA.length - partsB.length;
        }

        // Default string comparison
        return valA.localeCompare(valB, undefined, { sensitivity: 'base' });
    };

    // Apply filtering and sorting to the data
    const processedData = useMemo(() => {
        const data = isFiltered ? filterinProgressByDateRange : inProgress;

        const unique = [];
        const seen = new Set();

        for (const item of data) {
            const key = JSON.stringify(item); // full row check
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(item);
            }
        }

        return unique;
    }, [inProgress, filterinProgressByDateRange, isFiltered]);

    // Filter data by current user's userId matching with recruiterId
    const getUserFilteredData = () => {
        return processedData.filter(item => {
            // Assuming recruiterId field exists in your data
            // Adjust the field name based on your actual data structure
            return item.recruiterId === userId || item.recruiterName === userName;
        });
    };

    // Handle send email functionality
    const handleSendEmail = async () => {
        try {
            const userFilteredData = getUserFilteredData();
            
            if (userFilteredData.length === 0) {
                setEmailStatus({
                    open: true,
                    message: 'No data found for current user to send email.',
                    severity: 'warning'
                });
                return;
            }

            // Dispatch the action with userId and filtered data
            const result = await dispatch(sendingUsersData({ 
                userId: userId,
                data: userFilteredData // Send the filtered data along with userId
            })).unwrap();

            setEmailStatus({
                open: true,
                message: `Email sent successfully! ${userFilteredData.length} records processed.`,
                severity: 'success'
            });

        } catch (error) {
            console.error('Error sending email:', error);
            setEmailStatus({
                open: true,
                message: 'Failed to send email. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const columns = [
        {
            key: "bdm",
            label: "BDM",
            type: "text",
            sortable: true,
            filterable: true,
            width: 120,
            isSorted: sortConfig.key === 'bdm',
            isSortedDesc: sortConfig.key === 'bdm' && sortConfig.direction === 'desc',
            onSort: () => handleSort('bdm')
        },
        {
            key: "teamlead",
            label: "Team Lead",
            type: "text",
            sortable: true,
            filterable: true,
            width: 120,
            isSorted: sortConfig.key === 'teamlead',
            isSortedDesc: sortConfig.key === 'teamlead' && sortConfig.direction === 'desc',
            onSort: () => handleSort('teamlead')
        },
        {
            key: "recruiterName",
            label: "Recruiter",
            type: "text",
            sortable: true,
            filterable: true,
            width: 120,
            isSorted: sortConfig.key === 'recruiterName',
            isSortedDesc: sortConfig.key === 'recruiterName' && sortConfig.direction === 'desc',
            onSort: () => handleSort('recruiterName')
        },
        {
            key: "jobId",
            label: "JOB ID",
            type: "text",
            sortable: true,
            filterable: true,
            width: 120
        },
        {
            key: "clientName",
            label: "Client",
            type: "text",
            sortable: true,
            filterable: true,
            width: 120
        },
        {
            key: "technology",
            label: "Technologies",
            type: "text",
            sortable: true,
            filterable: true,
            width: 120 
        },
        {
            key: "postedDate",
            label: "Posted Date",
            type: "text",
            sortable: true,
            filterable: true,
            width: 120,
        },
        {
            key: "numberOfSubmissions",
            label: "Submissions",
            type: "text",
            sortable: true,
            filterable: true,
            width: 120,
        }
    ];

    const handleRefresh = () => {
        dispatch(clearFilterData());
        dispatch(fetchInProgressData());
    };

    const handleCloseSnackbar = () => {
        setEmailStatus({ ...emailStatus, open: false });
    };

    return (
        <>
            <Stack direction="row" alignItems="center" spacing={2}
                sx={{
                    flexWrap: 'wrap',
                    mb: 3,
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 2,
                    boxShadow: 1,
                }}>

                <Typography variant='h6' color='primary'>In-Progress Management</Typography>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ ml: 'auto' }}>
                    <DateRangeFilter component="InProgress" onClearFilter={handleRefresh}  />
                </Stack>
            </Stack>

            <DataTable
                data={processedData || []}
                columns={columns}
                title="In Progress"
                loading={loading}
                enableSelection={false}
                defaultSortColumn="bdm"
                defaultSortDirection="asc"
                defaultRowsPerPage={20}
                primaryColor="#00796b"
                secondaryColor="#e0f2f1"
                customStyles={{
                    headerBackground: "#1976d2",
                    rowHover: "#e0f2f1",
                    selectedRow: "#b2dfdb",
                }}
                uniqueId={(row) => `${row.jobId}-${row.recruiterName}-${row.teamlead}`}
                refreshData={handleRefresh}
                orderBy={sortConfig.key}
                order={sortConfig.direction}
                enableSendEmail={true}
                onSendEmail={handleSendEmail} // Pass the email handler
                userFilteredDataCount={getUserFilteredData().length} // Pass filtered count for display
            />

            {/* Snackbar for email status feedback */}
            <Snackbar
                open={emailStatus.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={emailStatus.severity}
                    sx={{ width: '100%' }}
                >
                    {emailStatus.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default InProgress;