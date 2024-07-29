import { Navigate } from "react-router-dom";



export default function UserLoginAuth ({children}) {
    const hasToken = Boolean(localStorage.getItem('access_token'));
    return hasToken ? children : <Navigate to='/user/login'/>
        
}