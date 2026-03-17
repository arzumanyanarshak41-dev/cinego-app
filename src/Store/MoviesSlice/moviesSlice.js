import { createSlice } from "@reduxjs/toolkit";
import { moviesFetch } from "./moviesAPI";

const moviesSlice = createSlice({
    name: "movies",
    initialState: {
        movies: [],
        loading: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(moviesFetch.pending, (state) => {
            state.loading = true
        })
            .addCase(moviesFetch.fulfilled, (state, action) => {
                state.movies = action.payload.movies
                state.loading = false
            })
            .addCase(moviesFetch.rejected, (state) => {
                state.loading = false
            })
    }
})

export const moviesSelect = (state) => state.movies
export const moviesReducer = moviesSlice.reducer