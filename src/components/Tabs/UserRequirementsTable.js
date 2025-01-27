import React, { useState, useEffect } from "react";
import axios from "axios";
import ReusableTable from "../ReusableTable";  // Assuming you have this file in the same directory
import BASE_URL from "../../redux/apiConfig";

const UserRequirementsTable = ({ userId }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchUserSpecificData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/${userId}/specific-data` // Replace with the API endpoint for user-specific data
        );
        setData(response.data.items);
        setTotalCount(response.data.totalCount);  // Assuming the API response includes a totalCount
      } catch (err) {
        console.error("Failed to fetch user-specific data", err);
      }
    };

    fetchUserSpecificData();
  }, [userId, page, rowsPerPage]);

  const headers = ["employeeId", "employeeName"]; // Example headers, customize based on data

  // Handle pagination changes
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to page 0 on rows per page change
  };

  const onCellRender = (row, header) => {
    // You can add custom rendering logic for each cell, for example, formatting the data
    if (header === "employeeName") {
      return `${row[header]} (formatted)`;  // Example: Adding "(formatted)" to employee name
    }
    return row[header];
  };

  return (
    <ReusableTable
      data={data}
      headers={headers}
      page={page}
      rowsPerPage={rowsPerPage}
      totalCount={totalCount}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onCellRender={onCellRender}
    />
  );
};

export default UserRequirementsTable;
