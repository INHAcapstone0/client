import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {persistedReducer} from './reducer';

const store = configureStore({
  reducer: {persist: persistedReducer},
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
