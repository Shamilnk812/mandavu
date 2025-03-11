import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupSchema from '../../Validations/User/SignupSchema';
import { toast } from 'react-toastify';
import { axiosUserInstance } from '../../Utils/Axios/axiosInstance';
import StoreIcon from '@mui/icons-material/Store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { CircularProgress } from "@mui/material";
import PasswordVisibility from '../../Components/Common/PasswordVisibility';



export default function SignUp() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password2: '',

    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values);
      setLoading(true)

      try {

        const response = await axiosUserInstance.post('register/', values);
        localStorage.setItem('email', values.email);
        toast.success('Account created successfully! Please check your email for the OTP.');
        navigate('/user/otp');
      } catch (error) {
        if (error.response && error.response.data) {
          const errors = error.response.data;
          if (errors.email) {
            toast.error('User with this email already exists');
          } else {
            toast.error('Registration failed');
          }
        } else {
          toast.error('Registration failed');
        }
      } finally {
        setLoading(false)
      }
    },
  });


  const togglePasswordVisibility1 = () => {
    setShowPassword1((prev) => !prev)
  }

  const togglePasswordVisibility2 = ()=> {
    setShowPassword2((prev)=> !prev)
  }



  return (
    <>

      <div className="min-h-screen bg-teal-600 flex justify-center items-center px-4 sm:px-6">
        <div className="py-8 px-8 bg-white rounded-2xl shadow-xl w-full max-w-lg">

          {/* switch button  */}
          <div className=" flex  flex-col justify-end items-end absolute top-4 right-4 ">
            <button
              onClick={() => navigate('/owner/login')}
              className="text-sm font-semibold text-gray-200 mb-2 px-4 py-2 border border-gray-400 rounded-lg transition-all duration-300 hover:bg-gray-200 hover:text-teal-700 hover:scale-105"
            > <StoreIcon /> Switch to Owner</button >
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
            <h1 className="text-lg font-semibold text-gray-600 text-center mb-2 cursor-pointer">  Create An Account</h1>
            <p className="w-full text-center text-sm mb-8 font-semibold text-gray-500 tracking-wide cursor-pointer">
              Create an account to enjoy all the services
            </p>
          </div>


          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <input type="text" name="first_name" onChange={formik.handleChange} value={formik.values.first_name} id='first_name' placeholder="First Name" className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" />
            {formik.errors.first_name && formik.touched.first_name ? (
              <div className="text-red-500 text-sm">{formik.errors.first_name}</div>
            ) : null}
            <input type="text" name="last_name" onChange={formik.handleChange} value={formik.values.last_name} id='last_name' placeholder="Last Name" className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" />
            {formik.errors.last_name && formik.touched.last_name ? (
              <div className="text-red-500 text-sm">{formik.errors.last_name}</div>
            ) : null}
            <input type="email" name="email" onChange={formik.handleChange} value={formik.values.email} id='email' placeholder="Email Address" className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" />
            {formik.errors.email && formik.touched.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
            
            <div className='relative'>
            <input 
              type={showPassword1 ? 'text' : 'password'}
              name="password" 
              onChange={formik.handleChange} 
              value={formik.values.password} 
              id='password' placeholder="Password" 
              className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" />
               <PasswordVisibility showPassword={showPassword1} togglePasswordVisibility={togglePasswordVisibility1} />
             </div>
            {formik.errors.password && formik.touched.password ? (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            ) : null}
           

            <div className='relative'>
            <input 
              type={showPassword2 ? "text" : "password"}
              name="password2" 
              onChange={formik.handleChange} 
              value={formik.values.confirmpassword} 
              id='confirmpassword' 
              placeholder="Confirm Password" 
              className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" />
              <PasswordVisibility  showPassword={showPassword2} togglePasswordVisibility={togglePasswordVisibility2}/>
            </div>
            {formik.errors.password2 && formik.touched.password2 ? (
              <div className="text-red-500 text-sm">{formik.errors.password2}</div>
            ) : null}


            <div className="text-center mt-6">
              <button type="submit"
                className={`w-full py-2 text-lg text-white bg-teal-600 rounded-lg hover:bg-teal-800 transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : ''
                  }`}

              >
                {loading ? (
                  <CircularProgress size={20} style={{ color: 'white' }} />
                ) : (
                  'Create Account'
                )}

              </button>
              <p className="mt-4 text-sm text-gray-500">Already Have An Account? <a onClick={() => navigate('/user/login')} className="underline cursor-pointer text-teal-600 ml-1">Sign In</a></p>
            </div>
          </form>

        </div>

      </div>
    </>
  )
}






