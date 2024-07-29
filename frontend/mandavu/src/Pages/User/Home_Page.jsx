import axios from "axios";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
// import axiosInstance from "../../Utils/axiosInstance"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




export default function HomePage() {

    const navigate  = useNavigate()

    const user = JSON.parse(localStorage.getItem('user'))
    const jwt_access = localStorage.getItem('access_token')

    useEffect(()=> {
        if (jwt_access=== null && !user) {
            navigate("/login")
        }
    },[])
    
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');

    if (!access_token || !refresh_token) {
    console.error("Tokens are missing");
    toast.error("You are not logged in");
    navigate("/login");
    return;
    }


    // const refresh_token = localStorage.getItem('refresh_token')
    const handleLogout = async () => {
        const refresh_token = localStorage.getItem('refresh_token');
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/logout/', 
                { "refresh_token": refresh_token },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            );
            if (response.status === 200) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_id');
                navigate("/user/login");
                toast.success("Logout successfully");
            }
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed. Please try again.");
        }
    };


    return(
        <>
        <ToastContainer/>
       <div className="min-h-screen flex flex-col">
            <nav className="bg-teal-600 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex space-x-4">
                        <span className="text-white text-lg font-semibold">Mandavu</span>
                    </div>
                    <div className="flex space-x-4">
                        <a href="/home" className="text-white text-lg font-semibold">Home</a>
                        <a href="/about" className="text-white text-lg font-semibold">About Us</a>
                        <a href="/profile" className="text-white text-lg font-semibold">Profile</a>
                        <button onClick={handleLogout} className="text-white text-lg font-semibold">Logout</button>
                    </div>
                </div>
            </nav>
            <main className="flex-grow flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome, To Mandavu</h1>
                    {/* <p className="text-xl">Enjoy your stay at our application.</p> */}
                </div>
            </main>
            <footer className="bg-teal-600 p-4">
                <div className="container mx-auto text-center text-white">
                    &copy; 2024 Your Company. All rights reserved.
                </div>
            </footer>
        </div>
        </>
    )
}