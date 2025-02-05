// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_appconfig.PROD_appconfig.PROD_BASE_URL = 'http://192.168.0.194:8080/api';
// const HARDCODED_EMPLOYEE_ID = 'DQIND012'; // Replace with your employee ID

// export const fetchAttendanceRecords = createAsyncThunk(
//   'attendance/fetchRecords',
//   async () => {
//     const response = await axios.get(`${API_appconfig.PROD_appconfig.PROD_BASE_URL}/timesheets/${HARDCODED_EMPLOYEE_ID}`, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//     return response.data;
//   }
// );

// export const postAttendanceRecord = createAsyncThunk(
//   'attendance/postRecord',
//   async () => {
//     const now = new Date();
//     const checkInData = {
//       employeeId: HARDCODED_EMPLOYEE_ID,
//       date: now.toLocaleDateString('en-GB'),
//       status: 'Present'
//     };
    
//     const response = await axios.post(`${API_appconfig.PROD_appconfig.PROD_BASE_URL}/timesheets/login`, checkInData, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//     return response.data;
//   }
// );

// export const updateAttendanceRecord = createAsyncThunk(
//   'attendance/updateRecord',
//   async () => {
//     const response = await axios.put(`${API_appconfig.PROD_appconfig.PROD_BASE_URL}/timesheets/logout/${HARDCODED_EMPLOYEE_ID}`, {}, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//     return response.data;
//   }
// );

// const initialState = {
//   records: [],
//   totalRecords: 0,
//   loading: false,
//   error: null,
//   currentSession: {
//     isCheckedIn: false,
//     checkInTime: null,
//     checkOutTime: null
//   }
// };

// const attendanceSlice = createSlice({
//   name: 'attendance',
//   initialState,
//   reducers: {
//     setCheckIn: (state, action) => {
//       state.currentSession.isCheckedIn = true;
//       state.currentSession.checkInTime = action.payload;
//       state.currentSession.checkOutTime = null;
//     },
//     setCheckOut: (state, action) => {
//       state.currentSession.isCheckedIn = false;
//       state.currentSession.checkOutTime = action.payload;
//     },
//     clearError: (state) => {
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAttendanceRecords.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAttendanceRecords.fulfilled, (state, action) => {
//         state.loading = false;
//         state.records = action.payload;
//         state.totalRecords = action.payload.length;
//       })
//       .addCase(fetchAttendanceRecords.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })
//       .addCase(postAttendanceRecord.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(postAttendanceRecord.fulfilled, (state, action) => {
//         state.loading = false;
//         state.records.unshift(action.payload);
//         state.totalRecords += 1;
//       })
//       .addCase(postAttendanceRecord.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })
//       .addCase(updateAttendanceRecord.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateAttendanceRecord.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.records.findIndex(record => record.employeeId === action.payload.employeeId);
//         if (index !== -1) {
//           state.records[index] = action.payload;
//         }
//       })
//       .addCase(updateAttendanceRecord.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   }
// });

// export const { setCheckIn, setCheckOut, clearError } = attendanceSlice.actions;
// export default attendanceSlice.reducer;




import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const appconfig = require("../apiConfig");

// ✅ Directly use the production URL everywhere
const BASE_URL = appconfig.PROD_appconfig.PROD_BASE_URL;

console.log("Using BASE_URL:", BASE_URL);

export const fetchAttendanceRecords = createAsyncThunk(
  'attendance/fetchRecords',
  async (_, { getState }) => {
    const { auth: { user } } = getState();
    const response = await axios.get(`${BASE_URL}/timesheets/${user}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
);

export const postAttendanceRecord = createAsyncThunk(
  'attendance/postRecord',
  async (_, { getState }) => {
    const { auth: { user } } = getState();
    const now = new Date();
    const checkInData = {
      employeeId: user,
      date: now.toLocaleDateString('en-GB'),
      status: 'Present'
    };

    const response = await axios.post(`${BASE_URL}/timesheets/login`, checkInData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
);

export const updateAttendanceRecord = createAsyncThunk(
  'attendance/updateRecord',
  async (_, { getState }) => {
    const { auth: { user } } = getState();
    const response = await axios.put(`${BASE_URL}/timesheets/logout/${user}`, {}, {
      headers: {
        'Content-Type': 'application/json'
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
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
        state.totalRecords = action.payload.length;
      })
      .addCase(fetchAttendanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(postAttendanceRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
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
      .addCase(updateAttendanceRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendanceRecord.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(record => record.employeeId === action.payload.employeeId);
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

export const { setCheckIn, setCheckOut, clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;