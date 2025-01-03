import { axiosUserInstance } from "../../Utils/Axios/axiosInstance";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { CircularProgress } from "@mui/material";



export default function ResetPasswordRequest() {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const response = await axiosUserInstance.post('password-reset-request/', values);
        toast.success(response.data.message)
        navigate('/user/login')
      } catch (error) {
        toast.error('Failed to send password reset link.')
      }finally{
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-teal-600 flex justify-center items-center px-4 sm:px-6">
      <div className="py-8 px-4 sm:px-12 bg-white rounded-2xl shadow-xl z-20 w-full max-w-lg">
        <div>

          <div className="flex justify-center mb-6">
            <img
              src="/user/mandavu-logo.png"
              alt="Mandavu Logo"
              className="w-24 h-auto sm:w-32"
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-700 text-center mb-4 cursor-pointer">Enter Your Email</h1>
          <p className="w-full text-center text-sm mb-8 font-semibold text-gray-600 tracking-wide cursor-pointer">
            A password reset request will be sent <br></br> Please check your email
          </p>
        </div>
        <form onSubmit={formik.handleSubmit}>
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
            <div className="text-red-500 text-sm mt-2 ml-2">{formik.errors.email}</div>
          ) : null}

          <div className="text-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-1/2 py-2 text-lg text-white bg-teal-600 rounded-lg hover:bg-teal-800 transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : ''} `}
            >
              {loading ? (
                <CircularProgress size={20} style={{ color: 'white' }} />
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}
