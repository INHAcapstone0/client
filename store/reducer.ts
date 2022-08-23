import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userSlice from '../slices/User';
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
  error: errorSlice.reducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);
