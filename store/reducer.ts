import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
// import {configureStore} from '@reduxjs/toolkit';
// import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userSlice from '../slices/User';
import orderSlice from '../slices/Order';
import errorSlice from '../slices/Error';

//action: state를 바꾸는 행위
//dispatch: 그 액션을 실행하는 함수
//reducer: 액션이 실제로 실행되면 state를 바꾸는 로직
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  user: userSlice.reducer,
  order: orderSlice.reducer,
  error: errorSlice.reducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//   reducer: {persist: persistedReducer},
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
//   // devTools: process.env.NODE_ENV !== 'production',
// });

// export type RootState = ReturnType<typeof store.getState>;
// export default store;

// export type AppDispatch = typeof store.dispatch;
// export const useAppDispatch = () => useDispatch<AppDispatch>();
