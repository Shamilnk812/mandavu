import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    user: null,
    access_token: null,
    refresh_token: null,
    selectedEvent: null,
    selectedPackage: null,
    addressAndEventDetails: null,
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
        },
        setBookingDetails:(state, action)=> {
            if (action.payload.addressAndEventDetails) {
                state.addressAndEventDetails = action.payload.addressAndEventDetails;
            }
            if (action.payload.selectedEvent) {
                state.selectedEvent = action.payload.selectedEvent;
            }
            if (action.payload.selectedPackage) {
                state.selectedPackage = action.payload.selectedPackage;
            }
        },
        clearBookingDetails:(state) => {
            state.selectedEvent = null;
            state.selectedPackage = null;
            state.addressAndEventDetails = null;
        }
    }
})

export const {UserLogin,UserLogout,setBookingDetails,clearBookingDetails} = userSlice.actions;
export default userSlice.reducer;