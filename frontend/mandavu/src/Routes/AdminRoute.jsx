import { Routes, Route } from "react-router-dom";
import AdminLogin from "../Pages/Admin/AdminLogin";
import Dashboard from "../Pages/Admin/Dashboard";

import UserList from "../Pages/Admin/UserList";
import OwnersList from "../Pages/Admin/OwnersList";
import Sidebar from "../Components/Admin/Sidebar";
import AdminLoginAuth from "../Utils/AuthCheck/AdminLoginAuth";
import VenueList from "../Pages/Admin/VenueList";


export default function AdminRoute() {
    return(
           <>
           <Routes>
            <Route path="/" element={<AdminLogin/>} />
            <Route path="/dashboard" element={<AdminLoginAuth> <Dashboard/> </AdminLoginAuth>} />
            <Route path="/userslist" element={ <AdminLoginAuth> <UserList/> </AdminLoginAuth>} />
            <Route path="/ownerslist" element={<AdminLoginAuth><OwnersList/> </AdminLoginAuth> }/>
            <Route path="/sidebar" element={<AdminLoginAuth> <Sidebar/> </AdminLoginAuth>}/>
            <Route path="/venuelist" element={<AdminLoginAuth> <VenueList/> </AdminLoginAuth>}/>
           </Routes>
           </>
    )
}