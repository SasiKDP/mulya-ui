import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../apiConfig";

// const BASE_URL = 'http://192.168.0.194'

// Define API endpoints with base URL
const API_ENDPOINTS = {
  SEND_OTP: `${BASE_URL}/users/send-otp`,
  VERIFY_OTP: `${BASE_URL}/users/verify-otp`,
  RESET_PASSWORD: `${BASE_URL}/users/update-password`,
};

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  return error.message || "An unexpected error occurred";
};

// Async thunk for sending OTP
export const sendOtpAsync = createAsyncThunk(
  "forgotPassword/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        API_ENDPOINTS.SEND_OTP,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data?.status === "error") {
        throw new Error(response.data.message);
      }

      return {
        data: response.data,
        message: "OTP has been sent to your email"
      };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async thunk for OTP verification
export const verifyOtpAsync = createAsyncThunk(
  "forgotPassword/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        API_ENDPOINTS.VERIFY_OTP,
        { email, otp },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data?.status === "error") {
        throw new Error(response.data.message);
      }

      return {
        data: response.data,
        message: "OTP verified successfully"
      };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async thunk for password reset
export const resetPasswordAsync = createAsyncThunk(
  "forgotPassword/resetPassword",
  async ({ email, updatePassword, confirmPassword }, { rejectWithValue }) => {
    try {
      if (updatePassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await axios.post(
        API_ENDPOINTS.RESET_PASSWORD,
        { 
          email, 
          updatePassword,
          confirmPassword 
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data?.status === "error") {
        throw new Error(response.data.message);
      }

      return {
        data: response.data,
        message: "Password has been reset successfully"
      };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Initial state
const initialState = {
  email: "",
  otp: "",
  enteredOtp: "",
  loading: false,
  step: 1, // 1: Email, 2: OTP, 3: Reset Password
  error: null,
  success: null,
  isSubmitting: false,
  otpExpiration: null,
  remainingAttempts: 3,
  formErrors: {
    email: null,
    otp: null,
    password: null,
    confirmPassword: null
  }
};

// Create the slice
const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
      state.formErrors.email = null;
      state.error = null;
    },
    setOtp: (state, action) => {
      state.enteredOtp = action.payload;
      state.formErrors.otp = null;
      state.error = null;
    },
    setStep: (state, action) => {
      state.step = action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
      state.formErrors = {
        email: null,
        otp: null,
        password: null,
        confirmPassword: null
      };
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    decrementAttempts: (state) => {
      state.remainingAttempts = Math.max(0, state.remainingAttempts - 1);
    },
    resetAttempts: (state) => {
      state.remainingAttempts = 3;
    },
    setFormError: (state, action) => {
      const { field, error } = action.payload;
      state.formErrors[field] = error;
    },
    resetState: (state) => {
      return { ...initialState };
    }
  },
  extraReducers: (builder) => {
    builder
      // Send OTP cases
      .addCase(sendOtpAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.isSubmitting = true;
      })
      .addCase(sendOtpAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isSubmitting = false;
        state.step = 2;
        state.success = action.payload.message;
        state.otpExpiration = Date.now() + 5 * 60 * 1000; // 5 minutes from now
        state.remainingAttempts = 3;
      })
      .addCase(sendOtpAsync.rejected, (state, action) => {
        state.loading = false;
        state.isSubmitting = false;
        state.error = action.payload;
      })
      // Verify OTP cases
      .addCase(verifyOtpAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.isSubmitting = true;
      })
      .addCase(verifyOtpAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isSubmitting = false;
        state.step = 3;
        state.success = action.payload.message;
        state.otpExpiration = null;
      })
      .addCase(verifyOtpAsync.rejected, (state, action) => {
        state.loading = false;
        state.isSubmitting = false;
        state.error = action.payload;
        state.remainingAttempts -= 1;
      })
      // Reset password cases
      .addCase(resetPasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.isSubmitting = true;
      })
      .addCase(resetPasswordAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isSubmitting = false;
        state.success = action.payload.message;
        // Don't reset state immediately to allow success message to be shown
        state.step = 1;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.isSubmitting = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  setEmail,
  setOtp,
  setStep,
  clearError,
  clearSuccess,
  decrementAttempts,
  resetAttempts,
  setFormError,
  resetState
} = forgotPasswordSlice.actions;

// Export selectors
export const selectForgotPasswordState = (state) => state.forgotPassword;
export const selectIsOtpExpired = (state) => {
  const { otpExpiration } = state.forgotPassword;
  return otpExpiration ? Date.now() > otpExpiration : false;
};
export const selectRemainingAttempts = (state) => state.forgotPassword.remainingAttempts;

// Export reducer
export default forgotPasswordSlice.reducer;
