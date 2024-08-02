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


export default function OwnerRoute() {
    return(
        <>  
        <Routes>
            <Route path="/signup" element={<OwnerLogoutAuth> <SignUp/> </OwnerLogoutAuth>} />
            <Route path="/login" element={<OwnerLogoutAuth> <LogIn/> </OwnerLogoutAuth>} />
            <Route path="/otp" element={<OwnerLogoutAuth> <OtpVerification/> </OwnerLogoutAuth>} />
            <Route path="/dashboard" element={<OwnerLoginAuth> <Dashboard_Owner/> </OwnerLoginAuth>} />
            <Route path="/details" element={<OwnerLoginAuth> <OwnerDetails/> </OwnerLoginAuth>} />
            <Route path="/venue-management" element={<OwnerLoginAuth> <VenueManagement/> </OwnerLoginAuth>} />
            <Route path="/success-register" element={<OwnerLoginAuth> <SuccessRegisterPage/> </OwnerLoginAuth>} />
        </Routes>
        </>
    )
}