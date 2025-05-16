// dashboardSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpService from '../Services/httpService';

export const filterDashBoardCountByDateRange = createAsyncThunk(
  'dashboard/filterDashBoardCountByDateRange',
  async ({ startDate, endDate }, { rejectWithValue, getState }) => {
    try {
      const { role, userId } = getState().auth; // Access role and userId
      let url = `/candidate/dashboardcounts?startDate=${startDate}&endDate=${endDate}`;

      // Modify the URL based on the role
      if (role !== 'SUPERADMIN') {
        url = `/candidate/dashboardcounts/filterByDate?startDate=${startDate}&endDate=${endDate}&recruiterId=${userId}`;
      }

      console.log("API Request URL:", url);
      const response = await httpService.get(url);
      console.log("response data",response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch filtered data");
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    statsByFilter: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(filterDashBoardCountByDateRange.pending, (state) => {
        state.loading = true;
        state.error=null;
      })
      .addCase(filterDashBoardCountByDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.statsByFilter = action.payload;
      })
      .addCase(filterDashBoardCountByDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.message;
      });
  },
});

export default dashboardSlice.reducer;
