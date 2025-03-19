import { Navigate,Outlet } from "react-router-dom";



export default function AdminLoginAuth ({allowedRole}) {
    const accessToken = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');
    if (!accessToken || role !== allowedRole ){
        return <Navigate to='/admin'/>
    }else{
        return <Outlet/>
    }
    
}


// const hasToken = Boolean(localStorage.getItem('access_token'));
    // return hasToken ? children : <Navigate to='/admin'/>


    
// export default function AdminLoginAuth ({children}) {
//     const hasToken = Boolean(localStorage.getItem('access_token'));
//     return hasToken ? children : <Navigate to='/admin'/>
// }