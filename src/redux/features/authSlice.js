import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../config";

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  roles: [],
  logInTimeStamp: null,
  logoutTimestamp: null,
  status: "idle",
  error: null,
};

// Async thunk for logging in
export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      const { userId, roleType, loginTimestamp } = response.data.payload;

      return {
        isAuthenticated: true,
        user: userId,
        roles: roleType ? [roleType] : [],
        logInTimeStamp: loginTimestamp,
      };
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.error?.errorMessage || "An unexpected error occurred.";

        if (status === 403) {
          return rejectWithValue("User is not active, please reach out to admin.");
        } else if (status === 400) {
          return rejectWithValue("Invalid credentials or bad request.");
        } else if (status === 201 && data?.success === false) {
          return rejectWithValue(errorMessage || "User is already logged in.");
        } else {
          return rejectWithValue(errorMessage);
        }
      } else if (error.request) {
        return rejectWithValue("Network error. Please try again later.");
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

// Async thunk for logging out
export const logoutAsync = createAsyncThunk(
  "auth/logoutAsync",
  async (userId, { rejectWithValue }) => {
    try {
      await axios.put(
        `${BASE_URL}/users/logout/${userId}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      return { logoutTimestamp: new Date().toISOString() };
    } catch (error) {
      if (error.response) {
        return rejectWithValue("Failed to log out. Please try again.");
      } else if (error.request) {
        return rejectWithValue("Network error. Please try again later.");
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.roles = [];
      state.logInTimeStamp = null;
      state.logoutTimestamp = null;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.roles = action.payload.roles;
        state.logInTimeStamp = action.payload.logInTimeStamp;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(logoutAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = false;
        state.user = null;
        state.roles = [];
        state.logInTimeStamp = null;
        state.logoutTimestamp = action.payload.logoutTimestamp;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
