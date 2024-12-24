import { useFormik } from "formik"
import LoginSchema from '../../Validations/User/LoginSchema'
import { Link } from "react-router-dom"
import axios from "axios"
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { OwnerLogin,SetVenueId } from "../../Redux/Slices/Owner";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { CircularProgress } from "@mui/material";
import StoreIcon from '@mui/icons-material/Store';
import { useState } from "react";


export default function LogIn() {
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues:{
      email:'',
      password:''
    },
    validationSchema:LoginSchema,
    onSubmit: async (values) =>{
      console.log(values)
      setLoading(true)
      try{
        const response = await axiosOwnerInstance.post('login/',values);
        console.log(response.data)
        const { access_token, refresh_token, owner_id, venue_id} = response.data
        
        dispatch(OwnerLogin({
          owner: {id: owner_id},
          access_token,
          refresh_token
        }))
        dispatch(SetVenueId(venue_id))

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('owner_id', JSON.stringify({owner_id}));
        toast.success('Your successfully loggedin')
        navigate('/owner/dashboard')
    }catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        const errors = error.response.data;
        // Check and display specific authentication error messages
        if (errors.detail) {
          toast.error(errors.detail);
        }
        //  else {
        //   // Display general or unexpected errors
        //   Object.values(errors).flat().forEach(message => toast.error(message));
        // }
      } else {
        toast.error('Login failed');
      }
    }finally {
      setLoading(false);
    }
    },
  });
    return (
        <>
      
  <div className="min-h-screen bg-teal-600 flex justify-center items-center  px-4 sm:px-6">
  <div className="py-8 px-4 sm:px-12 bg-white rounded-2xl shadow-xl w-full max-w-lg">


    {/* Switch Button */}
    <div className=" flex  flex-col justify-end items-end absolute top-4 right-4 ">
            <label className="text-sm font-semibold text-gray-200 mb-2"><AccountCircleIcon /> Switch to User</label>
            <button
              onClick={() => navigate('/user/login')}
              className="w-10 h-5 bg-gray-300 rounded-full flex items-center cursor-pointer p-1 transition-all hover:bg-teal-400 mr-8"
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300"></div>
            </button>
          </div>
    
     {/* Website Logo */}
     <div className="flex justify-center mb-6">
            <img
              src="/user/mandavu-logo.png"
              alt="Mandavu Logo"
              className="w-24 h-auto sm:w-32"
            />
          </div>



           {/* Title and Description */}
           <div>
            <h1 className="text-lg font-semibold text-gray-600 text-center mb-2 cursor-pointer"> <StoreIcon /> Login Your Account</h1>
            <p className="w-full text-center text-sm mb-8 font-semibold text-gray-500 tracking-wide cursor-pointer">
              Login your account to enjoy all the services
            </p>
          </div>

    <form onSubmit={formik.handleSubmit} class="space-y-4">

    <input type="text" name='email' value={formik.values.email} onChange={formik.handleChange} placeholder="Email Addres" class="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" />
      {formik.errors.email && formik.touched.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}     
            
            <input type="password" name='password'  value={formik.values.password} onChange={formik.handleChange} placeholder="Password" class="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" />
      {formik.errors.password && formik.touched.password ? (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            ) : null}

    <div class="text-center mt-6">
      <button type="submit" 
      className={`w-full py-2 text-lg text-white bg-teal-600 rounded-lg hover:bg-teal-800 transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : ''
      }`}
      disabled={loading}
      >
       {loading ? (
                  <CircularProgress size={20} style={{ color: 'white' }} />
                ) : (
                  'Login Account'
                )}
        </button>


      <p className="mt-4 text-sm">I don't have an account ?<span className="underline  cursor-pointer text-teal-600 ml-1"><Link to={'/owner/register-step-1'}>SignUp</Link> </span></p>
      <p className="mt-4 text-sm"><span className="underline  cursor-pointer text-teal-600 "><Link to={'/owner/reset-password-request'}>Forgot password?</Link> </span></p>
    </div>
    </form>
  </div>
 
</div>
        </>
    )
}











 {/* <div class="w-40 h-40 absolute bg-teal-500 rounded-full top-0 right-12 hidden md:block"></div>
  <div class="w-20 h-40 absolute bg-teal-500 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div> */}

    
// <div class="min-h-screen bg-teal-600 flex justify-center items-center">
// <div class="absolute w-60 h-60 rounded-xl bg-teal-500 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
// <div class="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
//   <div>
//     <h1 class="text-3xl font-bold text-center mb-4 cursor-pointer">Login Your Account</h1>
//     <p class="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">Login your account to enjoy all the services</p>
//   </div>
//   <form onSubmit={formik.handleSubmit} class="space-y-4">

//   <input type="text" name='email' value={formik.values.email} onChange={formik.handleChange} placeholder="Email Addres" class="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" />
//     {formik.errors.email && formik.touched.email ? (
//             <div className="text-red-500 text-sm">{formik.errors.email}</div>
//           ) : null}     
          
//           <input type="password" name='password'  value={formik.values.password} onChange={formik.handleChange} placeholder="Password" class="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" />
//     {formik.errors.password && formik.touched.password ? (
//             <div className="text-red-500 text-sm">{formik.errors.password}</div>
//           ) : null}

//   <div class="text-center mt-6">
//     <button type="submit" class="w-full py-2 text-xl text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-all">Login Account</button>
//     <p class="mt-4 text-sm">I don't have an account ?<span class="underline  cursor-pointer"><Link to={'/owner/register-step-1'}>SignUp</Link> </span></p>
//     <p class="mt-4 text-sm"><span class="underline  cursor-pointer"><Link to={'/owner/reset-password-request'}>Forgot password?</Link> </span></p>
//   </div>
//   </form>
// </div>
// <div class="w-40 h-40 absolute bg-teal-500 rounded-full top-0 right-12 hidden md:block"></div>
// <div class="w-20 h-40 absolute bg-teal-500 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
// </div>