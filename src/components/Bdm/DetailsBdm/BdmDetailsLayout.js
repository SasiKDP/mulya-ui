import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Card,
  CardContent,
  Grid,
  useTheme,
  Avatar, // Import Avatar component for simple profile icon
} from "@mui/material";

const BdmDetailsLayout = ({ bdmDetailsData }) => {
  const theme = useTheme();

  const bdmData = bdmDetailsData?.[0] || null;

  if (!bdmData?.employeeId) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">No BDM details available</Typography>
      </Box>
    );
  }

  const formatHeaderText = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/Id$/, " ID")
      .replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  const detailsOrder = [
    "employeeId",
    "roles",
    "designation",
    "email",
    "personalEmail",
    "phoneNumber",
    "dob",
    "gender",
    "joiningDate",
    "status",
  ];

  const formatValue = (key, value) => {
    if (!value) return "N/A";
    if (["joiningDate", "dob"].includes(key)) {
      return new Date(value).toLocaleDateString();
    }
    return value;
  };

  const getInitials = (userName) => {
    if (!userName) return "";
    const names = userName.split(" ");
    let initials = "";
    for (let i = 0; i < Math.min(2, names.length); i++) {
      initials += names[i].charAt(0).toUpperCase();
    }
    return initials;
  };

  return (
    <Grid item xs={12} md={6}>
      <Card
        elevation={3}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
        }}
      >
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 0 }}>
          <Box sx={{ bgcolor: theme.palette.info.light, p: 2, display: "flex", alignItems: "center", gap: 2, borderRadius: 1.2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: theme.palette.primary.main }}>
              {getInitials(bdmData.userName)}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" color={theme.palette.info.contrastText}>
                {bdmData.userName}
              </Typography>
              <Typography variant="subtitle1" color={theme.palette.info.contrastText}>
                {bdmData.designation} | {bdmData.roles}
              </Typography>
            </Box>
          </Box>
          <TableContainer sx={{ flex: 1, overflowY: "auto" }}>
            <Table size="medium">
              <TableBody>
                {detailsOrder.map((key) => (
                  <TableRow
                    key={key}
                    sx={{
                      "&:nth-of-type(odd)": {
                        bgcolor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                      {formatHeaderText(key)}
                    </TableCell>
                    <TableCell sx={{ fontSize: "1rem" }}>
                      {formatValue(key, bdmData[key])}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default BdmDetailsLayout;