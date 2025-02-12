import axios from "axios";
import BASE_URL from '../../redux/config'





/**
 * Fetch all candidate submissions for a given user.
 * @param {string} userId 
 * @returns {Promise}
 */
export const fetchCandidates = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/candidate/submissions/${userId}`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error fetching candidates:", error);
        return [];
    }
};

/**
 * Fetch the current resume of a candidate.
 * @param {string} candidateId 
 * @returns {Promise<File | null>}
 */
export const fetchCurrentResume = async (candidateId) => {
  try {
    const response = await axios.get(`${BASE_URL}/candidate/download-resume/${candidateId}`, {
      responseType: "blob",
      headers: { "Content-Type": "application/json" },
    });

    // Extract file name from response headers
    const fileName = response.headers["content-disposition"]?.split("filename=")[1] || "resume.pdf";

    return new File([response.data], fileName, { type: response.data.type });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return null;
  }
};

/**
 * Upload or update a candidate's details along with resume.
 * @param {Object} candidateData 
 * @returns {Promise}
 */
export const updateCandidate = async (candidateData) => {
  const formData = new FormData();

  Object.entries(candidateData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return axios.put(`${BASE_URL}/candidate/candidatesubmissions/${candidateData.candidateId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Delete a candidate record.
 * @param {string} candidateId 
 * @returns {Promise}
 */
export const deleteCandidate = async (candidateId) => {
  return axios.delete(`${BASE_URL}/candidate/deletecandidate/${candidateId}`);
};

/**
 * Download a candidate's resume as a file.
 * @param {string} candidateId 
 * @returns {Promise<void>}
 */
export const downloadResume = async (candidateId) => {
  try {
    const response = await axios.get(`${BASE_URL}/candidate/download-resume/${candidateId}`, {
      responseType: "blob",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.data) throw new Error("No file received from the server.");

    const contentType = response.headers["content-type"];
    const extension = contentType === "application/pdf"
      ? ".pdf"
      : contentType === "application/msword"
      ? ".doc"
      : contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ? ".docx"
      : ".pdf"; // Default to .pdf

    const filename = `${candidateId}${extension}`;
    const blob = new Blob([response.data], { type: response.data.type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading resume:", error);
  }
};
