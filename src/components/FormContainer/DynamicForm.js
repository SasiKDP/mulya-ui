import React from 'react';
import { Formik, Form } from 'formik';
import {
  Button,
  Grid,
  Box,
  Paper,
  Typography,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import { buildValidationSchema } from './validationUtils';
import { renderField } from './fieldRenderers';

const DynamicForm = ({
  fields,
  onSubmit,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  onCancel,
  title,
  subtitle,
  elevation = 2,
  maxWidth = '100%',
  spacing = 2,
  dense = false,
  editMode = false,
  initialValues: externalInitialValues,
  isLoading = false,
  ...props
}) => {
  const theme = useTheme();

  const computedInitialValues = externalInitialValues || fields.reduce((values, field) => {
    values[field.name] = field.initialValue !== undefined
      ? field.initialValue
      : (field.type === 'checkbox' ? false : '');
    return values;
  }, {});

  const validationSchema = buildValidationSchema(fields, editMode);

  const groupedFields = fields.reduce((acc, field) => {
    if ((field.editOnly && !editMode) || (field.createOnly && editMode)) return acc;
    const section = field.section || 'default';
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
    elevation={elevation}
    sx={{
      borderRadius: 1,
      overflow: 'hidden',
      maxWidth: maxWidth,
      mx: 'auto',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        boxShadow: theme.shadows[elevation + 1],
      },
      ...(dense && { padding: theme.spacing(1) }),
      ...props.sx
    }}
    >
      {(title || subtitle) && (
        <Box
          sx={{
            p: 2,
            background: alpha(theme.palette.primary.main, 0.04),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.4)}`
          }}
        >
          {title && (
            <Typography variant="h6" fontWeight="500" gutterBottom>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      <Box sx={{ p: 2 }}>
        <Formik
          initialValues={computedInitialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            await onSubmit(values, actions, editMode);
          }}
          enableReinitialize
        >
          {(formikProps) => (
            <Form>
              <Grid container spacing={spacing}>
                {Object.entries(groupedFields).map(([sectionName, sectionFields], sectionIndex) => (
                  <React.Fragment key={sectionName}>
                    {sectionName !== 'default' && (
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            mt: sectionIndex > 0 ? 2 : 0,
                            mb: 1,
                            color: theme.palette.text.primary
                          }}
                        >
                          {sectionName}
                        </Typography>
                        <Box sx={{ mb: 2, borderTop: `1px solid ${theme.palette.divider}` }} />
                      </Grid>
                    )}

                    {sectionFields.map((field) => (
                      <Grid
                        item
                        key={field.name}
                        {...field.gridProps}
                      >
                        <Box
                          sx={{
                            transition: 'all 0.2s ease',
                            '&:focus-within': {
                              transform: 'translateY(-1px)',
                            }
                          }}
                        >
                          {renderField(field, formikProps, editMode)}
                        </Box>
                      </Grid>
                    ))}
                  </React.Fragment>
                ))}

                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    gap={2}
                    mt={3}
                    flexWrap="wrap"
                  >
                    <Button
                      type="button"
                      variant="outlined"
                      color="inherit"
                      onClick={() => {
                        if (onCancel) onCancel(formikProps);
                        else formikProps.resetForm();
                      }}
                      sx={{
                        width: '120px',
                        height: '40px',
                        borderRadius: '8px',
                        borderColor: 'grey',
                        color: 'grey',
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          backgroundColor: 'transparent',
                        }
                      }}
                    >
                      {cancelButtonText}
                    </Button>

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        minWidth: '160px',
                        height: '40px',
                        borderRadius: '8px',
                      }}
                      disabled={formikProps.isSubmitting || !formikProps.isValid}
                      startIcon={
                        formikProps.isSubmitting ? (
                          <CircularProgress size={20} color="inherit" thickness={4} />
                        ) : null
                      }
                    >
                      {formikProps.isSubmitting ? '' : submitButtonText}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Paper>
  );
};

export default DynamicForm;
