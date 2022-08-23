import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  hasError: false,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError() {
      return {
        hasError: true,
      };
    },
    setFine() {
      return {
        hasError: false,
      };
    },
  },
});
export const errorActions = errorSlice.actions;
export default errorSlice;
// export const errorActions = errorSlice.actions;
// export default errorSlice.reducer;
