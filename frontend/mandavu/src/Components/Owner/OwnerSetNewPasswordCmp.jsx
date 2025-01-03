import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";
import { useState } from "react";
import { CircularProgress } from "@mui/material";



export default function OwnerSetNewPasswordCmp({ uidb64, token }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_password: '',
      uidb64: uidb64 || '',
      token: token || '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .required('Password is required'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axiosOwnerInstance.patch('owner-setnew-password/', values);
        toast.success(response.data.message);
        navigate('/owner/login')
      } catch (error) {
        toast.error('Failed to create new password. Please try again later.');
      }finally{
        setLoading(false);
      }
    },
  });

  return (
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
          <h1 className="text-xl font-semibold text-gray-700 text-center mb-2 cursor-pointer">Reset Your Password</h1>
          <p className="w-full text-center text-sm mb-8 font-semibold text-gray-600 tracking-wide cursor-pointer">
            Please enter your new password and confirm it below.
          </p>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="password"
            name="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your new password"
            className="block text-sm py-3 px-4 mt-2 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
          />
          {formik.errors.password && formik.touched.password ? (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          ) : null}

          <input
            type="password"
            name="confirm_password"
            id="confirm_password"
            value={formik.values.confirm_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Confirm your new password"
            className="block text-sm py-3 px-4 mt-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
          />
          {formik.errors.confirm_password && formik.touched.confirm_password ? (
            <div className="text-red-500 text-sm">{formik.errors.confirm_password}</div>
          ) : null}

          <div className="text-center mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-1/2 py-2 text-lg text-white bg-teal-600 rounded-lg hover:bg-teal-800 transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
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
  )
}