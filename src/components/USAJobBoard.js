// src/components/USA/JobBoard/USAJobBoard.tsx
import * as React from "react";
import { Box, Typography, Paper, Stack, TextField, Button } from "@mui/material";

const USAJobBoard = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>USA Job Board</Typography>

      <Paper elevation={2} style={{ padding: 16, marginBottom: 16 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Search title / keyword" size="small" fullWidth />
          <TextField label="Location" size="small" fullWidth />
          <Button variant="contained">Search</Button>
        </Stack>
      </Paper>

      <Paper elevation={2} style={{ padding: 16, minHeight: 240 }}>
        <Typography variant="body1">Job list placeholder</Typography>
      </Paper>
    </Box>
  );
};

export default USAJobBoard;
