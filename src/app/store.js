import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import toDoListReducer from "../features/toDoList/toDoListSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        todo: toDoListReducer,
    },
});
