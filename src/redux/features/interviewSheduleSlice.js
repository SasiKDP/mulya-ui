import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../apiConfig";

// AsyncThunk for form submission
export const submitInterviewForm = createAsyncThunk(
  "interviewForm/submitInterviewForm",
  async (formData, { rejectWithValue }) => {
    console.log('interview from data ', formData);
    
    try {
      const response = await axios.post(
        `http://35.188.150.92/candidate/interview-schedule/${formData.userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',  
          },
        }
      );
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Submission Failed");
    }
  }
);

const initialState = {
  formData: {
    jobId: "",
    candidateId: "",
    candidateFullName: "",
    candidateContactNo: "",
    candidateEmailId: '',
    userEmail: "",
    userId: "",
    interviewDateTime: null,
    duration: "",
    zoomLink: "",
    interviewScheduledTimestamp: null,
    clientEmail: '',
    clientName: "",
    interviewLevel: "",
  },
  isSubmitting: false,
  submissionSuccess: null,
  error: null,
  interviewResponse: null, // Store interview scheduling response
};

const interviewFormSlice = createSlice({
  name: "interviewForm",
  initialState,
  reducers: {
    updateFormField(state, action) {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetForm(state) {
      state.formData = initialState.formData;
      state.submissionSuccess = null;
      state.error = null;
      state.interviewResponse = null; // Reset interview response
    },
    clearError: (state) => {
      state.error = null;  // Clear error message
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitInterviewForm.pending, (state) => {
        state.isSubmitting = true;
        state.submissionSuccess = null;
        state.error = null;
      })
      .addCase(submitInterviewForm.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submissionSuccess = true;
        state.error = null;
        if (action.payload?.success) {
          state.interviewResponse = action.payload.payload;
          console.log('success response payload ',action)
        } else {
          state.error = action.payload?.message || "Interview scheduling failed.";
          state.submissionSuccess = false;
        }
      })
      .addCase(submitInterviewForm.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submissionSuccess = false;
        state.error = action.payload;
      });
  },
});

export const { updateFormField, resetForm, clearError } = interviewFormSlice.actions;
export default interviewFormSlice.reducer;
