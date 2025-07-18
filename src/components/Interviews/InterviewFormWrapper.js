import React from "react";
import EditInterviewForm from "./EditInterviewForm";
import RescheduleInterviewForm from "./RescheduleInterviewForm";
import ScheduleJoiningInterviewForm from "./ScheduleJoiningInterviewForm";

const InterviewFormWrapper = ({ 
  formType, 
  data, 
  onClose, 
  onSuccess, 
  showCoordinatorView = false 
}) => {
  // Determine the actual view context based on the data or prop
  const isCoordinatorView = data?.isCoordinatorView || showCoordinatorView;

  const renderForm = () => {
    const commonProps = {
      data,
      onClose,
      onSuccess,
      // For edit and reschedule forms, only show coordinator fields if in coordinator view
      showCoordinatorFields: isCoordinatorView && (formType === "edit" || formType === "reschedule"),
      // For schedule joining, never show coordinator fields
      showStatusAndLevel: true // Always show status and level fields
    };

    switch (formType) {
      case "edit":
        return <EditInterviewForm {...commonProps} />;
      case "reschedule":
        return <RescheduleInterviewForm {...commonProps} />;
      case "schedule":
        return <ScheduleJoiningInterviewForm {...commonProps} />;
      default:
        return <EditInterviewForm {...commonProps} />;
    }
  };

  return renderForm();
};

export default InterviewFormWrapper;