import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import BASE_URL from '../apiConfig';

// Async thunks for API calls with headers
export const fetchAttendanceRecords = createAsyncThunk(
  'attendance/fetchRecords',
  async ({ page, rowsPerPage, searchQuery = '' }) => {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        page,
        limit: rowsPerPage,
        search: searchQuery
      },
      headers: {
        'Content-Type': 'application/json' // Adding content-type header
      }
    });
    return response.data;
  }
);

export const postAttendanceRecord = createAsyncThunk(
  'attendance/postRecord',
  async (recordData) => {
    const response = await axios.post(`${BASE_URL}/attendance`, recordData, {
      headers: {
        'Content-Type': 'application/json' // Adding content-type header
      }
    });
    return response.data;
  }
);

export const updateAttendanceRecord = createAsyncThunk(
  'attendance/updateRecord',
  async (recordData) => {
    const response = await axios.put(`${BASE_URL}/attendance/${recordData.id}`, recordData, {
      headers: {
        'Content-Type': 'application/json' // Adding content-type header
      }
    });
    return response.data;
  }
);

const initialState = {
  records: [],
  totalRecords: 0,
  loading: false,
  error: null,
  currentSession: {
    isCheckedIn: false,
    checkInTime: null,
    checkOutTime: null
  }
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setCheckIn: (state, action) => {
      state.currentSession.isCheckedIn = true;
      state.currentSession.checkInTime = action.payload;
      state.currentSession.checkOutTime = null;
    },
    setCheckOut: (state, action) => {
      state.currentSession.isCheckedIn = false;
      state.currentSession.checkOutTime = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch records cases
      .addCase(fetchAttendanceRecords.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(fetchAttendanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.records;
        state.totalRecords = action.payload.total;
      })
      .addCase(fetchAttendanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Post record cases
      .addCase(postAttendanceRecord.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(postAttendanceRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records.unshift(action.payload);
        state.totalRecords += 1;
      })
      .addCase(postAttendanceRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update record cases
      .addCase(updateAttendanceRecord.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(updateAttendanceRecord.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(record => record.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })
      .addCase(updateAttendanceRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setCheckIn, setCheckOut } = attendanceSlice.actions;
export default attendanceSlice.reducer;
