import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpService from "../Services/httpService";

export const fetchSubmissionsTeamLead = createAsyncThunk(
  'submissions/teamlead',
  async(_, {getState, rejectWithValue}) => {
      try{
        const state = getState();
        const userId =  state.auth.userId
        const response = await httpService.get(`/candidate/submissions/teamlead/${userId}`);

        return response.data;
      }catch(error){
        console.log(error);
        return rejectWithValue(error);
      }
     }
)


export const filterSubmissionsByDateRange = createAsyncThunk(
    'submissions/filterByDateRange',
    async({startDate, endDate}, {rejectWithValue}) => {
        try{
       
          const response = await httpService.get(`/candidate/submissions/filterByDate?startDate=${startDate}&endDate=${endDate}`);
          
          return response.data;
        }catch(error){
          console.log(error);
          return rejectWithValue(error);
        }
       }
)

// Filter Submissions by Recruiter
export const filterSubmissionssByRecruiter = createAsyncThunk(
  'recruiter/submissions/filterByDateRange',
  async({startDate, endDate}, {getState, rejectWithValue}) => {
      try{
        const state = getState();
        const recruiterId = state.auth.userId;
 
        const response = await httpService.get(`/candidate/submissions/${recruiterId}/filterByDate?startDate=${startDate}&endDate=${endDate}`);
        
        return response.data;
      }catch(error){
        console.log(error);
        return rejectWithValue(error);
      }
     }
)


const submissionSlice =  createSlice({
    name: "submission",
    initialState: {
        loading: false,
        selfSubmissionsTL: [],
        teamSubmissionsTL: [],
        filteredSubmissionsList: [],
        filteredSubmissionsForRecruiter: [],
        error: null
    },
    reducers: {
        

    }, extraReducers: (builder) => {
        builder
        //for the taeamlead self-submissions anf tema-submissions 
        .addCase(fetchSubmissionsTeamLead.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchSubmissionsTeamLead.fulfilled, (state, action) => {
          state.loading = false;
          state.selfSubmissionsTL = action.payload.selfSubmissions;
          state.teamSubmissionsTL =  action.payload.teamSubmissions;
        })
        .addCase(fetchSubmissionsTeamLead.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload.message;

        })
          // Filter Submissions List By date Range
          .addCase(filterSubmissionsByDateRange.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(filterSubmissionsByDateRange.fulfilled, (state, action) => {
            state.loading = false;
            state.filteredSubmissionsList = action.payload;
          })
          .addCase(filterSubmissionsByDateRange.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            
          })

          // Filter Submissions List By date Range For Recruiter
          .addCase(filterSubmissionssByRecruiter.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(filterSubmissionssByRecruiter.fulfilled, (state, action) => {
            state.filteredSubmissionsForRecruiter = action.payload;
            state.loading = false;
            
          })
          .addCase(filterSubmissionssByRecruiter.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            
          })
        }
})

// export const { setFilteredReqDataRequested } = requirementSlice.actions;
export default submissionSlice.reducer;