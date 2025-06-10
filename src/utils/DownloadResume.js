import React, { useState } from "react";
import { IconButton, Menu, MenuItem, LinearProgress } from "@mui/material";
import { Download } from "@mui/icons-material";
import ToastService from "../Services/toastService";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ExternalHyperlink,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle
} from "docx";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  window.pdfjsWorkerPath || 
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const DownloadResume = ({ candidate, getDownloadUrl }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };

  const downloadFile = async (url, format) => {
    try {
      const response = await fetch(url, {
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
      
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `${candidate.fullName.replace(/\s+/g, '_')}_resume.${format}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+?)"?(;|$)/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      return {
        blob: await response.blob(),
        filename
      };
    } catch (error) {
      console.error('File download failed:', error);
      throw error;
    }
  };

  const extractAdvancedTextContent = async (pdf) => {
    const pages = [];
    const links = [];
    const fonts = new Set();
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1.0 });
      
      // Extract font information
      const opList = await page.getOperatorList();
      const fontMap = {};
      
      // Process operator list to get font information
      opList.fnArray.forEach((fn, index) => {
        if (fn === pdfjsLib.OPS.setFont) {
          const fontName = opList.argsArray[index][0];
          const fontSize = opList.argsArray[index][1];
          fontMap[fontName] = fontSize;
          fonts.add(fontName);
        }
      });

      // Sort text items by position (top to bottom, left to right)
      const sortedItems = textContent.items
        .map(item => {
          const fontName = item.fontName;
          const fontSize = fontMap[fontName] || item.height || 11;
          const isBold = fontName && (
            fontName.toLowerCase().includes('bold') || 
            fontName.match(/bd/i) || 
            fontName.match(/bold/i)
          );
          const isItalic = fontName && (
            fontName.toLowerCase().includes('italic') || 
            fontName.match(/it/i) || 
            fontName.match(/oblique/i)
          );
          
          return {
            text: item.str,
            x: item.transform[4],
            y: viewport.height - item.transform[5], // Convert to top-down coordinate
            width: item.width,
            height: item.height,
            fontSize: fontSize,
            fontName: fontName || '',
            bold: isBold,
            italic: isItalic,
            color: item.color && item.color.length === 3 ? 
              rgbToHex(item.color[0], item.color[1], item.color[2]) : '#000000'
          };
        })
        .filter(item => item.text.trim().length > 0)
        .sort((a, b) => {
          const yThreshold = 5; // Group items on similar vertical positions
          if (Math.abs(a.y - b.y) < yThreshold) {
            return a.x - b.x; // Same line, sort by x position
          }
          return a.y - b.y; // Different lines, sort by y position
        });

      // Extract links
      try {
        const annotations = await page.getAnnotations();
        annotations.forEach(annotation => {
          if (annotation.url) {
            links.push({
              url: annotation.url,
              text: annotation.url,
              rect: annotation.rect
            });
          }
        });
      } catch (e) {
        console.warn('Could not extract annotations from page', i);
      }
      
      pages.push({
        items: sortedItems,
        pageNumber: i,
        width: viewport.width,
        height: viewport.height
      });
      
      setConversionProgress((i / pdf.numPages) * 40);
    }
    
    return { pages, links, fonts: Array.from(fonts) };
  };

  const rgbToHex = (r, g, b) => {
    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };

  const groupTextIntoLines = (items) => {
    if (!items.length) return [];
    
    const lines = [];
    let currentLine = [items[0]];
    
    for (let i = 1; i < items.length; i++) {
      const current = items[i];
      const previous = items[i - 1];
      
      // Check if items are on the same line (within a threshold)
      const yThreshold = Math.max(current.fontSize, previous.fontSize) * 0.3;
      const xGap = current.x - (previous.x + previous.width);
      
      if (Math.abs(current.y - previous.y) <= yThreshold) {
        // Check if this is a continuation of the same text (small gap) or a new column (large gap)
        if (xGap < 50) { // Small gap - same text
          currentLine.push(current);
        } else { // Large gap - new column (for tables)
          lines.push(currentLine);
          currentLine = [current];
        }
      } else {
        lines.push(currentLine);
        currentLine = [current];
      }
    }
    
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    
    return lines;
  };

  const identifyTextStyle = (items) => {
    if (!items.length) return { type: 'normal', size: 22 };
    
    const avgFontSize = items.reduce((sum, item) => sum + item.fontSize, 0) / items.length;
    const hasBold = items.some(item => item.bold);
    const hasItalic = items.some(item => item.italic);
    const text = items.map(item => item.text).join('').trim();
    const color = items[0].color; // Use first item's color
    
    // Detect headings and styles
    if (avgFontSize > 14 || hasBold) {
      if (text.toUpperCase() === text && text.length < 50) {
        return { 
          type: 'heading1', 
          size: Math.round(avgFontSize * 2), 
          bold: true,
          color: color || '2E74B5',
          alignment: AlignmentType.CENTER
        };
      } else if (hasBold && text.length < 100) {
        return { 
          type: 'heading2', 
          size: Math.round(avgFontSize * 2), 
          bold: true,
          color: color || '1F4E79',
          alignment: AlignmentType.LEFT
        };
      }
    }
    
    // Check for bullet points
    if (text.match(/^[•·\-\*]\s/) || text.match(/^\d+\.\s/)) {
      return { 
        type: 'bullet', 
        size: Math.round(avgFontSize * 2), 
        bold: hasBold, 
        italic: hasItalic,
        color: color || '000000',
        alignment: AlignmentType.LEFT
      };
    }
    
    // Check for centered text (by comparing position to page width)
    if (items.length > 0) {
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const textWidth = lastItem.x + lastItem.width - firstItem.x;
      const pageCenter = firstItem.pageWidth / 2;
      const textCenter = firstItem.x + (textWidth / 2);
      
      if (Math.abs(textCenter - pageCenter) < 20) {
        return { 
          type: 'centered', 
          size: Math.round(avgFontSize * 2), 
          bold: hasBold, 
          italic: hasItalic,
          color: color || '000000',
          alignment: AlignmentType.CENTER
        };
      }
    }
    
    return { 
      type: 'normal', 
      size: Math.round(avgFontSize * 2), 
      bold: hasBold, 
      italic: hasItalic,
      color: color || '000000',
      alignment: AlignmentType.LEFT
    };
  };

  const detectTableStructure = (lines) => {
    const tables = [];
    let currentTable = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const text = line.map(item => item.text).join('').trim();
      
      // Skip empty lines
      if (!text) continue;
      
      // Simple table detection - look for lines with multiple columns separated by significant gaps
      if (line.length > 1) {
        const gaps = [];
        for (let j = 1; j < line.length; j++) {
          gaps.push(line[j].x - (line[j-1].x + line[j-1].width));
        }
        
        const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
        
        if (avgGap > 50 && line.length >= 2) { // Potential table row
          if (!currentTable) {
            currentTable = {
              startIndex: i,
              rows: [],
              columns: line.length,
              columnPositions: line.map(item => item.x)
            };
          } else {
            // Check if this line aligns with existing columns
            const columnAlignment = line.every((item, idx) => {
              if (idx >= currentTable.columnPositions.length) return false;
              return Math.abs(item.x - currentTable.columnPositions[idx]) < 10;
            });
            
            if (columnAlignment) {
              currentTable.rows.push(line.map(item => ({
                text: item.text.trim(),
                style: {
                  size: Math.round(item.fontSize * 2),
                  bold: item.bold,
                  italic: item.italic,
                  color: item.color
                }
              })));
              continue;
            }
          }
        }
      }
      
      // End current table if exists
      if (currentTable && currentTable.rows.length > 1) {
        tables.push({
          ...currentTable,
          endIndex: i - 1
        });
      }
      currentTable = null;
    }
    
    // Add the last table if it exists
    if (currentTable && currentTable.rows.length > 1) {
      tables.push({
        ...currentTable,
        endIndex: lines.length - 1
      });
    }
    
    return tables;
  };

  const createWordDocument = (pages, links) => {
    const children = [];
    const processedLineIndices = new Set();
    
    pages.forEach((page, pageIndex) => {
      // Add page items to their page object for reference
      const pageWithItems = {
        ...page,
        items: page.items.map(item => ({ ...item, pageWidth: page.width }))
      };
      
      const lines = groupTextIntoLines(pageWithItems.items);
      const tables = detectTableStructure(lines);
      
      lines.forEach((line, lineIndex) => {
        if (processedLineIndices.has(`${pageIndex}-${lineIndex}`)) return;
        
        // Check if this line is part of a table
        const table = tables.find(t => 
          lineIndex >= t.startIndex && lineIndex <= t.endIndex
        );
        
        if (table && lineIndex === table.startIndex) {
          // Create table
          const tableRows = table.rows.map((rowData, rowIndex) => {
            // First row is often the header
            const isHeader = rowIndex === 0;
            
            return new TableRow({
              children: rowData.map((cell, cellIndex) => {
                const cellChildren = [];
                
                // Split text by newlines if they exist
                const paragraphs = cell.text.split('\n');
                
                paragraphs.forEach((para, paraIndex) => {
                  if (para.trim()) {
                    cellChildren.push(new Paragraph({
                      children: [new TextRun({
                        text: para,
                        size: cell.style.size,
                        bold: cell.style.bold,
                        italic: cell.style.italic,
                        color: cell.style.color,
                      })],
                      alignment: paraIndex === 0 ? AlignmentType.LEFT : AlignmentType.LEFT,
                      spacing: { line: 276 }
                    }));
                  }
                });
                
                return new TableCell({
                  children: cellChildren,
                  margins: {
                    top: 100,
                    bottom: 100,
                    left: 100,
                    right: 100
                  },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
                    left: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
                    bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
                    right: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" }
                  },
                  shading: {
                    fill: isHeader ? "DDDDDD" : "FFFFFF"
                  }
                });
              }),
              tableHeader: isHeader
            });
          });
          
          children.push(new Table({
            rows: tableRows,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            },
            borders: {
              insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
              insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" }
            },
            layout: WidthType.AUTO
          }));
          
          // Mark all table lines as processed
          for (let i = table.startIndex; i <= table.endIndex; i++) {
            processedLineIndices.add(`${pageIndex}-${i}`);
          }
          return;
        }
        
        if (table) return; // Skip if part of table (already processed)
        
        const text = line.map(item => item.text).join('').trim();
        if (!text) return;
        
        const style = identifyTextStyle(line);
        
        // Create paragraph based on detected style
        const paragraphOptions = {
          children: [new TextRun({
            text: text,
            size: style.size,
            bold: style.bold,
            italic: style.italic,
            color: style.color,
            font: "Calibri"
          })],
          spacing: {
            before: style.type === 'heading1' ? 400 : style.type === 'heading2' ? 300 : 120,
            after: style.type === 'heading1' ? 200 : style.type === 'heading2' ? 150 : 120,
            line: 276
          },
          alignment: style.alignment,
          indent: style.type === 'bullet' ? { left: 720 } : undefined
        };
        
        if (style.type === 'heading1') {
          paragraphOptions.heading = HeadingLevel.HEADING_1;
        } else if (style.type === 'heading2') {
          paragraphOptions.heading = HeadingLevel.HEADING_2;
        } else if (style.type === 'bullet') {
          paragraphOptions.bullet = { level: 0 };
        }
        
        children.push(new Paragraph(paragraphOptions));
      });
      
      setConversionProgress(40 + (pageIndex / pages.length) * 50);
    });
    
    // Add links section if any
    if (links.length > 0) {
      children.push(new Paragraph({
        children: [new TextRun({ 
          text: "Links:", 
          bold: true, 
          size: 28,
          color: "2E74B5"
        })],
        spacing: { before: 400, after: 200 },
        heading: HeadingLevel.HEADING_2
      }));
      
      links.forEach(link => {
        children.push(new Paragraph({
          children: [
            new ExternalHyperlink({
              children: [new TextRun({
                text: link.text,
                size: 22,
                color: "0563C1",
                underline: {}
              })],
              link: link.url
            })
          ],
          spacing: { after: 100 }
        }));
      });
    }
    
    return new Document({
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            run: {
              size: 22,
              color: "000000",
              font: "Calibri"
            },
            paragraph: {
              spacing: { line: 276, before: 120, after: 120 }
            }
          },
          {
            id: "Heading1",
            name: "Heading 1",
            run: {
              size: 28,
              bold: true,
              color: "2E74B5",
              font: "Calibri Light",
              allCaps: true
            },
            paragraph: {
              spacing: { before: 400, after: 200 },
              alignment: AlignmentType.CENTER
            }
          },
          {
            id: "Heading2",
            name: "Heading 2",
            run: {
              size: 26,
              bold: true,
              color: "1F4E79",
              font: "Calibri"
            },
            paragraph: {
              spacing: { before: 300, after: 150 },
              alignment: AlignmentType.LEFT
            }
          },
          {
            id: "ListParagraph",
            name: "List Paragraph",
            run: {
              size: 22,
              color: "000000",
              font: "Calibri"
            },
            paragraph: {
              spacing: { line: 276 },
              indent: { left: 720, hanging: 360 }
            }
          }
        ]
      },
      sections: [{
        children,
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        }
      }]
    });
  };

  const convertPdfToWord = async (pdfBlob) => {
    setIsConverting(true);
    setConversionProgress(0);
    
    try {
      const pdfData = await pdfBlob.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ 
        data: pdfData,
        verbosity: 0,
        standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/standard_fonts/`,
        cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
        cMapPacked: true
      }).promise;

      const { pages, links } = await extractAdvancedTextContent(pdf);
      setConversionProgress(50);

      const doc = createWordDocument(pages, links);
      setConversionProgress(95);

      const blob = await Packer.toBlob(doc);
      setConversionProgress(100);
      return blob;
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
      ToastService.error("Missing candidate information");
      handleClose();
      return;
    }

    try {
      const originalFormat = format === 'word' ? 'pdf' : format;
      const url = getDownloadUrl(candidate, originalFormat);
      
      ToastService.info("Preparing download...");
      const { blob, filename: originalFilename } = await downloadFile(url, originalFormat);

      let downloadBlob, filename;

      if (format === 'word') {
        ToastService.info("Converting to Word...");
        downloadBlob = await convertPdfToWord(blob);
        filename = originalFilename.replace(/\.pdf$/i, '.docx') || 
                  `${candidate.fullName.replace(/\s+/g, '_')}_resume.docx`;
      } else {
        downloadBlob = blob;
        filename = originalFilename || 
                 `${candidate.fullName.replace(/\s+/g, '_')}_resume.${format}`;
      }

      const link = document.createElement('a');
      link.href = URL.createObjectURL(downloadBlob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }, 100);

      ToastService.success("Download completed");
    } catch (error) {
      console.error('Download failed:', error);
      ToastService.error(
        error.message.includes('password') ? "Cannot convert password-protected PDF" :
        "Download failed. Please try again"
      );
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
        disabled={isConverting}
        title="Download Resume"
      >
        <Download fontSize="small" />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={(e) => handleDownload("pdf", e)} disabled={isConverting}>
          {isConverting ? "Processing..." : "Download PDF"}
        </MenuItem>
        <MenuItem onClick={(e) => handleDownload("docx", e)} disabled={isConverting}>
          {isConverting ? "Processing..." : "Download Word"}
        </MenuItem>
        <MenuItem onClick={(e) => handleDownload("word", e)} disabled={isConverting}>
          {isConverting ? "Converting..." : "Convert PDF to Word"}
        </MenuItem>
        
        {isConverting && (
          <MenuItem disabled>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              width: '200px',
              flexDirection: 'column' 
            }}>
              <span style={{ fontSize: '12px' }}>
                Converting... {Math.round(conversionProgress)}%
              </span>
              <LinearProgress 
                variant="determinate"
                value={conversionProgress}
                style={{ width: '100%' }}
              />
            </div>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default DownloadResume;