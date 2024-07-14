import { configureStore } from '@reduxjs/toolkit';
import visaReducer from './visaSlice.ts';

export const store = configureStore({
  reducer: {
    visa: visaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;