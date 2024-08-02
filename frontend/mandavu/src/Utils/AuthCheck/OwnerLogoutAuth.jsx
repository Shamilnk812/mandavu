
import { Navigate } from "react-router-dom";


export default function OwnerLogoutAuth({children}) {
    const hasToken = Boolean(localStorage.getItem('access_token'));
    return hasToken ? <Navigate to='/owner/dashboard'/>  : children
}