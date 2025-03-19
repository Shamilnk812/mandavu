import { Navigate, Outlet} from "react-router-dom";


export default function UserLoginAuth ({allowedRole}) {
    const accessToken = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');

    if (!accessToken || role !== allowedRole){
        return <Navigate to='/user/login' replace/>
    }else{
        return <Outlet/>
    }
    
}






// export default function UserLoginAuth ({children, allowedRole}) {
//     const accessToken = localStorage.getItem('access_token');
//     const role = localStorage.getItem('role');

//     if (accessToken && role === allowedRole){
//         return children
//     }else{
//         return <Navigate to='/user/login'/>
//     }
    
    
// }


// export default function UserLoginAuth ({children}) {
//     const hasToken = Boolean(localStorage.getItem('access_token'));
    
//     return hasToken ? children : <Navigate to='/user/login'/>
        
// }