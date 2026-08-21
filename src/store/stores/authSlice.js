import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URI || import.meta.env.BACKEND_URI || 'http://localhost:5050';

export const loginUser = createAsyncThunk(
  'auth/login',
  async({email, password}, {rejectWithValue}) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {email, password}, { withCredentials : true})
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const checkAuthStatus  = createAsyncThunk(
  'auth/checkStatus',
  async(_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true })
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async(_, {rejectWithValue}) => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true })
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ name, email, mobile, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, { name, email, phoneNo: mobile, password })
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const authSlice = createSlice({
  name : 'auth',
  initialState : {
    name : null, isAuthenticated : false, isChecking: true, error: null
  },
  reducers : {
    clearAuthError : (state) => { state.error = null;}
  },
  extraReducers : (builder) => {
    builder
    .addCase(loginUser.pending, (state) => {state.error = null})
    .addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    })
    .addCase(loginUser.rejected, (state, action) => { 
      state.error = action.payload
    })
    .addCase(signupUser.rejected, (state, action) => {
      state.error = action.payload
    })

    .addCase(checkAuthStatus.pending, (state) => { state.isChecking = true })
    .addCase(checkAuthStatus.fulfilled, (state, action) => { 
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isChecking = false;
    })
    .addCase(checkAuthStatus.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isChecking = false;
    })

    .addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    })
  }
})

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;