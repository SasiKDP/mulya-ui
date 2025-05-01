// src/redux/slices/placementSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import httpService from "../Services/httpService";
import ToastService from "../Services/toastService";

// Format date for API
const formatDateForAPI = (dateStr) => {
  if (!dateStr) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  try {
    return new Date(dateStr).toISOString().split("T")[0];
  } catch (e) {
    return null;
  }
};

// Format date for UI
const formatDateForUI = (isoDate) => {
  if (!isoDate) return "";

  if (isoDate.includes("-")) {
    const [year, month, day] = isoDate.split("-");
    return `${month}/${day}/${year}`;
  } else if (isoDate.includes("/")) {
    return isoDate;
  }

  try {
    const date = new Date(isoDate);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

// Async thunk to fetch placements list
export const fetchPlacements = createAsyncThunk(
  "placement/fetchPlacements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpService.get(
        "/candidate/placement/placements-list"
      );
      const rawData = response.data.data;

      const formattedData = rawData.map((item) => ({
        ...item,
        startDate: item.startDate ? formatDateForUI(item.startDate) : "",
        endDate: item.endDate ? formatDateForUI(item.endDate) : "",
      }));

      return formattedData;
    } catch (error) {
      ToastService.error("Failed to load placement data. Please try again.");
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch placements"
      );
    }
  }
);

// Async thunk to create a new placement
export const createPlacement = createAsyncThunk(
  "placement/createPlacement",
  async (placementData, { rejectWithValue, dispatch }) => {
    try {
      const submissionValues = {
        ...placementData,
        startDate: placementData.startDate
          ? formatDateForAPI(placementData.startDate)
          : null,
        endDate: placementData.endDate
          ? formatDateForAPI(placementData.endDate)
          : null,
      };

      const response = await httpService.post(
        "/candidate/placement/create-placement",
        submissionValues
      );

      if (response.data.success) {
        ToastService.success("New placement created successfully!");
        // Refetch placements after creating a new one
        dispatch(fetchPlacements());
        return response.data;
      } else {
        throw new Error(response.data.error || "Failed to create placement");
      }
    } catch (error) {
      ToastService.error(
        error.response?.data?.message ||
          "Failed to create placement. Please try again."
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to create placement"
      );
    }
  }
);

// Async thunk to update a placement
export const updatePlacement = createAsyncThunk(
  "placement/updatePlacement",
  async ({ id, placementData }, { rejectWithValue, dispatch }) => {
    try {
      const submissionValues = {
        ...placementData,
        startDate: placementData.startDate
          ? formatDateForAPI(placementData.startDate)
          : null,
        endDate: placementData.endDate
          ? formatDateForAPI(placementData.endDate)
          : null,
      };

      const response = await httpService.put(
        `/candidate/placement/update-placement/${id}`,
        submissionValues
      );

      if (response.data.success) {
        ToastService.success("Placement updated successfully!");
        // Refetch placements after updating
        dispatch(fetchPlacements());
        return response.data;
      } else {
        throw new Error(response.data.error || "Failed to update placement");
      }
    } catch (error) {
      ToastService.error(
        error.response?.data?.message ||
          "Failed to update placement. Please try again."
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to update placement"
      );
    }
  }
);

// Async thunk to delete a placement
export const deletePlacement = createAsyncThunk(
  "placement/deletePlacement",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await httpService.delete(
        `/candidate/placement/delete-placement/${id}`
      );

      if (response.data.success) {
        ToastService.success("Placement deleted successfully!");
        // Refetch placements after deleting
        dispatch(fetchPlacements());
        return response.data;
      } else {
        throw new Error(response.data.error || "Failed to delete placement");
      }
    } catch (error) {
      ToastService.error(
        error.response?.data?.message ||
          "Failed to delete placement. Please try again."
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete placement"
      );
    }
  }
);

export const filterPlacementByDateRange = createAsyncThunk(
  "placement/filterByDateRange",
  async ({ startDate, endDate }, thunkAPI) => {
    try {
      const response = await httpService.get(
        `/candidate/placement/filterByDate`,
        {
          params: { startDate, endDate },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch placements"
      );
    }
  }
);

const initialState = {
  placements: [],
  loading: false,
  error: null,
  success: false,
  actionType: null, // To track what action is in progress (create, update, delete)
  selectedPlacement: null, // To store the currently selected placement
};

const placementSlice = createSlice({
  name: "placement",
  initialState,
  reducers: {
    resetPlacementState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.actionType = null;
    },
    setSelectedPlacement: (state, action) => {
      // Format dates for edit mode
      if (action.payload) {
        const placement = action.payload;
        state.selectedPlacement = {
          ...placement,
          startDate: placement.startDate
            ? formatDateForAPI(placement.startDate)
            : "",
          endDate: placement.endDate ? formatDateForAPI(placement.endDate) : "",
        };
      } else {
        state.selectedPlacement = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch placements
      .addCase(fetchPlacements.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.actionType = "fetch";
      })
      .addCase(fetchPlacements.fulfilled, (state, action) => {
        state.loading = false;
        state.placements = action.payload;
        state.actionType = null;
      })
      .addCase(fetchPlacements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.actionType = null;
      })

      // Create placement
      .addCase(createPlacement.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.actionType = "create";
      })
      .addCase(createPlacement.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.actionType = null;
      })
      .addCase(createPlacement.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.actionType = null;
      })

      // Update placement
      .addCase(updatePlacement.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.actionType = "update";
      })
      .addCase(updatePlacement.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.actionType = null;
        state.selectedPlacement = null;
      })
      .addCase(updatePlacement.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.actionType = null;
      })

      // Delete placement
      .addCase(deletePlacement.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.actionType = "delete";
      })
      .addCase(deletePlacement.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.actionType = null;
      })
      .addCase(deletePlacement.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.actionType = null;
      })

      // Handle the pending state for date range filter
      .addCase(filterPlacementByDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.actionType = "fetchDateRange";
      })
      .addCase(filterPlacementByDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.placements = action.payload;
        state.success = true;
        state.actionType = null;
      })
      .addCase(filterPlacementByDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.actionType = null;
      });
  },
});

export const { resetPlacementState, setSelectedPlacement } =
  placementSlice.actions;
export default placementSlice.reducer;
