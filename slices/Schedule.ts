import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  groupName: '',
  startAt: '',
  endAt: '',
  participantsId: [],
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setGroupName(state, action) {
      return {
        ...initialState,
        groupName: action.payload.groupName,
      };
    },
    setDate(state, action) {
      return {
        ...state,
        startAt: action.payload.startAt,
        endAt: action.payload.endAt,
        participantsId: action.payload.participantsId,
      };
    },
    setParticipants(state, action) {
      return {
        ...state,
        participantsId: action.payload.participantsId,
      };
    },
  },
});

export const scheduleAction = scheduleSlice.actions;
export default scheduleSlice;
