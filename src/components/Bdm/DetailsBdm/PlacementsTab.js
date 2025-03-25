import React from "react";
import ReusableTable from "./ReusableTable";

const PlacementsTab = ({ placementsData }) => {
  // Convert placements object to an array of placement entries
  const allPlacements = Object.entries(placementsData)
    .flatMap(([clientName, placements]) =>
      placements.map((placement) => ({
        ...placement,
        clientName, // Add client name to each row
      }))
    );

  // Define columns for the table
  const columns = [
    { key: "candidateId", label: "Candidate ID" },
    { key: "fullName", label: "Full Name" },
    { key: "candidateEmailId", label: "Email" },
    { key: "jobId", label: "Job ID" },
    { key: "jobTitle", label: "Job Title" },
    { key: "clientName", label: "Client Name" },
  ];

  return <ReusableTable columns={columns} data={allPlacements} />;
};

export default PlacementsTab;
