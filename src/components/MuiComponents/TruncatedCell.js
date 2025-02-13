import { useState } from "react";
import { TableCell, Tooltip, Typography } from "@mui/material";
import CustomDialog from "./CustomDialog"; // Import the existing dialog component

const MAX_CHAR_LENGTH = 15;

const TruncatedCell = ({ content }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <>
      <Tooltip title={content.length > MAX_CHAR_LENGTH ? content : ""} arrow>
        <TableCell
          onClick={content.length > MAX_CHAR_LENGTH ? handleOpenDialog : undefined}
          sx={{
            cursor: content.length > MAX_CHAR_LENGTH ? "pointer" : "default",
            maxWidth: "150px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <Typography variant="body2">
            {content.length > MAX_CHAR_LENGTH ? `${content.substring(0, MAX_CHAR_LENGTH)}...` : content}
          </Typography>
        </TableCell>
      </Tooltip>

      {/* Show full content in dialog if clicked */}
      <CustomDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title="Full Content"
        content={content}
      />
    </>
  );
};

export default TruncatedCell;
