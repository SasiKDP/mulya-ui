import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/authSlice';
import employeesReducer from '../redux/employeesSlice'; // Import the employees reducer
import clientsReducer from '../redux/clientsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeesReducer, // Add the employees reducer to the store
    clients: clientsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;