import { Navigate } from "react-router-dom";



export default function AdminLogoutAuth({children}) {
    const hasToken = Boolean(localStorage.getItem('access_token'));
    return hasToken ?<Navigate to='/admin/dashboard'/> : children
}