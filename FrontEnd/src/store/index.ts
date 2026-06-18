import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import menuReducer from './slices/menuSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    menu: menuReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
