import React from "react";
import { Field } from "formik";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Typography,
  Box,
  useTheme,
  alpha,
  FormHelperText,
  InputAdornment,
  IconButton,
  Tooltip,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Switch,
  Slider,
  Divider,
  Paper,
} from "@mui/material";
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { format } from "date-fns";

export const renderField = (field, formik, editMode = false) => {
  const { setFieldValue, handleChange, handleBlur, touched, errors, values } =
    formik;
  const errorText = touched[field.name] && errors[field.name];

  // Skip rendering if field has condition that isn't met
  if (field.condition && !field.condition(values)) {
    return null;
  }

  // Handle field visibility based on mode
  if ((field.editOnly && !editMode) || (field.createOnly && editMode)) {
    return null;
  }

  // Show help tooltip if provided
  const helpTooltip = field.helpText && (
    <InputAdornment position="end">
      <Tooltip title={field.helpText} arrow placement="top">
        <IconButton edge="end" size="small" sx={{ color: "text.secondary" }}>
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  );

  return (
    <Field name={field.name} key={field.name}>
      {({ field: formikField }) => {
        const theme = useTheme();

        const commonProps = {
          ...formikField,
          label: field.label,
          variant: "outlined",
          fullWidth: true,
          onChange: handleChange,
          onBlur: handleBlur,
          error: Boolean(errorText),
          helperText: errorText || field.description,
          required: field.required,
          disabled: field.disabled || (editMode && field.disableOnEdit),
          readOnly: editMode && field.readOnly,
          placeholder: field.placeholder,
          size: field.fieldSize || "medium",
          InputProps: {
            style: {
              borderRadius: 8,
            },
            endAdornment: field.endAdornment || helpTooltip,
            startAdornment: field.startAdornment,
            ...field.InputProps,
          },
          InputLabelProps: {
            style: {
              fontSize: "0.95rem",
            },
            shrink: true,
            ...field.InputLabelProps,
          },
          sx: {
            mt: 1,
            mb: 1.5,
            "& .MuiOutlinedInput-root": {
              transition: "all 0.2s ease-in-out",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha(theme.palette.primary.main, 0.6),
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
                boxShadow: `0 0 0 3px ${alpha(
                  theme.palette.primary.main,
                  0.15
                )}`,
              },
            },
            ...field.sx,
          },
        };

        // Format date value for display if needed
        const formatDateValue = (dateValue, formatString) => {
          if (!dateValue) return "";
          try {
            return format(new Date(dateValue), formatString);
          } catch (e) {
            return "";
          }
        };

        switch (field.type) {
          case "text":
          case "email":
          case "password":
          case "number":
          case "tel":
          case "url":
            return (
              <TextField
                {...commonProps}
                type={field.type}
                autoComplete={field.autoComplete}
                multiline={field.multiline}
                rows={field.rows}
                maxRows={field.maxRows}
                min={field.min}
                max={field.max}
                step={field.step}
              />
            );

          case "date":
            return (
              <TextField
                {...commonProps}
                type="date"
                value={values[field.name] || ""}
                onChange={(e) => {
                  setFieldValue(field.name, e.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            );

          case "time":
            return (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  {...commonProps}
                  value={values[field.name] || null}
                  onChange={(newValue) => {
                    setFieldValue(field.name, newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...commonProps}
                      InputProps={{
                        ...params.InputProps,
                        ...commonProps.InputProps,
                      }}
                    />
                  )}
                  ampm={field.ampm !== false}
                />
              </LocalizationProvider>
            );
          case "multiselect":
            return (
              <TextField
                {...commonProps}
                select
                SelectProps={{
                  multiple: true,
                  value: values[field.name] || [],
                  onChange: (event) => {
                    const { value } = event.target;
                    setFieldValue(
                      field.name,
                      typeof value === "string" ? value.split(",") : value
                    );
                  },
                  renderValue:
                    field.renderValue || ((selected) => selected.join(", ")),
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        borderRadius: 2,
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      },
                    },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                  },
                  ...field.SelectProps,
                }}
              >
                {field.options?.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    sx={{
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <Checkbox
                      checked={(values[field.name] || []).includes(
                        option.value
                      )}
                      color={field.color || "primary"}
                      sx={{ borderRadius: 0.5 }}
                    />
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            );

            case "datetime":
              return (
                <TextField
                  {...commonProps}
                  type="datetime-local"
                  value={values[field.name] || ""}
                  onChange={(e) => {
                    setFieldValue(field.name, e.target.value);
                  }}
                  InputProps={{
                    ...commonProps.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayOutlinedIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              );
            

          case "textarea":
            return (
              <TextField
                {...commonProps}
                multiline
                rows={field.rows || 4}
                maxRows={field.maxRows || 10}
              />
            );

          case "select":
            return (
              <TextField
                {...commonProps}
                select
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        borderRadius: 2,
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      },
                    },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                  },
                  ...field.SelectProps,
                }}
              >
                {field.options?.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    sx={{
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            );

          case "checkbox":
            return (
              <FormControl
                error={Boolean(errorText)}
                component="fieldset"
                fullWidth
                sx={{ my: 1 }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      {...formikField}
                      checked={formikField.value}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={
                        field.disabled || (editMode && field.disableOnEdit)
                      }
                      color={field.color || "primary"}
                      sx={{
                        borderRadius: 1,
                        padding: 0.8,
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.08
                          ),
                        },
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      color={
                        field.disabled || (editMode && field.disableOnEdit)
                          ? "text.disabled"
                          : "text.primary"
                      }
                    >
                      {field.label}
                    </Typography>
                  }
                />
                {(errorText || field.description) && (
                  <FormHelperText sx={{ ml: 2 }}>
                    {errorText || field.description}
                  </FormHelperText>
                )}
              </FormControl>
            );

          case "radio":
            return (
              <FormControl
                component="fieldset"
                error={Boolean(errorText)}
                fullWidth
                sx={{ my: 1.5 }}
              >
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    color: "text.primary",
                    "&.Mui-focused": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {field.label}
                </FormLabel>
                <RadioGroup
                  {...formikField}
                  onChange={handleChange}
                  row={field.row}
                  sx={{ mt: 0.5 }}
                >
                  {field.options?.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={
                        <Radio
                          color={field.color || "primary"}
                          sx={{
                            transition: "all 0.2s",
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.08
                              ),
                            },
                          }}
                        />
                      }
                      label={option.label}
                      disabled={
                        option.disabled ||
                        field.disabled ||
                        (editMode && field.disableOnEdit)
                      }
                      sx={{ mr: 2 }}
                    />
                  ))}
                </RadioGroup>
                {(errorText || field.description) && (
                  <FormHelperText>
                    {errorText || field.description}
                  </FormHelperText>
                )}
              </FormControl>
            );

          case "switch":
            return (
              <FormControl
                error={Boolean(errorText)}
                component="fieldset"
                fullWidth
                sx={{ my: 1 }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      {...formikField}
                      checked={formikField.value}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={
                        field.disabled || (editMode && field.disableOnEdit)
                      }
                      color={field.color || "primary"}
                      sx={{
                        "& .MuiSwitch-switchBase": {
                          "&.Mui-checked": {
                            "& + .MuiSwitch-track": {
                              opacity: 0.8,
                            },
                          },
                        },
                        "& .MuiSwitch-thumb": {
                          boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      color={
                        field.disabled || (editMode && field.disableOnEdit)
                          ? "text.disabled"
                          : "text.primary"
                      }
                    >
                      {field.label}
                    </Typography>
                  }
                />
                {(errorText || field.description) && (
                  <FormHelperText sx={{ ml: 2 }}>
                    {errorText || field.description}
                  </FormHelperText>
                )}
              </FormControl>
            );

          case "slider":
            return (
              <Box sx={{ width: "100%", px: 1, my: 2 }}>
                <Typography
                  id={`${field.name}-label`}
                  gutterBottom
                  sx={{ fontWeight: 500, fontSize: "0.95rem" }}
                >
                  {field.label}
                  {field.required ? " *" : ""}
                </Typography>
                <Box sx={{ px: 1, mt: 2, mb: 1 }}>
                  <Slider
                    {...formikField}
                    aria-labelledby={`${field.name}-label`}
                    valueLabelDisplay="auto"
                    step={field.step || 1}
                    marks={field.marks}
                    min={field.min || 0}
                    max={field.max || 100}
                    disabled={
                      field.disabled || (editMode && field.disableOnEdit)
                    }
                    color={field.color || "primary"}
                    onChange={(_, value) => setFieldValue(field.name, value)}
                    onBlur={handleBlur}
                    sx={{
                      "& .MuiSlider-thumb": {
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        "&:hover, &.Mui-focusVisible": {
                          boxShadow:
                            "0 0 0 8px " +
                            alpha(theme.palette.primary.main, 0.16),
                        },
                      },
                      "& .MuiSlider-valueLabel": {
                        borderRadius: 1,
                        backgroundColor: theme.palette.primary.main,
                      },
                    }}
                  />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    {field.min || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {field.max || 100}
                  </Typography>
                </Box>
                {(errorText || field.description) && (
                  <FormHelperText error={Boolean(errorText)}>
                    {errorText || field.description}
                  </FormHelperText>
                )}
              </Box>
            );

          case "divider":
            return (
              <Box width="100%" my={field.spacing || 2}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  {field.label}
                </Typography>
                <Divider
                  sx={{
                    backgroundColor: alpha(theme.palette.divider, 0.8),
                    height: "1px",
                  }}
                />
              </Box>
            );

          case "file":
            const selectedFile = values[field.name];
            const fileURL =
              selectedFile instanceof File
                ? URL.createObjectURL(selectedFile)
                : null;

            return (
              <Box
                display="flex"
                flexDirection="column"
                gap={1}
                sx={{ my: 1.5 }}
              >
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ fontWeight: 500, fontSize: "0.95rem" }}
                >
                  {field.label}
                  {field.required ? " *" : ""}
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${
                      errorText
                        ? theme.palette.error.main
                        : theme.palette.divider
                    }`,
                    borderStyle: "dashed",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                    ...(fileURL && {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    }),
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    accept={field.accept || "*"}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue(field.name, file);
                    }}
                    onBlur={handleBlur}
                    style={{ display: "none" }}
                    disabled={
                      field.disabled || (editMode && field.disableOnEdit)
                    }
                  />
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    gap={1}
                  >
                    {fileURL ? (
                      <>
                        <InsertDriveFileOutlinedIcon
                          color="primary"
                          sx={{ fontSize: 36, mb: 1 }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          color="primary.main"
                          mb={0.5}
                        >
                          {selectedFile.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(selectedFile.size / 1024).toFixed(1)} KB • Click to
                          change
                        </Typography>
                      </>
                    ) : (
                      <>
                        <UploadFileOutlinedIcon
                          color="action"
                          sx={{ fontSize: 40, mb: 1 }}
                        />
                        <Typography variant="body2" mb={0.5}>
                          {field.uploadLabel || "Click to upload a file"}
                        </Typography>
                        {field.accept && (
                          <Typography variant="caption" color="text.secondary">
                            Accepted formats: {field.accept}
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                </Paper>

                {(errorText || field.description) && (
                  <FormHelperText error={Boolean(errorText)}>
                    {errorText || field.description}
                  </FormHelperText>
                )}
              </Box>
            );

          default:
            return null;
        }
      }}
    </Field>
  );
};
