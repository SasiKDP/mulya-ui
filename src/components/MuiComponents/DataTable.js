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

const DataTable = ({ data: initialData, columns, pageLimit = 10 }) => {
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
          style={{ backgroundColor: "#F6C90E", padding: "0.1rem" }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={8} md={6} lg={4}>
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
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <TableContainer
          sx={{
            flexGrow: 1,
            height: "400px", // Fixed height to ensure pagination is visible
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
            },
            "& .MuiTableCell-root": {
              borderBottom: "1px solid #ccc",
              borderRight: "1px solid #ccc",
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {/* Add Serial Number Column */}
                <TableCell
                  sx={{
                    backgroundColor: "#00796b",
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: 2.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  S.No
                </TableCell>

                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    sx={{
                      backgroundColor: "#00796b",
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: 2,
                      whiteSpace: "normal", // Allows text to wrap
                      wordWrap: "break-word", // Ensures long words break
                      maxWidth: "150px", // Set max width for better alignment
                      overflow: "hidden",
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
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor:
                          index % 2 === 0
                            ? "#f9f9f9"
                            : "rgba(192, 238, 211, 0.34)",
                        "&:hover": {
                          backgroundColor: "rgba(0, 121, 107, 0.04)",
                        },
                      }}
                    >
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        {page * rowsPerPage + index + 1}
                      </TableCell>

                      {columns.map((column) => {
                        if (column.render) {
                          return (
                            <TableCell
                              key={column.key}
                              sx={{
                                padding: 2,
                                textAlign: "left",
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
                              padding: 2,
                              textAlign: "left",
                              whiteSpace: "nowrap",
                              maxWidth: "200px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {cellData && String(cellData).length > 15 ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {highlightText(
                                    String(cellData).slice(0, 15),
                                    searchQuery
                                  )}
                                  ...
                                </Typography>

                                <Button
                                  variant="text"
                                  onClick={() => handleDialogOpen(cellData)}
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    ml: 1,
                                    minWidth: "auto",
                                    p: "2px 8px",
                                    color: "#00796b",
                                    flexShrink: 0,
                                  }}
                                >
                                  <VisibilityIcon
                                    sx={{ fontSize: "1rem", mr: 0.5 }}
                                  />
                                  <span style={{ fontSize: "0.75rem" }}>
                                    See More
                                  </span>
                                </Button>
                              </Box>
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
          rowsPerPageOptions={[10, 20, 30, 40, 50, { label: "All", value: -1 }]}
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "#00796b",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Full Content
        </DialogTitle>
        <DialogContent dividers>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Roboto, sans-serif",
              color: "#333",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {highlightText(dialogContent, searchQuery)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            variant="contained"
            sx={{
              backgroundColor: "#00796b",
              "&:hover": {
                backgroundColor: "#00695c",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataTable;