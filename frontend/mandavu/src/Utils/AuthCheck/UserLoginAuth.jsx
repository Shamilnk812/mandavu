import { useEffect, useState } from "react";
import { Navigate, Outlet} from "react-router-dom";
import { axiosUserInstance } from "../Axios/axiosInstance";
import LoadingAnimation from "../../Components/Common/LoadingAnimation";


export default function UserLoginAuth ({allowedRole}) {

    const [isValid, setIsValid] = useState(null);
    const accessToken = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    useEffect(() => {
        const validateToken = async () => {
            if (!accessToken || role !== allowedRole) {
                setIsValid(false);
                return;
            }

            try {
                const response = await axiosUserInstance.post(
                    "verify-token/",
                    {},
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                setIsValid(response.status === 200);
            } catch (error) {
                console.error("Token is not valid:", error);
                localStorage.removeItem("access_token");
                localStorage.removeItem("role");
                setIsValid(false);
            }
        };

        validateToken();
    }, []);

    if (isValid === null) return <LoadingAnimation/>;
    return isValid ? <Outlet /> : <Navigate to="/user/login" replace />;
    
}


