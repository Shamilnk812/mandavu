
import { Navigate, Outlet } from "react-router-dom";


export default function OwnerLogoutAuth({allowedRole}) {
    const accessToken = localStorage.getItem('access_token')
    const role = localStorage.getItem('role')
    if (!accessToken || role !== allowedRole){
        return <Outlet/>
    }else{
        return <Navigate to='/owner/dashboard' replace/>
    }
  
}


