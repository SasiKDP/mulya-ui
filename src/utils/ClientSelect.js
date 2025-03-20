import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients } from "../redux/features/clientSlice";
import { Field } from "formik";
import {
  MenuItem,
  CircularProgress,
  InputAdornment,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import PersonOutline from "@mui/icons-material/PersonOutline";
import { CustomSelectField } from "../components/Requirements/JobForm";
import SearchIcon from "@mui/icons-material/Search";

const ClientSelect = ({ name }) => {
  const dispatch = useDispatch();
  const { clientsList, isLoading, error } = useSelector((state) => state.clients);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  // Filter clients based on search query
  const filteredClients = clientsList.filter((client) =>
    client.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Field
      name={name}
      component={CustomSelectField}
      label="Select Client"
      icon={<PersonOutline fontSize="small" />}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 250,
            overflowY: "auto",
            borderRadius: 10,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
            padding: "5px",
            width: 280,
          },
        },
      }}
    >
      {/* Search Input */}
      <Box sx={{ p: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Loading State */}
      {isLoading ? (
        <MenuItem disabled>
          <Box display="flex" alignItems="center">
            <CircularProgress size={18} sx={{ mr: 1 }} />
            <Typography variant="body2">Loading...</Typography>
          </Box>
        </MenuItem>
      ) : error ? (
        <MenuItem disabled>
          <Typography variant="body2" color="error">
            Error loading clients
          </Typography>
        </MenuItem>
      ) : filteredClients.length === 0 ? (
        <MenuItem disabled>No clients found</MenuItem>
      ) : (
        filteredClients.map((client) => (
          <MenuItem
            key={client.id}
            value={client.clientName}
            sx={{
              transition: "0.3s",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            {client.clientName}
          </MenuItem>
        ))
      )}
    </Field>
  );
};

export default ClientSelect;