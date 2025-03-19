import { Navigate ,Outlet} from "react-router-dom";






// export default function UserLogoutAuth({children, allowedRole}) {
//     // const hasToken = Boolean(localStorage.getItem('access_token'));
//     const [isAuthenticated , setIsAuthenticated] = useState(null);
//     const accessToken = useSelector((state)=> state.user.accessToken);
//     const role = useSelector((state)=> state.user.role);

//     useEffect(()=> {
//         if(accessToken && role === allowedRole){
//             setIsAuthenticated(true);
//         }else if (accessToken === undefined || role === undefined){
//             setIsAuthenticated(null);
//         }else{
//             setIsAuthenticated(false);
//         }
//     },[accessToken,role,allowedRole])

//     if (isAuthenticated === null){
//         return <LoadingAnimation/>
//     }

//     if (isAuthenticated){
//         return <Navigate to='/user/home'/>
//     }
    
//     return children;
//     // return hasToken ? <Navigate to='/user/home'/> : children

// }



export default function UserLogoutAuth({allowedRole }) {
    const accessToken = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');

    if (accessToken && role === allowedRole){
        return <Navigate to="/user/home" replace/>
    }else{
        return <Outlet/> 
    }
}



// const hasToken = Boolean(localStorage.getItem("access_token"));
// return hasToken ? <Navigate to="/user/home" /> : children;


// export default function UserLogoutAuth({ children }) {
//     const accessToken = useSelector((state) => state.user.accessToken);
//     const hasToken = Boolean(accessToken || localStorage.getItem("access_token"));

//     return hasToken ? <Navigate to="/user/home" /> : children;
// }




// export default function UserLogoutAuth({children}) {
//     const hasToken = Boolean(localStorage.getItem('access_token'));

//     return hasToken ? <Navigate to='/user/home'/> : children

// }







// export default function UserLogoutAuth ({children, allowedRole}) {
//     const accessToken = useSelector((state) => state.user.accessToken);
//     const role = useSelector((state) => state.user.role);

//     if (accessToken || role === allowedRole) {
//         return <Navigate to="/user/home" />;
//     }

//     return children;
   

// }
