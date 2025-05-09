import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Download } from "@mui/icons-material";
import ToastService from "../Services/toastService";

const DownloadResume = ({ candidate, getDownloadUrl }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async (format, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (!candidate?.candidateId || !candidate?.jobId) {
      console.error('Missing required candidate data:', candidate);
      ToastService.error("Cannot download resume: missing candidate information");
      handleClose();
      return;
    }

    const url = getDownloadUrl(candidate, format);
    console.log(`Downloading from URL: ${url}`); // Debug URL

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
        credentials: 'include', // Include cookies if authentication is needed
      });

      if (!response.ok) {
        console.error('Download failed with status:', response.status);
        throw new Error(`Download failed with status ${response.status}`);
      }

      // Check content type to ensure we're getting the right format
      const contentType = response.headers.get('content-type');
      console.log(`Received content type: ${contentType}`); // Debug content type
      
      
      const blob = await response.blob();
      
      // Set appropriate extension based on actual content type
      let extension = 'pdf';
      if (format === 'word') {
        extension = 'docx';
      }

      let filename = `${candidate.fullName}.${extension}`;

      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, '');
        }
      }

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Resume download failed', error);
      ToastService.error("Download failed. Please try again.");
    }

    handleClose();
  };

  return (
    <>
      <IconButton 
        color="success" 
        size="small" 
        onClick={handleClick}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Download fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PopperProps={{ disablePortal: true }}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={(e) => handleDownload("pdf", e)}>PDF</MenuItem>
        <MenuItem onClick={(e) => handleDownload("word", e)}>Word</MenuItem>
      </Menu>
    </>
  );
};

export default DownloadResume;

