import { configureStore } from '@reduxjs/toolkit'
import  urlReducer  from './stores/urlSlice.js';
import  authReducer  from './stores/authSlice.js'
const store = configureStore({
  reducer : {
    auth : authReducer,
    url : urlReducer,
  }
})

export default store;