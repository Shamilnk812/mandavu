import { Navigate,Outlet } from "react-router-dom";


export default function OwnerLoginAuth({allowedRole}) {
    const accessToken = localStorage.getItem('access_token')
    const role = localStorage.getItem('role')
    
    if (!accessToken || role !== allowedRole){
        return <Navigate to='/owner/login' replace/>
    }else{
        return <Outlet/>
    }
  
}
 