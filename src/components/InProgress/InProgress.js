import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInProgressData } from '../../redux/inProgressSlice';
import DataTable from '../muiComponents/DataTabel';
import DateRangeFilter from '../muiComponents/DateRangeFilter';
import { Stack, Typography } from '@mui/material';

const InProgress = () => {
    const dispatch = useDispatch();
    const { inProgress, loading } = useSelector((state) => state.inProgress);
    const [sortConfig, setSortConfig] = useState({
        key: 'bdm',
        direction: 'asc'
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


    // Apply sorting to the entire dataset
const sortedData = useMemo(() => {
  const sortableItems = [...inProgress];

  if (sortConfig.key) {
    sortableItems.sort((a, b) => {
      const result = customSort(a, b, sortConfig.key);
      return sortConfig.direction === 'asc' ? result : -result;
    });
  }

  return sortableItems;
}, [inProgress, sortConfig]);


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
        dispatch(fetchInProgressData());
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
                    <DateRangeFilter component="InProgress"/>
                </Stack>
            </Stack>

           <DataTable
         data={sortedData}
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
         uniqueId="jobId"  
         refreshData={handleRefresh}
         orderBy={sortConfig.key}
         order={sortConfig.direction}
         />
        </>
    );
};

export default InProgress;