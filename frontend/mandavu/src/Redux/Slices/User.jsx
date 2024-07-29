import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    user: null,
    access_token: null,
    refresh_token: null,
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        UserLogin:(state, action) =>{
            state.user = action.payload.user;
            state.access_token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token;
        },
        UserLogout:(state) =>{
            state.user =  null;
            state.access_token = null;
            state.refresh_token = null;
        }
    }
})

export const {UserLogin,UserLogout} = userSlice.actions;
export default userSlice.reducer;