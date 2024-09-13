import { Routes, Route } from "react-router-dom";
import SignUp from "../Pages/User/SignUp";
import Login from "../Pages/User/Login";
// import HomePage from "../Pages/User/Home_Page";
import OtpVerification from "../Pages/User/Otp_Verify";
import Profile from "../Pages/User/Profile";
import Home from "../Pages/User/Home";
import UserLoginAuth from "../Utils/AuthCheck/UserLoginAuth";
import UserLogoutAuth from "../Utils/AuthCheck/UserLogoutAuth";
import ShowAllVenues from "../Pages/User/ShowAllVenues";
import ShowSingleVenueDetails from "../Pages/User/ShowSingleVenue";
import VenueBooking from "../Pages/User/VenueBooking";
import ViewSlote from "../Pages/User/ViewSlote";
import ShowBookingDetails from "../Pages/User/ShowBookingDetails";
import PaymentSuccess from "../Pages/User/PaymentSuccess";
import PaymentCanclled from "../Pages/User/PaymentCanclled";
import ShowSingleBookingDetails from "../Pages/User/ViewSingleBookingDetails";
import UserProfile from "../Pages/User/UserProfile";
import UserChat from "../Pages/User/UserChat";
import ResetPasswordRequest from "../Pages/User/ResetPasswordRequest";
import UserSetNewPassword from "../Pages/User/UserSetNewPassword";
import { ChatProvider } from "../Utils/ChatContext/CreateChat";
// import ResetPasswordConfirm from "../Pages/User/ResetPasswordConfirm";

export default function UserRoute() {
    return(
        <ChatProvider>
        <Routes>
            <Route path="/signup" element={<UserLogoutAuth> <SignUp/> </UserLogoutAuth> }/>
            <Route path="/login" element={ <UserLogoutAuth> <Login/> </UserLogoutAuth>} />
            <Route path="/home" element={<UserLoginAuth> <Home/> </UserLoginAuth>} />
            <Route path="/otp" element={<UserLogoutAuth><OtpVerification/> </UserLogoutAuth>} />
            <Route path="/reset-password-request" element={<UserLogoutAuth><ResetPasswordRequest/> </UserLogoutAuth>} />
            <Route path="/set-new-passwod" element={<UserLogoutAuth><UserSetNewPassword/> </UserLogoutAuth>} />
            <Route path="/profile" element={ <UserLoginAuth> <Profile/> </UserLoginAuth>} />
            <Route path="/profile2" element={ <UserLoginAuth> <UserProfile/> </UserLoginAuth>} />
            <Route path="/show-booking-details" element={ <UserLoginAuth> <ShowBookingDetails/> </UserLoginAuth>} />
            <Route path="/view-booking-details/:bookingId" element={ <UserLoginAuth> <ShowSingleBookingDetails/> </UserLoginAuth>} />
            <Route path="/payment-success" element={ <UserLoginAuth> <PaymentSuccess/> </UserLoginAuth>} />
            <Route path="/payment-cancelled" element={ <UserLoginAuth> <PaymentCanclled/> </UserLoginAuth>} />
            <Route path="/show-all-venues" element={ <UserLoginAuth> <ShowAllVenues/> </UserLoginAuth>} />
            <Route path="/show-single-venue/:venueId" element={ <UserLoginAuth> <ShowSingleVenueDetails/> </UserLoginAuth>} />
            <Route path="/venue-booking/:venueId" element={ <UserLoginAuth> <VenueBooking/> </UserLoginAuth>} />
            <Route path="/view-slot/:venueId" element={ <UserLoginAuth> <ViewSlote/> </UserLoginAuth>} />
            <Route path="/chat" element={ <UserLoginAuth> <UserChat/> </UserLoginAuth>} />

            
            
        </Routes>
        </ChatProvider>
    )
}