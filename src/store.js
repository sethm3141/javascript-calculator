import { configureStore } from '@reduxjs/toolkit';
import displayReducer from './features/display/displaySlice';

export const store = configureStore({
  reducer: {
    display: displayReducer,
  },
});
