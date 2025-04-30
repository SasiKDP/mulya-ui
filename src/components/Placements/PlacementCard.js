import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Grid,
  Avatar,
  Chip,
  Paper,
  useTheme,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Business,
  Store,
  PermIdentity,
  Paid,
  CalendarToday,
  WorkOutline,
} from "@mui/icons-material";

const InfoItem = ({ icon: Icon, label, value }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
      <Icon color="action" fontSize="small" />
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: "medium" }}>
        {value}
      </Typography>
    </Box>
  );
};

const FinancialCard = ({ label, value, color }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        textAlign: "center",
        bgcolor: theme.palette.background.default,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.secondary, mb: 1 }}
      >
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: "bold", color }}>
        {value}
      </Typography>
    </Paper>
  );
};

const PlacementCard = ({ data }) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "completed":
        return "info";
      case "pending":
        return "warning";
      case "terminated":
        return "error";
      default:
        return "default";
    }
  };

  const formatCurrency = (val) =>
    val
      ? `₹ ${parseFloat(val).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}`
      : "₹ 0";

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "CN";

  return (
    <Card
      elevation={0}
      sx={{ width: "100%", borderRadius: 2, background: "transparent" }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          backgroundColor: "#E0F2F1", // Soft teal
          color: theme.palette.text.primary,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderRadius: "16px 16px 0 0",
        }}
      >
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 56,
            height: 56,
            fontSize: "1.25rem",
            fontWeight: "bold",
          }}
        >
          {getInitials(data.consultantName)}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {data.consultantName}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            ID: {data.id} • {data.technology}
          </Typography>
        </Box>
        <Box sx={{ ml: "auto" }}>
          <Chip
            label={data.status || "Unknown"}
            color={getStatusColor(data.status)}
            sx={{ fontWeight: "bold" }}
          />
        </Box>
      </Box>

      {/* Content */}
      <Paper elevation={1} sx={{ borderRadius: "0 0 16px 16px" }}>
        <CardContent sx={{ p: 3 }}>
          {/* Consultant Info */}
          <Section title="CONSULTANT INFO" icon={Person}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={Email}
                  label="Email"
                  value={data.consultantEmail}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem icon={Phone} label="Phone" value={data.phone} />
              </Grid>
            </Grid>
          </Section>

          <Divider sx={{ my: 3 }} />

          {/* Placement Info */}
          <Section title="PLACEMENT DETAILS" icon={Business}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InfoItem icon={Business} label="Client" value={data.client} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem icon={Store} label="Vendor" value={data.vendorName} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={PermIdentity}
                  label="Recruiter"
                  value={data.recruiter}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={PermIdentity}
                  label="Sales"
                  value={data.sales}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={CalendarToday}
                  label="Start Date"
                  value={data.startDate}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={CalendarToday}
                  label="End Date"
                  value={data.endDate || "Ongoing"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={WorkOutline}
                  label="Employment Type"
                  value={data.employmentType}
                />
              </Grid>
            </Grid>
          </Section>

          <Divider sx={{ my: 3 }} />

          {/* Financial Info */}
          <Section title="FINANCIAL DETAILS" icon={Paid}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FinancialCard
                  label="Bill Rate "
                  value={formatCurrency(data.billRateUSD)}
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FinancialCard
                  label="Pay Rate"
                  value={formatCurrency(data.payRate)}
                  color={theme.palette.info.main}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FinancialCard
                  label="Gross Profit"
                  value={formatCurrency(data.grossProfit)}
                  color={theme.palette.primary.main}
                />
              </Grid>
            </Grid>
          </Section>
        </CardContent>
      </Paper>
    </Card>
  );
};

const Section = ({ title, icon: Icon, children }) => {
  const theme = useTheme();
  return (
    <Box mb={3}>
      <Typography
        variant="subtitle1"
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: theme.palette.text.secondary,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Icon fontSize="small" /> {title}
      </Typography>
      {children}
    </Box>
  );
};

export default PlacementCard;