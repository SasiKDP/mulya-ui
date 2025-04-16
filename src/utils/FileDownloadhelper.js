// FileDownloadHelper.js - Utility functions for file downloads

/**
 * Downloads a file from a URL
 * @param {string} url - The URL of the file to download
 * @param {string} filename - The name to save the file as
 */
export function downloadFileFromURL(url, filename) {
    try {
      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename || "download");
      link.setAttribute("target", "_blank");
      link.style.display = "none";
      
      // Append to body, click, and then remove
      document.body.appendChild(link);
      setTimeout(() => {
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
      }, 0);
    } catch (error) {
      console.error("Error downloading file from URL:", error);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }
  
  /**
   * Downloads a Blob object as a file
   * @param {Blob} blob - The Blob object to download
   * @param {string} filename - The name to save the file as
   */
  export function downloadBlob(blob, filename) {
    try {
      // Create a downloadable URL from the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename || "download");
      link.style.display = "none";
      
      // Append to body, click, and then remove
      document.body.appendChild(link);
      setTimeout(() => {
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          // Important: revoke the object URL to free up memory
          window.URL.revokeObjectURL(url);
        }, 100);
      }, 0);
    } catch (error) {
      console.error("Error downloading blob:", error);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }
  
  /**
   * Safely creates a blob from text content and downloads it
   * @param {string} content - Text content to download
   * @param {string} filename - The name to save the file as
   * @param {string} mimeType - The MIME type for the file (default: text/plain)
   */
  export function downloadTextAsFile(content, filename, mimeType = "text/plain") {
    try {
      const blob = new Blob([content], { type: mimeType });
      downloadBlob(blob, filename);
      return true;
    } catch (error) {
      console.error("Error creating text download:", error);
      return false;
    }
  }