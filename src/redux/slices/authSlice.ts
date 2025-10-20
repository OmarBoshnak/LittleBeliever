import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  error: string | null;
  isGuest: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isGuest: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set user when authenticated
    setUser: (state, action: PayloadAction<FirebaseAuthTypes.User>) => {
      state.user = action.payload;
      state.isGuest = false;
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error message
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Set guest mode
    setGuestMode: state => {
      state.isGuest = true;
      state.user = null;
    },

    // Clear auth state (logout)
    clearAuth: state => {
      state.user = null;
      state.isGuest = false;
      state.error = null;
      state.loading = false;
    },
  },
});

export const { setUser, setLoading, setError, setGuestMode, clearAuth } =
  authSlice.actions;
export default authSlice.reducer;
