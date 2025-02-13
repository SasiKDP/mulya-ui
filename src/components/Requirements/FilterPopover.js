import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Popover,
  TextField,
  IconButton,
  Select,
  MenuItem,
  InputAdornment,
  FormControl,
  Divider,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const FilterPopover = ({ column, getColumnFilters, filterColumns, handleColumnFilterChange }) => {
  const [filterPopoverAnchorEl, setFilterPopoverAnchorEl] = useState(null);
  const [filterInputValue, setFilterInputValue] = useState(filterColumns[column] || '');
  const inputRef = useRef(null);

  useEffect(() => {
    setFilterInputValue(filterColumns[column] || '');
  }, [filterColumns, column]);

  const handleFilterIconClick = (event) => {
    setFilterPopoverAnchorEl(event.currentTarget);
  };

  const handleFilterPopoverClose = () => {
    setFilterPopoverAnchorEl(null);
  };

  const handleInputChange = (event) => {
    setFilterInputValue(event.target.value);
  };

  const handleInputBlur = () => {
    handleColumnFilterChange(column, filterInputValue);
  };

  const handleClearFilter = () => {
    setFilterInputValue('');
    handleColumnFilterChange(column, '');
    inputRef.current?.focus();
  };

  const filterOptions = getColumnFilters[column] || [];
  const shouldUseSelect = filterOptions.length <= 20;

  return (
    <>
      <IconButton size="small" onClick={handleFilterIconClick} sx={{ color: '#0F1C46' }}>
        <FilterListIcon />
      </IconButton>
      <Popover
        open={Boolean(filterPopoverAnchorEl)}
        anchorEl={filterPopoverAnchorEl}
        onClose={handleFilterPopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: { maxHeight: 350, overflowY: 'auto', padding: 2, minWidth: 280, borderRadius: 2, boxShadow: 3 },
        }}
      >
        <Box sx={{ minWidth: 280 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
            <Typography variant="subtitle2" sx={{ color: '#1B3A8C', fontWeight: 'bold' }}>
              Filter by {column}
            </Typography>
            <IconButton size="small" onClick={handleFilterPopoverClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ my: 1 }} />

          {shouldUseSelect ? (
            <FormControl fullWidth size="small">
              <Select
                id={`select-${column}`}
                value={filterColumns[column] || ''}
                onChange={(e) => handleColumnFilterChange(column, e.target.value)}
                displayEmpty
                sx={{ fontSize: '0.875rem', backgroundColor: '#F7F9FC', borderRadius: 1 }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 200,
                      overflowY: 'auto',
                    },
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.map((value) => (
                  <MenuItem key={value} value={value} sx={{ fontSize: '0.875rem' }}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <FormControl fullWidth size="small">
              <TextField
                inputRef={inputRef}
                label={`Filter ${column}`}
                variant="outlined"
                size="small"
                placeholder="Enter filter..."
                value={filterInputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: filterInputValue && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleClearFilter}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ backgroundColor: '#F7F9FC', borderRadius: 1 }}
              />
            </FormControl>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default FilterPopover;
