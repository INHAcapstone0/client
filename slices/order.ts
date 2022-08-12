/* eslint-disable @typescript-eslint/no-unused-vars */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Order {
  orderId: string;
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
  price: number;
  image: string;
  completedAt: string;
}
interface InitialState {
  orders: Order[]; //서버에서 오는 모든 오더들
  deliveries: Order[]; //수락한 오더
  completes: Order[]; //배달완료된 오더
}
const initialState: InitialState = {
  orders: [],
  deliveries: [],
  completes: [],
};
const orderSlice = createSlice({
  name: 'order',
  initialState,
  //동기 액션
  reducers: {
    //오더 데이터 받기
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    //배달한 오더 선택
    acceptOrder(state, action: PayloadAction<string>) {
      const index = state.orders.findIndex(v => v.orderId === action.payload);
      if (index > -1) {
        state.deliveries.push(state.orders[index]); //delivery에 추가
        state.orders.splice(index, 1); //opders에 제거
      }
    },
    //오더 거절
    rejectOrder(state, action: PayloadAction<string>) {
      const index = state.orders.findIndex(v => v.orderId === action.payload);
      if (index > -1) {
        state.orders.splice(index, 1); //opders에 제거
      }
      const delivery = state.deliveries.findIndex(
        v => v.orderId === action.payload,
      );
      if (delivery > -1) {
        state.deliveries.splice(delivery, 1); //delivery에 제거
      }
    },
    setCompletes(state, action) {
      state.completes = action.payload;
    },
  },
  extraReducers: builder => {}, //비동기 액션
});

export default orderSlice;
