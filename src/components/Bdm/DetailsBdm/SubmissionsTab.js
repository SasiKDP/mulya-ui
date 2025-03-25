import React from 'react';
import ReusableTable from './ReusableTable';

const SubmissionsTab = ({ submissionsData }) => {
  const allSubmissions = Object.values(submissionsData).flat();

  if (allSubmissions.length === 0) {
    return <p>No submissions available</p>;
  }

  // Define column configuration for ReusableTable
  const columns = [
    { key: 'candidateId', label: 'Candidate ID' },
    { key: 'fullName', label: 'Candidate Name' },
    { key: 'clientName', label: 'Client Name' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'candidateEmailId', label: 'Email' },
    { key: 'contactNumber', label: 'Contact Number' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'skills', label: 'Skills' },
    { key: 'overallFeedback', label: 'Feedback' },
    { key: 'jobId', label: 'Job ID' }
   
    
  ];

  return <ReusableTable columns={columns} data={allSubmissions} />;
};

export default SubmissionsTab;
