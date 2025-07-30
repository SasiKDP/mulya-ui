// src/components/USA/Candidates/USACandidates.tsx
import * as React from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const rows = [
  { name: "Alex Johnson", role: "Frontend Dev", status: "Active" },
  { name: "Priya Singh", role: "Backend Dev", status: "Interview" },
];

const USACandidates = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>USA Candidates</Typography>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Primary Role</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.name}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.role}</TableCell>
                <TableCell>{r.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default USACandidates;
