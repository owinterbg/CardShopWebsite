import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  username: string;
  email: string;
  bio?: string;
  avatar_url?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
  isLoggedIn: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
      state.isLoggedIn = true;
      localStorage.setItem('token', action.payload.token);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('token');
    }
  }
});

export const { loginSuccess, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
