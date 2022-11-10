import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  finNum: '',
  startAt: '',
  endAt: '',
  name: '',
};

const accountSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setAccount(state, action) {
      return {
        finNum: action.payload.finNum,
        startAt: action.payload.start,
        endAt: action.payload.end,
        name: action.payload.name,
      };
    },
  },
});

export const accountAction = accountSlice.actions;
export default accountSlice;
