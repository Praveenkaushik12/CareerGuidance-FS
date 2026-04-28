import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
axios.defaults.withCredentials = true;

const initialState = {
    user_id: null,
    name: null,
    email: null,
    role: null,
    is_exist: null,
    counsellor_approved: false,
    isLoading: true,
    school: null,
    stream: null,
    age: null,
    gender: null,
}

export const authenticate = createAsyncThunk('authenticate/getSessionData', async() => {
    try{
        const response = await axios.get("http://127.0.0.1:8000/getSessionData")
        return response.data
    } catch(error){
        throw error
    }
})

export const logout = createAsyncThunk('authenticate/deleteSessionData', async() => {
    try{
        const response = await axios.get("http://127.0.0.1:8000/deleteSessionData")
        return response.data
    } catch(error){
        throw error
    }
})

const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(authenticate.pending, (state) => {
                //console.log("authenticate pending")
            })
            .addCase(authenticate.fulfilled, (state, action) => {
                state.user_id = action.payload.user_id
                state.name = action.payload.name
                state.email = action.payload.email
                state.is_exist = action.payload.is_exist
                state.role = action.payload.role
                state.counsellor_approved = action.payload.counsellor_approved
                state.school = action.payload.school ?? null
                state.stream = action.payload.stream ?? null
                state.age    = action.payload.age    ?? null
                state.gender = action.payload.gender ?? null
            })
            .addCase(authenticate.rejected, (state, action) => {
                //console.log("authenticate rejected")
            })
            .addCase(logout.pending, (state) => {
                //console.log("logout pending")
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.user_id = null
                state.name = null
                state.email = null
                state.role = null
                state.is_exist = null
                state.counsellor_approved = false
                state.school = null
                state.stream = null
                state.age    = null
                state.gender = null
            })
            .addCase(logout.rejected, (state, action) => {
                //console.log("logout rejected")
            })
    }
})


export const { setLoading } = authenticationSlice.actions
export default authenticationSlice.reducer