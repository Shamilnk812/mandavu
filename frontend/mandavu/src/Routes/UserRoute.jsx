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
// import ResetPasswordConfirm from "../Pages/User/ResetPasswordConfirm";

export default function UserRoute() {
    return(
        <ChatProvider>
        <Routes>
            <Route element={<UserLogoutAuth  allowedRole="user" />}>
                <Route path="/signup" element={ <SignUp/>}/>
                <Route path="/login" element={<Login/>} />
                <Route path="/otp" element={<OtpVerification/>} />
                <Route path="/reset-password-request" element={<ResetPasswordRequest/>} />
                <Route path="/set-new-passwod" element={<UserSetNewPassword/>} />
            </Route>
             

            <Route element={<UserLoginAuth allowedRole="user"/>}>
                <Route path="/home" element={  <Home/>  } />
                <Route path="/profile" element={  <Profile/> } />
                <Route path="/profile2" element={  <UserProfile/> } />
                <Route path="/contact-us" element={  <ContactUs/> } />
                <Route path="/show-booking-details" element={  <ShowBookingDetails/> } />
                <Route path="/view-booking-details/:bookingId" element={  <ShowSingleBookingDetails/> } />
                <Route path="/payment-success" element={  <PaymentSuccess/> } />
                <Route path="/payment-cancelled" element={  <PaymentCanclled/> } />
                <Route path="/show-all-venues" element={  <ShowAllVenues/> } />
                <Route path="/show-single-venue/:venueId" element={  <ShowSingleVenueDetails/> } />
                <Route path="/venue-booking/:venueId" element={  <VenueBooking/> } />
                <Route path="/venue-booking-step1/:venueId" element={  <VenueBookingStep1/> } />
                <Route path="/venue-booking-step2/:venueId" element={  <VenueBookingStep2/> } />
                <Route path="/view-slot/:venueId" element={  <ViewSlote/> } />
                <Route path="/chat" element={  <UserChat/> } />
            </Route> 
            
            
        </Routes>
        </ChatProvider>



        // <ChatProvider>
        // <Routes>
        //     <Route path="/signup" element={<UserLogoutAuth allowedRole="user"> <SignUp/> </UserLogoutAuth> }/>
        //     <Route path="/login" element={ <UserLogoutAuth allowedRole="user"> <Login/> </UserLogoutAuth>} />
        //     <Route path="/otp" element={<UserLogoutAuth allowedRole="user"><OtpVerification/> </UserLogoutAuth>} />
        //     <Route path="/reset-password-request" element={<UserLogoutAuth allowedRole="user"><ResetPasswordRequest/> </UserLogoutAuth>} />
        //     <Route path="/set-new-passwod" element={<UserLogoutAuth allowedRole="user"><UserSetNewPassword/> </UserLogoutAuth>} />

             
        //     <Route path="/home" element={<UserLoginAuth  allowedRole="user">  <Home/>  </UserLoginAuth>} />
        //     <Route path="/profile" element={ <UserLoginAuth allowedRole="user"> <Profile/> </UserLoginAuth>} />
        //     <Route path="/profile2" element={ <UserLoginAuth allowedRole="user"> <UserProfile/> </UserLoginAuth>} />
        //     <Route path="/contact-us" element={ <UserLoginAuth allowedRole="user"> <ContactUs/> </UserLoginAuth>} />
        //     <Route path="/show-booking-details" element={ <UserLoginAuth allowedRole="user"> <ShowBookingDetails/> </UserLoginAuth>} />
        //     <Route path="/view-booking-details/:bookingId" element={ <UserLoginAuth allowedRole="user"> <ShowSingleBookingDetails/> </UserLoginAuth>} />
        //     <Route path="/payment-success" element={ <UserLoginAuth allowedRole="user"> <PaymentSuccess/> </UserLoginAuth>} />
        //     <Route path="/payment-cancelled" element={ <UserLoginAuth allowedRole="user"> <PaymentCanclled/> </UserLoginAuth>} />
        //     <Route path="/show-all-venues" element={ <UserLoginAuth allowedRole="user"> <ShowAllVenues/> </UserLoginAuth>} />
        //     <Route path="/show-single-venue/:venueId" element={ <UserLoginAuth allowedRole="user"> <ShowSingleVenueDetails/> </UserLoginAuth>} />
        //     <Route path="/venue-booking/:venueId" element={ <UserLoginAuth allowedRole="user"> <VenueBooking/> </UserLoginAuth>} />
        //     <Route path="/venue-booking-step1/:venueId" element={ <UserLoginAuth allowedRole="user"> <VenueBookingStep1/> </UserLoginAuth>} />
        //     <Route path="/venue-booking-step2/:venueId" element={ <UserLoginAuth allowedRole="user"> <VenueBookingStep2/> </UserLoginAuth>} />
        //     <Route path="/view-slot/:venueId" element={ <UserLoginAuth allowedRole="user"> <ViewSlote/> </UserLoginAuth>} />
        //     <Route path="/chat" element={ <UserLoginAuth allowedRole="user"> <UserChat/> </UserLoginAuth>} />

            
            
        // </Routes>
        // </ChatProvider>
    )
}