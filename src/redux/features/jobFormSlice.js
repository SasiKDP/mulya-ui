// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import BASE_URL from "../apiConfig";

// // const url = 'http://35.188.150.92';

// // Async thunk for posting job requirements
// export const postJobRequirement = createAsyncThunk(
//   "jobForm/postJobRequirement",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${BASE_URL}/requirements/assignJob`, formData, {
//         headers: {
//           "Content-Type": "application/json; charset=UTF-8",
//         },
//       });
//       console.log("job posting log ==== ", response.data);
//       return response.data; // Return API response data
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to post job requirement"
//       );
//     }
//   }
// );

// // Initial state
// const initialState = {
//   formData: {
//     //jobId: "",
//     jobTitle: "",
//     clientName: "",
//     jobDescription: "",
//     jobType: "",
//     location: "",
//     jobMode: "",
//     experienceRequired: "",
//     noticePeriod: "",
//     relevantExperience: "",
//     qualification: "",
//     status: "Open",
    
//   },
//   status: "idle", // idle, loading, succeeded, failed
//   error: null,
//   jobPostingSuccessResponse: null, // New field for success messages
  
// };

// // Slice for managing job form state
// const jobFormSlice = createSlice({
//   name: "jobForm",
//   initialState,
//   reducers: {
//     updateField: (state, action) => {
//       const { name, value } = action.payload;
//       if (name === "recruiterIds") {
//         // Ensure recruiterIds is stored as an array
//         state.formData[name] = typeof value === "string" ? value.split(",") : value;
//       } else {
//         state.formData[name] = value;
//       }
//       if (name === "jobDescription") {
//         // Check length of jobDescription
//         console.log('Job description length:', value.length);
//       }
      
//     },
//     resetForm: (state) => {
//       // Reset formData to the initial state
//       state.formData = { ...initialState.formData };
//       state.status = "idle";
//       state.error = null;
//       state.successMessage = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(postJobRequirement.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(postJobRequirement.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.error = null;
//         console.log('job form success response---------- ',action.payload)
//         state.jobPostingSuccessResponse = action.payload
//         state.formData = { ...initialState.formData }; 
//       })
//       .addCase(postJobRequirement.rejected, (state, action) => {
//         state.status = "failed";
//         console.log('job form error response---------- ',action.payload)
//         state.error = action.payload; // Capture the error message
//         state.successMessage = null;
//       });
//   },
// });

// // Exporting actions and reducer
// export const { updateField, resetForm } = jobFormSlice.actions;
// export default jobFormSlice.reducer;




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../apiConfig";

// Async thunk for posting job requirements
export const postJobRequirement = createAsyncThunk(
  "jobForm/postJobRequirement",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/requirements/assignJob`, formData, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      });
      console.log("job posting log ==== ", response.data);
      return response.data; // Return API response data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to post job requirement"
      );
    }
  }
);

// Initial state with dynamic fields for job posting
const initialState = {
  formData: {
    jobTitle: "",
    clientName: "",
    jobDescription: "",
    jobType: "",
    location: "",
    jobMode: "",
    experienceRequired: "",
    noticePeriod: "",
    relevantExperience: "",
    qualification: "",
    recruiterIds: [],
    status: "In Progress",
    recruiterName: "",
  },
  status: "idle", // idle, loading, succeeded, failed
  error: null,
  jobPostingSuccessResponse: null, // New field for success messages
};

// Slice for managing job form state
const jobFormSlice = createSlice({
  name: "jobForm",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { name, value } = action.payload;
      if (name === "recruiterIds") {
        // Ensure recruiterIds is stored as an array
        state.formData[name] = typeof value === "string" ? value.split(",") : value;
      } else {
        state.formData[name] = value;
      }
    },
    resetForm: (state) => {
      state.formData = { ...initialState.formData };
      state.status = "idle";
      state.error = null;
      state.jobPostingSuccessResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postJobRequirement.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.jobPostingSuccessResponse = null;
      })
      .addCase(postJobRequirement.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.jobPostingSuccessResponse = action.payload;
        state.formData = { ...initialState.formData };
      })
      .addCase(postJobRequirement.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Capture the error message
        state.jobPostingSuccessResponse = null;
      });
  },
});

// Exporting actions and reducer
export const { updateField, resetForm } = jobFormSlice.actions;
export default jobFormSlice.reducer;

