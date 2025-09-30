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
import VenueBookingStep1 from "../Pages/User/VenueBookingStep1";
import VenueBookingStep2 from "../Pages/User/VenueBookingStep2";
import UserLocationCheck from "../Utils/SetUserLocation/SetUserLocationCheck";
import ContactUs from "../Pages/User/ContactUsPage";
import PaymentStatus from "../Pages/User/PaymentStatus";
// import ResetPasswordConfirm from "../Pages/User/ResetPasswordConfirm";

export default function UserRoute() {
    return (
        <ChatProvider>
            <Routes>
                <Route element={<UserLogoutAuth allowedRole="user" />}>
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/otp" element={<OtpVerification />} />
                    <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
                    <Route path="/set-new-passwod" element={<UserSetNewPassword />} />
                </Route>


                <Route element={<UserLoginAuth allowedRole="user" />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile2" element={<UserProfile />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                    <Route path="/show-booking-details" element={<ShowBookingDetails />} />
                    <Route path="/view-booking-details/:bookingId" element={<ShowSingleBookingDetails />} />
                    <Route path="/payment-status" element={<PaymentStatus />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-cancelled" element={<PaymentCanclled />} />
                    <Route path="/show-all-venues" element={<ShowAllVenues />} />
                    <Route path="/show-single-venue/:venueId" element={<ShowSingleVenueDetails />} />
                    <Route path="/venue-booking/:venueId" element={<VenueBooking />} />
                    <Route path="/venue-booking-step1/:venueId" element={<VenueBookingStep1 />} />
                    <Route path="/venue-booking-step2/:venueId" element={<VenueBookingStep2 />} />
                    <Route path="/view-slot/:venueId" element={<ViewSlote />} />
                    <Route path="/chat" element={<UserChat />} />
                </Route>


            </Routes>
        </ChatProvider>

    )
}