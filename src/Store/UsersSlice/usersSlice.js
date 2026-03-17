import { createSlice } from "@reduxjs/toolkit";
import { usersFetch } from "./usersAPI";

const usersSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        loading: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(usersFetch.pending, (state) => {
                state.loading = true
            })
            .addCase(usersFetch.fulfilled, (state, { payload }) => {
                state.users = payload
                state.loading = false
            })
            .addCase(usersFetch.rejected, (state) => {
                state.loading = false
            })
    }
})

export const usersSelect = (state) => state.users
export const usersReducer = usersSlice.reducer