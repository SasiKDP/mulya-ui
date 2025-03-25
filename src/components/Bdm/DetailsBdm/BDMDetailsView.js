import React, { useState } from "react";
import { Box, Tabs, Tab, CircularProgress } from "@mui/material";
import ClientDetailsTab from "./ClientDetailsTab";
import SubmissionsTab from "./SubmissionsTab";
import InterviewsTab from "./InterviewsTab";
import PlacementsTab from "./PlacementsTab";
import BdmDetailsLayout from "./BdmDetailsLayout";

const BDMDetailsView = ({ bdmData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setLoading(true);
    setActiveTab(newValue);

    // Simulate a brief loading time (useful if fetching data)
    setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust delay if needed
  };

  const tabComponents = [
    <BdmDetailsLayout key="bdmDetails" bdmDetailsData={bdmData.bdmDetails} />,
    <ClientDetailsTab key="clients" clientDetails={bdmData.clientDetails} />,
    <SubmissionsTab key="submissions" submissionsData={bdmData.submissions} />,
    <InterviewsTab key="interviews" interviewsData={bdmData.interviews} />,
    <PlacementsTab key="placements" placementsData={bdmData.placements} />,
  ];

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          width: "60%",
          bgcolor: "white",
          borderRadius: "8px",
          ".MuiTabs-indicator": {
            height: "4px",
            borderRadius: "4px",
            backgroundColor: "#2A4DBD",
          },
        }}
      >
        <Tab  label="BDM Details" />
        <Tab  label="Clients" />
        <Tab  label="Submissions" />
        <Tab  label="Interviews" />
        <Tab  label="Placements" />
      </Tabs>

      <Box p={3}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress color="primary" />
          </Box>
        ) : (
          tabComponents[activeTab]
        )}
      </Box>
    </Box>
  );
};

export default BDMDetailsView;
