import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import DataTable from "../muiComponents/DataTabel";
import { generateInterviewColumns } from "./allInterviewColumns";
import httpService from "../../Services/httpService";
import ToastService from "../../Services/toastService";

const AllInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await httpService.get("/candidate/allscheduledinterviews");
      setInterviews(response.data || []);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      ToastService.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    ToastService.info(`Editing interview for ${row.candidateFullName}`);
    // Implement your edit logic here
  };

  const handleDelete = async (row) => {
    try {
      const toastId = ToastService.loading("Deleting interview...");
      await httpService.delete(`/interview/${row.interviewId}`);
      await fetchInterviews();
      ToastService.update(toastId, "Interview deleted successfully", "success");
    } catch (error) {
      ToastService.error("Failed to delete interview");
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const columns = generateInterviewColumns(interviews, { handleEdit, handleDelete });

  return (
    <Box sx={{ p: 3 }}>
      <DataTable
        data={interviews}
        columns={columns}
        title="Scheduled Interviews"
        loading={loading}
        enableSelection={false}
        defaultSortColumn="interviewScheduledTimestamp"
        defaultSortDirection="desc"
        defaultRowsPerPage={10}
        customTableHeight={650}
        refreshData={fetchInterviews}
        primaryColor="#00796b"
        secondaryColor="#e0f2f1"
        customStyles={{
          headerBackground: "#1976d2",
          rowHover: "#e0f2f1",
          selectedRow: "#b2dfdb",
        }}
        uniqueId="interviewId"
      />
    </Box>
  );
};

export default AllInterviews;