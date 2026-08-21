import { createSlice, createAsyncThunk  } from "@reduxjs/toolkit";
import axios from 'axios'
const API_URL = import.meta.env.VITE_BACKEND_URI || import.meta.env.BACKEND_URI || 'http://localhost:5050';

export const fetchUrlData = createAsyncThunk(
  'url/fetchUrl',
  async (_, {rejectWithValue}) => {
    try {
      const res = await axios.get(`${API_URL}/api/urls`, {withCredentials : true})
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
);

export const createShortUrl = createAsyncThunk(
  'url/createShortUrl',
  async({originalUrl, expiresAt}, {dispatch, rejectWithValue}) => {
    try {
      const res = await axios.post(`${API_URL}/api/urls`,{originalUrl, expiresAt}, {withCredentials : true})
      dispatch(fetchUrlData())
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
);

export const deleteUrl = createAsyncThunk(
  'url/delete',
  async(id, {dispatch, rejectWithValue}) => {
    try {
      await axios.delete(`${API_URL}/api/urls/${id}`, {
        withCredentials : true
      })
      dispatch(fetchUrlData())
      return id;
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUrl = createAsyncThunk(
  'url/update',
  async ({ id, originalUrl, expiresAt }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/api/urls/${id}`, { originalUrl, expiresAt }, { withCredentials: true })
      dispatch(fetchUrlData())
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const urlSlice = createSlice({
  name : 'urlHandler',
  initialState : {
    urls : [],
    overview : {totalUrls : 0, activeUrls : 0, expiredUrls : 0, totalVisitors : 0},
    insights : [],
    loading : false,
    error : null,
  },
  reducers : {},
  extraReducers : (builder) => {
    builder
    .addCase(fetchUrlData.pending, (state, action)=> {
      state.loading = !action.meta.arg?.silent;
      state.error = null;
    })
    .addCase(fetchUrlData.fulfilled, (state, action)=> {
      if (!action.meta.arg?.silent) state.loading = false;
      state.urls = action.payload.data;
      state.overview = action.payload.overview;
      state.insights = action.payload.insights;
    })
    .addCase(fetchUrlData.rejected, (state, action)=> {
      if (!action.meta.arg?.silent) state.loading = false;
      state.error = action.payload;
    })
    .addCase(createShortUrl.pending, (state)=> {
      state.loading = true;
      state.error = null;
    })
    .addCase(createShortUrl.fulfilled, (state)=> {
      state.loading = false;
    })
    .addCase(createShortUrl.rejected, (state, action)=> {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(deleteUrl.pending, (state)=> {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteUrl.fulfilled, (state)=> {
      state.loading = false;
    })
    .addCase(deleteUrl.rejected, (state, action)=> {
      state.loading = false;
      state.error = action.payload;
    })
  }
})

export default urlSlice.reducer;