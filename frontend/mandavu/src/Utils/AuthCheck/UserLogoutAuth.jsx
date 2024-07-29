import { Navigate } from "react-router-dom";



export default function UserLogoutAuth({children}) {
    const hasToken = Boolean(localStorage.getItem('access_token'));

    return hasToken ? <Navigate to='/user/home'/> : children

}