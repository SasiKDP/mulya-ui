// utils/downloadUtils.js

import httpService from "../Services/httpService";


/**
 * Downloads a file from a URL with proper error handling
 * @param {string} url - The URL to download from
 * @param {string} fileName - The name to give the downloaded file
 * @param {object} options - Optional configuration
 * @param {string} options.responseType - The expected response type (default: 'blob')
 * @param {object} options.headers - Additional headers to include
 * @param {function} options.onStart - Callback when download starts
 * @param {function} options.onSuccess - Callback on successful download
 * @param {function} options.onError - Callback when download fails
 * @returns {Promise<void>}
 */
export const downloadFile = async (
  url,
  fileName,
  {
    responseType = 'blob',
    headers = {},
    onStart,
    onSuccess,
    onError,
  } = {}
) => {
  try {
    onStart?.();

    const response = await httpService.get(url, {
      responseType,
      headers,
    });

    if (!response?.data) {
      throw new Error('No file data received');
    }

    // Get filename from content-disposition header if available
    const contentDisposition = response.headers['content-disposition'];
    const finalFileName = contentDisposition?.split('filename=')[1] || fileName;

    // Determine file extension based on content type
    const contentType = response.headers['content-type'];
    let extension = '.bin'; // default extension

    if (contentType) {
      if (contentType.includes('pdf')) extension = '.pdf';
      else if (contentType.includes('word')) extension = '.doc';
      else if (contentType.includes('excel')) extension = '.xls';
      else if (contentType.includes('image')) extension = '.jpg';
      else if (contentType.includes('json')) extension = '.json';
      else if (contentType.includes('text')) extension = '.txt';
    }

    // Ensure filename has proper extension
    const downloadFileName = finalFileName.includes('.') 
      ? finalFileName 
      : `${finalFileName}${extension}`;

    // Create download link
    const blob = new Blob([response.data], { type: contentType });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', downloadFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    onSuccess?.();
  } catch (error) {
    console.error('Download failed:', error);
    onError?.(error);
    throw error;
  }
};