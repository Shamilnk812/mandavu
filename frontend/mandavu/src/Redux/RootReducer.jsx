import { combineReducers } from "@reduxjs/toolkit";
import User from "./Slices/User";
import Owner from "./Slices/Owner";

const rootReducer = combineReducers({
    user: User,
    owner: Owner
})

export default rootReducer;