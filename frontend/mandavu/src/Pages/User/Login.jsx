import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux';
import LoginSchema from "../../Validations/User/LoginSchema"
import { UserLogin } from "../../Redux/Slices/User";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Login() {
 
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues:{
            email:'',
            password:''
        },
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            console.log(values)
            try{
                const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/login/',values);
                console.log(response.data);  
                const { access_token, refresh_token, email,user_id } = response.data;


                dispatch(UserLogin({
                  user: { id: user_id, email },
                  access_token,
                  refresh_token,
                }));
        

                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                localStorage.setItem('user_email', JSON.stringify({ email }));
                localStorage.setItem('user_id', JSON.stringify({user_id}))
                toast.success('you successfully logedin');
                navigate('/user/home');

            }catch (error) {
                if (error.response && error.response.data) {
                  const errorMessage = error.response.data.message || 'Invalid credentials try again';
                  toast.error(errorMessage);
                } else {
                  toast.error('Login failed');
                }
              }
        },
    });


    return(
      <>
      <ToastContainer />
      <div className="min-h-screen bg-customColor3 flex justify-center items-center">
        <div className="absolute w-60 h-60 rounded-xl bg-customColor2 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
        <div className="py-12 px-12 bg-customColor4 rounded-2xl shadow-xl z-20">
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
              className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor4  border border-gray-300 outline-customColor5"
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
              className="block text-sm py-3 px-4  rounded-lg w-full bg-customColor4 border border-gray-300 outline-customColor5"
            />
            {formik.errors.password && formik.touched.password ? (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            ) : null}
            <div className="text-center mt-6">
              <button type="submit" className="w-full py-2 text-xl text-white bg-customColor5 rounded-lg hover:bg-customColor2 transition-all">Login Account</button>
              <p className="mt-4 text-sm">I don't have an account? <a onClick={() => navigate('/user/signup')} className="underline cursor-pointer">SignUp</a></p>
            </div>
          </form>
        </div>
        <div className="w-40 h-40 absolute bg-customColor2 rounded-full top-0 right-12 hidden md:block"></div>
        <div className="w-20 h-40 absolute bg-customColor2 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
      </div>
        </>
    )
}