import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    access_token: null,
    refresh_token: null,
    role: null,
}



const adminSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{
        AdminLoginSlice:(state,action) => {
            state.access_token = action.payload.access_token
            state.refresh_token = action.payload.refresh_token
            state.role = action.payload.role
        },
        AdminLogoutSlice:(state) =>{
            state.access_token = null
            state.refresh_token = null
            state.role = null
        },
        
    }
})


export const {AdminLoginSlice,AdminLogoutSlice} = adminSlice.actions
export default adminSlice.reducer;
