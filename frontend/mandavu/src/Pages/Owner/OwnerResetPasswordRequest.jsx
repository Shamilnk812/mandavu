import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

export default function OwnerResetPasswordRequest() {
    const formik = useFormik({
        initialValues: {
          email: '',
        },
        validationSchema: Yup.object({
          email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        onSubmit: async (values) => {
          console.log(values);
    
          try{
            const response = await axios.post('http://127.0.0.1:8000/api/v2/auth/owner-password-reset-request/',values);
            toast.success(response.data.message)
          }catch(error) {
            toast.error('Failed to send password reset link.')
          }
        },
      });
    return(
        <div className="min-h-screen bg-teal-600 flex justify-center items-center">
        <div className="absolute w-60 h-60 rounded-xl bg-teal-500 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
        <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
          <div>
            <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">Enter Your Email</h1>
            <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
            A password reset request will be sent <br></br> Please check your email
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email"
              className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
            />
            {formik.errors.email && formik.touched.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
  
            <div className="text-center mt-6">
              <button type="submit" className="w-1/2 py-2 text-xl text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-all">
                Submit
              </button>
            </div>
          </form>
          
        </div>
        <div className="w-40 h-40 absolute bg-teal-500 rounded-full top-0 right-12 hidden md:block"></div>
        <div className="w-20 h-40 absolute bg-teal-500 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
      </div>
    )
}