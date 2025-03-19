import axios from "axios"
import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { AdminLoginSlice } from "../../Redux/Slices/AdminSlice"
import { useDispatch } from "react-redux";
import { axiosAdminInstance } from "../../Utils/Axios/axiosInstance"
import { CircularProgress } from "@mui/material";
import { useFormik } from "formik"
import * as Yup from "yup";
import PasswordVisibility from "../../Components/Common/PasswordVisibility"




export default function AdminLogin() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [showPassword,setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            password: Yup.string().required("Password is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await axiosAdminInstance.post('login/', values
                    //      {
                    //     email: email,
                    //     password: password
                    // }
                )
                console.log(response.data)
                const { access_token, refresh_token,role } = response.data;
                console.log('rollllll',response.data.role)
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                localStorage.setItem('role',role)
                dispatch(AdminLoginSlice({ access_token, refresh_token, role }));

                toast.success('You are successfully logged in')
                navigate('/admin/dashboard/')

            } catch (error) {
                console.log(error.response?.data?.error || 'Login failed. Please try again.');
                toast.error("Invalid Credentials.")
            } finally {
                setLoading(false);
            }
        }
    })

    const togglePasswordVisibility = ()=> {
        setShowPassword((prev)=> !prev)
    }



    return (
        <>
            <div className="min-h-screen bg-teal-600 flex justify-center items-center px-4 sm:px-6">
                <div className="py-8 px-4 sm:px-12 bg-white rounded-2xl shadow-xl z-20 w-full max-w-lg">
                    <div className="flex justify-center mb-6">
                        <img
                            src="/user/mandavu-logo.png"
                            alt="Mandavu Logo"
                            className="w-24 h-auto sm:w-32"
                        />
                    </div>

                    <div>
                        <h1 className="text-xl font-semibold text-gray-700 text-center mb-4 cursor-pointer">Admin Login</h1>
                        <p className="w-full text-center text-sm mb-8 font-semibold text-gray-500 tracking-wide cursor-pointer">This login is restricted to authorized administrators.<br /> If you are not an admin, please navigate <br /> to the appropriate login page.</p>
                    </div>

                    <div>
                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Email Address"
                                    className="block text-sm py-3 px-4 rounded-lg w-full border border-gray-400 outline-teal-600"
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-500 text-sm">{formik.errors.email}</div>
                                ) : null}
                            </div>

                            <div>
                                <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Password"
                                    className="block text-sm py-3 px-4 rounded-lg w-full border border-gray-400 outline-teal-600"
                                />
                                <PasswordVisibility showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility}/>
                                </div>
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-500 text-sm">{formik.errors.password}</div>
                                ) : null}
                            </div>

                            <div className="text-center mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-1/2 py-2 text-lg text-white bg-teal-600 rounded-lg hover:bg-teal-800 transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
                                >
                                    {loading ? (
                                        <CircularProgress size={20} style={{ color: 'white' }} />
                                    ) : (
                                        'Login'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>


            </div>
        </>
    )
}