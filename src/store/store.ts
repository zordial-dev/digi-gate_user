import { configureStore } from '@reduxjs/toolkit';
import visitorReducer from './slices/visitorSlice';

export const store = configureStore({
  reducer: {
    visitor: visitorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;