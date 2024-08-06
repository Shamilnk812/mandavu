import { Routes, Route } from "react-router-dom";
import SignUp from "../Pages/User/SignUp";
import Login from "../Pages/User/Login";
import HomePage from "../Pages/User/Home_Page";
import OtpVerification from "../Pages/User/Otp_Verify";
import Profile from "../Pages/User/Profile";
import Home from "../Pages/User/Home";
import UserLoginAuth from "../Utils/AuthCheck/UserLoginAuth";
import UserLogoutAuth from "../Utils/AuthCheck/UserLogoutAuth";
import ShowAllVenues from "../Pages/User/ShowAllVenues";
import ShowSingleVenueDetails from "../Pages/User/ShowSingleVenue";
import VenueBooking from "../Pages/User/VenueBooking";
import ViewSlote from "../Pages/User/ViewSlote";

export default function UserRoute() {
    return(
        <Routes>
            <Route path="/signup" element={<UserLogoutAuth> <SignUp/> </UserLogoutAuth> }/>
            <Route path="/login" element={ <UserLogoutAuth> <Login/> </UserLogoutAuth>} />
            <Route path="/home" element={<UserLoginAuth> <Home/> </UserLoginAuth>} />
            <Route path="/otp" element={<UserLogoutAuth><OtpVerification/> </UserLogoutAuth>} />
            <Route path="/profile" element={ <UserLoginAuth> <Profile/> </UserLoginAuth>} />
            <Route path="/show-all-venues" element={ <UserLoginAuth> <ShowAllVenues/> </UserLoginAuth>} />
            <Route path="/show-single-venue/:venueId" element={ <UserLoginAuth> <ShowSingleVenueDetails/> </UserLoginAuth>} />
            <Route path="/venue-booking/:venueId" element={ <UserLoginAuth> <VenueBooking/> </UserLoginAuth>} />
            <Route path="/view-slote/:venueId" element={ <UserLoginAuth> <ViewSlote/> </UserLoginAuth>} />

            
            
        </Routes>
    )
}