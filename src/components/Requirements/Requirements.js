import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import BASE_URL from "../../redux/apiConfig";
import CustomDialog from "../MuiComponents/CustomDialog";



const Requirements = () => {
  const user = useSelector((state) => state.auth.user);
  const [requirementsList, setRequirementsList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [fullDescription, setFullDescription] = useState("");
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://35.188.150.92/requirements/getAssignments` // Replace userId as necessary
        );
        setRequirementsList(response.data);
      } catch (err) {
        setError("Failed to load job requirements");
      }
    };

    fetchData();
  }, []);

  

  const tableHeaders =
    requirementsList.length > 0 ? Object.keys(requirementsList[0]) : [];
   // Safeguard against non-array `requirementsList`
   const paginatedData = Array.isArray(requirementsList)
   ? requirementsList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
   : [];

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (description, jobTitle) => {
    setFullDescription(description);
    setCurrentJobTitle(jobTitle);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#3f51b5",
          marginBottom: 2,
          textAlign: "start",
        }}
      >
        Requirements List
      </Typography>

      {/* Error handling message */}
      {error && (
        <Box
          sx={{
            padding: 2,
            marginBottom: 2,
            backgroundColor: "#f8d7da", // Light red background for error
            border: "1px solid #f5c6cb",
            borderRadius: 2,
            color: "#721c24", // Dark red text
          }}
        >
          <Typography variant="body1">{error}</Typography>
        </Box>
      )}

      {/* Table Section */}
      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid #ddd",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          maxHeight: "80vh", // Set the height as needed
          maxWidth:'160vh',
          overflowY: "auto", 
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#4db6ac" }}>
              {tableHeaders.map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                    textTransform: "capitalize",
                    border: "1px solid #ddd",
                    padding:'8px',
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#e8f5e9",
                    },
                  }}
                >
                  {tableHeaders.map((header, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        border: "1px solid #ddd",
                        padding:'6px',
                      }}
                    >
                      {header === "jobDescription" ? (
                        <>
                          {row[header].length > 30 ? (
                            <>
                              {row[header].slice(0, 30)}...
                              <Button
                                onClick={() =>
                                  handleOpenDialog(row[header], row.jobTitle)
                                }
                                size="small"
                                variant="text"
                                sx={{
                                  color: "#3f51b5",
                                  textTransform: "capitalize",
                                }}
                              >
                                View More
                              </Button>
                            </>
                          ) : (
                            row[header]
                          )}
                        </>
                      ) : (
                        row[header]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableHeaders.length} align="center">
                  No requirements available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={requirementsList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ marginTop: 2 }}
      />

      {/* Dialog */}
      {/* <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{currentJobTitle}</DialogTitle>
        <DialogContent>
          <Typography>{fullDescription}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}

      <CustomDialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        title={currentJobTitle} 
        content={fullDescription} 
      />
    </Box>
  );
};

export default Requirements;
