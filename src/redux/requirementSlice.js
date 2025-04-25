import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpService from "../Services/httpService";


export const fetchAllRequirementsBDM = createAsyncThunk(
  'requirements/All/BDM',
  async(_, {rejectWithValue}) => {
      try{
        const response = await httpService.get('/requirements/getAssignments');
  
        
        return response.data;
      }catch(error){
        console.log(error);
        return rejectWithValue(error);
      }
     }
)

export const fetchRequirementsBdmSelf = createAsyncThunk(
  'requirements/BDM/self',
  async(_, {getState,rejectWithValue}) => {
      try{
        const state = getState();
        const userId = state.auth.userId;
        const response = await httpService.get(`/requirements/bdmrequirements/${userId}`);
        return response.data || [];
      }catch(error){
        console.log(error);
        return rejectWithValue(error);
      }
     }
)

export const filterRequirementsByDateRange = createAsyncThunk(
    'requirements/filterByDateRange',
    async({startDate, endDate}, {rejectWithValue}) => {
        try{
       
          const response = await httpService.get(`/requirements/filterByDate?startDate=${startDate}&endDate=${endDate}`);
          
          return response.data;
        }catch(error){
          console.log(error);
          return rejectWithValue(error);
        }
       }
)

// Filter requirements for employee
export const filterRequirementsByRecruiter = createAsyncThunk(
  'recruiter/requirements/filterByDateRange',
  async({startDate, endDate}, {getState, rejectWithValue}) => {
      try{
        const state = getState();
        const recruiterId = state.auth.userId;
 
        const response = await httpService.get(`/requirements/recruiter/${recruiterId}/filterByDate?startDate=${startDate}&endDate=${endDate}`);
        
        return response.data;
      }catch(error){
        console.log(error);
        return rejectWithValue(error);
      }
     }
)

export const getRequirementDetailsByJobId = createAsyncThunk(
  'requirements/getByJobId',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await httpService.get(`/requirements/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching requirement by job ID:', error);
      return rejectWithValue(error);
    }
  }
);

const requirementSlice =  createSlice({
    name: "requirement",
    initialState: {
        loading: false,
        filteredRequirementList: [],
        filterAssignedRequirements: [],
        filteredTeamLeadRequirements: [],
        requirementsAllBDM : [],
        requirementsSelfBDM : [],
        isFilteredReqRequested: false,
        error: null
    },
    reducers: {
        setFilteredReqDataRequested: (state, action) => {
            state.isFilteredDataRequested = action.payload;
        }

    }, extraReducers: (builder) => {
        builder

        .addCase(fetchAllRequirementsBDM.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllRequirementsBDM.fulfilled, (state, action) => {
          state.loading = false;
          state.requirementsAllBDM = action.payload;
        })
        .addCase(fetchAllRequirementsBDM.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          
        })

        .addCase(fetchRequirementsBdmSelf.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchRequirementsBdmSelf.fulfilled, (state, action) => {
          state.loading = false;
          state.requirementsSelfBDM = action.payload;
        })
        .addCase(fetchRequirementsBdmSelf.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          
        })
          // Filter Requirement List By date Range
          .addCase(filterRequirementsByDateRange.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(filterRequirementsByDateRange.fulfilled, (state, action) => {
            state.loading = false;
            state.filteredRequirementList = action.payload;
          })
          .addCase(filterRequirementsByDateRange.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            
          })

          // Filter Recruiter requirements
          .addCase(filterRequirementsByRecruiter.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(filterRequirementsByRecruiter.fulfilled, (state, action) => {
            state.loading = false;
            state.filterAssignedRequirements = action.payload;
          })
          .addCase(filterRequirementsByRecruiter.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            
          })

          //jobDetails tarking 
          .addCase(getRequirementDetailsByJobId.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getRequirementDetailsByJobId.fulfilled, (state, action) => {
            state.loading = false;
            state.requirementDetails = action.payload;
          })
          .addCase(getRequirementDetailsByJobId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Something went wrong';
          })
          
        }
})

export const { setFilteredReqDataRequested } = requirementSlice.actions;
export default requirementSlice.reducer;