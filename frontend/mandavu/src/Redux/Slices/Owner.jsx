import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    owner : null,
    access_token: null,
    refresh_token: null,
}

const ownerSlice = createSlice({
    name:'owner',
    initialState,
    reducers:{
        OwnerLogin:(state,action) => {
            state.owner = action.payload.owner;
            state.access_token = action.payload.access_token
            state.refresh_token = action.payload.refresh_token
        },
        OwnerLogout:(state) =>{
            state.owner = null
            state.access_token = null
            state.refresh_token = null
        }
    }
})


export const {OwnerLogin,OwnerLogout} = ownerSlice.actions
export default ownerSlice.reducer;