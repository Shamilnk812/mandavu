import { Navigate } from "react-router-dom";


export default function OwnerLoginAuth({children}) {
    const hasToken = Boolean(localStorage.getItem('access_token'));
    return hasToken ? children : <Navigate to='/owner/login'/>
}