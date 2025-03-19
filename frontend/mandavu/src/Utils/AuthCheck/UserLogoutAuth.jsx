import { Navigate ,Outlet} from "react-router-dom";




export default function UserLogoutAuth({allowedRole }) {
    const accessToken = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');

    if (accessToken && role === allowedRole){
        return <Navigate to="/user/home" replace/>
    }else{
        return <Outlet/> 
    }
}








