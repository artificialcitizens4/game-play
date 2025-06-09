import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import apiReducer from './slices/apiSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    api: apiReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});