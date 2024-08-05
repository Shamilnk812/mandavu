import {createSlice} from '@reduxjs/toolkit'
import { act } from 'react';

const initialState = {
    owner : null,
    access_token: null,
    refresh_token: null,
    venueId: null,
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
            state.venueId = null
        },
        SetVenueId: (state, action) => { 
            state.venueId = action.payload;
        },
    }
})


export const {OwnerLogin,OwnerLogout,SetVenueId} = ownerSlice.actions
export default ownerSlice.reducer;