import React, { useEffect, useState } from 'react';
import { Stack, IconButton, Tooltip } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ClearIcon from '@mui/icons-material/Clear';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import ToastService from '../../Services/toastService'; 
import { filterBenchListByDateRange, setFilteredDataRequested } from '../../redux/benchSlice';
import { validateDateRange } from '../../utils/validateDateRange';
import { filterRequirementsByDateRange, filterRequirementsByRecruiter } from '../../redux/requirementSlice';
import { filterInterviewsByDateRange, filterInterviewsByRecruiter ,filterInterviewsByTeamLead} from '../../redux/interviewSlice';
import { filterUsersByDateRange } from '../../redux/employeesSlice';
import { filterSubmissionsByDateRange, filterSubmissionssByRecruiter } from '../../redux/submissionSlice';
import { filterClientsByDateRange } from '../../redux/clientsSlice';
import { filterPlacementByDateRange } from '../../redux/placementSlice';
import { filterDashBoardCountByDateRange } from '../../redux/dashboardSlice';

import { filterTeamMetricsByDateRange, clearFilters } from '../../redux/teamMetricsSlice';

import {filterSubmissionsByTeamlead} from '../../redux/submissionSlice'



const componentToActionMap = {
  BenchList: filterBenchListByDateRange,
  Requirement: filterRequirementsByDateRange,
  Interviews: filterInterviewsByDateRange,
  Users: filterUsersByDateRange,
  Submissions: filterSubmissionsByDateRange,
  SubmissionsForTeamLead:filterSubmissionsByTeamlead,
  AssignedList: filterRequirementsByRecruiter,
  RecruiterSubmission: filterSubmissionssByRecruiter,
  InterviewsForRecruiter: filterInterviewsByRecruiter,
  dashboard:filterDashBoardCountByDateRange,
  InterviewsForTeamLead: filterInterviewsByDateRange,
  Clients: filterClientsByDateRange,
  placements: filterPlacementByDateRange,
  allSubmissions: filterSubmissionsByDateRange,
  allInterviews: filterInterviewsByDateRange,
  dashboard: filterDashBoardCountByDateRange,
  TeamMetrics: filterTeamMetricsByDateRange

};

const componentToClearActionsMap = {
  TeamMetrics: clearFilters
};

const DateRangeFilter = ({ component, labelPrefix = '', onDateChange }) => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    dispatch(setFilteredDataRequested(false));
    
    // Use component-specific clear action if available
    const clearAction = componentToClearActionsMap[component];
    if (clearAction) {
      dispatch(clearAction());
    }
    
    // Call the onDateChange callback if provided
    if (onDateChange) {
      onDateChange();
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      const error = validateDateRange(startDate, endDate);
      if (error) {
        ToastService.error(error);
        return;
      }

      const formattedStart = dayjs(startDate).format('YYYY-MM-DD');
      const formattedEnd = dayjs(endDate).format('YYYY-MM-DD');

      dispatch(setFilteredDataRequested(true));

      const actionCreator = componentToActionMap[component];
      if (actionCreator) {
        dispatch(actionCreator({ startDate: formattedStart, endDate: formattedEnd }))
          .then(() => {
            // Call the onDateChange callback if provided
            if (onDateChange) {
              onDateChange();
            }
          })
          .catch(error => {
            ToastService.error(`Error applying date filter: ${error.message}`);
          });
      } else {
        console.warn(`No action mapped for component: ${component}`);
      }
    }
  }, [startDate, endDate, component, dispatch, onDateChange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
        <DatePicker
          label={`${labelPrefix} Start Date`}
          value={startDate}
          onChange={(date) => setStartDate(date)}
          slotProps={{
            textField: {
              size: 'small',
              sx: { maxWidth: 180 },
            },
          }}
        />
        <DatePicker
          label={`${labelPrefix} End Date`}
          value={endDate}
          onChange={(date) => setEndDate(date)}
          slotProps={{
            textField: {
              size: 'small',
              sx: { maxWidth: 180 },
            },
          }}
        />
        {(startDate || endDate) && (
          <Tooltip title="Clear Filter">
            <IconButton onClick={handleClearFilter} size="small" sx={{ mt: 3 }}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </LocalizationProvider>
  );
};

export default DateRangeFilter;