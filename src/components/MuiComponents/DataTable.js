import React, { useState } from "react";
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
} from "@mui/material";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";

const DataTable = ({ data, columns, pageLimit = 5 }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageLimit);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when rows per page changes
  };

  const handleDialogOpen = (content) => {
    setDialogContent(content);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogContent("");
  };

  // Determine if the bottom header should be shown based on the number of records
  const shouldShowBottomHeader = data.length > 20;

  return (
    <>
      <TableContainer
        component={Paper}
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table>
          {/* Top Header */}
          <TableHead>
            <TableRow style={{ backgroundColor: "#00796b" }}>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    border: "1px solid #ccc",
                    textAlign: "center",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No records
                </TableCell>
              </TableRow>
            ) : (
              data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => {
                      const cellData = row[column.key];

                      return (
                        <TableCell
                          key={column.key}
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {cellData && cellData.length > 20 ? (
                            <>
                              {cellData.slice(0, 15)}...
                              <Button
                                variant="text" // Removes the border
                                color="primary"
                                onClick={() => handleDialogOpen(cellData)}
                                style={{
                                  marginLeft: "0.25rem", // minimal margin
                                  textTransform: "none",
                                  padding: "0.125rem 0.25rem", // even smaller padding
                                  borderRadius: "0.2rem", // slightly smaller rounded corners
                                  fontWeight: "500", // lighter font weight
                                  fontSize: "0.6875rem", // smaller font size (11px)
                                  minWidth: "auto", // removes extra width
                                }}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: "lightgray", // or any light color you prefer
                                  },
                                  "&:focus": {
                                    outline: "none",
                                    borderColor: "lightgray", // Optional: adjust border color on focus as well
                                  },
                                }}
                              >
                                <Typography
                                  variant="button"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: "0.6875rem", // smaller font size for the text
                                  }}
                                >
                                  <VisibilityIcon
                                    sx={{
                                      marginRight: "0.125rem", // smaller margin for the icon
                                      fontSize: "0.875rem", // smaller icon size (14px)
                                    }}
                                  />
                                  See More
                                </Typography>
                              </Button>
                            </>
                          ) : (
                            cellData
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
            )}
          </TableBody>

          {/* Bottom Header */}
          {shouldShowBottomHeader && (
            <TableHead>
              <TableRow style={{ backgroundColor: "#00796b" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      border: "1px solid #ccc",
                      textAlign: "center",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          )}
        </Table>
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
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
      </TableContainer>

      {/* Dialog to show full content */}
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
            {dialogContent}
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
    </>
  );
};

export default DataTable;
