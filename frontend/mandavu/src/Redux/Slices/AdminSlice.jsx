import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    access_token: null,
    refresh_token: null,
}



const adminSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{
        AdminLoginSlice:(state,action) => {
            state.access_token = action.payload.access_token
            state.refresh_token = action.payload.refresh_token
        },
        AdminLogoutSlice:(state) =>{
            state.access_token = null
            state.refresh_token = null
        },
        
    }
})


export const {AdminLoginSlice,AdminLogoutSlice} = adminSlice.actions
export default adminSlice.reducer;
