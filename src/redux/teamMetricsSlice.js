import { createSlice } from '@reduxjs/toolkit';
import httpService from '../Services/httpService';

const initialState = {
  bdmUsers: [],
  teamLeadUsers: [],
  employeeUsers: [],
  filteredBdmUsers: [],
  filteredTeamLeadUsers: [],
  filteredEmployeeUsers: [],
  isLoading: false,
  error: null,
  isFiltered: false
};

export const teamMetricsSlice = createSlice({
  name: 'teamMetrics',
  initialState,
  reducers: {
    fetchTeamMetricsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchBdmUsersSuccess: (state, action) => {
      state.bdmUsers = action.payload;
      if (!state.isFiltered) {
        state.filteredBdmUsers = action.payload;
      }
      state.isLoading = false;
    },
    fetchTeamLeadUsersSuccess: (state, action) => {
      state.teamLeadUsers = action.payload;
      if (!state.isFiltered) {
        state.filteredTeamLeadUsers = action.payload;
      }
      state.isLoading = false;
    },
    fetchEmployeeUsersSuccess: (state, action) => {
      state.employeeUsers = action.payload;
      if (!state.isFiltered) {
        state.filteredEmployeeUsers = action.payload;
      }
      state.isLoading = false;
    },
    fetchTeamMetricsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setFilteredBdmUsers: (state, action) => {
      state.filteredBdmUsers = action.payload;
      state.isFiltered = true;
    },
    setFilteredTeamLeadUsers: (state, action) => {
      state.filteredTeamLeadUsers = action.payload;
      state.isFiltered = true;
    },
    setFilteredEmployeeUsers: (state, action) => {
      state.filteredEmployeeUsers = action.payload;
      state.isFiltered = true;
    },
    clearFilters: (state) => {
      state.filteredBdmUsers = state.bdmUsers;
      state.filteredTeamLeadUsers = state.teamLeadUsers;
      state.filteredEmployeeUsers = state.employeeUsers;
      state.isFiltered = false;
    }
  },
});

export const {
  fetchTeamMetricsStart,
  fetchBdmUsersSuccess,
  fetchTeamLeadUsersSuccess,
  fetchEmployeeUsersSuccess,
  fetchTeamMetricsFailure,
  setFilteredBdmUsers,
  setFilteredTeamLeadUsers,
  setFilteredEmployeeUsers,
  clearFilters
} = teamMetricsSlice.actions;

// Thunk actions
export const fetchBdmUsers = () => async (dispatch) => {
  dispatch(fetchTeamMetricsStart());
  try {
    const response = await httpService.get('/users/bdmlist');
    dispatch(fetchBdmUsersSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(fetchTeamMetricsFailure(error.message || 'Failed to fetch BDM users'));
    throw error;
  }
};

export const fetchTeamLeadUsers = () => async (dispatch) => {
  dispatch(fetchTeamMetricsStart());
  try {
    const response = await httpService.get('/requirements/stats');
    const teamLeadUsers = response.data.userStats ? 
      response.data.userStats.filter(user => user.role && user.role.toUpperCase() === 'TEAMLEAD') : 
      [];
    dispatch(fetchTeamLeadUsersSuccess(teamLeadUsers));
    return teamLeadUsers;
  } catch (error) {
    dispatch(fetchTeamMetricsFailure(error.message || 'Failed to fetch Team Lead users'));
    throw error;
  }
};

export const fetchEmployeeUsers = () => async (dispatch) => {
  dispatch(fetchTeamMetricsStart());
  try {
    const response = await httpService.get('/requirements/stats');
    const employeeUsers = response.data.userStats ? 
      response.data.userStats.filter(user => user.role && user.role.toUpperCase() === 'EMPLOYEE') : 
      [];
    dispatch(fetchEmployeeUsersSuccess(employeeUsers));
    return employeeUsers;
  } catch (error) {
    dispatch(fetchTeamMetricsFailure(error.message || 'Failed to fetch Employee users'));
    throw error;
  }
};

export const filterTeamMetricsByDateRange = ({ startDate, endDate }) => async (dispatch, getState) => {
  dispatch(fetchTeamMetricsStart());
  try {
    // Filter BDM users
    const bdmResponse = await httpService.get(`/users/bdmlist/filterByDate?startDate=${startDate}&endDate=${endDate}`);
    dispatch(setFilteredBdmUsers(bdmResponse.data || []));
    
    // Filter TeamLead and Employee users
    const statsResponse = await httpService.get(`/requirements/stats/filterByDate?startDate=${startDate}&endDate=${endDate}`);
    
    if (statsResponse.data && statsResponse.data.userStats) {
      const teamLeadUsers = statsResponse.data.userStats.filter(
        user => user.role && user.role.toUpperCase() === 'TEAMLEAD'
      );
      dispatch(setFilteredTeamLeadUsers(teamLeadUsers));
      
      const employeeUsers = statsResponse.data.userStats.filter(
        user => user.role && user.role.toUpperCase() === 'EMPLOYEE'
      );
      dispatch(setFilteredEmployeeUsers(employeeUsers));
    }
    
    return true;
  } catch (error) {
    dispatch(fetchTeamMetricsFailure(error.message || 'Failed to filter by date range'));
    throw error;
  }
};

export default teamMetricsSlice.reducer;
