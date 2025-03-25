import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients } from "../redux/features/clientSlice";
import { Field } from "formik";
import {
  MenuItem,
  CircularProgress,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import PersonOutline from "@mui/icons-material/PersonOutline";
import { CustomSelectField } from "../components/Requirements/JobForm";

const ClientSelect = ({ name }) => {
  const dispatch = useDispatch();
  const { clientsList, isLoading, error } = useSelector((state) => state.clients);
  const fetchCalled = useRef(false);
  const theme = useTheme();

  // Fetch clients only once
  useEffect(() => {
    if (!fetchCalled.current) {
      dispatch(fetchClients());
      fetchCalled.current = true;
    }
  }, [dispatch]);

  // Sort clients alphabetically (A to Z)
  const sortedClients = clientsList
    ? [...clientsList].sort((a, b) => a.clientName.localeCompare(b.clientName))
    : [];

  return (
    <Box sx={{ width: "100%" }}> {/* Ensures it follows Grid width */}
      <Field
        name={name}
        component={CustomSelectField}
        label="Select Client"
        icon={<PersonOutline fontSize="small" />}
        disabled={isLoading || !!error}
        fullWidth
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: "40vh", // Ensures enough space for scrolling
              overflowY: "auto",
              borderRadius: theme.shape.borderRadius,
              boxShadow: theme.shadows[3],
              padding: theme.spacing(1),
              width: "auto", // Adapts dynamically
              minWidth: "100%", // Ensures it doesn't shrink smaller than the parent
            },
          },
        }}
        sx={{
          width: "100%", // Follows Grid width dynamically
        }}
      >
        {/* Loading State */}
        {isLoading ? (
          <MenuItem disabled>
            <Box display="flex" alignItems="center">
              <CircularProgress size={18} sx={{ mr: 1 }} />
              <Typography variant="body2">Loading clients...</Typography>
            </Box>
          </MenuItem>
        ) : error ? (
          <MenuItem disabled>
            <Typography variant="body2" color="error">
              Failed to load clients
            </Typography>
          </MenuItem>
        ) : sortedClients.length === 0 ? (
          <MenuItem disabled>No clients found</MenuItem>
        ) : (
          sortedClients.map((client) => (
            <MenuItem
              key={client.id}
              value={client.clientName}
              sx={{
                transition: "background-color 0.2s ease-in-out",
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              {client.clientName}
            </MenuItem>
          ))
        )}
      </Field>
    </Box>
  );
};

export default ClientSelect;
