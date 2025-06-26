import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpService from '../Services/httpService';
import isEqual from 'lodash/isEqual';


export const fetchInProgressData=createAsyncThunk(
    'inProgress/fetchInProgressDate',
    async (_,{rejectWithValue})=>{
    try{
        const response=await httpService.get("/requirements/inprogress");
        return response.data
    }
    catch(error){
      return rejectWithValue(error)
    }
    }
 )

 export const filterInProgressDataByDateRange=createAsyncThunk(
    'inProgress/filterInProgressDataByDateRange', 
    async ({startDate,endDate},{rejectWithValue})=>{
        try{
            const response= await httpService.get(`/requirements/inprogress/filterByDate?startDate=${startDate}&endDate=${endDate}`);
            return response.data
        }
        catch(error){
            return rejectWithValue(error)
        }
    } 
 )


const InProgressSlice = createSlice({
    name: 'inProgress',
    initialState: {
        inProgress: [],
        filterinProgressByDateRange: [],
        error: null,
        loading: false,
        isFiltered: false // Add this new state
    },
    reducers: {
        clearFilterData: (state) => {
            state.filterinProgressByDateRange = [];
            state.isFiltered = false; // Mark as not filtered
            state.loading = false; // Don't set loading here
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch inProgress data
            .addCase(fetchInProgressData.pending, (state) => {
                state.loading = true;
            })
           .addCase(fetchInProgressData.fulfilled, (state, action) => {
            state.loading = false;

            // Remove exact duplicates (based on deep equality)
            const unique = [];
            const seen = new Set();

            for (const item of action.payload) {
            const key = JSON.stringify(item); // Treat whole object as unique key
            if (!seen.has(key)) {
             seen.add(key);
            unique.push(item);
         }
         }

           state.inProgress = unique;
            })
            .addCase(fetchInProgressData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // filter inProgress data by date range
            .addCase(filterInProgressDataByDateRange.pending, (state) => {
                state.loading = true;
            })
            .addCase(filterInProgressDataByDateRange.fulfilled, (state, action) => {
                state.loading = false;
                state.filterinProgressByDateRange = action.payload;
                state.isFiltered = true; // Mark as filtered
            })
            .addCase(filterInProgressDataByDateRange.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const {clearFilterData}=InProgressSlice.actions


export default  InProgressSlice.reducer