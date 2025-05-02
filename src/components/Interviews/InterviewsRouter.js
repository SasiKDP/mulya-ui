import React from "react";
import { useSelector } from "react-redux";
import AllInterviews from "./AllInterviews";
import TeamLeadInterviews from "./TeamLeadInterviews";
import RecruiterInterviews from "./Interviews";

/**
 * Router component that renders the appropriate interviews component based on user role
 * This allows for cleaner code organization and better separation of concerns
 */
const InterviewsRouter = () => {
  const { role } = useSelector((state) => state.auth);
  
  // Determine which component to render based on user role
  const renderRoleBasedComponent = () => {
    switch (role) {
      case "SUPERADMIN":
        return <AllInterviews />;
      case "TEAMLEAD":
        return <TeamLeadInterviews />;
      default:
        return <RecruiterInterviews />;
    }
  };

  return renderRoleBasedComponent();
};

export default InterviewsRouter;