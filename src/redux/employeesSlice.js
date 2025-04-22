// employeesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import httpService from "../Services/httpService"; // Import the httpService

// Fetch employees thunk
export const fetchEmployees = createAsyncThunk(
  "employee/fetchEmployees",
  async () => {
    const response = await httpService.get("/users/employee");
    return response.data;
  }
);

// Update employee thunk
export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async (employeeData) => {
    const { employeeId, ...updatedData } = employeeData;

    console.log("employee data from the edit  ", updatedData);

    const response = await httpService.put(
      `/users/update/${employeeId}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
);

export const filterUsersByDateRange = createAsyncThunk(
  'users/filterUsersByDateRange',
  async({startDate, endDate}, {rejectWithValue}) => {
      try{
        const response = await httpService.get(`/users/employee/filterByJoiningDate?startDate=${startDate}&endDate=${endDate}`);
        
        return response.data;
      }catch(error){
        console.log(error);
        return rejectWithValue(error);
      }
     }
)

// Delete employee thunk
export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (employeeId) => {
    await httpService.delete(`/users/delete/${employeeId}`);
    return employeeId;
  }
);

const employeesSlice = createSlice({
  name: "employee",
  initialState: {
    employeesList: [],
    filteredUsers: [],
    fetchStatus: "idle",
    fetchError: null,
    updateStatus: "idle",
    updateError: null,
    deleteStatus: "idle",
    deleteError: null,
    updatedUserResponse: null,
  },
  reducers: {
    resetUpdateStatus: (state) => {
      state.updateStatus = "idle";
      state.updateError = null;
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = "idle";
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchEmployees.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.employeesList = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.error.message;
      })

      // Update cases
      .addCase(updateEmployee.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.updatedUserResponse = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.error.message;
      })

      // Delete cases
      .addCase(deleteEmployee.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.employeesList = state.employeesList.filter(
          (employee) => employee.id !== action.payload
        );
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.error.message;
      })

 // Filter Bench List By date Range
          .addCase(filterUsersByDateRange.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(filterUsersByDateRange.fulfilled, (state, action) => {
            state.loading = false;
            state.filteredUsers = action.payload;
          })
          .addCase(filterUsersByDateRange.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            
          })
  },
});

export const { resetUpdateStatus, resetDeleteStatus } = employeesSlice.actions;
export default employeesSlice.reducer;