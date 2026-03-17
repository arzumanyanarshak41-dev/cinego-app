import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabaseUrl } from "../../Supabase/supabase";

export const moviesFetch = createAsyncThunk("movies/moviesFetch",
    async (page) => {
        const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=1eda474d8a43894c253cbeb02bd72ac4&language=en-EN&page=${page}`)
        const data = await res.json()
        return {
            movies: data.results,
        };
    }
)