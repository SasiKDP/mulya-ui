import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Select,
  MenuItem,
  InputAdornment,
  Stack,
  FormControl,
  Tooltip,
  TablePagination,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import CellContent from './CellContent';  // Import the CellContent component

const RequirementsTable = ({ requirementsList, handleEdit, handleDeleteClick }) => {

    console.log('this requiremenst ',requirementsList)
  const [filterColumns, setFilterColumns] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Get unique values for each column dynamically from the requirements list
  const getColumnFilters = useMemo(() => {
    const filters = {};
    
    requirementsList.forEach(requirement => {
      Object.entries(requirement).forEach(([key, value]) => {
        if (!filters[key]) {
          filters[key] = new Set();
        }
        
        if (Array.isArray(value)) {
          value.forEach(v => {
            if (v !== null && v !== undefined) {
              filters[key].add(v.toString());
            }
          });
        } else if (value !== null && value !== undefined) {
          filters[key].add(value.toString());
        }
      });
    });

    // Convert Sets to sorted Arrays
    return Object.fromEntries(
      Object.entries(filters).map(([key, values]) => [
        key,
        Array.from(values).sort((a, b) => a.localeCompare(b))
      ])
    );
  }, [requirementsList]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleColumnFilterChange = (column, value) => {
    setFilterColumns(prev => {
      const newFilters = { ...prev };
      if (value) {
        newFilters[column] = value;
      } else {
        delete newFilters[column];
      }
      return newFilters;
    });
    setPage(0);
  };

  const clearAllFilters = () => {
    setFilterColumns({});
    setPage(0);
  };

  const columns = ["recruiterName", "jobTitle", ...Object.keys(requirementsList[0] || {}).filter(col => col !== "recruiterName" && col !== "jobTitle")];

  const formatColumnName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const filteredRequirements = useMemo(() => {
    return requirementsList.filter((row) => {
      return Object.entries(filterColumns).every(([column, filterValue]) => {
        const rowValue = row[column];
        if (!filterValue) return true;
        
        if (Array.isArray(rowValue)) {
          return rowValue.some(v => v?.toString().toLowerCase().includes(filterValue.toLowerCase()));
        }
        return rowValue?.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [requirementsList, filterColumns]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredRequirements.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRequirements, page, rowsPerPage]);

  const renderFilterInput = (column) => {
    const filterOptions = getColumnFilters[column];
    const shouldUseSelect = filterOptions && filterOptions.length <= 20;

    if (shouldUseSelect) {
      return (
        <FormControl fullWidth size="small" variant="standard">
          <Select
            value={filterColumns[column] || ''}
            onChange={(e) => handleColumnFilterChange(column, e.target.value)}
            displayEmpty
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: '300px',
                  width: '250px',
                },
              },
            }}
            sx={{
              fontSize: '0.875rem',
              '& .MuiSelect-select': {
                minHeight: '20px',
                padding: '4px 8px',
              }
            }}
          >
            <MenuItem value="">All</MenuItem>
            {filterOptions.map((value) => (
              <MenuItem 
                key={value} 
                value={value}
                sx={{
                  fontSize: '0.875rem',
                  padding: '8px 16px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}
              >
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        variant="standard"
        size="small"
        placeholder="Filter..."
        value={filterColumns[column] || ''}
        onChange={(e) => handleColumnFilterChange(column, e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: filterColumns[column] && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => handleColumnFilterChange(column, '')}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    );
  };

  return (
    <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
          <Tooltip title="Clear all filters">
            <IconButton onClick={clearAllFilters} size="small">
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <TableContainer sx={{ maxHeight: 'calc(100vh - 280px)' }}>
        <Table stickyHeader sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#00796b',
                    color: 'white',
                    minWidth: 150,
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Box sx={{ mb: 1 }}>{formatColumnName(column)}</Box>
                  {renderFilterInput(column)}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#00796b',
                  color: 'white',
                  border: '1px solid #e0e0e0',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.jobId} hover>
                <CellContent content={row.recruiterName || "N/A"} title="Recruiter Name" />
                <CellContent content={row.jobTitle || "N/A"} title="Job Title" />
                {columns.slice(2).map((column) => (
                  <CellContent
                    key={column}
                    content={Array.isArray(row[column]) ? row[column].join(", ") : row[column] || "N/A"}
                    title={formatColumnName(column)}
                  />
                ))}
                <TableCell sx={{ border: '1px solid #e0e0e0' }}>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(row)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(row.jobId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredRequirements.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          backgroundColor: "white",
          borderTop: "1px solid #ddd",
        }}
      />
    </Paper>
  );
};

export default RequirementsTable;
