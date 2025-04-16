import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpService from "../Services/httpService";

export const filterInterviewsByDateRange = createAsyncThunk(
    'interviews/filterByDateRange',
    async({startDate, endDate}, {rejectWithValue}) => {
        try{
       
          const response = await httpService.get(`/candidate/interviews/filterByDate?startDate=${startDate}&endDate=${endDate}`);
          
          return response.data;
        }catch(error){
          console.log(error);
          return rejectWithValue(error);
        }
       }
)


const interviewSlice =  createSlice({
    name: "interview",
    initialState: {
        loading: false,
        filteredInterviewList: [],
        error: null
    },
    reducers: {
      

    }, extraReducers: (builder) => {
        builder
          // Filter Interviews List By date Range
          .addCase(filterInterviewsByDateRange.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(filterInterviewsByDateRange.fulfilled, (state, action) => {
            state.loading = false;
            state.filteredInterviewList = action.payload;
          })
          .addCase(filterInterviewsByDateRange.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            
          })
        }
})

export const {  } = interviewSlice.actions;
export default interviewSlice.reducer;