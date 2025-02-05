import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, IconButton, TextField, InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import CellContent from "./CellContent";

const RequirementsTable = ({ requirementsList, handleEdit, handleDeleteClick, recruiters }) => {
  const [searchText, setSearchText] = useState("");
  const [filterColumns, setFilterColumns] = useState({});

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleColumnFilterChange = (column, value) => {
    setFilterColumns({ ...filterColumns, [column]: value });
  };

  const columns = [
    "recruiterName", "jobId", "jobTitle", "clientName", "jobDescription", "jobType",
    "location", "jobMode", "experienceRequired", "noticePeriod", "relevantExperience",
    "qualification", "status", "recruiterIds"
  ];

  const filteredRequirements = useMemo(() => {
    return requirementsList.filter((row) => {
      const searchTextLower = searchText.toLowerCase();
      let matchesSearch = Object.values(row).some(value => {
        if (typeof value === 'string') {
          return value?.toLowerCase().includes(searchTextLower);
        } else if (Array.isArray(value)) {
          return value.join(', ').toLowerCase().includes(searchTextLower);
        } else if (typeof value === 'number'){
          return value.toString().toLowerCase().includes(searchTextLower);
        }
        return false; 
      });

      let matchesColumnFilters = true;
      for (const column in filterColumns) {
        const filterValue = filterColumns[column]?.toLowerCase() || ""; // Handle undefined filter values
        const rowValue = row[column];

        if (filterValue === "") continue; // Skip empty filters

        if (rowValue) {
          if (typeof rowValue === 'string') {
            if (!rowValue.toLowerCase().includes(filterValue)) {
              matchesColumnFilters = false;
              break;
            }
          } else if (Array.isArray(rowValue)) {
            if (!rowValue.join(', ').toLowerCase().includes(filterValue)) {
              matchesColumnFilters = false;
              break;
            }
          } else if (typeof rowValue === 'number'){
            if (!rowValue.toString().toLowerCase().includes(filterValue)) {
              matchesColumnFilters = false;
              break;
            }
          } else {
            matchesColumnFilters = false; // Handle other data types as not matching
            break;
          }
        } else {
          matchesColumnFilters = false;
          break;
        }
      }
      return matchesSearch && matchesColumnFilters;
    });
  }, [requirementsList, searchText, filterColumns]);


  return (
    <TableContainer sx={{ border: "1px solid #ddd", borderRadius: 1, overflow: "auto", maxHeight: 500 }}>
      <TextField
        label="Search"
        variant="outlined"
        value={searchText}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column} sx={{ fontWeight: "bold", backgroundColor: "#00796b", color: "white", border: "1px solid #ddd" }}>
                {column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1')}
                <TextField
                  variant="standard"
                  value={filterColumns[column] || ""}
                  onChange={(e) => handleColumnFilterChange(column, e.target.value)}
                  placeholder="Filter"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{ width: '100%', mt: 1, input: { color: 'white' } }}
                />
              </TableCell>
            ))}
            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#00796b", color: "white", border: "1px solid #ddd" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRequirements.map((row) => (
            <TableRow key={row.jobId} hover>
              {columns.map((column) => (
                <CellContent key={column} content={Array.isArray(row[column]) ? row[column].join(", ") : row[column] || "N/A"} title={column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1')} />
              ))}
              <TableCell sx={{ border: "1px solid #ddd", display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title="Edit">
                  <IconButton color="primary" onClick={() => handleEdit(row)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => handleDeleteClick(row.jobId)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequirementsTable;