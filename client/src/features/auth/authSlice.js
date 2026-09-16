import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('rentride_token') || null;
const user = JSON.parse(localStorage.getItem('rentride_user') || 'null');

const initialState = {
  user,
  token,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      if (action.payload.token) {
        localStorage.setItem('rentride_token', action.payload.token);
      }
      localStorage.setItem('rentride_user', JSON.stringify(action.payload.user));
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('rentride_user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('rentride_token');
      localStorage.removeItem('rentride_user');
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const { setLoading, loginSuccess, updateUserProfile, logout, setError, clearError } = authSlice.actions;
export default authSlice.reducer;
