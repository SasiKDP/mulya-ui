import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import DataTable from "../muiComponents/DataTabel";
import { generateSubmissionColumns } from "./submissionColumns";
import httpService from "../../Services/httpService";
import ToastService from "../../Services/toastService";

const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSubmissions = async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      const response = await httpService.get("/candidate/submissions/allsubmittedcandidates");
      setSubmissions(response.data || []);
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
      ToastService.update(toastId, "Submission deleted successfully", "success");
    } catch (error) {
      ToastService.error("Failed to delete submission");
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const columns = generateSubmissionColumns(submissions, { handleEdit, handleDelete });

  return (
   
      
        <DataTable
          data={submissions}
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
      
   
  );
};

export default AllSubmissions;