// src/components/JobForm/JobFormActions.jsx
import React from "react";
import { Button, CircularProgress, Stack } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SendIcon from "@mui/icons-material/Send";

const JobFormActions = ({ status, handleClear, resetForm }) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="flex-end"
      sx={{ mt: 3 }}
    >
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleClear(resetForm)}
        startIcon={<RefreshIcon />}
      >
        Reset Form
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <CircularProgress
              size={24}
              sx={{ color: "white", mr: 1 }}
            />
            Posting...
          </>
        ) : (
          "Post Requirement"
        )}
      </Button>
    </Stack>
  );
};

export default JobFormActions;