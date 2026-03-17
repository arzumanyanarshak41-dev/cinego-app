import { configureStore } from "@reduxjs/toolkit";
import { usersReducer } from "./UsersSlice/usersSlice";
import { moviesReducer } from "./MoviesSlice/moviesSlice";

export const store = configureStore({
    reducer: {
        users: usersReducer,
        movies: moviesReducer
    }
})