import { Routes, Route } from "react-router-dom";
import AdminLogin from "../Pages/Admin/AdminLogin";
import Dashboard from "../Pages/Admin/Dashboard";

import UserList from "../Pages/Admin/UserList";
import OwnersList from "../Pages/Admin/OwnersList";
import Sidebar from "../Components/Admin/Sidebar";
import AdminLoginAuth from "../Utils/AuthCheck/AdminLoginAuth";
import AdminLogoutAuth from "../Utils/AuthCheck/AdminLogoutAuth";
import VenueList from "../Pages/Admin/VenueList";
import ShowVenueDetails from "../Pages/Admin/ShowVenueDetails";
import AdminViewAllBookings from "../Pages/Admin/AdminViewAllBookings";
import ShowVenueDetails2 from "../Pages/Admin/ShowVenueDetails1";
import UserInquiry from "../Pages/Admin/UserInquiry";


export default function AdminRoute() {
    return(
           <>
           <Routes>
            <Route path="/" element={<AdminLogoutAuth> <AdminLogin/> </AdminLogoutAuth>} />
            <Route path="/dashboard" element={<AdminLoginAuth> <Dashboard/> </AdminLoginAuth>} />
            <Route path="/userslist" element={ <AdminLoginAuth> <UserList/> </AdminLoginAuth>} />
            <Route path="/ownerslist" element={<AdminLoginAuth><OwnersList/> </AdminLoginAuth> }/>
            <Route path="/sidebar" element={<AdminLoginAuth> <Sidebar/> </AdminLoginAuth>}/>
            <Route path="/venuelist" element={<AdminLoginAuth> <VenueList/> </AdminLoginAuth>}/>
            <Route path="/user-inquiry" element={<AdminLoginAuth> <UserInquiry/> </AdminLoginAuth>}/>
            <Route path="/show-venue-details/:venueId" element={<AdminLoginAuth> <ShowVenueDetails/> </AdminLoginAuth>}/>
            <Route path="/show-venue-details2/:venueId" element={<AdminLoginAuth> <ShowVenueDetails2/> </AdminLoginAuth>}/>
            <Route path="/view-all-bookings" element={<AdminLoginAuth> <AdminViewAllBookings/> </AdminLoginAuth>}/>
            {/* <Route path="/notifications" element={<AdminLoginAuth> <AdminNotification/> </AdminLoginAuth>}/> */}
            
           </Routes>
           </>
    )
}