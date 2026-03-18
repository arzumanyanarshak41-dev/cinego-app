import { createSlice } from "@reduxjs/toolkit";
import { usersFetch } from "./usersAPI";

const usersSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        loading: false
    },
    reducers: {
        addToFavorites(state, { payload }) {
            const user = state.users.find(el => el.id == payload.id)

            if (!user) return

            if (!user.favorites) {
                user.favorites = []
            }

            if (user.favorites.includes(payload.movieId)) {
                user.favorites = user.favorites.filter(
                    id => id !== payload.movieId
                )
            } else {
                user.favorites.unshift(payload.movieId)
            }
        }
    },
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
export const { addToFavorites } = usersSlice.actions