/* eslint-disable @typescript-eslint/no-unused-vars */
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  user_id: '',
  accessToken: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.name = action.payload.name;
      state.user_id = action.payload.user_id;
      state.accessToken = action.payload.accessToken;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    signout() {
      return initialState;
    },
  },
  extraReducers: builder => {}, //비동기액션
});

export const userActions = userSlice.actions;
export default userSlice;
