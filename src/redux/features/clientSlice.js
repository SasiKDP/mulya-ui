import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../config";
// import httpService from "../httpService";





// Async thunk for fetching clients
export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (_, { rejectWithValue }) => {
    try {
      

      // Fetch data directly using Axios
      const response = await axios.get(`${BASE_URL}/requirements/bdm/getAll`);

      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        return rejectWithValue("Unexpected response format");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching clients");
    }
  }
);

const clientSlice = createSlice({
  name: "clients",
  initialState: {
    clientsList: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientsList = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default clientSlice.reducer;
