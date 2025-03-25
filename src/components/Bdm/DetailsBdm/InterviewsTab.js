import React from 'react';
import ReusableTable from './ReusableTable';

const InterviewsTab = ({ interviewsData }) => {
  const allInterviews = Object.values(interviewsData).flat();

  const columns = allInterviews.length > 0
    ? Object.keys(allInterviews[0]).map((key) => ({
        key,
        label: key.replace(/([A-Z])/g, ' $1').trim() // Converts camelCase to readable format
      }))
    : [];

  return <ReusableTable columns={columns} data={allInterviews} />;
};

export default InterviewsTab;
