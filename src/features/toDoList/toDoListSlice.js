import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import listService from "./toDoListService";

const storedUser = localStorage.getItem("localStorageUser");
const user = storedUser ? JSON.parse(storedUser) : null;

const initialState = {
    user,
    lists: [],
    completedTasks: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// Create To-Do List
export const createToDoList = createAsyncThunk(
    "toDo/create",
    async ({ userData, token }, thunkAPI) => {
        try {
            return await listService.createList(userData, token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Get To-Do List
export const getList = createAsyncThunk(
    "toDo/list",
    async (token, thunkAPI) => {
        try {
            return await listService.getList(token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete To-Do List
export const deleteToDoList = createAsyncThunk(
    "toDo/delete",
    async ({ listId, token }, thunkAPI) => {
        try {
            return await listService.deleteList(listId, token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Mark Task as Completed
export const markAsDone = createAsyncThunk(
    "toDo/markAsDone",
    async ({ id, token }, thunkAPI) => {
        try {
            return await listService.markAsCompleted(id, token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Get Completed Tasks
export const getCompletedTasks = createAsyncThunk(
    "toDo/completedTasks",
    async (token, thunkAPI) => {
        try {
            return await listService.getCompletedTasks(token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const toDoSlice = createSlice({
    name: "toDo",
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
            .addCase(createToDoList.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createToDoList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.lists.push(action.payload);
            })
            .addCase(createToDoList.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            .addCase(getList.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.lists = action.payload;
            })
            .addCase(getList.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            .addCase(deleteToDoList.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteToDoList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.lists = state.lists.filter((list) => list._id !== action.meta.arg.listId);
            })
            .addCase(deleteToDoList.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            .addCase(markAsDone.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(markAsDone.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const taskIndex = state.lists.findIndex((task) => task._id === action.payload._id);
                if (taskIndex >= 0) {
                    state.lists[taskIndex] = action.payload;
                }
            })
            .addCase(markAsDone.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            .addCase(getCompletedTasks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCompletedTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.completedTasks = action.payload;
            })
            .addCase(getCompletedTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = toDoSlice.actions;
export default toDoSlice.reducer;
