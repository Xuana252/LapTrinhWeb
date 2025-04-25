// sessionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    customer: null,
    isAuthenticated: false,
  },
  reducers: {
    setSession: (state, action) => {
      state.customer = action.payload.customer;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    clearSession: (state) => {
      state.customer = null;
      state.isAuthenticated = false;
    },
    updateSession: (state,action) => {
      state.customer = action.payload.customer;
    }
  },
});

export const { setSession, clearSession, updateSession } = sessionSlice.actions;
export default sessionSlice.reducer;
