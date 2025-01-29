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
} from "@mui/material";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const DataTable = ({ data, columns, pageLimit = 5 }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageLimit);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper} style={{ border: "1px solid #ccc" }}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: "#00796b" }}>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  border: "1px solid #ccc",
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    style={{ border: "1px solid #ccc" }}
                  >
                    {row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
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
  );
};

export default DataTable;
