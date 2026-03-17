import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabaseHeaders, supabaseUrl } from "../../Supabase/supabase";

export const usersFetch = createAsyncThunk("users.usersFetch",
    async () => {
        const res = await fetch(`${supabaseUrl}/rest/v1/users?select=*`, {
            headers: supabaseHeaders
        })
        const data = await res.json()
        return data
    }
)