import { createSlice } from '@reduxjs/toolkit';

const homeSlice = createSlice({
  name: 'home',
  initialState: { greeting: 'Welcome to CardShop!' },
  reducers: {}
});

export default homeSlice.reducer;