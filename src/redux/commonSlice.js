

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpService from "../Services/httpService";
import { Toast } from "bootstrap";
import ToastService from "../Services/toastService";
import DialogBox from "../components/DialogBox/DialogBox";

export const addtoPlacementHandler = createAsyncThunk(
    '/addPlacement',
    async(data, {rejectWithValue}) => {
      
        try{
            const url = `/candidate/placement/create-placement`;
            const response = await httpService.post(url, data);
            console.log("response: ", response);
            return response.data;
        }catch(error){
          console.log(error);
          return rejectWithValue(error);
        }
       }
)

const commonSlice =  createSlice({
    name: "common",
    initialState: {
        loading: false,
        error: null,
        isSuccessful: false,
        newPlacementRecord: {}

    },
    reducers: {

    }, extraReducers: (builder) => {
        builder
          // Filter Requirement List By date Range
          .addCase(addtoPlacementHandler.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(addtoPlacementHandler.fulfilled, (state, action) => {
            state.loading = false;
            state.newPlacementRecord = action.payload;
            console.log("Action.payload: ", action.payload);
            
            if(action.payload.success == true) {
                ToastService.success(action.payload.message) 
            }
          })
          .addCase(addtoPlacementHandler.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            ToastService.error(action.payload.message)
            
          })
        }
})

export default commonSlice.reducer;



