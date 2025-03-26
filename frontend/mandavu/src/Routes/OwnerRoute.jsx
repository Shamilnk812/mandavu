import { Routes, Route } from "react-router-dom";
import SignUp from "../Pages/Owner/SignUp_Owner";
import LogIn from "../Pages/Owner/LogIn_Owner";
import OtpVerification from "../Pages/Owner/Otp_Owner";
import Dashboard_Owner from "../Pages/Owner/Dashboard";
import OwnerDetails from "../Pages/Owner/OwnerDetails";
import VenueManagement from "../Pages/Owner/Venue_Management";
import SuccessRegisterPage from "../Pages/Owner/SuccessRegister";
import OwnerLogoutAuth from "../Utils/AuthCheck/OwnerLogoutAuth";
import OwnerLoginAuth from "../Utils/AuthCheck/OwnerLoginAuth";
// import BannerManagement from "../Pages/Owner/BannerManagement";
import EventsManagement from "../Pages/Owner/EventsManagement";
import BannerManage from "../Pages/Owner/BannerManage";
import BookingManagement from "../Pages/Owner/BookingManagement";
import RegisterationStep1 from "../Pages/Owner/RegisterStep1";
import RegisterationStep2 from "../Pages/Owner/RegisterStep2";
import RegisterationStep3 from "../Pages/Owner/RegisterStep3";
import RegisterationStep4 from "../Pages/Owner/RegisterStep4";
import VenueApprovalWaiting from "../Pages/Owner/VenueApprovalWaiting";
import FacilitesManagement from "../Pages/Owner/FacilitiesManagement";
import VenuePhotosManagement from "../Pages/Owner/VenuePhotosManagement";
import OwnerDetails2 from "../Pages/Owner/Profile2";
import OwnerChat from "../Pages/Owner/OwnerChat";
import OwnerResetPasswordRequest from "../Pages/Owner/OwnerResetPasswordRequest";
import OwnerSetNewPassword from "../Pages/Owner/OwnerSetNewPassword";
import OwnerViewSingleBookingDetails from "../Pages/Owner/OwnerViewSingleBookingDetails";
import BookingPackages from "../Pages/Owner/BookingPackages";
import ManageTimeSlotesForPackages from "../Pages/Owner/ManageTimeSlotes";
import { useDispatch } from "react-redux";

export default function OwnerRoute() {
  

 
    return(
        <>  
        <Routes>

            <Route element={<OwnerLogoutAuth allowedRole='owner'/>}>
                <Route path="/signup" element={ <SignUp/> } />
                <Route path="/login" element={ <LogIn/> } />
                <Route path="/otp" element={ <OtpVerification/> } />
                <Route path="/reset-password-request" element={ <OwnerResetPasswordRequest/> } />
                <Route path="/set-new-passwod" element={ <OwnerSetNewPassword/> } />
                
                <Route path="/register-step-1" element={ <RegisterationStep1/> } />
                <Route path="/register-step-2" element={ <RegisterationStep2/> } />
                <Route path="/register-step-3" element={ <RegisterationStep3/> } />
                <Route path="/register-step-4" element={ <RegisterationStep4/> } />
                <Route path="/venue_approval_waiting" element={ <VenueApprovalWaiting/> } />

            </Route>

        

            <Route element={<OwnerLoginAuth allowedRole='owner'/> }>
                <Route path="/dashboard" element={ <Dashboard_Owner/>} />
                <Route path="/details" element={ <OwnerDetails/>} />
                <Route path="/venue-management" element={ <VenueManagement/>} />
                <Route path="/success-register" element={ <SuccessRegisterPage/>} />
                <Route path="/banner-management" element={ <VenuePhotosManagement/>} />
                <Route path="/events-management" element={ <EventsManagement/>} />
                <Route path="/facilities-management" element={ <FacilitesManagement/>} />
                <Route path="/booking-packages" element={ <BookingPackages/>} />
                <Route path="/manage-time-slotes/:id" element={ <ManageTimeSlotesForPackages/>} />
                <Route path="/booking-management" element={ <BookingManagement/>} />
                <Route path="/view-single-booking-details/:id" element={ <OwnerViewSingleBookingDetails/>} />
                <Route path="/chat" element={ <OwnerChat/>} />
                <Route path="/details2" element={ <OwnerDetails2/>}/>
            </Route>


            
        </Routes>


      
        </>
    )
}