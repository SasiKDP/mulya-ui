import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination
} from '@mui/material';

const ReusableTable = ({ columns, data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!data || data.length === 0) {
    return <p style={{ textAlign: 'center', padding: '10px', color: '#666' }}>No data available</p>;
  }

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  return (
    <Paper sx={{ borderRadius: '8px', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)', padding: '10px' }}>
      <TableContainer sx={{ maxHeight: 650, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  sx={{
                    backgroundColor: '#2A4DBD',
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '2px solid #ddd', // Proper border for headers
                    borderRight: '1px solid #ccc', // Column separation
                    padding: '12px',
                    '&:last-child': { borderRight: 'none' }, // Remove border from last column
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Pagination logic
              .map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  sx={{
                    '&:nth-of-type(even)': { backgroundColor: '#F8F9FC' },
                    '&:hover': { backgroundColor: '#E7ECFF' },
                    borderBottom: '2px solid #ddd', // Proper row separation
                  }}
                >
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      sx={{
                        borderBottom: '1px solid #ccc', // Row separation
                        borderRight: '1px solid #ccc', // Column separation
                        '&:last-child': { borderRight: 'none' },
                        padding: '12px',
                        minHeight: '48px',
                        fontSize: '0.95rem',
                        textAlign: 'center',
                        color: '#333',
                        wordBreak: 'break-word', // Breaks long words
                        whiteSpace: 'normal', // Allows text wrapping
                      }}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key] || '—'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[ 10, 15, 20]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ backgroundColor: '#F8F9FC' }}
      />
    </Paper>
  );
};

export default ReusableTable;
