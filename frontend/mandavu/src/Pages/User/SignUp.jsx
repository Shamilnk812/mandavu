import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import SignupSchema from '../../Validations/User/SignupSchema';
import { toast } from 'react-toastify';
import { axiosUserInstance } from '../../Utils/Axios/axiosInstance';



export default function SignUp() {
   
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      first_name:'',
      last_name:'',
      email:'',
      password:'',
      password2:'',

    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values);
      try {
        const response = await axiosUserInstance.post('register/', values);
        localStorage.setItem('email', values.email); 
        toast.success('Account created successfully! Please check your email for the OTP.');
        navigate('/user/otp'); 
      }catch (error) {
        if (error.response && error.response.data) {
          const errors = error.response.data;
          if (errors.email) {
            toast.error('User with this email already exists');
          } else {
            toast.error('Registration failed');}
        } else {
          toast.error('Registration failed');
        }
      }
    },
  });


    
    return(
        <>
         
             <div className="min-h-screen bg-teal-600 flex justify-center items-center">
        <div className="absolute w-60 h-60 rounded-xl bg-teal-500 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
        <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
          <div>
            <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">Create An Account</h1>
            <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">Create an account to enjoy all the services </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <input type="text"  name="first_name" onChange={formik.handleChange} value={formik.values.first_name} id='first_name' placeholder="First Name" className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" />
            {formik.errors.first_name && formik.touched.first_name ? (
              <div className="text-red-500 text-sm">{formik.errors.first_name}</div>
            ) : null}
            <input type="text" name="last_name" onChange={formik.handleChange}  value={formik.values.last_name} id='last_name' placeholder="Last Name" className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" />
            {formik.errors.last_name && formik.touched.last_name ? (
              <div className="text-red-500 text-sm">{formik.errors.last_name}</div>
            ) : null}
            <input type="email" name="email"onChange={formik.handleChange} value={formik.values.email} id='email' placeholder="Email Address" className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" />
            {formik.errors.email && formik.touched.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
            <input type="password" name="password"onChange={formik.handleChange} value={formik.values.password} id='password' placeholder="Password" className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" />
            {formik.errors.password && formik.touched.password ? (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            ) : null}
            <input type="password" name="password2"onChange={formik.handleChange} value={formik.values.confirmpassword} id='confirmpassword' placeholder="Confirm Password" className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" />
            {formik.errors.password2 && formik.touched.password2 ? (
              <div className="text-red-500 text-sm">{formik.errors.password2}</div>
            ) : null}
            <div className="text-center mt-6">
            <button type="submit" className="w-full py-2 text-xl text-white bg-teal-500 rounded-lg hover:bg-teal transition-all">Create Account</button>
            <p className="mt-4 text-sm">Already Have An Account? <a onClick={()=> navigate('/user/login')} className="underline cursor-pointer">Sign In</a></p>
          </div>
          </form>
         
        </div>
        <div className="w-40 h-40 absolute bg-teal-500 rounded-full top-0 right-12 hidden md:block"></div>
        <div className="w-20 h-40 absolute bg-teal-500 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
      </div>
        </>
    )
}
