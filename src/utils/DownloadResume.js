import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Download } from "@mui/icons-material";
import ToastService from "../Services/toastService";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  window.pdfjsWorkerPath || 
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const DownloadResume = ({ candidate, getDownloadUrl }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };

  const downloadFile = async (getDownloadUrl, format) => {
    try {
      const response = await fetch(getDownloadUrl, {
        method: 'GET',
        headers: {
          'Accept': format === 'pdf' 
            ? 'application/pdf' 
            : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      
      // Additional validation for PDF files
      if (format === 'pdf') {
        const isValid = await validatePdfBlob(blob);
        if (!isValid) {
          throw new Error("Invalid PDF file downloaded");
        }
      }

      return blob;
    } catch (error) {
      console.error('File download failed:', error);
      throw error;
    }
  };

  const validatePdfBlob = async (blob) => {
    try {
      const arrayBuffer = await blob.slice(0, 4).arrayBuffer();
      const header = new Uint8Array(arrayBuffer);
      return (
        header[0] === 0x25 && // %
        header[1] === 0x50 && // P
        header[2] === 0x44 && // D
        header[3] === 0x46    // F
      );
    } catch (e) {
      return false;
    }
  };

  const convertPdfToWord = async (pdfBlob) => {
  setIsConverting(true);
  try {
    // Load PDF document
    const pdfData = await pdfBlob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    
    // Document setup with professional styling
    const doc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            run: {
              size: 22, // Default to 11pt (22 half-points)
            },
            paragraph: {
              spacing: { line: 276 }, // 1.15 line spacing
            },
          },
        ],
      },
      sections: [],
    });

    // Track previous line position for grouping
    let prevBottom = null;
    let currentParagraph = [];
    let currentLeft = null;
    
    // Process each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.0 });
      const textContent = await page.getTextContent();
      
      // Process each text item
      for (const item of textContent.items) {
        const transform = item.transform;
        const left = transform[4];
        const bottom = transform[5];
        const fontSize = Math.round(transform[3] * 2); // Convert to half-points
        const isBold = item.fontName.includes('Bold') || item.fontName.includes('bold');
        const isItalic = item.fontName.includes('Italic') || item.fontName.includes('italic');
        
        // Check if we should start a new paragraph
        const isNewLine = prevBottom !== null && Math.abs(bottom - prevBottom) > 5;
        const isNewLeft = currentLeft !== null && Math.abs(left - currentLeft) > 10;
        
        if (isNewLine || isNewLeft) {
          if (currentParagraph.length > 0) {
            doc.addSection({
              properties: {},
              children: [
                new Paragraph({
                  children: currentParagraph,
                }),
              ],
            });
            currentParagraph = [];
          }
        }
        
        // Add text run with preserved formatting
        currentParagraph.push(
          new TextRun({
            text: item.str,
            size: fontSize,
            bold: isBold,
            italic: isItalic,
          })
        );
        
        prevBottom = bottom;
        currentLeft = left;
      }
      
      // Add remaining content
      if (currentParagraph.length > 0) {
        doc.addSection({
          properties: {},
          children: [
            new Paragraph({
              children: currentParagraph,
            }),
          ],
        });
        currentParagraph = [];
      }
      
      // Add page break if not last page
      if (i < pdf.numPages) {
        doc.addSection({
          properties: {
            page: {
              break: "page",
            },
          },
          children: [],
        });
      }
    }

    return await Packer.toBlob(doc);
  } catch (error) {
    console.error('Conversion failed:', error);
    throw error;
  } finally {
    setIsConverting(false);
  }
};

  const handleDownload = async (format, event) => {
    if (event) event.stopPropagation();
    
    if (!candidate?.candidateId || !candidate?.jobId) {
      console.error('Missing required candidate data:', candidate);
      ToastService.error("Cannot download resume: missing candidate information");
      handleClose();
      return;
    }

    try {
      const originalFormat = format === 'word' ? 'pdf' : format;
      const url = getDownloadUrl(candidate, originalFormat);
      
      ToastService.info("Preparing download...");
      const blob = await downloadFile(url, originalFormat);

      let downloadBlob, filename;

      if (format === 'word') {
        ToastService.info("Converting to Word document...");
        downloadBlob = await convertPdfToWord(blob);
        filename = `${candidate.fullName.replace(/\s+/g, '_')}_resume.docx`;
      } else {
        downloadBlob = blob;
        filename = `${candidate.fullName.replace(/\s+/g, '_')}_resume.${format}`;
      }

      // Create and trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(downloadBlob);
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }, 100);

      ToastService.success("Download started");
    } catch (error) {
      console.error('Download failed:', error);
      let errorMessage = "Download failed. Please try again.";
      
      if (error.message.includes("Password protected")) {
        errorMessage = "Cannot convert password-protected PDF";
      } else if (error.message.includes("too large")) {
        errorMessage = "File is too large for conversion (max 10MB)";
      } else if (error.message.includes("No readable text")) {
        errorMessage = "PDF contains no readable text";
      }
      
      ToastService.error(errorMessage);
    } finally {
      handleClose();
    }
  };

  return (
    <>
      <IconButton 
        color="success" 
        size="small" 
        onClick={handleClick}
        onMouseDown={(e) => e.stopPropagation()}
        disabled={isConverting}
        aria-label="Download resume"
      >
        <Download fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem 
          onClick={(e) => handleDownload("pdf", e)} 
          disabled={isConverting}
        >
          {isConverting ? "Processing..." : "Download PDF"}
        </MenuItem>
        <MenuItem 
          onClick={(e) => handleDownload("word", e)} 
          disabled={isConverting}
        >
          {isConverting ? "Converting to Word..." : "Convert to Word"}
        </MenuItem>
      </Menu>
    </>
  );
};

export default DownloadResume;