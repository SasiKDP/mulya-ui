import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Typography,
  Paper,
  Box,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import DynamicForm from "../FormContainer/DynamicForm";
import { placementFormFields } from "./placementFormFields";
import { placementValidationSchema } from "./placementValidationSchema";

const SuccessAlert = styled(Alert)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.success.main}`,
  backgroundColor: `${theme.palette.success.light}20`,
  "& .MuiAlert-icon": {
    color: theme.palette.success.main,
  },
}));

const ErrorAlert = styled(Alert)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.error.main}`,
  backgroundColor: `${theme.palette.error.light}20`,
  "& .MuiAlert-icon": {
    color: theme.palette.error.main,
  },
}));

const formatToHTMLDate = (dateStr) => {
  if (!dateStr) return "";

  try {
    // Handle MM/DD/YYYY format
    if (dateStr.includes("/")) {
      const [month, day, year] = dateStr.split("/");
      const formattedMonth = month.padStart(2, "0");
      const formattedDay = day.padStart(2, "0");
      return `${year}-${formattedMonth}-${formattedDay}`;
    }

    // Handle YYYY-MM-DD format
    if (dateStr.includes("-") && dateStr.length === 10) {
      return dateStr;
    }

    // Handle ISO date strings
    if (dateStr.includes("T")) {
      return dateStr.split("T")[0];
    }

    // Fallback for other formats using dayjs
    return dayjs(dateStr).format("YYYY-MM-DD");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

const PlacementForm = ({ initialValues = {}, onSubmit, onCancel }) => {
  const theme = useTheme();
  const [submitStatus, setSubmitStatus] = React.useState({
    isSubmitting: false,
    success: null,
    error: null,
    response: null,
  });
  const [expandedResponse, setExpandedResponse] = React.useState(false);

  const getFormFields = () => {
    return placementFormFields.map((field) => {
      if (field.name === "startDate" || field.name === "endDate") {
        return {
          ...field,
          type: "date",
          InputLabelProps: { shrink: true },
          inputProps: {
            max: field.name === "endDate" ? undefined : "2100-12-31",
            min: field.name === "startDate" ? undefined : "1900-01-01",
          },
        };
      }
      return field;
    });
  };

  const formattedFields = getFormFields();

  const formInitialValues = formattedFields.reduce((values, field) => {
    values[field.name] = field.initialValue || "";

    if (initialValues && initialValues[field.name] !== undefined) {
      if (["startDate", "endDate"].includes(field.name)) {
        values[field.name] = formatToHTMLDate(initialValues[field.name]);
      } else {
        values[field.name] = initialValues[field.name];
      }
    }

    return values;
  }, {});

  const handleSubmit = async (values, actions) => {
    setSubmitStatus({
      isSubmitting: true,
      success: null,
      error: null,
      response: null,
    });
    try {
      const formattedValues = { ...values };

      if (onSubmit) {
        await onSubmit(formattedValues);
      }

      setSubmitStatus({
        isSubmitting: false,
        success: true,
        error: null,
        response: {
          message: "Placement saved successfully!",
          payload: formattedValues,
        },
      });
      setExpandedResponse(false);
    } catch (error) {
      setSubmitStatus({
        isSubmitting: false,
        success: false,
        error: error.message || "Failed to save placement. Please try again.",
        response: null,
      });
      setExpandedResponse(false);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Box>
      <DynamicForm
        fields={formattedFields}
        onSubmit={handleSubmit}
        initialValues={formInitialValues}
        submitButtonText="Save Placement"
        cancelButtonText="Cancel"
        onCancel={onCancel}
      />

      <Collapse in={submitStatus.success !== null} sx={{ mt: 2 }}>
        {submitStatus.success ? (
          <SuccessAlert
            icon={<SuccessIcon fontSize="inherit" />}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setExpandedResponse(!expandedResponse)}
              >
                {expandedResponse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            }
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {submitStatus.response?.message}
            </Typography>
            <Collapse in={expandedResponse} sx={{ mt: 1 }}>
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  p: 2,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="caption" display="block" gutterBottom>
                  Response details:
                </Typography>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    margin: 0,
                    overflow: "auto",
                    maxHeight: "200px",
                  }}
                >
                  {JSON.stringify(submitStatus.response?.payload, null, 2)}
                </pre>
              </Box>
            </Collapse>
          </SuccessAlert>
        ) : (
          <ErrorAlert
            severity="error"
            icon={<ErrorIcon fontSize="inherit" />}
            onClose={() =>
              setSubmitStatus((prev) => ({ ...prev, error: null }))
            }
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Submission Failed
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {submitStatus.error}
            </Typography>
          </ErrorAlert>
        )}
      </Collapse>
    </Box>
  );
};

export default PlacementForm;
