import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Download } from "@mui/icons-material";

const DownloadResume = ({ candidate, baseUrl }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async (format) => {
    
    if (!candidate?.id) return;
  
    const url = `${baseUrl}/candidate/bench/download/${candidate.id}?format=${format}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream',
        },
      });
  
      if (!response.ok) {
        throw new Error('Download failed');
      }
  
      const blob = await response.blob();
  
      // Default filename: use full name with spaces and extension
      let filename = `${candidate.fullName}.${
        format === 'pdf' ? 'pdf' : 'docx'
      }`;
  
      // Override with backend-provided filename if present
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
      alert('Download failed. Please try again.');
    }
  
    handleClose();
  };
  

  return (
    <>
       <IconButton
              color="success"
              size="small"
              onClick={handleClick}
              // disabled={downloadingResume}
        >
        <Download fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} 
          anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
          }}
          transformOrigin={{
           vertical: 'top',
           horizontal: 'right',
          }}
          PopperProps={{ disablePortal: true }}
        >
        <MenuItem onClick={() => handleDownload("pdf")}>PDF</MenuItem>
        <MenuItem onClick={() => handleDownload("word")}>Word</MenuItem>
      </Menu>
    </>
  );
};

export default DownloadResume;
