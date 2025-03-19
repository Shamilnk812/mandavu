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


  // const hasToken = Boolean(localStorage.getItem('access_token'));
    // return hasToken ?<Navigate to='/admin/dashboard'/> : children


// export default function AdminLogoutAuth({children}) {
//     const hasToken = Boolean(localStorage.getItem('access_token'));
//     return hasToken ?<Navigate to='/admin/dashboard'/> : children
// }