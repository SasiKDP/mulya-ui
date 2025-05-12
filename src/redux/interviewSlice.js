import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpService from "../Services/httpService";

export const fetchInterviewsTeamLead = createAsyncThunk(
  'interviews/teamlead',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = state.auth.userId
      const response = await httpService.get(`/candidate/interviews/teamlead/${userId}`);

      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
)


export const filterInterviewsByDateRange = createAsyncThunk(
  'interviews/filterByDateRange',
  async ({ startDate, endDate, userId, role }, { rejectWithValue }) => {
    try {
      let response;
  
        response = await httpService.get(`/candidate/interviews/filterByDate?startDate=${startDate}&endDate=${endDate}`)

      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);



// Filter interviews for employee
export const filterInterviewsByRecruiter = createAsyncThunk(
  'recruiter/interviews/filterByDateRange',
  async({startDate, endDate}, {getState, rejectWithValue}) => {
      try{
        const state = getState();
        const userId = state.auth.userId
 
        const response = await httpService.get(`/candidate/interviews/${userId}/filterByDate?startDate=${startDate}&endDate=${endDate}`);
        
        return response.data;
      }catch(error){
        console.log(error);
        return rejectWithValue(error);
      }
     }
)

export const filterInterviewsByTeamLead=createAsyncThunk(
  'teamlead/interviews/filterByDateRange',
  async({startDate,endDate,userId},{getState, rejectWithValue})=>{
    try{
      const state=getState();
     
      const response =await httpService.get(`/candidate/teamlead/interviews/${userId}/filterByDate?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    }catch(error){
      return rejectWithValue(error);
    }
  }
)

const interviewSlice =  createSlice({
    name: "interview",
    initialState: {
      loading: false,
      selfInterviewsTL: [],
      teamInterviewsTL: [],
      filteredInterviewList: [],
      filterInterviewsForRecruiter: [],
      filterInterviewsForTeamLead:[],
      error: null
    },
    reducers: {
      

    }, extraReducers: (builder) => {
        builder
        //teamlead interviews 
        .addCase(fetchInterviewsTeamLead.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchInterviewsTeamLead.fulfilled, (state, action) => {
          state.loading = false;
          state.selfInterviewsTL = action.payload.selfInterviews || [];
          state.teamInterviewsTL = action.payload.teamInterviews || [];
          console.log(action.payload);
        })
        .addCase(fetchInterviewsTeamLead.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
          console.log(action.payload);
  
        })

          // Filter Interviews List By date Range
          .addCase(filterInterviewsByDateRange.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(filterInterviewsByDateRange.fulfilled, (state, action) => {
            state.loading = false;
            state.filterInterviewsForRecruiter = action.payload.data;
          })
          .addCase(filterInterviewsByDateRange.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            
          })


          // Filter Interviews List By date Range For Recruiters
          .addCase(filterInterviewsByRecruiter.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(filterInterviewsByRecruiter.fulfilled, (state, action) => {
            state.loading = false;
            state.filterInterviewsForRecruiter = action.payload.data;
          })
          .addCase(filterInterviewsByRecruiter.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            
          })


          // Filter Interviews List By date Range For TeamLead
          .addCase(filterInterviewsByTeamLead.pending,(state)=>{
            state.loading=true;
            state.error=null;
          })
          .addCase(filterInterviewsByTeamLead.fulfilled,(state,action)=>{
            state.loading=false;
            state.filterInterviewsForTeamLead=state.payload.data;
          })
          .addCase(filterInterviewsByTeamLead.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message
          })
        }
})

export const {  } = interviewSlice.actions;
export default interviewSlice.reducer;