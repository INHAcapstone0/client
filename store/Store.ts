import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {persistedReducer} from './Reducer';

const store = configureStore({
  reducer: {persist: persistedReducer},
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  // devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export default store;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
