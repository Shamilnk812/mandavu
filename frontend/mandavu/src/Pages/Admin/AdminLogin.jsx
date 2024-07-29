import axios from "axios"
import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export default function AdminLogin() {

    const navigate = useNavigate()
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            console.log('Email is required');
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            console('Email address is invalid');
            return;
        }
        if (!password) {
            console('Password is required');
            return;
        } 

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/admin_dash/auth/login/', {
                email: email,
                password: password
            })
            console.log(response.data)
            const { access_token, refresh_token } = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            toast.success('You are successfully logged in')
            navigate('/admin/dashboard/')

        } catch (error) {
            console.log(error.response?.data?.error || 'Login failed. Please try again.');
        }
    }

    return(
        <>
         <div className="min-h-screen bg-teal-600 flex justify-center items-center">
            <div className="absolute w-60 h-60 rounded-xl bg-teal-500 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
            <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
                <div>
                    <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">Admin Login</h1>
                    <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer"></p>
                </div>
                <div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="block text-sm py-3 px-4 rounded-lg w-full border outline-teal-500" />
                        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="block text-sm py-3 px-4 rounded-lg w-full border outline-teal-500" />
                        {/* {error && <div className="text-red-500 text-sm">{error}</div>} */}
                        <div className="text-center mt-6">
                            <button type="submit" className="w-full py-2 text-xl text-white bg-teal-600 rounded-lg hover:bg-teal-500 transition-all">Login</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="w-40 h-40 absolute bg-teal-500 rounded-full top-0 right-12 hidden md:block"></div>
            <div className="w-20 h-40 absolute bg-teal-500 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
        </div>
        </>
    )
}