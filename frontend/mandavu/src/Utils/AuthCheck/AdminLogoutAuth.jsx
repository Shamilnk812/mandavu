import { Navigate } from "react-router-dom";



export default function AdminLogoutAuth({allowedRole,children}) {
    const accessToken = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');
    if (!accessToken || role !== allowedRole ){
        return children;
    }else{
        return <Navigate to='/admin/dashboard'/> 
    }
  
}

