import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpService from '../Services/httpService';



export const fetchInProgressData=createAsyncThunk(
    'inProgress/fetchInProgressDate',
    async (_,{rejectWithValue})=>{
    try{
        const response=await httpService.get("/requirements/inprogress/filterByDate");
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
            const response= await httpService.get(`/requirements/inprogress/filterByDate?${startDate}&${endDate}`);
            return response.data
        }
        catch(error){
            return rejectWithValue(error)
        }
    } 
 )


const InProgressSlice=createSlice({
    name:'inProgress',
    initialState:{
        inProgress:[],
        filterinProgressByDateRange:[],
        error:null,
        loading:false
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder

        //fetch inProgress data
        .addCase(fetchInProgressData.pending,(state)=>{
            state.loading=true
        })
        .addCase(fetchInProgressData.fulfilled,(state,action)=>{
            state.loading=false;
            state.inProgress=action.payload
        })
        .addCase(fetchInProgressData.rejected,(state,action)=>{
            state.loading = false;
            state.error=action.payload
        })

        //fetch inProgress data by date range
        .addCase(filterInProgressDataByDateRange.pending,(state)=>{
            state.loading=true
        })
        .addCase(filterInProgressDataByDateRange.fulfilled,(state,action)=>{
            state.loading=false;
            state.filterinProgressByDateRange=action.payload
        })
        .addCase(filterInProgressDataByDateRange.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
        })
    }
})


export default InProgressSlice.reducer