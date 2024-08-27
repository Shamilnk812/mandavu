import { useFormik } from "formik"
import LoginSchema from '../../Validations/User/LoginSchema'
import { Link } from "react-router-dom"
import axios from "axios"
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { OwnerLogin,SetVenueId } from "../../Redux/Slices/Owner";




export default function LogIn() {
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues:{
      email:'',
      password:''
    },
    validationSchema:LoginSchema,
    onSubmit: async (values) =>{
      console.log(values)
      try{
        const response = await axios.post('http://127.0.0.1:8000/api/v2/auth/login/',values);
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
    }
    },
  });
    return (
        <>
      
  <div class="min-h-screen bg-teal-600 flex justify-center items-center">
  <div class="absolute w-60 h-60 rounded-xl bg-teal-500 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
  <div class="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
    <div>
      <h1 class="text-3xl font-bold text-center mb-4 cursor-pointer">Login Your Account</h1>
      <p class="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">Login your account to enjoy all the services</p>
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
      <button type="submit" class="w-full py-2 text-xl text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-all">Login Account</button>
      <p class="mt-4 text-sm">I don't have an account ?<span class="underline  cursor-pointer"><Link to={'/owner/register-step-1'}>SignUp</Link> </span></p>
      <p class="mt-4 text-sm"><span class="underline  cursor-pointer"><Link to={'/owner/reset-password-request'}>Forgot password?</Link> </span></p>
    </div>
    </form>
  </div>
  <div class="w-40 h-40 absolute bg-teal-500 rounded-full top-0 right-12 hidden md:block"></div>
  <div class="w-20 h-40 absolute bg-teal-500 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
</div>
        </>
    )
}