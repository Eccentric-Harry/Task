// src/features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        admin: null,
        token: null,
        isAuthenticated: false,
    },
    reducers: {
        login: (state, action) => {
            state.admin = action.payload.admin;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.admin = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
