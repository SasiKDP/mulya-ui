import React, { useState, useEffect } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import DataTable from "../muiComponents/DataTabel";
import { generateSubmissionColumns } from "./submissionColumns";
import httpService from "../../Services/httpService";
import ToastService from "../../Services/toastService";
import DateRangeFilter from "../muiComponents/DateRangeFilter";
import { useSelector } from "react-redux";

const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { isFilteredDataRequested } = useSelector((state) => state.bench);
  const { filteredSubmissionsList } = useSelector((state) => state.submission);

  const fetchSubmissions = async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      const response = await httpService.get(
        "/candidate/submissions"
      );
      setSubmissions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      ToastService.error("Failed to load submissions");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleEdit = (row) => {
    ToastService.info(`Editing submission for ${row.fullName}`);
    // Implement your edit logic here
  };

  const handleDelete = async (row) => {
    try {
      const toastId = ToastService.loading("Deleting submission...");
      await httpService.delete(`/submission/${row.submissionId}`);
      await fetchSubmissions();
      ToastService.update(
        toastId,
        "Submission deleted successfully",
        "success"
      );
    } catch (error) {
      ToastService.error("Failed to delete submission");
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const columns = generateSubmissionColumns(submissions, {
    handleEdit,
    handleDelete,
  });

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          flexWrap: "wrap",
          mb: 3,
          justifyContent: "space-between",
          p: 2,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" color="primary">
          Submissions Management
        </Typography>

        <DateRangeFilter component="Submissions" />
      </Stack>

      <DataTable
        data={
          isFilteredDataRequested ? filteredSubmissionsList : submissions || []
        }
        columns={columns}
        title="Candidate Submissions"
        loading={loading}
        onRefresh={fetchSubmissions}
        isRefreshing={isRefreshing}
        enableSelection={false}
        defaultSortColumn="submissionDate"
        defaultSortDirection="desc"
        defaultRowsPerPage={10}
        customTableHeight={650}
        primaryColor="#3f51b5"
        secondaryColor="#e8eaf6"
        customStyles={{
          headerBackground: "#1976d2",
          rowHover: "#e8eaf6",
          selectedRow: "#c5cae9",
        }}
        uniqueId="submissionId"
      />
    </>
  );
};

export default AllSubmissions;
