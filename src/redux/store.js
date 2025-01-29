// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import formReducer from './features/formSlice'
import authReducer from './features/authSlice'

// import employeeReducer from './features/employeeSliceexample'
import jobFormReducer from '../redux/features/jobFormSlice';
import candidateSubmissionReducer from './features/candidateSubmissionSlice';
import interviewFormReducer from '../redux/features/interviewSheduleSlice'
import employeesReducer from "../redux/features/employeesSlice";
import dialogReducer from './features/dialogSlice'
import attendanceReducer from './features/attendanceSlice';


export const store = configureStore({
  reducer: {
    form:formReducer,
    auth: authReducer,
    
    dialog: dialogReducer,
    employees: employeesReducer,
    jobForm: jobFormReducer,
    candidateSubmission: candidateSubmissionReducer,
    interviewForm: interviewFormReducer,
    attendance: attendanceReducer,

  },
});
