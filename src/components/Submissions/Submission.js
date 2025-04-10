import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  Drawer,
  Link,
  Typography,
} from "@mui/material";
import { Download, Edit, Delete } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

import DataTable from "../muiComponents/DataTabel";
import CandidateSubmissionDrawer from "../Assigned/CandidateSubmissionDrawer";
import ScheduleInterviewForm from "./ScheduleInterviewForm";
import httpService from "../../Services/httpService";
import { useSelector } from "react-redux";

const Submission = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [candidateData, setCandidateData] = useState(null);
  const [mode, setMode] = useState("add");

  const [scheduleDrawerOpen, setScheduleDrawerOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);

  const { userId } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await httpService.get(`/candidate/submissions/${userId}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching candidate submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = async (candidateId, e) => {
    e.stopPropagation();
    try {
      setDownloadLoading(true);
      const response = await httpService.get(`/candidate/resume/${candidateId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${candidateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading resume:", error);
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleEdit = (row, e) => {
    e.stopPropagation();
    setCandidateData(row);
    setMode("edit");
    setOpenDrawer(true);
  };

  const handleDelete = async (candidateId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await httpService.delete(`/candidate/${candidateId}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting candidate:", error);
      }
    }
  };

  const openNewCandidateDrawer = () => {
    setCandidateData(null);
    setMode("add");
    setOpenDrawer(true);
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
  };

  const openScheduleDrawer = (row, e) => {
    e.stopPropagation();
    setScheduleData(row);
    setScheduleDrawerOpen(true);
  };

  const closeScheduleDrawer = () => {
    setScheduleDrawerOpen(false);
  };

  const generateColumns = (data) => {
    if (data.length === 0) return [];
    return [
      {
        key: "candidateId",
        label: "Candidate ID",
        type: "text",
        sortable: true,
        filterable: true,
        width: 120,
      },
      {
        key: "fullName",
        label: "Full Name",
        type: "text",
        sortable: true,
        filterable: true,
        width: 180,
      },
      {
        key: "emailId",
        label: "Email",
        type: "text",
        sortable: true,
        filterable: true,
        width: 220,
      },
      {
        key: "contactNumber",
        label: "Contact",
        type: "text",
        sortable: true,
        filterable: true,
        width: 120,
      },
      {
        key: "jobId",
        label: "Job ID",
        type: "text",
        sortable: true,
        filterable: true,
        width: 100,
      },
      {
        key: "interviewStatus",
        label: "Status",
        type: "select",
        sortable: true,
        filterable: true,
        width: 120,
        options: [
          "selected",
          "rejected",
          "pending",
          "interviewed",
          "cancelled",
          "not scheduled",
        ],
      },
      {
        key: "schedule",
        label: "Schedule Interview",
        sortable: false,
        filterable: false,
        width: 160,
        align: "center",
        render: (row) => (
          <Link
            component="button"
            variant="body2"
            onClick={(e) => openScheduleDrawer(row, e)}
          >
            Schedule Interview
          </Link>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        filterable: false,
        width: 150,
        align: "center",
        render: (row) => (
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Tooltip title="Download Resume">
              <IconButton
                color="primary"
                size="small"
                onClick={(e) => downloadResume(row.candidateId, e)}
                disabled={downloadLoading}
              >
                {downloadLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <Download fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Candidate">
              <IconButton
                color="primary"
                size="small"
                onClick={(e) => handleEdit(row, e)}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Candidate">
              <IconButton
                color="error"
                size="small"
                onClick={(e) => handleDelete(row.candidateId, e)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ];
  };

  const columns = generateColumns(data);

  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        title="Candidate Submissions"
        loading={loading}
        enableSelection={false}
        defaultSortColumn="candidateId"
        defaultSortDirection="desc"
        defaultRowsPerPage={10}
        customTableHeight={650}
        refreshData={fetchData}
        primaryColor="#00796b"
        secondaryColor="#e0f2f1"
        customStyles={{
          headerBackground: "#1976d2",
          rowHover: "#e0f2f1",
          selectedRow: "#b2dfdb",
        }}
        onAddNew={openNewCandidateDrawer}
         uniqueId="candidateId"
      />

      <Drawer anchor="right" open={openDrawer} onClose={closeDrawer}>
        <CandidateSubmissionDrawer
          candidateData={candidateData}
          setCandidateData={setCandidateData}
          onClose={closeDrawer}
          mode={mode}
          refreshData={fetchData}
          userId={userId}
        />
      </Drawer>

      <Drawer
        anchor="right"
        open={scheduleDrawerOpen}
        onClose={closeScheduleDrawer}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 500, md: 500, lg: 600 },
            p: 2,
            pt: 0,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            boxShadow: 3,
            backgroundColor: "#fafafa",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Schedule Interview
          </Typography>
          <IconButton onClick={closeScheduleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            px: 2,
            pb: 4,
            pt: 1,
            overflowY: "auto",
            height: "calc(100% - 60px)",
          }}
        >
          <ScheduleInterviewForm
            data={scheduleData}
            onClose={closeScheduleDrawer}
            refreshData={fetchData} // ✅ Added refresh call
          />
        </Box>
      </Drawer>
    </div>
  );
};

export default Submission;
