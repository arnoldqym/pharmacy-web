import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type {
  user,
  LoginCredentials,
  SignupCredentials,
  AuthState,
} from "../types/index.dt";

const API_URL =
  import.meta.env.VITE_BASE_API_URL || "http://localhost:8000/api";

// --- THUNKS ---

export const loginUser = createAsyncThunk<
  user,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    return response.data.user;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const signupUser = createAsyncThunk<
  user,
  SignupCredentials,
  { rejectValue: string }
>("auth/signupUser", async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      name,
      email,
      password,
      password_confirmation: password,
    });
    localStorage.setItem("token", response.data.token);
    return response.data.user;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Signup failed");
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      // If there's no token, just resolve immediately
      if (!token) return;

      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error: any) {
      // We log the error but don't stop the logout flow
      console.error(
        "Server-side logout failed:",
        error.response?.data?.message,
      );
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    } finally {
      // ALWAYS clear local storage, even if the API call fails
      localStorage.removeItem("token");
    }
  },
);

// --- SLICE ---
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous logout (optional, but good for force logging out)
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Login Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // 2. Signup Cases
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      })

      // 3. Logout Cases (This was missing!)
      .addCase(logoutUser.fulfilled, (state) => {
        localStorage.removeItem("token");
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Even if server fails (rejected), we still clear local state
      .addCase(logoutUser.rejected, (state) => {
        localStorage.removeItem("token");
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
