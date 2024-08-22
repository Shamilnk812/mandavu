import { combineReducers } from "@reduxjs/toolkit";
import user from "./Slices/User";
import owner from "./Slices/Owner";
import AdminSlice from "./Slices/AdminSlice";

const rootReducer = combineReducers({
    user: user,
    owner: owner,
    admin: AdminSlice
    
})

export default rootReducer;