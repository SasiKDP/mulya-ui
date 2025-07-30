// src/Layout/USA/USADashboard.tsx
import * as React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";

const USADashboard = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>USA Dashboard</Typography>

      <Grid container spacing={2}>
        {["Open Jobs", "Active Candidates", "Active Clients", "Interviews"].map((title, i) => (
          <Grid item xs={12} sm={6} md={3} key={title}>
            <Paper elevation={2} style={{ padding: 16 }}>
              <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
              <Typography variant="h5">{(i + 1) * 7}</Typography>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Paper elevation={2} style={{ padding: 16, minHeight: 240 }}>
            <Typography variant="h6">Pipeline Overview</Typography>
            <Typography variant="body2" color="text.secondary">
              Add charts or widgets here.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default USADashboard;
