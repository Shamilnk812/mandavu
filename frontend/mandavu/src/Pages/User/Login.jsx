import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux';
import LoginSchema from "../../Validations/User/LoginSchema"
import { UserLogin } from "../../Redux/Slices/User";
import { toast } from 'react-toastify';
import { axiosUserInstance } from "../../Utils/Axios/axiosInstance";
import { useState } from "react";



import StoreIcon from '@mui/icons-material/Store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { CircularProgress } from "@mui/material";


export default function Login() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      console.log(values)
      setLoading(true);


      try {
        const response = await axiosUserInstance.post('login/', values);
        console.log(response.data);
        const { access_token, refresh_token, email, user_id } = response.data;


        dispatch(UserLogin({
          user: { id: user_id, email },
          access_token,
          refresh_token,
        }));


        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user_email', JSON.stringify({ email }));
        localStorage.setItem('user_id', JSON.stringify({ user_id }))
        toast.success('You successfully logged in');
        navigate('/user/home');

      } catch (error) {
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
      } finally {
        setLoading(false); // Stop loading
      }
    },
  });


  return (
    <>




      <div className="min-h-screen bg-teal-600 flex justify-center items-center px-4 sm:px-6">
        <div className="py-8 px-4 sm:px-12 bg-white rounded-2xl shadow-xl w-full max-w-lg">


          {/* Switch Button */}
          <div className=" flex  flex-col justify-end items-end absolute top-4 right-4 ">
            <label className="text-sm font-semibold text-gray-200 mb-2"><StoreIcon /> Switch to Owner</label>
            <button
              onClick={() => navigate('/owner/login')}
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
            <h1 className="text-lg font-semibold text-gray-600 text-center mb-2 cursor-pointer"><AccountCircleIcon /> Login Your Account</h1>
            <p className="w-full text-center text-sm mb-8 font-semibold text-gray-500 tracking-wide cursor-pointer">
              Login your account to enjoy all the services
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <input
              type="text"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Email Address"
              className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
            />
            {formik.errors.email && formik.touched.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}

            <input
              type="password"
              name="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Password"
              className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
            />
            {formik.errors.password && formik.touched.password ? (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            ) : null}

            <div className="text-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 text-lg text-white bg-teal-600 rounded-lg hover:bg-teal-800 transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : ''
                  }`}
              >
                {loading ? (
                  <CircularProgress size={20} style={{ color: 'white' }} />
                ) : (
                  'Login Account'
                )}
              </button>
              <p className="mt-4 text-sm  ">
                I don't have an account?
                <a
                  onClick={() => navigate('/user/signup')}
                  className="underline cursor-pointer text-teal-600 ml-1" > SignUp</a>
              </p>
              <p className="mt-4 text-sm">
                <a
                  onClick={() => navigate('/user/reset-password-request')}
                  className="underline cursor-pointer text-teal-600">Forgot password?</a>
              </p>
            </div>
          </form>
        </div>
      </div>



    </>
  )
}





// <div className="w-40 h-40 absolute bg-teal-500 rounded-full top-0 right-12 hidden md:block"></div>
// <div className="w-20 h-40 absolute bg-teal-500 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>

{/* <div className="absolute w-60 h-60 rounded-xl bg-teal-500 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div> */ }




{/* <div className="min-h-screen bg-teal-600 flex justify-center items-center">
        <div className="absolute w-60 h-60 rounded-xl bg-teal-500 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
        <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
          <div>
            <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">Login Your Account</h1>
            <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">Login your account to enjoy all the services</p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <input
              type="text"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Email Address"
              className="block text-sm py-3 px-4 rounded-lg w-full bg-white  border border-gray-300 outline-teal-500"
            />
            {formik.errors.email && formik.touched.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
            <input
              type="password"
              name="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Password"
              className="block text-sm py-3 px-4  rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
            />
            {formik.errors.password && formik.touched.password ? (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            ) : null}
            <div className="text-center mt-6">
              <button type="submit" className="w-full py-2 text-xl text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-all">Login Account</button>
              <p className="mt-4 text-sm">I don't have an account? <a onClick={() => navigate('/user/signup')} className="underline cursor-pointer">SignUp</a></p>
              <p className="mt-4 text-sm"> <a onClick={() => navigate('/user/reset-password-request')} className="underline cursor-pointer">Forgot password?</a></p>
            </div>
          </form>
        </div>
        <div className="w-40 h-40 absolute bg-teal-500 rounded-full top-0 right-12 hidden md:block"></div>
        <div className="w-20 h-40 absolute bg-teal-500 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
      </div> */}





{/* <div className="min-h-screen bg-teal-600 flex justify-center items-center">


        <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">

          <div>
            <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">Login Your Account</h1>
            <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">Login your account to enjoy all the services</p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <input
              type="text"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Email Address"
              className="block text-sm py-3 px-4 rounded-lg w-full bg-white  border border-gray-300 outline-teal-500"
            />
            {formik.errors.email && formik.touched.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
            <input
              type="password"
              name="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Password"
              className="block text-sm py-3 px-4  rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
            />
            {formik.errors.password && formik.touched.password ? (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            ) : null}
            <div className="text-center mt-6">
              <button type="submit" className="w-full py-2 text-xl text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-all">Login Account</button>
              <p className="mt-4 text-sm">I don't have an account? <a onClick={() => navigate('/user/signup')} className="underline cursor-pointer">SignUp</a></p>
              <p className="mt-4 text-sm"> <a onClick={() => navigate('/user/reset-password-request')} className="underline cursor-pointer">Forgot password?</a></p>
            </div>
          </form>
        </div>

       

      </div>  */}