// src/features/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk for admin login
export const loginAdmin = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
    try {
        const response = await axios.post('/api/admin/login', credentials);
        return response.data;  // Return the response data (admin and token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);  // Handle errors
    }
});

const initialState = {
    admin: JSON.parse(localStorage.getItem('admin')) || null,  // Load admin from localStorage if available
    token: localStorage.getItem('token') || null,  // Load token from localStorage if available
    loading: false,
    error: null,
    isAuthenticated: localStorage.getItem('token') !== null,  // Check if token exists
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutAdmin: (state) => {
            state.admin = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('admin');
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload.admin;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                // Save admin and token to localStorage for persistence
                localStorage.setItem('admin', JSON.stringify(action.payload.admin));
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('isAuthenticated', 'true');
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { logoutAdmin } = authSlice.actions;
export default authSlice.reducer;
