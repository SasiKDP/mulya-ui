import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  InputAdornment,
  Box,
  Grid,
} from "@mui/material";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const DataTable = ({ data: initialData, columns, pageLimit = 5 }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageLimit);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(initialData);

  useEffect(() => {
    const filtered = initialData.filter((row) =>
      Object.keys(row).some((key) => {
        const value = row[key];
        return (
          typeof value === "string" &&
          value.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    );
    setFilteredData(filtered);
    setPage(0);
  }, [searchQuery, initialData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDialogOpen = (content) => {
    setDialogContent(content);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogContent("");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim() || !text) return text;

    const parts = String(text).split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span
          key={index}
          style={{ backgroundColor: "#fff3cd", padding: "0.1rem" }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };


  

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2} sx={{ mb: 2, justifyContent: "start" }}>
        <Grid item xs={12} sm={8} md={6} lg={5}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search in all columns..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <CloseIcon
                    sx={{ cursor: "pointer", color: "#00796b" }}
                    onClick={() => setSearchQuery("")}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#ffffff",
                "& fieldset": { borderColor: "#00796b" },
                "&:hover fieldset": { borderColor: "#00796b" },
                "&.Mui-focused fieldset": { borderColor: "#00796b" },
              },
            }}
          />
        </Grid>
      </Grid>

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <TableContainer
          sx={{
            maxHeight: 440,
            "& .MuiTableCell-root": {
              borderLeft: "1px solid #ccc",
              "&:first-of-type": {
                borderLeft: "none",
              },
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    sx={{
                      backgroundColor: "#00796b",
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                      zIndex: 1,
                      border: "1px solid #ccc", 
                      
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => {
                        if (column.render) {
                          return (
                            <TableCell
                              key={column.key}
                              sx={{
                                padding: "8px",
                                textAlign: "center",
                                border: "1px solid #ccc", // Adds bottom border to rows
                               
                              }}
                            >
                              {column.render(row)}
                            </TableCell>
                          );
                        }

                        const cellData = row[column.key];

                        return (
                          <TableCell
                            key={column.key}
                            sx={{
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            {cellData && String(cellData).length > 20 ? (
                              <>
                                {highlightText(
                                  String(cellData).slice(0, 15),
                                  searchQuery
                                )}
                                ...
                                <Button
                                  variant="text"
                                  color="primary"
                                  onClick={() => handleDialogOpen(cellData)}
                                  sx={{
                                    marginLeft: "0.25rem",
                                    textTransform: "none",
                                    padding: "0.125rem 0.25rem",
                                    borderRadius: "0.2rem",
                                    fontWeight: "500",
                                    fontSize: "0.6875rem",
                                    minWidth: "auto",
                                    "&:hover": {
                                      backgroundColor: "lightgray",
                                    },
                                    "&:focus": {
                                      outline: "none",
                                      borderColor: "lightgray",
                                    },
                                  }}
                                >
                                  <Typography
                                    variant="button"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      fontSize: "0.6875rem",
                                    }}
                                  >
                                    <VisibilityIcon
                                      sx={{
                                        marginRight: "0.125rem",
                                        fontSize: "0.875rem",
                                      }}
                                    />
                                    See More
                                  </Typography>
                                </Button>
                              </>
                            ) : (
                              highlightText(cellData, searchQuery)
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          sx={{
            borderTop: "1px solid #ccc",
            backgroundColor: "#fff",
          }}
          slotProps={{
            select: {
              "aria-label": "Rows per page",
            },
            actions: {
              showFirstButton: true,
              showLastButton: true,
              slots: {
                firstPageIcon: FirstPageRoundedIcon,
                lastPageIcon: LastPageRoundedIcon,
                nextPageIcon: ChevronRightRoundedIcon,
                backPageIcon: ChevronLeftRoundedIcon,
              },
            },
          }}
        />
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Full Content</DialogTitle>
        <DialogContent dividers>
          <div
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "16px",
              color: "#333",
            }}
          >
            {highlightText(dialogContent, searchQuery)}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            color="primary"
            variant="contained"
            size="large"
            style={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataTable;
