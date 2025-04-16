import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpService from "../Services/httpService";

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


const submissionSlice =  createSlice({
    name: "submission",
    initialState: {
        loading: false,
        filteredSubmissionsList: [],
        error: null
    },
    reducers: {
        

    }, extraReducers: (builder) => {
        builder
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
        }
})

// export const { setFilteredReqDataRequested } = requirementSlice.actions;
export default submissionSlice.reducer;