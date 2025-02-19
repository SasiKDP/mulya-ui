import React, { useState, useMemo } from "react";
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
  Stack,
  Tooltip,
  TablePagination,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  FilterListOff as FilterListOffIcon,
} from "@mui/icons-material";
import CellContent from "./CellContent";
import FilterPopover from "./FilterPopover";

const RequirementsTable = ({
  requirementsList,
  handleEdit,
  handleDeleteClick,
}) => {
  const [filterColumns, setFilterColumns] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [globalSearch, setGlobalSearch] = useState("");

  // Sort requirementsList by requirementAddedTimeStamp in ascending order
  const sortedRequirementsList = useMemo(() => {
    return [...requirementsList].sort(
      (a, b) =>
        new Date(b.requirementAddedTimeStamp) -
        new Date(a.requirementAddedTimeStamp)
    );
  }, [requirementsList]);

  const getColumnFilters = useMemo(() => {
    const filters = {};
    sortedRequirementsList.forEach((requirement) => {
      Object.entries(requirement).forEach(([key, value]) => {
        if (!filters[key]) {
          filters[key] = new Set();
        }
        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v !== null && v !== undefined) {
              filters[key].add(v.toString());
            }
          });
        } else if (value !== null && value !== undefined) {
          filters[key].add(value.toString());
        }
      });
    });
    return Object.fromEntries(
      Object.entries(filters).map(([key, values]) => [
        key,
        Array.from(values).sort((a, b) => a.localeCompare(b)),
      ])
    );
  }, [sortedRequirementsList]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleColumnFilterChange = (column, value) => {
    setFilterColumns((prev) => {
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

  const columns = [
    ...new Set([
      "recruiterName",
      "jobTitle",
      "clientName",
      "requirementAddedTimeStamp",
      ...Object.keys(sortedRequirementsList[0] || {}),
    ]),
  ];

  const formatColumnName = (name) => {
    return (
      name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1")
    );
  };

  const filteredRequirements = useMemo(() => {
    return sortedRequirementsList.filter((row) => {
      const matchesGlobalSearch =
        globalSearch === "" ||
        Object.values(row).some((value) => {
          if (Array.isArray(value)) {
            return value.some((v) =>
              v?.toString().toLowerCase().includes(globalSearch.toLowerCase())
            );
          }
          return value
            ?.toString()
            .toLowerCase()
            .includes(globalSearch.toLowerCase());
        });

      const matchesColumnFilters = Object.entries(filterColumns).every(
        ([column, filterValue]) => {
          const rowValue = row[column];
          if (!filterValue) return true;

          if (Array.isArray(rowValue)) {
            return rowValue.some((v) =>
              v?.toString().toLowerCase().includes(filterValue.toLowerCase())
            );
          }
          return rowValue
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      );

      return matchesGlobalSearch && matchesColumnFilters;
    });
  }, [sortedRequirementsList, filterColumns, globalSearch]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredRequirements.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRequirements, page, rowsPerPage]);

  return (
    <Paper elevation={2} sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ p: 1 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-start"
        >
          <Tooltip title="Clear all filters">
            <IconButton onClick={clearAllFilters} size="small">
              <FilterListOffIcon sx={{ p: 1 }} />
            </IconButton>
          </Tooltip>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search globally..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: globalSearch && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setGlobalSearch("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, maxWidth: "400px" }}
          />
        </Stack>
      </Box>

      <TableContainer sx={{ maxHeight: "calc(100vh - 280px)" }}>
        <Table stickyHeader sx={{ borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#00796b",
                  color: "white",
                  border: "1px solid #ccc",
                }}
              >
                S.No
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#00796b",
                    color: "white",
                    border: "1px solid #ccc",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ mr: 1 }}>{formatColumnName(column)}</Box>
                    <FilterPopover
                      column={column}
                      getColumnFilters={getColumnFilters}
                      filterColumns={filterColumns}
                      handleColumnFilterChange={handleColumnFilterChange}
                    />
                  </Box>
                </TableCell>
              ))}
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#00796b",
                  color: "white",
                  border: "1px solid #ccc",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={row.jobId} hover>
                <TableCell
                  sx={{
                    border: "1px solid #ccc", // Light gray border for clarity
                    textAlign: "center", // Center align the serial number
                    fontWeight: "bold", // Make it stand out
                    padding: "8px", // Ensure proper spacing
                  }}
                >
                  {index + 1 + page * rowsPerPage}
                </TableCell>

                {/* Add S.No */}
                {columns.map((column) => (
                  <CellContent
                    key={column}
                    content={row[column] || ""}
                    title={formatColumnName(column)}
                    globalSearch={globalSearch}
                  />
                ))}
                <TableCell>
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
      />
    </Paper>
  );
};

export default RequirementsTable;