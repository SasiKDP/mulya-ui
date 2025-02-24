import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Tooltip, CircularProgress, Alert, Snackbar } from '@mui/material';
import { 
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  TextSnippet as TextIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const JobDescription = ({ description, jobId, onView }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [fileDetails, setFileDetails] = useState({
    type: null,
    url: null,
    fileName: null
  });

  useEffect(() => {
    const processDescription = async () => {
      if (!description) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Handle Blob (file) directly passed in
        if (description instanceof Blob) {
          const url = URL.createObjectURL(description);
          const extension = description.type ? description.type.split('/')[1] : 'file';
          setFileDetails({
            type: description.type || 'application/octet-stream',
            url: url,
            fileName: `job-description-${jobId}.${extension}`
          });
          return;
        }

        // Handle Base64 Image case
        if (typeof description === 'string' && description.startsWith('data:image')) {
          const match = description.match(/^data:image\/(\w+);base64,/);
          const extension = match ? match[1] : 'png';
          setFileDetails({
            type: `image/${extension}`,
            url: description,
            fileName: `job-description-${jobId}.${extension}`
          });
          return;
        }

        // Handle URL strings (backend endpoint that returns Blob)
        if (typeof description === 'string' && 
            (description.startsWith('http') || description.startsWith('/download'))) {
          // Replace {jobId} placeholder if present
          const finalUrl = description.replace('{jobId}', jobId);
          // Extract file extension from URL (if available)
          const extension = finalUrl.split('.').pop().split('?')[0] || 'file';
          setFileDetails({
            type: getFileType(extension),
            url: finalUrl,
            fileName: `job-description-${jobId}.${extension}`
          });
          return;
        }

        // Handle plain text: convert text to Blob
        if (typeof description === 'string') {
          const blob = new Blob([description], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          setFileDetails({
            type: 'text/plain',
            url: url,
            fileName: `job-description-${jobId}.txt`
          });
          return;
        }
      } catch (err) {
        setError('Failed to process file. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    processDescription();

    return () => {
      // Revoke object URL if it was created locally (not a data URL or external URL)
      if (fileDetails.url && !fileDetails.url.startsWith('data:') && !fileDetails.url.startsWith('http')) {
        URL.revokeObjectURL(fileDetails.url);
      }
    };
  }, [description, jobId]);

  const handleDownload = async () => {
    try {
      setLoading(true);
      // Fetch the blob from the backend URL
      const response = await fetch(fileDetails.url);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      
      // Create an object URL from the blob
      const url = URL.createObjectURL(blob);
      <img src={url} alt="Downloaded Image" />
      // Create a temporary link element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileDetails.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      URL.revokeObjectURL(url);
      setDownloadStatus('Download successful!');
    } catch (err) {
      setError('Download failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const getFileType = (extension) => {
    const typeMap = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      txt: 'text/plain'
    };
    return typeMap[extension.toLowerCase()] || 'application/octet-stream';
  };

  const getFileIcon = () => {
    if (!fileDetails.type) return <DescriptionIcon />;
    if (fileDetails.type.startsWith('image')) return <ImageIcon />;
    if (fileDetails.type.includes('pdf')) return <PdfIcon />;
    if (fileDetails.type.includes('text')) return <TextIcon />;
    return <DescriptionIcon />;
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {loading ? (
          <CircularProgress size={20} />
        ) : error ? (
          <Alert 
            severity="error" 
            icon={<ErrorIcon />}
            sx={{ '& .MuiAlert-message': { display: 'flex', alignItems: 'center' } }}
          >
            {error}
          </Alert>
        ) : !description ? (
          <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionIcon fontSize="small" />
            No description available
          </Typography>
        ) : fileDetails.url ? (
          <>
            {getFileIcon()}
            <Typography noWrap sx={{ maxWidth: 200 }}>
              {fileDetails.fileName}
            </Typography>
            <Tooltip title={`Download ${fileDetails.type.includes('image') ? 'Image' : 'File'}`}>
              <Button
                onClick={handleDownload}
                startIcon={<DownloadIcon />}
                variant="contained"
                size="small"
                disabled={loading}
                sx={{ 
                  borderRadius: 2,
                  minWidth: 'auto',
                  '&:hover': { transform: 'translateY(-1px)' }
                }}
              >
                Download
              </Button>
            </Tooltip>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextIcon />
            <Typography noWrap sx={{ maxWidth: 200 }}>
              {description.slice(0, 20)}...
            </Typography>
            <Button
              onClick={onView}
              startIcon={<DescriptionIcon />}
              size="small"
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                minWidth: 'auto',
                '&:hover': { transform: 'translateY(-1px)' }
              }}
            >
              View
            </Button>
          </Box>
        )}
      </Box>
      
      <Snackbar
        open={!!downloadStatus}
        autoHideDuration={3000}
        onClose={() => setDownloadStatus('')}
        message={downloadStatus}
      />
    </>
  );
};

export default JobDescription;
