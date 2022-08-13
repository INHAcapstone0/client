import {combineReducers} from 'redux';
// import {persistReducer} from 'redux-persist';
import userSlice from '../slices/User';
import orderSlice from '../slices/Order';
import errorSlice from '../slices/Error';

//action: state를 바꾸는 행위
//dispatch: 그 액션을 실행하는 함수
//reducer: 액션이 실제로 실행되면 state를 바꾸는 로직
// const persistConfig = {
//   key: 'root',
//   storage,
// };

const rootReducer = combineReducers({
  user: userSlice.reducer,
  order: orderSlice.reducer,
  error: errorSlice.reducer,
});
// const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
