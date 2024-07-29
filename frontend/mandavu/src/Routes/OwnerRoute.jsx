import { Routes, Route } from "react-router-dom";
import SignUp from "../Pages/Owner/SignUp_Owner";
import LogIn from "../Pages/Owner/LogIn_Owner";
import OtpVerification from "../Pages/Owner/Otp_Owner";
import Dashboard_Owner from "../Pages/Owner/Dashboard";
import OwnerDetails from "../Pages/Owner/OwnerDetails";



export default function OwnerRoute() {
    return(
        <>  
        <Routes>
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/login" element={<LogIn/>} />
            <Route path="/otp" element={<OtpVerification/>} />
            <Route path="/dashboard" element={<Dashboard_Owner/>} />
            <Route path="/details" element={<OwnerDetails/>} />
        </Routes>
        </>
    )
}