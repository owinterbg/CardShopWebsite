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
  isLoading: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
  isLoggedIn: !!localStorage.getItem('token'),
  isLoading: true,  // Add this line
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
      state.isLoggedIn = true;
      localStorage.setItem('token', action.payload.token);
      state.isLoading = false; // Stop loading when login succeeds
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isLoading = false;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.isLoading = false;
      localStorage.removeItem('token');
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      state.isLoading = false;
      localStorage.removeItem('token');
    }
  }
});

export const { loginSuccess, setUser, clearUser, logout } = authSlice.actions;
export default authSlice.reducer;
