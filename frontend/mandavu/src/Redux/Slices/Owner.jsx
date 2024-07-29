import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    owner : null,
}

const ownerSlice = createSlice({
    name:'owner',
    initialState,
    reducers:{
        OwnerLogin:(state,action) => {
            state.owner = action.payload.owner;
        },
        OwnerLogout:(state) =>{
            state.owner = null
        }
    }
})


export const {OwnerLogin,OwnerLogout} = ownerSlice.actions
export default ownerSlice.reducer;