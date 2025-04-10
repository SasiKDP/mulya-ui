import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  useTheme
} from "@mui/material";

/**
 * A reusable component for rendering expanded content in data tables
 */
const ReusableExpandedContent = ({ row, config }) => {
  const theme = useTheme();

  const {
    title = "Details",
    description = { key: null, fallback: null },
    sections = [],
    actions = [],
    backgroundColor = theme.palette.background.paper,
  } = config || {};

  const renderField = (field, rowData) => {
    const { key, label, render, fallback = "-" } = field;
    const value = key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : undefined), rowData);

    if (render && typeof render === "function") {
      return render(value, rowData);
    }

    return value || fallback;
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 3, bgcolor: backgroundColor,width:"80%" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Title */}
        {title && (
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {title}
          </Typography>
        )}

        {/* Optional description */}
        {description.key && (
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            {renderField(description, row)}
          </Typography>
        )}

        <Divider sx={{ mb: 3 }} />

        {/* Content Sections */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {sections.map((section, sectionIndex) => (
            <Box key={sectionIndex} sx={{ minWidth: 250 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 1 }}
              >
                {section.title}
              </Typography>

              <Box
                component="dl"
                sx={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "6px 12px",
                }}
              >
                {section.fields.map((field, fieldIndex) => (
                  <React.Fragment key={fieldIndex}>
                    <Typography component="dt" variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                      {field.label}:
                    </Typography>
                    <Typography component="dd" variant="body2" sx={{ color: "text.secondary" }}>
                      {renderField(field, row)}
                    </Typography>
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Action Buttons */}
        {actions.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            {actions.map((action, actionIndex) => (
              <Button
                key={actionIndex}
                variant={action.variant || "contained"}
                size={action.size || "small"}
                startIcon={action.icon}
                onClick={() => action.onClick(row)}
                color={action.color || "primary"}
                sx={{
                  mr: actionIndex < actions.length - 1 ? 2 : 0,
                  borderRadius: 2,
                  ...action.sx,
                }}
                {...(action.props || {})}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ReusableExpandedContent;
