/* eslint-disable @typescript-eslint/no-unused-vars */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  accessToken: '',
};
const schduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchdule(state, action) {
      state.name = action.payload.name;
    },
  },
  extraReducers: builder => {}, //비동기액션
});

export default schduleSlice;
