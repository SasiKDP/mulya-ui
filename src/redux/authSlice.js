import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import httpService from "../Services/httpService"; // Adjust path if needed

const initialState = {
  isAuthenticated: !!localStorage.getItem("userId"),
  userId: localStorage.getItem("userId") || null,
  userName: localStorage.getItem("userName") || null,
  email: localStorage.getItem("email") || null,
  role: localStorage.getItem("role") || null,
  logInTimeStamp: localStorage.getItem("logInTimeStamp") || null,
  logoutTimestamp: null,
  status: "idle",
  error: null,
  encryptionKey: localStorage.getItem("encryptionKey") || null
};

// Login thunk
export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await httpService.post(
        `/users/login`,
        { email, password },
        { withCredentials: true }
      );

      const {
        userId,
        userName,
        email: userEmail,
        roleType,
        loginTimestamp,
        encryptionKey
      } = response.data.payload;

      // ✅ Persist in localStorage
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("role", roleType);
      localStorage.setItem("logInTimeStamp", loginTimestamp);
      localStorage.setItem("encryptionKey", encryptionKey);
      

      return {
        isAuthenticated: true,
        userId,
        userName,
        email: userEmail,
        role: roleType,
        logInTimeStamp: loginTimestamp,
        encryptionKey
      };
    } catch (error) {
      const message = error?.response?.data?.error?.errorMessage || "Login failed.";
      return rejectWithValue(message);
    }
  }
);

// Logout thunk
export const logoutAsync = createAsyncThunk(
  "auth/logoutAsync",
  async (userId, { rejectWithValue }) => {
    try {
      await httpService.put(`/users/logout/${userId}`, null, { withCredentials: true });

      // ✅ Clean localStorage
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("logInTimeStamp");
      localStorage.removeItem("encryptionKey");

      return { logoutTimestamp: new Date().toISOString() };
    } catch {
      return rejectWithValue("Logout failed. Please try again.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.userName = null;
      state.email = null;
      state.role = null;
      state.logInTimeStamp = null;
      state.logoutTimestamp = null;
      state.status = "idle";
      state.error = null;
      state.encryptionKey = null;

      // ✅ Clean localStorage
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("logInTimeStamp");
      localStorage.removeItem("encryptionKey");
    }
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
        state.userId = action.payload.userId;
        state.userName = action.payload.userName;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.logInTimeStamp = action.payload.logInTimeStamp;
        state.encryptionKey = action.payload.encryptionKey;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(logoutAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = false;
        state.userId = null;
        state.userName = null;
        state.email = null;
        state.role = null;
        state.logInTimeStamp = null;
        state.logoutTimestamp = action.payload.logoutTimestamp;
        state.encryptionKey = null;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
