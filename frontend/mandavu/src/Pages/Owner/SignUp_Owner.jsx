import { useFormik } from 'formik';
import SignupSchema from '../../Validations/Owner/SignUpSchema';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



export default function SignUp() {

  const navigate = useNavigate()
  const formik = useFormik({
    initialValues:{
      first_name:'',
      last_name:'',
      email:'',
      convention_center_name:'',
      password:'',
      password2:''
    },
    validationSchema:SignupSchema,
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values);
      try{
        const response = await axios.post('http://127.0.0.1:8000/api/v2/auth/register/',values);
        localStorage.setItem('email',values.email)
        toast.success('Account created successfully! Please check your email for the OTP.')
        navigate('/owner/otp')
      }catch (error) {
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.message || 'Registration failed';
          toast.error(errorMessage);
        } else {
          toast.error('Registration failed');
        }
      }
      

    },
  
  });
    return(
        <>
          <div class="min-h-screen bg-customColor3 flex justify-center items-center">
  <div class="absolute w-60 h-60 rounded-xl bg-customColor2 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
  <div class="py-12 px-12 bg-customColor4 rounded-2xl shadow-xl z-20">
    <div>
      <h1 class="text-3xl font-bold text-center mb-4 cursor-pointer">Create An Account</h1>
      <p class="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">Create an account to enjoy all the services</p>
    </div>
    <form onSubmit={formik.handleSubmit} class="space-y-4">
      <input type="text" name='first_name' value={formik.values.first_name} onChange={formik.handleChange} placeholder="First Name" class="block text-sm py-3 px-4 rounded-lg w-full bg-customColor4 border border-gray-300 outline-customColor5" />
      {formik.errors.first_name && formik.touched.first_name ? (
              <div className="text-red-500 text-sm">{formik.errors.first_name}</div>
            ) : null}

      <input type="text" name='last_name' value={formik.values.last_name} onChange={formik.handleChange} placeholder="Last Name" class="block text-sm py-3 px-4 rounded-lg w-full bg-customColor4 border border-gray-300 outline-customColor5" />
      {formik.errors.last_name && formik.touched.last_name ? (
              <div className="text-red-500 text-sm">{formik.errors.last_name}</div>
            ) : null}

      <input type="text" name='email' value={formik.values.email} onChange={formik.handleChange} placeholder="Email Addres" class="block text-sm py-3 px-4 rounded-lg w-full bg-customColor4 border border-gray-300 outline-customColor5" />
      {formik.errors.email && formik.touched.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}

      <input type="text" name='convention_center_name' value={formik.values.convention_center_name} onChange={formik.handleChange} placeholder="Convention Center Name" class="block text-sm py-3 px-4 rounded-lg w-full bg-customColor4 border border-gray-300 outline-customColor5" />
      {formik.errors.convention_center_name && formik.touched.convention_center_name ? (
              <div className="text-red-500 text-sm">{formik.errors.convention_center_name}</div>
            ) : null}

      <input type="password" name='password'  value={formik.values.password} onChange={formik.handleChange} placeholder="Password" class="block text-sm py-3 px-4 rounded-lg w-full bg-customColor4 border border-gray-300 outline-customColor5" />
      {formik.errors.password && formik.touched.password ? (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            ) : null}

      <input type="password" name='password2'  value={formik.values.password2} onChange={formik.handleChange}   placeholder="Confirm Password" class="block text-sm py-3 px-4 rounded-lg w-full bg-customColor4 border border-gray-300 outline-customColor5" />
      {formik.errors.password2 && formik.touched.password2 ? (
              <div className="text-red-500 text-sm">{formik.errors.password2}</div>
            ) : null}

    <div class="text-center mt-6">
      <button type='submit' class="w-full py-2 text-xl text-white bg-customColor5 rounded-lg hover:bg-customColor3 transition-all">Create Account</button>
      <p class="mt-4 text-sm">Already Have An Account? <span class="underline  cursor-pointer"><Link to={'/owner/login'}>Login</Link> </span></p>
    </div>
    </form>
  </div>
  <div class="w-40 h-40 absolute bg-customColor2 rounded-full top-0 right-12 hidden md:block"></div>
  <div class="w-20 h-40 absolute bg-customColor2 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
</div>
        </>
    )
}