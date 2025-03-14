import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const storedUser = localStorage.getItem("localStorageUser");
const user = storedUser ? JSON.parse(storedUser) : null;


const initialState = {
    user,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// Register User
export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
    try {
        const response = await authService.register(userData);
        if (response.data) {
            localStorage.setItem("localStorageUser", JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        const message = 
            (error.response && error.response.data && error.response.data.message) || 
            error.message || 
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Login User
export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
    try {
        const response = await authService.login(userData);
        return response; // Ensure the token is included
    } catch (error) {
        const message = 
            (error.response && error.response.data && error.response.data.message) || 
            error.message || 
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// Logout User
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
        await authService.logout();
        localStorage.removeItem("localStorageUser");
    } catch (error) {
        return thunkAPI.rejectWithValue("Logout failed");
    }
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            // Register cases
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

            // Login cases
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

            // Logout case
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isSuccess = false;
                state.isError = false;
                state.message = "";
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
