import {combineReducers} from 'redux';

import userSlice from '../slices/user';
import orderSlice from '../slices/order';

//action: state를 바꾸는 행위
//dispatch: 그 액션을 실행하는 함수
//reducer: 액션이 실제로 실행되면 state를 바꾸는 로직

const rootReducer = combineReducers({
  user: userSlice.reducer,
  order: orderSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
