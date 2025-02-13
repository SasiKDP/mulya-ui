import axios from "axios";
import BASE_URL from "../../redux/config";


/**
 * Fetch interview details for a given user
 * @param {string} userId - The user ID
 * @param {function} setData - Function to update state with interview data
 * @param {function} setFilteredData - Function to update filtered data
 * @param {function} setLoading - Function to toggle loading state
 * @param {function} setSnackbar - Function to show snackbar messages
 * @param {string} filterLevel - The filter criteria (Internal/External/All)
 */
export const fetchInterviewDetails = async (userId, setData, setLoading, setSnackbar) => {
  if (!userId) return;

  try {
    setLoading(true);
    const response = await axios.get(`${BASE_URL}/interviews/${userId}`);
    const interviewData = response.data || [];

    const scheduledInterviews = interviewData.filter(
      (interview) => interview.interviewStatus?.toUpperCase() === "SCHEDULED"
    );

    const processedData = scheduledInterviews.map((interview) => ({
      ...interview,
      interviewDateTime: formatDateTime(interview.interviewDateTime),
      interviewScheduledTimestamp: formatDateTime(interview.interviewScheduledTimestamp),
      duration: interview.duration ? `${interview.duration} minutes` : "",
      zoomLink: interview.zoomLink && typeof interview.zoomLink === "string" ? interview.zoomLink.trim() : null,
    }));

    setData(processedData);
    
  } catch (error) {
    setSnackbar({ open: true, message: "Failed to fetch interviews. Please try again.", severity: "error" });
  } finally {
    setLoading(false);
  }
};

/**
 * Update an interview
 * @param {string} userId - The user ID
 * @param {object} interview - The interview object to update
 * @param {function} setSnackbar - Function to show snackbar messages
 * @param {function} fetchInterviewDetails - Function to refresh interview data
 */
export const updateInterview = async (userId, interview, setSnackbar, fetchInterviewDetails ,setData,setLoading) => {
  if (!userId || !interview) return;

  const payload = {
    interviewDateTime: interview.interviewDateTime,
    duration: interview.duration,
    zoomLink: interview.zoomLink,
    userId: userId,
    candidateId: interview.candidateId,
    jobId: interview.jobId,
    clientName: interview.clientName,
    fullName: interview.fullName,
    contactNumber: interview.contactNumber,
    userEmail: interview.userEmail,
    interviewLevel: interview.interviewLevel,
    clientEmail: interview.clientEmail,
  };

  try {
    await axios.put(`${BASE_URL}/interview-update/${userId}/${interview.candidateId}`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    setSnackbar({ open: true, message: "Interview updated successfully!", severity: "success" });
    fetchInterviewDetails(userId, setData, setLoading, setSnackbar);
  } catch (error) {
    setSnackbar({ open: true, message: "Failed to update interview. Please try again.", severity: "error" });
  }
};

/**
 * Delete an interview
 * @param {object} interview - The interview object to delete
 * @param {function} setSnackbar - Function to show snackbar messages
 * @param {function} fetchInterviewDetails - Function to refresh interview data
 */
export const deleteInterview = async (interview, setSnackbar, fetchInterviewDetails) => {
  if (!interview || !interview.candidateId) return;

  try {
    await axios.delete(`${BASE_URL}/deleteinterview/${interview.candidateId}`, {
      headers: { "Content-Type": "application/json" },
    });

    setSnackbar({ open: true, message: "Interview deleted successfully!", severity: "success" });
    fetchInterviewDetails();
  } catch (error) {
    setSnackbar({ open: true, message: "Failed to delete interview. Please try again.", severity: "error" });
  }
};

/**
 * Format date-time to readable format
 * @param {string} dateTime - The date-time string
 * @returns {string} - Formatted date-time
 */
const formatDateTime = (dateTime) => {
  if (!dateTime) return "";
  try {
    return new Date(dateTime).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  } catch (error) {
    return "";
  }
};
